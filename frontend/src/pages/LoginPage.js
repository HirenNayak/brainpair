import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase/firebase-config";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        if (!userData.firstName || !userData.university) {
          navigate("/setup");
        } else if (!userData.images || userData.images.length < 2) {
          navigate("/upload");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/setup");
      }

      alert("Login successful!");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-indigo-50 py-12 px-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            Login to Brainpair
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <Button type="submit">Login</Button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-500 hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default LoginPage;
