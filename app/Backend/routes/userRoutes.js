const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authenticateResetToken } = require('../middleware/middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      try {
        const user = await User.findById(req.user.id);
        if (!user) {
          return cb(new Error('User not found'));
        }
  
        const uploadPath = path.join(__dirname, '../uploads', user.username);
  
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
  
        cb(null, uploadPath);
      } catch (err) {
        cb(err);
      }
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname.split('.').slice(0, -1).join('.')}_${Date.now()}${path.extname(file.originalname)}`);
    }
  });
  
  const upload = multer({ storage: storage });


router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', authenticateToken, userController.profileAccess);
router.post('/user/verification/sendOtp', userController.emailVerification);
router.post('/user/verification/reSendOtp' , userController.reSendingOtp);
router.post('/user/verification/otpCheck' , userController.verifyOtp);
router.post('/user/password-forgot' , userController.forgotPass);
router.post('/user/password-reset', authenticateResetToken , userController.passwordReset);
router.post('/user/password-update', authenticateToken , userController.changePass);
router.post('/user/upload-pic', authenticateToken , upload.single('file'), userController.uploadPicture);
router.get('/user/profile-pic', authenticateToken , userController.getPicture);

module.exports = router;
