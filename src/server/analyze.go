package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/gorilla/mux"
)

// handlePostAnalysis create a new analysis if necessary than
// redirect requester to the analysis page.
func (s *Server) handlePostAnalysis() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		var contract []byte
		var id string
		var err error
		var contractPath string

		v := mux.Vars(r)
		address := strings.ToLower(v["address"])

		if address != "" {
			res, err := s.d.query("ANALYSIS", address)

			if err != nil {
				s.err(w, err.Error(), http.StatusInternalServerError)
				return
			} else if len(res) > 0 {
				s.respond(w, address, http.StatusCreated)
				return
			}

			contract = []byte("contract")
			id = address
			contractPath = id
		} else {
			c, name, err := getFile(r)
			contract = c
			if err != nil {
				s.err(w, err.Error(), http.StatusBadRequest)
				return
			}
			if len(contract) == 0 {
				s.err(w, "Contract not found", http.StatusNotFound)
				return
			}
			if flag.Lookup("test.v") != nil {
				id = "hash(" + name + ")"
			} else {
				id = strings.ToLower(RandString(12))
			}

			f, err := os.CreateTemp("contracts", "segeth-*.sol")
			if err != nil {
				s.err(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer f.Close()
			defer os.Remove(f.Name())

			if _, err := f.Write(contract); err != nil {
				s.err(w, err.Error(), http.StatusInternalServerError)
				return
			}

			contractPath = f.Name()
		}

		timer := time.Now()
		cmd := exec.Command("slither", contractPath)
		toolTime := time.Since(timer)
		if flag.Lookup("test.v") != nil {
			toolTime = 0
		}
		_, err = cmd.Output()
		defer os.Remove("out.json")

		plan, _ := ioutil.ReadFile("out.json")
		var out map[string]interface{}
		if err := json.Unmarshal(plan, &out); err != nil {
			s.err(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err != nil {
			if out["error"] != nil && strings.HasPrefix(out["error"].(string), "Traceback (") {
				s.err(
					w,
					fmt.Sprintf("Contract cannot compile: %d", err.(*exec.ExitError).ExitCode()),
					http.StatusBadRequest)
				return
			} else if err.(*exec.ExitError).ExitCode() == 1 {
				s.err(w, "Contract not found", http.StatusNotFound)
				return
			}
		}

		vulnerabilities := map[string]bool{}
		if len(out["results"].(map[string]interface{})) > 0 {
			detectors := out["results"].(map[string]interface{})["detectors"].([]interface{})
			for _, v := range detectors {
				if _, ok := vulnerabilities[v.(map[string]interface{})["check"].(string)]; !ok {
					vulnerabilities[v.(map[string]interface{})["check"].(string)] = true
				}
			}
		}
		kv := make([]string, 0, len(vulnerabilities))
		for k := range vulnerabilities {
			kv = append(kv, k)
		}

		a := &Analysis{
			ID: id,
			Results: []ToolResult{{
				Name:            "slither",
				Time:            toolTime,
				Vulnerabilities: kv,
			}}}
		if err := s.d.create(a); err != nil {
			s.err(w, err.Error(), http.StatusInternalServerError)
			return
		}

		s.respond(w, id, http.StatusCreated)
	}
}

// handleGetAnalysis get analysis result for the request item.
func (s *Server) handleGetAnalysis() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		v := mux.Vars(r)
		res, err := s.d.query("ANALYSIS", strings.ToLower(v["id"]))
		if err != nil {
			s.err(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if len(res) == 0 {
			s.err(w, "", http.StatusNotFound)
			return
		}

		s.respond(w, res[0], http.StatusOK)
	}
}

type ToolResult struct {
	Name            string        `json:"name"`
	Time            time.Duration `json:"time"`
	Vulnerabilities []string      `json:"vulnerabilities"`
}

type Analysis struct {
	ID      string       `json:"id"`
	Results []ToolResult `json:"results"`
}

func (a *Analysis) getPK() string {
	return "ANALYSIS"
}

func (a *Analysis) getSK() string {
	return a.ID
}
