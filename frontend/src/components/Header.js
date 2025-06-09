import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md fixed w-full top-0 left-0 z-50 text-black dark:text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-indigo-600">Brainpair</Link>
        <nav className="flex space-x-4 items-center">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium">Login</Link>
              <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 font-medium">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
              <DarkModeToggle />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
