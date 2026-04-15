import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://assistant-backend-t4qo.onrender.com/api/auth/login', formData);
            // Token ko localStorage mein save karenge taaki baad mein kaam aaye
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            navigate('/chat');
        } catch (err) {
            alert(err.response?.data?.msg || "Login fail ho gaya!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070114] relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-purple-600 rounded-full blur-[150px] opacity-50"></div>

            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl w-[400px] backdrop-blur-lg z-10">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
                <p className="text-gray-400 text-sm mb-6 text-center">Login to talk to your AI</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-xs mb-1 block">Email Address</label>
                        <input 
                            type="email" placeholder="example@test.com" 
                            className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white outline-none focus:border-purple-500 transition"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
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
                    Login
                </button>

                <p className="text-gray-400 mt-6 text-center text-sm">
                   "Don't have an account? <Link to="/signup" className="text-purple-400 hover:underline">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
