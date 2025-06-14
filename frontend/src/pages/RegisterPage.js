import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase-config";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email
      });

      alert("Registered successfully!");
      navigate("/setup");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-indigo-50 dark:bg-gray-900 py-12 px-6 text-black dark:text-white">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-300 mb-6">
            Register for Brainpair
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              value={form.firstName}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              value={form.lastName}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={form.email}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-700 text-black dark:text-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-700 text-black dark:text-white"
            />

            <Button type="submit">Register</Button>

            <p className="text-center text-gray-600 dark:text-gray-300 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-500 hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RegisterPage;
