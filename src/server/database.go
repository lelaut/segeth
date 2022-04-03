package main

import (
	"context"
	"flag"
	"fmt"
	"reflect"

	"github.com/go-redis/redis/v8"
)

var DBHost string
var DBPort int
var DBPass string

func init() {
	flag.StringVar(&DBHost, "dbhost", "localhost", "Redis database host")
	flag.IntVar(&DBPort, "dbport", 6379, "Redis database port")
	flag.StringVar(&DBPass, "dbpass", "", "Redis database password")
}

// Database
type Database struct {
	rdb *redis.Client
	ctx context.Context

	data []Identifiable
}

func newDatabase() *Database {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", DBHost, DBPort),
		Password: DBPass,
		DB:       0,
	})
	return &Database{rdb: rdb, ctx: context.Background()}
}

func (d *Database) create(record Identifiable) error {
	d.data = append(d.data, record)
	return nil
}

func (d *Database) query(pk string, sk string) ([]interface{}, error) {
	for _, v := range d.data {
		if v.getPK() == pk && v.getSK() == sk {
			return []interface{}{v}, nil
		}
	}
	return []interface{}{}, nil
}

func (d *Database) mutate(record Identifiable) error {
	return nil
}

// DatabaseMockAction
type DatabaseMockAction struct {
	name   string
	pk     string
	sk     string
	record Identifiable
}

// DatabaseMock
type DatabaseMock struct {
	actions       []DatabaseMockAction
	actionsDone   []DatabaseMockAction
	returns       []interface{}
	currentAction int
	err           error
}

func newDatabaseMock(actions []DatabaseMockAction, returns []interface{}) *DatabaseMock {
	return &DatabaseMock{
		actions:       actions,
		actionsDone:   []DatabaseMockAction{},
		returns:       returns,
		currentAction: 0,
		err:           nil}
}

func (d *DatabaseMock) create(record Identifiable) error {
	d.checkAction("create", record.getPK(), record.getSK(), record)
	d.actionsDone = append(d.actions, DatabaseMockAction{
		name:   "create",
		pk:     record.getPK(),
		sk:     record.getSK(),
		record: record,
	})
	d.returns = d.returns[1:]
	return nil
}

func (d *DatabaseMock) query(pk string, sk string) ([]interface{}, error) {
	d.checkAction("query", pk, sk, nil)
	d.actionsDone = append(d.actions, DatabaseMockAction{
		name: "query",
		pk:   pk,
		sk:   sk,
	})
	if len(d.returns) == 0 {
		return []interface{}{}, nil
	}
	r := d.returns[0]
	d.returns = d.returns[1:]

	if r == nil {
		return []interface{}{}, nil
	}
	if reflect.TypeOf(r).Elem().Implements(reflect.TypeOf((*error)(nil)).Elem()) {
		return nil, r.(error)
	}
	return r.([]interface{}), nil
}

func (d *DatabaseMock) mutate(record Identifiable) error {
	d.checkAction("mutate", record.getPK(), record.getSK(), record)
	d.actionsDone = append(d.actions, DatabaseMockAction{
		name:   "mutate",
		pk:     record.getPK(),
		sk:     record.getSK(),
		record: record,
	})
	d.returns = d.returns[1:]
	return nil
}

func (d *DatabaseMock) close() error {
	if d.err != nil {
		return d.err
	}
	if len(d.actionsDone) < len(d.actions) {
		return fmt.Errorf("expecting %d more actions", len(d.actions)-len(d.actionsDone))
	}

	return nil
}

func (d *DatabaseMock) checkAction(name string, pk string, sk string, record Identifiable) {
	if d.currentAction < len(d.actions) {
		currentAction := d.actions[d.currentAction]
		if currentAction.name != name {
			d.err = fmt.Errorf(
				"expected action[%d] named %v got %v", d.currentAction, currentAction.name, name)
		} else if pk != currentAction.pk {
			d.err = fmt.Errorf("expected action[%d] pk %v got %v", d.currentAction, currentAction.pk, pk)
		} else if sk != currentAction.sk {
			d.err = fmt.Errorf("expected action[%d] sk %v got %v", d.currentAction, currentAction.sk, sk)
		} else if record != nil || currentAction.record != nil {
			if !reflect.DeepEqual(record, currentAction.record) {
				d.err = fmt.Errorf("expected action[%d] record %v got %v", d.currentAction, currentAction.record, record)
			}
		}
	} else {
		d.err = fmt.Errorf("expected no addicional action got `%s`", name)
	}

	d.currentAction++
}

// Identifiable
type Identifiable interface {
	getPK() string
	getSK() string
}

// DatabaseORM
type DatabaseORM interface {
	// create
	create(record Identifiable) error
	// query
	query(pk string, sk string) ([]interface{}, error)
	// mutate
	mutate(record Identifiable) error
}
