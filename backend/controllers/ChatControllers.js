import { chatWithGemini } from "../config/gemini.js";
import Thread from "../models/Thread.js";

export const chat = async (req, res) => {
    const { threadId, message } = req.body;
    const userId = req.user._id.toString();

    if (!threadId || !message)
        return res.status(400).json({ error: "Missing required fields" });

    try {
        let thread = await Thread.findOne({ threadId, userId });
        if (!thread) {
            thread = new Thread({
                threadId,
                userId,
                title: message.slice(0, 60),
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await chatWithGemini(message);

        thread.messages.push({ role: "assistant", content: assistantReply });
        await thread.save();
        res.json({ reply: assistantReply });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const thread = async (req, res) => {
    const userId = req.user._id.toString();
    try {
        const threads = await Thread.find({ userId }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export const threadId = async (req, res) => {
    const { threadId } = req.params;
    const userId = req.user._id.toString();
    try {
        const threadDetails = await Thread.findOne({ threadId, userId });
        if (!threadDetails)
            return res.status(400).json({ error: "Thread not found" });

        res.json(threadDetails.messages);
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};

export const Delete = async (req, res) => {
    const { threadId } = req.params;
    const userId = req.user._id.toString();
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId, userId });
        if (!deletedThread)
            return res.status(404).json({ error: "Thread not found" });

        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};
