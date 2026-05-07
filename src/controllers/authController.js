const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "myjournalsecret", {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  const {
    fullName,
    email,
    username,
    password,
    dob,
    gender,
    hobbies,
    profession,
    bio,
    phone,
    profileImage,
  } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }
    let finalProfileImage = profileImage;
    if (req.file) {
      finalProfileImage = req.file.path;
    }

    const user = new User({
      fullName,
      email,
      username,
      password,
      dob,
      gender,
      hobbies,
      profession,
      bio,
      phone,
      profileImage: finalProfileImage,
    });
    await user.save();
    const token = createToken(user._id);
    res
      .status(201)
      .json({
        token,
        user: {
          id: user._id,
          fullName,
          email,
          username,
          dob,
          gender,
          hobbies,
          profession,
          bio,
          phone,
          profileImage: finalProfileImage,
        },
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username: username }, { email: username }] });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });
    const isValid = await user.comparePassword(password);
    if (!isValid)
      return res.status(400).json({ message: "Invalid username or password" });
    const token = createToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        dob: user.dob,
        gender: user.gender,
        hobbies: user.hobbies,
        profession: user.profession,
        bio: user.bio,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

exports.profile = async (req, res) => {
  const user = req.user;
  res.json({ user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, dob, gender, hobbies, profession, bio, phone, profileImage } = req.body;
    
    // We already have req.user from authMiddleware
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (dob !== undefined) user.dob = dob;
    if (gender !== undefined) user.gender = gender;
    if (hobbies !== undefined) user.hobbies = hobbies;
    if (profession !== undefined) user.profession = profession;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    
    if (req.file) {
      user.profileImage = req.file.path;
    } else if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }

    await user.save();

    res.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        dob: user.dob,
        gender: user.gender,
        hobbies: user.hobbies,
        profession: user.profession,
        bio: user.bio,
        phone: user.phone,
        profileImage: user.profileImage,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save(); // Password will be hashed by pre-save hook

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password", error: error.message });
  }
};
