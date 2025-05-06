import React, {useEffect, useState} from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import { db, auth } from "../firebase/firebase-config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const universities = [
    "University of Auckland", "Auckland University of Technology (AUT)",
    "University of Waikato", "Massey University",
    "Victoria University of Wellington", "University of Canterbury",
    "Lincoln University", "University of Otago"
];

const courses = ["BCIS", "BBUS", "BCS", "BHSc"];

const interest = ["Cyber Security", "Software Development", "Web Development", "iOS Development", "Ethical Hacking"];

const cities = [
    "Auckland", "Wellington", "Christchurch", "Hamilton", "Dunedin",
    "Tauranga", "Palmerston North", "Napier", "Rotorua", "New Plymouth"
];

const UserProfileSettings = () => {
    const navigate = useNavigate(); //

    const [form, setForm] = useState({
        university: "",
        course: "",
        year: "1",
        interest1: "",
        interest2: "",
        age: "16",
        gender: "",
        city: "",
        day: "",
        startTime: "",
        endTime: ""
    });

//fetching the current user's profile data from firebase
    const MyComponent = () => {
        const [form, setForm] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    try {
                        const docRef = doc(db, "users", user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            setForm(docSnap.data());
                        } else {
                            console.log("No profile data found for this user.");
                        }
                    } catch (err) {
                        console.log("Error fetching user profile:", err);
                    }
                } else {
                    alert("No user logged in.");
                    navigate("/login");
                }
            });

            return () => unsubscribe(); // Cleanup listener on unmount.
        }, [navigate]);

        return (
            <div>
                {/* Render form data or a loading state here */}
                {form ? <pre>{JSON.stringify(form, null, 2)}</pre> : <p>Loading...</p>}
            </div>
        );
    };

    export default MyComponent;
