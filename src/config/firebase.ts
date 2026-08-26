import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const app = initializeApp({
	apiKey: "AIzaSyC0slMq7X8wsF5-oufU9i8iTGofW7wryEc",
	authDomain: "consultapronta-dev.firebaseapp.com",
	databaseURL: "https://consultapronta-dev-default-rtdb.firebaseio.com",
	projectId: "consultapronta-dev",
	storageBucket: "consultapronta-dev.firebasestorage.app",
	messagingSenderId: "67071114072",
	appId: "1:67071114072:web:228a0f41181f9234f9432d",
	measurementId: "G-B2P2LDT39C"
})

export const auth = getAuth(app)
export const db = getFirestore(app)