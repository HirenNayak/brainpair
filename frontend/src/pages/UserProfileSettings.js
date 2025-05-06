import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
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

const ProfileSetupPage = () => {
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