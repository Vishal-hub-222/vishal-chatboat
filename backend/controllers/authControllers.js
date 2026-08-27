import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// POST /api/auth/register
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ error: "Please fill all fields" });
    if (password.length < 6)
        return res.status(400).json({ error: "Password must be at least 6 characters" });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ error: "Email already registered" });

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Please fill all fields" });

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ error: "Invalid email or password" });

        const token = generateToken(user._id);
        res.json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
    const { _id, name, email } = req.user;
    res.json({ id: _id, name, email });
};

// PUT /api/auth/profile  (protected)
export const updateProfile = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (name) user.name = name;
        if (password) {
            if (password.length < 6)
                return res.status(400).json({ error: "Password must be at least 6 characters" });
            user.password = password;
        }
        const updatedUser = await user.save();
        res.json({ id: updatedUser._id, name: updatedUser.name, email: updatedUser.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
