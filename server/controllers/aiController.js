const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.askAI = async (req, res) => {
    try {
        const { prompt, image } = req.body; 
        const currentDate = new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });

        let messages = [
            {
                role: "system",
               // ... existing imports
content: `Today's date is ${new Date().toLocaleDateString()}. 
1. If the user speaks/writes in Hindi/Hinglish, reply ONLY in Hinglish.
2. If the user speaks/writes in English, reply ONLY in English.
3. Keep response in separate code blocks for HTML/CSS/JS.
4. Be a professional assistant.`
// ... existing code
            }
        ];

        if (image) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: prompt || "Is image ko dekho aur samjhao ye kya hai." },
                    { type: "image_url", image_url: { url: image } }
                ]
            });
        } else {
            messages.push({ role: "user", content: prompt });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            // Vision ke liye model switch hoga
            model: image ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile",
        });

        res.json({ answer: chatCompletion.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};