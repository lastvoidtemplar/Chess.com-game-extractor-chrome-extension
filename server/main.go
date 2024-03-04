package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Player struct {
	Name   string `json:"name"`
	Rating int    `json:"rating"`
}

type Move struct {
	MoveAnnotation string  `json:"move"`
	Time           float32 `json:"time"`
}

type Game struct {
	User        Player `json:"user"`
	Opponent    Player `json:"opponent"`
	IsUserWhite bool   `json:"isUserWhite"`
	Result      string `json:"result"`
	Moves       []Move `json:"moves"`
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	router := http.NewServeMux()

	router.HandleFunc("POST /game", func(w http.ResponseWriter, r *http.Request) {
		var game Game
		json.NewDecoder(r.Body).Decode(&game)
		log.Println(game)
	})

	http.ListenAndServe(":5000", enableCORS(router))
}
