import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import useStudyStreak from '../utils/userStudyStreak';

const Header = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  const { studyStreak, lastStudyDate, loading } = useStudyStreak();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setFirstName(data.firstName || "");
          }
        } catch (err) {
          console.error("Error fetching user name:", err);
        }
      } else {
        setFirstName("");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && lastStudyDate) {
      const today = new Date();
      const last = lastStudyDate.toDate();

      const isSameDay =
          today.getFullYear() === last.getFullYear() &&
          today.getMonth() === last.getMonth() &&
          today.getDate() === last.getDate();

      if (!isSameDay) {
        toast.info("🔥 Don’t forget to study today to keep your streak alive!");
      }
    }
  }, [loading, lastStudyDate]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
      <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between p-4 gap-2">
          <Link to="/" className="text-2xl font-bold text-indigo-600">Brainpair</Link>

          <div className="flex items-center space-x-4">
            {user && !loading && (
                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                  {studyStreak}-day streak
                </div>
            )}

            <nav className="flex space-x-4 items-center">
              {user ? (
                  <>
                    {firstName && <span className="text-gray-800 font-medium">{firstName}</span>}
                    <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">Dashboard</Link>
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Logout
                    </button>
                  </>
              ) : (
                  <>
                    <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
                    <Link to="/register" className="text-gray-600 hover:text-indigo-600 font-medium">Register</Link>
                  </>
              )}
            </nav>
          </div>
        </div>
      </header>
  );
};

export default Header;
