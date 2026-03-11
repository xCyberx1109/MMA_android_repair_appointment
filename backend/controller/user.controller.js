const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

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

exports.changePassword = async (req, res) => {

  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Current password incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.json({ message: "Password updated successfully" });
};


