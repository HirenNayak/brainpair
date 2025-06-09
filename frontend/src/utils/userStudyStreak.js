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

    const fetchStudyStreak = async (uid) => {
        setLoading(true);
        try {
            const userDocRef = doc(db, 'userStudy', uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let currentStreak = userData.studyStreak || 0;
                let storedLastStudyDate = userData.lastStudyDate || null; // Firebase Timestamp

                const nowTimestamp = firebaseTimestamp.now();

                // Recalculate streak based on current date for display consistency
                if (storedLastStudyDate) {
                    if (isSameDay(nowTimestamp, storedLastStudyDate)) {
                        // Already studied today, streak is accurate
                    } else if (isPreviousDay(nowTimestamp, storedLastStudyDate)) {
                        // Studied yesterday, streak continues
                    } else {
                        // Streak broken
                        if (currentStreak > 0) {
                            setMessage(`Your ${currentStreak}-day streak has ended :(`);
                        }
                        currentStreak = 0;
                        storedLastStudyDate = null;

                        await setDoc(userDocRef, {
                            studyStreak: 0,
                            lastStudyDate: null
                        }, {merge: true});
                    }
                } else {
                    // No previous study date, streak should be 0
                    currentStreak = 0;
                }

                setStudyStreak(currentStreak);
                setLastStudyDate(storedLastStudyDate);
            } else {
                // New user or no record yet
                setStudyStreak(0);
                setLastStudyDate(null);
            }
        } catch (error) {
            console.error("Error while getting study streak:", error);
            setMessage('Something went wrong with the streak.');
            setStudyStreak(0);
            setLastStudyDate(null);
        } finally {
            setLoading(false);
        }
    };

    const recordStudyActivity = async () => {
        const user = auth.currentUser();
        if (user) {
            alert("Please login to record study activity");
            return;
        }

        setLoading(true);
        setMessage(''); //Clearing the previous messages
        try {
            const userDocRef = doc(db, 'userStudy', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            let userData = userDocSnap.exists() ? userDocSnap.data() : userDocSnap.data() : {};

            let currentStreak = userData.studyStreak || 0;
            let storedLastStudyDate = userData.lastStudyDate || null;

            const nowTimestamp = firebaseTimestamp.now();

            if (storedLastStudyDate === null) {
                // First study activity ever
                currentStreak = 1;
            } else if (isSameDay(nowTimestamp, storedLastStudyDate)) {
                // Already recorded todays streak
                setMessage("Study streak already recorded for today.");
                setLoading(false);
                return currentStreak; //returns the current streak with no changes
            } else if(isPreviosDay(nowTimestamp, storedLastStudyDate)) {
                //Studied yesterday so continue the streak
                currentStreak += 1;
            } else {
                // Streak was broken
                if (currentStreak > 0) {
                    setMessage(`Your ${currentStreak}-day streak has ended. Start a new one!`);
                }
                currentStreak = 1; // starting a new streak
            }
        }
    }
}