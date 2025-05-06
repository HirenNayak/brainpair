import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase-config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom"; // 

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("No user logged in.");
        return;
      }

      await setDoc(doc(db, "users", user.uid), {
        ...form
      }, { merge: true });

      alert("Profile setup complete!");
      navigate("/upload"); 
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-indigo-50 flex items-center justify-center py-12 px-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Complete Your Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField label="University" name="university" value={form.university} onChange={handleChange} options={universities} />
            <SelectField label="Course" name="course" value={form.course} onChange={handleChange} options={courses} />
            <SelectField label="Year" name="year" value={form.year} onChange={handleChange} options={["1", "2", "3", "4"]} />
            <SelectField label="Interest 1" name="interest1" value={form.interest1} onChange={handleChange} options={interest} />
            <SelectField label="Interest 2" name="interest2" value={form.interest2} onChange={handleChange} options={interest} />
            <SelectField label="Age" name="age" value={form.age} onChange={handleChange} options={[...Array(25)].map((_, i) => (i + 16).toString())} />
            <SelectField label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
            <SelectField label="City" name="city" value={form.city} onChange={handleChange} options={cities} />
            <SelectField label="Available Day" name="day" value={form.day} onChange={handleChange} options={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button onClick={handleSubmit}>Save Profile</Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

// Reusable Select component
const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
      <option value="">-- Select --</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default ProfileSetupPage;
