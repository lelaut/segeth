package main

import "log"

func main() {
	if err := run(); err != nil {
		log.Fatal(err)
	}
}

func run() error {
	s := newServer(newDatabase())
	defer s.stop()

	log.Println("Server loaded on port " + Port)
	return s.run()
}
