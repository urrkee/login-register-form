import React from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-black flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-extrabold mb-6">
        Gym <span className="text-blue-400">App</span>
      </h1>
      <p className="text-2xl text-center mb-8 px-6">
        Are you looking to make changes in your{' '}
        <span className="text-blue-400">life</span>, improve{' '}
        <span className="text-blue-400">health</span> and{' '}
        <span className="text-blue-400">fitness</span>? You are in the right
        place.
      </p>
      <Link to="/register">
        <button className="bg-blue-400 hover:bg-blue-500 text-black font-bold text-xl py-4 px-8 rounded-xl shadow-xl transition duration-300">
          Get Started
        </button>
      </Link>
    </div>
  );
};
export default GetStarted;
