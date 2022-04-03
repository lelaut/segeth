package main

import (
	"bytes"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gorilla/mux"
)

// 0xbf006e1a1b8bc51303af5b6d5b32c4a922d6f387
const (
	ContractAddress = "0xed04915c23f00a313a544955524eb7dbd823143d"
)

func TestPostAnalysisWithAddress(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{
		{
			name: "query",
			pk:   "ANALYSIS",
			sk:   ContractAddress,
		},
		{
			name: "create",
			pk:   "ANALYSIS",
			sk:   ContractAddress,
			record: &Analysis{
				ID: ContractAddress,
				Results: []ToolResult{
					{
						Name:            "slither",
						Time:            0,
						Vulnerabilities: []string{},
					},
				},
			},
		},
	}, []interface{}{
		[]interface{}{},
		nil,
	}))
	h := s.routeToPostAnalysis()
	r := httptest.NewRequest(http.MethodPost, "", nil)
	w := httptest.NewRecorder()
	r = mux.SetURLVars(r, map[string]string{"address": ContractAddress})
	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 201 {
		t.Fatalf("expected status code 201 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func TestPostAnalysisWithCode(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{
		{
			name: "create",
			pk:   "ANALYSIS",
			sk:   "hash(correct.sol)",
			record: &Analysis{
				ID: "hash(correct.sol)",
				Results: []ToolResult{
					{
						Name:            "slither",
						Time:            0,
						Vulnerabilities: []string{},
					},
				},
			},
		},
	}, []interface{}{
		nil,
	}))
	h := s.routeToPostAnalysis()
	co, _ := os.Open("./contracts/correct.sol")
	defer co.Close()
	var mb bytes.Buffer
	mw := multipart.NewWriter(&mb)
	defer mw.Close()
	fw, _ := mw.CreateFormFile("file", co.Name())
	io.Copy(fw, co)
	mw.Close()
	r := httptest.NewRequest(http.MethodPost, "", &mb)
	r.Header.Set("Content-Type", mw.FormDataContentType())
	w := httptest.NewRecorder()

	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 201 {
		t.Fatalf("expected status code 201 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func TestPostAnalysisWithoutAddressAndCodeFail(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{}, []interface{}{}))
	h := s.routeToPostAnalysis()
	r := httptest.NewRequest(http.MethodPost, "", nil)
	w := httptest.NewRecorder()

	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 400 {
		t.Fatalf("expected status code 400 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func TestPostAnalysisCodeWithErrorsFail(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{}, []interface{}{}))
	h := s.routeToPostAnalysis()
	co, _ := os.Open("./contracts/witherrors.sol")
	defer co.Close()
	var mb bytes.Buffer
	mw := multipart.NewWriter(&mb)
	defer mw.Close()
	fw, _ := mw.CreateFormFile("file", co.Name())
	io.Copy(fw, co)
	mw.Close()
	r := httptest.NewRequest(http.MethodPost, "", &mb)
	r.Header.Set("Content-Type", mw.FormDataContentType())
	w := httptest.NewRecorder()

	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 400 {
		t.Fatalf("expected status code 400 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func TestPostAnalysisWithInvalidAddressFail(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{
		{
			name: "query",
			pk:   "ANALYSIS",
			sk:   "0xdead00dead00dead00dead00dead00dead00dead",
		},
	}, []interface{}{
		[]interface{}{},
	}))
	h := s.routeToPostAnalysis()
	r := httptest.NewRequest(http.MethodPost, "", nil)
	r = mux.SetURLVars(r, map[string]string{"address": "0xdead00dead00dead00dead00dead00dead00dead"})
	w := httptest.NewRecorder()

	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 404 {
		t.Fatalf("expected status code 404 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func TestGetAnalysisFromAddress(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{
		{
			name: "query",
			pk:   "ANALYSIS",
			sk:   ContractAddress,
		},
	}, []interface{}{
		[]interface{}{
			&Analysis{
				ID: ContractAddress,
			},
		},
	}))
	h := s.routeToGetAnalysis()
	r := httptest.NewRequest(http.MethodGet, "", nil)
	r = mux.SetURLVars(r, map[string]string{"id": ContractAddress})
	w := httptest.NewRecorder()

	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 200 {
		t.Fatalf("expected status code 200 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func TestGetAnalysisFromCode(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{
		{
			name: "query",
			pk:   "ANALYSIS",
			sk:   "hash(contract.sol)",
		},
	}, []interface{}{
		[]interface{}{
			&Analysis{
				ID: "hash(contract.sol)",
			},
		},
	}))
	h := s.routeToGetAnalysis()
	r := httptest.NewRequest(http.MethodGet, "", nil)
	r = mux.SetURLVars(r, map[string]string{"id": "hash(contract.sol)"})
	w := httptest.NewRecorder()

	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 200 {
		t.Fatalf("expected status code 200 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func TestGetAnalysisFromInvalidIdFail(t *testing.T) {
	s := newServer(newDatabaseMock([]DatabaseMockAction{
		{
			name: "query",
			pk:   "ANALYSIS",
			sk:   "hash(contract.sol)",
		},
	}, []interface{}{
		[]interface{}{},
	}))
	h := s.routeToGetAnalysis()
	r := httptest.NewRequest(http.MethodGet, "", nil)
	r = mux.SetURLVars(r, map[string]string{"id": "hash(contract.sol)"})
	w := httptest.NewRecorder()

	h(w, r)
	res := w.Result()
	defer res.Body.Close()

	data, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf(err.Error())
	}
	if res.StatusCode != 404 {
		t.Fatalf("expected status code 404 got %v: %s", res.StatusCode, data)
	}

	err = s.d.(*DatabaseMock).close()
	if err != nil {
		t.Fatalf(err.Error())
	}
}
