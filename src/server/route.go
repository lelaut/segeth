package main

import (
	"net/http"
)

const baseURL = "/api/v0/"

// initRoutes set all API routes
func (s *Server) initRoutes() {
	h := s.routeToPostAnalysis()
	s.r.HandleFunc(baseURL+"analysis/{address}", h).Methods("POST")
	s.r.HandleFunc(baseURL+"analysis/", h).Methods("POST")
	h = s.routeToGetAnalysis()
	s.r.HandleFunc(baseURL+"analysis/{id}", h).Methods("GET")
}

func (s *Server) routeToPostAnalysis() http.HandlerFunc {
	return s.handlePostAnalysis()
}

func (s *Server) routeToGetAnalysis() http.HandlerFunc {
	return s.handleGetAnalysis()
}
