import React, { useState } from "react";
import { submitReview } from "../utils/reviewService";

const ReviewModal = ({ onClose, currentUserId, targetUserId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    await submitReview(currentUserId, targetUserId, rating, comment);
    onClose();
    alert("Review submitted!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Leave a Review</h2>
        <label className="block mb-2">Rating (1–5):</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <label className="block mb-2">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button onClick={handleSubmit} className="bg-indigo-600 text-white px-4 py-2 rounded">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
