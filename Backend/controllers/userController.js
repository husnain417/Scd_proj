require('dotenv').config();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendOtp } = require('../services/sendOtp');
const { reSendOtp } = require('../services/sendOtp');
const path = require('path');
const fs = require('fs');


const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;s

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Fill all fields' });
    }
    
    const isPasswordValid = /^(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, include at least one special character, and contain at least one number.',
      });
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!isEmailValid) {
        return res.status(400).json({ message: 'Enter a valid email format' });
      }

    const userAlreadyExists = await User.findOne({ username });

    if (userAlreadyExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
     
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    await emailVerification(email);

    res.status(200).json({ message: 'User created successfully, and OTP sent to email' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Fill all fields' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'No user found with this username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const profileAccess = async (req, res) => {
  const { id } = req.user;

  try {
      const user = await User.findOne({ _id: id }).lean();
      
      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'Profile', user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};


const emailVerification = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    await sendOtp(user);  // Ensure sendOtp is a function that sends OTP to the user

    return { message: 'OTP sent successfully' };
  } catch (err) {
    console.log(err);
    throw new Error('Failed to send OTP');
  }
};

const reSendingOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    await reSendOtp(user);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyOtp = async(req,res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.otp = null;  
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();    
    
    res.status(200).json({ message: 'OTP verified successfully' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const forgotPass = async(req,res) => {
  try {
    const { email  } = req.body;

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      return res.status(400).json({ message: 'Enter a valid email format' });
    }

    const user = await User.findOne({ email });
    if(!user)
    {
      return res.status(400).json({message: 'User doesnot exist'})
    }

      const payload = {
        id: user._id,
        username: user.username,
        email: user.email
      };

      const resetToken = jwt.sign(payload, process.env.RESET_TOKEN_SECRET , { expiresIn: '15m' });

      await reSendOtp(user);

      res.status(200).json({ message: 'Enter New Password with Otp sent to your mail',resetToken});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const passwordReset = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;
    const { id } = req.user; 
    
    const isPasswordValid = /^(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, include at least one special character, and contain at least one number.',
      });
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;

    if (!user.isVerified) {
      user.isVerified = true;
    }

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.log(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

const changePass = async (req, res) => {
  try {
    const { oldPassword , newPassword } = req.body;
    const { id } = req.user; 

    if(oldPassword == newPassword)
    {
      return res.status(400).json({message : "You entered the same password please change: "});
    }

    const user = await User.findOne({ _id:id });
    if (!user) {
      return res.status(400).json({ message: 'No user found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadPicture = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const file = req.file;
    const newFileName = file.filename;
    const lastUnderscoreIndex = newFileName.lastIndexOf('_');
    const newBaseName = newFileName.slice(0, lastUnderscoreIndex);
    
    if (user.profilePicUrl) {
        const oldFileName = path.basename(user.profilePicUrl);
        const oldLastUnderscoreIndex = oldFileName.lastIndexOf('_');
        const oldBaseName = oldFileName.slice(0, oldLastUnderscoreIndex);
        const oldFilePath = path.join(__dirname, '../uploads/', user.username, oldFileName);

      if (fs.existsSync(oldFilePath)) {
        if (oldBaseName === newBaseName) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    const url = `${req.protocol}://${req.get('host')}/uploads/${user.username}/${newFileName}`;
    user.profilePicUrl = url;
    await user.save();

    res.status(201).json({ message: 'File uploaded successfully', url });
  } catch (err) {
    console.error('Error uploading file', err);
    res.status(500).send('Server error');
  }
};

const getPicture = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user || !user.profilePicUrl) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    res.status(200).json({ url: user.profilePicUrl });
  } catch (err) {
    console.error('Error fetching profile picture', err);
    res.status(500).send('Server error');
  }
}


module.exports = {
  registerUser,
  loginUser,
  profileAccess,
  emailVerification,
  reSendingOtp,
  verifyOtp,
  forgotPass,
  passwordReset,
  changePass,
  uploadPicture,
  getPicture,
};
