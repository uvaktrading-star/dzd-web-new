import mongoose from 'mongoose';

const MONGO_URI = "mongodb+srv://zanta-md:Akashkavindu12345@cluster0.iw4vklq.mongodb.net/?appName=Cluster0";

// Schema එක define කිරීමේදී strict: false අනිවාර්යයි
const SignalSchema = new mongoose.Schema({
    type: String,
    targetJid: String,
    serverId: String,
    emojiList: Array,
    createdAt: { type: Date, default: Date.now, expires: 60 }
}, { strict: false }); // <--- මගින් dynamic keys (APP_ID_1, 2, 3...) වලට ඉඩ ලබා දේ.

const Signal = mongoose.models.Signal || mongoose.model("Signal", SignalSchema);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(MONGO_URI);
        }

        // Body එකේ එන සියලුම දත්ත (type, link, APP_IDs) කෙලින්ම ගන්නවා
        const signalData = req.body;

        const newSignal = new Signal(signalData);
        await newSignal.save();
        
        return res.status(200).json({ success: true, message: "Strike Deployed Successfully" });
    } catch (error) {
        console.error("DB Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
