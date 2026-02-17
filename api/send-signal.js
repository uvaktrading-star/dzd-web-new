import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://zanta-test:Akashkavindu12345@cluster0.qedizqe.mongodb.net/?appName=Cluster0";

// Schema එක define කිරීම
const SignalSchema = new mongoose.Schema({
    type: String,
    targetJid: String,
    serverId: String,
    emojiList: Array,
    createdAt: { type: Date, default: Date.now, expires: 60 }
});

// Model එක ලබා ගැනීම
const Signal = mongoose.models.Signal || mongoose.model("Signal", SignalSchema);

export default async function handler(req, res) {
    // CORS Headers සෙට් කිරීම
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
        // Database Connection එක පරීක්ෂා කිරීම
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
        
        return res.status(200).json({ success: true, message: "Signal Captured" });
    } catch (error) {
        console.error("DB Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
