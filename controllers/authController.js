const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const randomstring = require('randomstring');
const sendEmail = require('../utils/sendemails');

// generate OTP 

function generateOTP() {
  return randomstring.generate({
    length: 4,
    charset: 'numeric'
  })
}

exports.register = async (req, res) => {
  console.log('register')
  try {
    const {
      device_id,
      firstName,
      lastName,
      email,
      password,
      phone_number,
      address,
      country,
      pincode
    } = req.body;
    console.table(email);
    const hasedPassword = bcrypt.hashSync(password, 8);

    await User.create({
      device_id,
      firstName,
      lastName,
      email,
      password: hasedPassword,
      phone_number,
      address,
      country,
      pincode
    });

    res.status(200).send('user created successfully');

  } catch (err) {
    console.log(err);
    res.status(500).send('error register user');
  }
};
exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;
   
    // Find user by email
    const users = await User.findByEmail(email);
    if (users.length === 0) return res.status(404).send("User not found.");
  
    const user = users[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return res.status(401).send("Invalid credentials.");
    console.log(user.id)
    // Generate JWT
    const token = jwt.sign({
      id: user.id
    }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    });
   
    res.status(200).send({
      message: 'User loged in',
      auth: true,
      token
    });
  } catch (err) {
    res.status(500).send("Error logging in.");
  }
};

exports.sendOtps = async (req, res) => {
  try {
    const {
      email
    } = req.body;
    const otp = generateOTP();
    // console.log({email, otp});
    await User.sendOTP({
      email,
      otp
    });
    console.log('login ... sent')
    await sendEmail({
      to: email,
      subject: 'your OTP',
      message: `<h2>Your OTP ${otp} </h2>`
    }) 
    
    res.status(200).send({
      message: "Your Otp send to your email Address"
    });

  } catch (err) {
    console.error('Error sending OTP:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
exports.verifyOtp = async (req, res, next) => {
  try {
    const {
      email,
      otp
    } = req.body;

    const validOtp = await User.validateOtp({
      email,
      otp
    });
    if (validOtp) {
      res.status(200).json({
        success: true,
        message: 'Your OTP is valid',
      });
      next();
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    };
  } catch (err) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}