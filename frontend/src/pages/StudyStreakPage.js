import React from "react";
import useStudyStreak from "../utils/userStudyStreak";

const StudyStreakPage = () => {
    const { studyStreak, lastStudyDate, loading, message, recordStudyActivity } = useStudyStreak();

    return (
        <div>
            <h1>Study Streak</h1>
            {loading ? (
                <p>Loading streak data...</p>
            ) : (
                <>
                    <p>Current Streak: {studyStreak}</p>
                    <p>Last Study Date: {lastStudyDate?.toDate().toLocaleDateString() || "None"}</p>
                    {message && <p>{message}</p>}
                    <button onClick={recordStudyActivity}>Record Study Activity</button>
                </>
            )}
        </div>
    );
};

export default StudyStreakPage;