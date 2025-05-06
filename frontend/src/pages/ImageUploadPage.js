import React, { useState } from "react";
import { auth, db } from "../firebase/firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dvgkrvvsv/upload";
const UPLOAD_PRESET = "brainpair_upload";

const ImageUploadPage = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
  };

  const handleUpload = async () => {
    if (images.length < 2) {
      alert("Please select at least 2 images.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("User not logged in.");
      return;
    }

    setUploading(true);
    const uploadedUrls = [];

    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      } catch (err) {
        console.error("Upload failed", err);
        alert("Image upload failed. Please try again.");
        setUploading(false);
        return;
      }
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        images: uploadedUrls
      });

      alert("Images uploaded successfully!");
    } catch (err) {
      alert("Error saving image URLs: " + err.message);
    }

    setUploading(false);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-indigo-50 flex items-center justify-center py-12 px-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">Upload Profile Pictures</h2>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="mb-4 w-full"
          />
          <p className="text-sm text-gray-600 mb-4">Select 2–4 clear profile pictures</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt={`Preview ${i}`}
                className="rounded-lg w-full h-32 object-cover"
              />
            ))}
          </div>

          <div className="text-center">
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ImageUploadPage;
