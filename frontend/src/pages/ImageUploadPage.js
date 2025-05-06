import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added
import { auth, db } from "../firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dvgkrvvsv/upload";
const UPLOAD_PRESET = "brainpair_upload";

const ImageUploadPage = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // ✅ Added

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);

    if (images.length + selected.length > 4) {
      alert("You can upload a maximum of 4 images only.");
      return;
    }

    const total = [...images, ...selected];
    setImages(total);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
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

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const firstName = userDoc.exists()
        ? userDoc.data().firstName?.toLowerCase() || user.uid
        : user.uid;

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("folder", `brainpair/users/${firstName}`);
        formData.append("public_id", `profile${i + 1}`);

        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!data.secure_url) {
          throw new Error("Upload failed");
        }

        uploadedUrls.push(data.secure_url);
      }

      await updateDoc(doc(db, "users", user.uid), {
        images: uploadedUrls,
      });

      alert("Images uploaded successfully!");
      navigate("/dashboard"); // ✅ Redirect to dashboard
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong: " + err.message);
    }

    setUploading(false);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-indigo-50 flex items-center justify-center py-12 px-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            Upload Profile Pictures
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Select 2–4 clear images that best represent you
          </p>

          <label className="block w-full p-4 border-2 border-dashed border-indigo-300 text-center rounded-lg cursor-pointer hover:bg-indigo-100 transition mb-6">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-sm text-indigo-500 font-medium">
              Click to select or drag images here
            </span>
            <p className="text-xs text-gray-500 mt-1">Maximum 4 images allowed</p>
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              {images.map((img, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${i}`}
                    className="rounded-lg w-full h-32 object-cover shadow-sm"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-white text-red-500 font-bold rounded-full w-6 h-6 flex items-center justify-center shadow hover:bg-red-100"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

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
