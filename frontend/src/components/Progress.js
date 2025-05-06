import React from 'react';

const Progress = ({ value, className }) => {
    return (
        <div className={`relative w-full bg-gray-200 rounded-full h-4 ${className}`}>
            <div
                className="absolute top-0 left-0 h-4 rounded-full bg-green-400"
                style={{ width: `${value}%` }}
            ></div>
        </div>
    );
};

export default Progress;
