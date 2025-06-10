import { useState, useEffect } from 'react';
import { auth, db, firebaseTimestamp } from '../firebase/firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

// Helper function to check if timestamps are on the same day
const isSameDay = (timestamp1, timestamp2) => {
    if (!timestamp1 || !timestamp2) return false;
    const d1 = timestamp1.toDate();
    const d2 = timestamp2.toDate();
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

// Helper function to check if currentTimestamp is exactly one day after lastTimestamp
const isPreviousDay = (currentTimestamp, lastTimestamp) => {
    if (!currentTimestamp || !lastTimestamp) return false;
    const currentDay = currentTimestamp.toDate();
    const lastDay = lastTimestamp.toDate();
    const previousDay = new Date(currentDay);
    previousDay.setDate(currentDay.getDate() - 1);
    return (
        previousDay.getFullYear() === lastDay.getFullYear() &&
        previousDay.getMonth() === lastDay.getMonth() &&
        previousDay.getDate() === lastDay.getDate()
    );
};

const useStudyStreak = () => {
    const [studyStreak, setStudyStreak] = useState(0);
    const [lastStudyDate, setLastStudyDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await fetchStudyStreak(user.uid);
            } else {
                setStudyStreak(0);
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
                let storedLastStudyDate = userData.lastStudyDate || null;

                const nowTimestamp = firebaseTimestamp.now();

                if (storedLastStudyDate) {
                    if (isSameDay(nowTimestamp, storedLastStudyDate)) {
                        // Already studied today, streak is accurate
                    } else if (isPreviousDay(nowTimestamp, storedLastStudyDate)) {
                        // Studied yesterday, the streak continues
                    } else {
                        // Streak broken
                        if (currentStreak > 0) {
                            toast.error(`Your ${currentStreak}-day streak has ended 😢`);
                            setMessage(`Your ${currentStreak}-day streak has ended :(`);
                        }
                        currentStreak = 0;
                        storedLastStudyDate = null;

                        await setDoc(userDocRef, {
                            studyStreak: 0,
                            lastStudyDate: null
                        }, { merge: true });
                    }
                } else {
                    currentStreak = 0;
                }

                setStudyStreak(currentStreak);
                setLastStudyDate(storedLastStudyDate);
            } else {
                setStudyStreak(0);
                setLastStudyDate(null);
            }
        } catch (error) {
            console.error("Error while getting study streak:", error);
            toast.error('Something went wrong with the streak');
            setMessage('Something went wrong with the streak.');
            setStudyStreak(0);
            setLastStudyDate(null);
        } finally {
            setLoading(false);
        }
    };

    const recordStudyActivity = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error("Please login to record study activity");
            return;
        }

        setLoading(true);
        setMessage('');
        try {
            const userDocRef = doc(db, 'userStudy', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            let userData = userDocSnap.exists() ? userDocSnap.data() : {};

            let currentStreak = userData.studyStreak || 0;
            let storedLastStudyDate = userData.lastStudyDate || null;

            const nowTimestamp = firebaseTimestamp.now();

            if (storedLastStudyDate === null) {
                currentStreak = 1;
                toast.success('Started your first study streak! 🎉');
            } else if (isSameDay(nowTimestamp, storedLastStudyDate)) {
                toast.info("You've already recorded your study activity for today! 📚");
                setMessage("Study streak already recorded for today.");
                setLoading(false);
                return currentStreak;
            } else if (isPreviousDay(nowTimestamp, storedLastStudyDate)) {
                currentStreak += 1;
                toast.success(`${currentStreak} day streak! Keep it up! 🔥`);
            } else {
                if (currentStreak > 0) {
                    toast.info(`Starting a new streak! Previous streak: ${currentStreak} days`);
                    setMessage(`Your ${currentStreak}-day streak has ended. Start a new one!`);
                }
                currentStreak = 1;
            }

            await setDoc(userDocRef, {
                studyStreak: currentStreak,
                lastStudyDate: nowTimestamp,
            }, { merge: true });

            setStudyStreak(currentStreak);
            setLastStudyDate(nowTimestamp);
            setMessage("Study activity recorded successfully!");
            toast.success('Study activity recorded! 📚');
        } catch (error) {
            console.error("Error while recording study streak:", error);
            toast.error('Failed to record study activity');
            setMessage("Failed to record study streak");
        } finally {
            setLoading(false);
        }
    };

    return { studyStreak, lastStudyDate, loading, message, recordStudyActivity, fetchStudyStreak };
};

export default useStudyStreak;
