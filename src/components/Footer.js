import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 mt-10">
      <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
        © 2025 Brainpair. All rights reserved.
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#privacy-policy" className="hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:underline">Terms</a>
          <a href="#support" className="hover:underline">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
