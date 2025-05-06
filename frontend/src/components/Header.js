import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-indigo-600">Brainpair</Link>
        <nav className="flex space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
          <Link to="/register" className="text-gray-600 hover:text-indigo-600 font-medium">Register</Link>
          <Link to="/pomodoro" className="text-gray-600 hover:text-indigo-600 font-medium">Pomodoro</Link>
          <Link to="/settings" className="text-gray-600 hover:text-indigo-600 font-medium">Settings</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
