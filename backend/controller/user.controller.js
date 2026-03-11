const User = require("../models/User.model");

// READ ALL
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

// UPDATE
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};


exports.toggleActive = async (req, res) => {
    try {

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.is_active = !user.is_active;

        await user.save();

        res.json(user);

    } catch (err) {
        res.status(500).json(err);
    }
};

