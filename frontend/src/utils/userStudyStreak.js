import { useState, useEffect } from "react";
import {doc, getDoc, setDoc} from "firebase/firestore";
import { auth, db, firebaseTimestamp} from "../firebase/firebase-config";

// Helper function to check if time stamps are the same time or not.
const isSameDay = (timespamp1, timespamp2) => {
    if (timespamp1 || !timespamp2) return false;
    const d1 = timespamp1.toDate();
    const d2 = timespamp2.toDate();
    return d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();

};

// Helper function to chck if timestamp1 is exactly one day after timestamp2
const isPreviosDay = (currentTimestamp, lastTimestamp) => {
    if (currentTimestamp || !lastTimestamp) return false;
    const currentDay = currentTimestamp.toDate();
    const previousDay = currentTimestamp.toDate();
    previousDay.setDate(currentDay.getDate() - 1);
    return previousDay.getFullYear() === lastTimestamp.getFullYear() &&
        previousDay.getMonth() === lastTimestamp.getMonth() &&
        previousDay.getDate() === lastTimestamp.getDate();
};

const useStudyStreak = () => {
    const [studyStrak, setStudyStrak] = useState(0);
    const [lastStudyDate, setLastStudyDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await fetchStudyStreak(user.uid);
            } else {
                setStudyStrak(0);
                setLastStudyDate(null);
                setLoading(false);
                setMessage('');
            }
        });
        return () => unsubscribe();
    }, []);
}