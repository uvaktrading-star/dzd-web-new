const mongoose = require('mongoose');

// MongoDB URI එක කෙලින්ම මෙතනට දැම්මා
const MONGO_URI = "mongodb+srv://zanta-md:Akashkavindu12345@cluster0.iw4vklq.mongodb.net/?appName=Cluster0";

const SignalSchema = new mongoose.Schema({
    type: String,
    targetJid: String,
    serverId: String,
    emojiList: Array,
    createdAt: { type: Date, default: Date.now, expires: 60 }
});

const Signal = mongoose.models.Signal || mongoose.model("Signal", SignalSchema);

module.exports = async (req, res) => {
    // CORS ප්‍රශ්න මඟහරවා ගැනීමට headers සෙට් කිරීම
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(MONGO_URI);
        }

        const { type, targetJid, serverId, emojiList } = req.body;

        const newSignal = new Signal({
            type,
            targetJid,
            serverId,
            emojiList
        });

        await newSignal.save();
        return res.status(200).json({ success: true, message: "Signal stored in DB" });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};
