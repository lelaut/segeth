package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var Port string

func init() {
	Port = os.Getenv("PORT")
	if Port == "" {
		Port = "5000"
	}
}

// Server stores server info
type Server struct {
	r *mux.Router
	d DatabaseORM
}

// newServer creates a new Server
func newServer(d DatabaseORM) *Server {
	s := &Server{r: mux.NewRouter(), d: d}
	s.initRoutes()
	return s
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if origin := r.Header.Get("Origin"); origin != "" {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers",
			"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	}

	// Stop here for a Preflighted OPTIONS request.
	if r.Method == "OPTIONS" {
		return
	}

	s.r.ServeHTTP(w, r)
}

// stop server
func (s *Server) stop() {
}

// run server
func (s *Server) run() error {
	methods := handlers.AllowedMethods([]string{"POST", "GET"})
	return http.ListenAndServe(":"+Port, handlers.CORS(methods)(s))
}

// err respond request with an error
func (s *Server) err(w http.ResponseWriter, errMsg string, errCode int) {
	http.Error(w, errMsg, errCode)
}

// respond request
func (s *Server) respond(w http.ResponseWriter, data interface{}, status int) {
	w.WriteHeader(status)
	if data != nil {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(data); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

// decode request body
func (s *Server) decode(w http.ResponseWriter, r *http.Request, v interface{}) error {
	return json.NewDecoder(r.Body).Decode(v)
}

// readBody from request to struct given
func (s *Server) readBody(r *http.Request, body interface{}) error {
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(body)
	return err
}
