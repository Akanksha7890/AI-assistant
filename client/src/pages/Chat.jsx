import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Mic, Send, LogOut, Loader2, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const Chat = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    
    // Sabse important: Mic ko control karne ke liye ref
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    // 1. Voice Recognition Setup (Ek hi baar setup hoga)
    useEffect(() => {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'en-IN';
            recognitionRef.current.interimResults = true;
            recognitionRef.current.continuous = true;

            recognitionRef.current.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setPrompt(transcript); // Live typing in box
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    // 2. AI Speaking Logic (Isme Mic auto-stop hai)
    const speak = (text) => {
        // AI bolne se pehle mic ko bilkul kill kar do
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
        window.speechSynthesis.cancel();

        const msg = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        
        // Language check for better accent
        const isEnglishOnly = /^[A-Za-z0-9\s.,!?-]+$/.test(text.slice(0, 40));
        const preferredVoice = voices.find(v => 
            isEnglishOnly ? v.lang.includes('en-IN') : (v.lang.includes('hi-IN') || v.name.includes('Google Hindi'))
        );

        msg.voice = preferredVoice || voices[0];
        msg.rate = 1.0;
        window.speechSynthesis.speak(msg);
    };

    // 3. Mic Start/Stop Toggle
    const toggleMic = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setPrompt(''); // Naya bolne ke liye purana saaf
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    // 4. Send to AI
    const handleAsk = async () => {
        if (!prompt) return;
        
        // Send karte hi Mic band
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);

        const currentPrompt = prompt;
        setLoading(true);
        setPrompt(''); 

        try {
            const res = await axios.post('https://assistant-backend-t4qo.onrender.com/api/ai/ask', { prompt: currentPrompt });
            const aiAnswer = res.data.answer;
            setResponse(aiAnswer);

            // Code na padhe isliye filter
            const cleanText = aiAnswer.replace(/```[\s\S]*?```/g, "Maine niche code de diya hai.");
            speak(cleanText);

        } catch (err) {
            setResponse("Backend se connection nahi ho raha.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#070114] text-white p-4 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6 z-10">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent italic">Vision Assistant</h1>
                <button onClick={() => {localStorage.clear(); navigate('/login')}} className="p-2 hover:bg-white/10 rounded-full"><LogOut className="text-red-400"/></button>
            </div>

            {/* Chat Screen */}
            <div className="flex-1 w-full max-w-3xl bg-white/5 border border-white/10 rounded-[2rem] p-8 overflow-y-auto mb-6 backdrop-blur-xl">
                {response ? (
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                        <Mic size={50} className="mb-2" />
                        <p>Listening... Start speaking </p>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="w-full max-w-3xl relative">
                <input 
                    type="text" value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder={isListening ? "Listening... (Bolna band karke Send karein)" : "Start typing..."}
                    className={`w-full p-6 pr-36 rounded-2xl bg-black/40 border transition-all text-lg outline-none ${isListening ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-white/10'}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                    <button onClick={toggleMic} className={`p-4 rounded-xl transition ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/5 hover:bg-white/10'}`}>
                        <Mic size={24} className={isListening ? 'text-white' : 'text-purple-400'} />
                    </button>
                    <button onClick={handleAsk} disabled={loading} className="p-4 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-500/30">
                        {loading ? <Loader2 className="animate-spin" size={24}/> : <Send size={24}/>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
