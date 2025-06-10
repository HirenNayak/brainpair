import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';

const LandingPage = () => {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="bg-indigo-50 dark:bg-gray-900 pt-24 pb-12 min-h-screen flex flex-col items-center justify-center text-center px-4 text-black dark:text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold text-indigo-700 dark:text-indigo-400 mb-6">
          Studying Alone? Find Your Perfect Study Partner!
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl max-w-2xl mb-8">
          Browse through students with similar study goals and get matched instantly – just like Tinder, but for learning!
        </p>
        <Link to="/register">
          <Button>Join Brainpair Now</Button>
        </Link>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-800 text-black dark:text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card
              title="Step 1"
              description="Create Your Profile: Share your study preferences and goals."
              icon="📝"
            />
            <Card
              title="Step 2"
              description="Get Matched: Our smart algorithm finds your ideal study partner."
              icon="🔍"
            />
            <Card
              title="Step 3"
              description="Start Studying: Chat, video call, and collaborate for success!"
              icon="🎯"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-indigo-50 dark:bg-gray-900 text-black dark:text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-10">Features</h2>
          <ul className="text-gray-700 dark:text-gray-300 text-lg space-y-4">
            <li>🔗 Smart Matching Algorithm</li>
            <li>⏲️ Built-in Pomodoro Timer</li>
            <li>💬 Instant Messaging and Video Calls</li>
            <li>📈 Study Goals Tracker</li>
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white dark:bg-gray-800 text-black dark:text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-10">What Our Users Say</h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-6">
            <p className="text-gray-700 dark:text-gray-300 italic mb-4">
              "Brainpair helped me find a study partner for my computer science course, and we've been studying together ever since!" – Emily
            </p>
            <p className="text-gray-700 dark:text-gray-300 italic">
              "I found someone to study biology with. It's been a game changer for exam prep!" – John
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Find Your Study Partner?</h2>
        <Link to="/register">
          <Button>Get Started Today</Button>
        </Link>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
