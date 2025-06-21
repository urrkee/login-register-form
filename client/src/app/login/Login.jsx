import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import axios from '../../api/axios';

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const emailRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/login',
        JSON.stringify({ email: email, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      if (response?.data?.message === 'login successful') {
        setAuth({ name: response.data.username, email });
        setSuccess(true);
        setEmail('');
        setPwd('');
      } else {
        setErrMsg('Login Failed');
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Email or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      } else {
        setErrMsg('Login Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-black flex items-center justify-center text-white">
      {success ? (
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-6">You are logged in</h1>
          <p>
            <Link
              to="/user-page"
              className="text-blue-400 hover:text-blue-500 underline"
            >
              Go to User Page
            </Link>
          </p>
        </section>
      ) : (
        <section className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg w-full max-w-md">
          <p
            ref={errRef}
            className={`${
              errMsg ? 'errmsg' : 'offscreen'
            } text-red-500 text-center mb-4`}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="email" className="text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <label htmlFor="password" className="text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              className="p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 text-black font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
            >
              Sign In
            </button>
          </form>
          <p className="text-center mt-6">
            Need an Account?{' '}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-500 underline"
            >
              Register
            </Link>
          </p>
        </section>
      )}
    </div>
  );
};

export default Login;
