import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axios from '../api/axios';

const Signup = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') setTouched(true);
  };

  const password = form.password;

  const rules = {
    minLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const allValid = Object.values(rules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) return;

    try {
      await axios.post('/auth/signup', form);
      setMessage('✅ Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Signup failed. Try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm transition-all ease-in-out"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded outline-blue-400"
          required
        />

        {/* Password with Toggle */}
        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded pr-10 outline-blue-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Password Rules */}
        {touched && (
          <div className="mb-4 text-sm">
            <p className="font-semibold mb-1">Password must include:</p>
            <ul className="space-y-1">
              <RuleItem isValid={rules.minLength} label="At least 8 characters" />
              <RuleItem isValid={rules.hasUpper} label="An uppercase letter (A-Z)" />
              <RuleItem isValid={rules.hasLower} label="A lowercase letter (a-z)" />
              <RuleItem isValid={rules.hasNumber} label="A number (0-9)" />
              <RuleItem isValid={rules.hasSpecial} label="A special character (!@#$...)" />
            </ul>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className={`w-full text-white p-2 rounded transition-all duration-300 ${
            allValid
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={!allValid}
        >
          Sign Up
        </button>

        <p className="mt-3 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 underline">
            Login
          </a>
        </p>

        {/* Message */}
        {message && (
          <p className="mt-2 text-sm text-center text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
};

// ✅ Styled rule item with animation and round indicator
const RuleItem = ({ isValid, label }) => (
  <li className="flex items-center space-x-2 transition-all duration-300 ease-in-out">
    <div
      className={`w-4 h-4 rounded-full flex items-center justify-center border ${
        isValid ? 'bg-green-500 border-green-500' : 'bg-white border-gray-400'
      } transition-all duration-300`}
    >
      {isValid && (
        <span className="text-white text-xs">✓</span>
      )}
    </div>
    <span
      className={`${isValid ? 'text-green-600' : 'text-gray-600'} transition-all duration-300`}
    >
      {label}
    </span>
  </li>
);

export default Signup;
