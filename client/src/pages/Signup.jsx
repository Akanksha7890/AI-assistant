import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://assistant-backend-t4qo.onrender.com/api/auth/signup', formData);
            alert("Account created successfully! Please log in.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || "Galti ho gayi!");
        }
    };

    return (
        // Background with Dark Purple Glow
        <div className="min-h-screen flex items-center justify-center bg-[#070114] relative overflow-hidden">
            
            {/* Top Neon Light Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-purple-600 rounded-full blur-[150px] opacity-50"></div>

            {/* Glassmorphic Form - Simple Structure */}
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl w-[400px] backdrop-blur-lg z-10">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h2>
                <p className="text-gray-400 text-sm mb-6 text-center">Join our AI Assistant today</p>
                
                <div className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="text-gray-300 text-xs mb-1 block">Username</label>
                        <input 
                            type="text" placeholder="Your name" 
                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-gray-300 text-xs mb-1 block">Email Address</label>
                        <input 
                            type="email" placeholder="example@test.com" 
                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-gray-300 text-xs mb-1 block">Password</label>
                        <input 
                            type="password" placeholder="••••••••" 
                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl mt-8 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                    Sign Up
                </button>

                <p className="text-gray-400 mt-6 text-center text-sm">
                    Pehle se account hai? <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
