import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

const DashboardNavbar = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await axios.get('/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.user.username || res.data.user.email);
      } catch (err) {
        console.error('Failed to fetch user:', err.message);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-xl font-semibold">ATS Dashboard</div>

      <div className="flex items-center space-x-4">
        {/* ✅ Create Resume Button */}
        <Link
          to="/create-resume"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow transition duration-200"
        >
          Create Your Resume
        </Link>

        <span className="hidden sm:inline font-medium">
          Welcome, <span className="font-bold">{username}</span>
        </span>

        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default DashboardNavbar;