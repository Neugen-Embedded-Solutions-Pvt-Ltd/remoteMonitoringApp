const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmail = require('../utils/sendemails');
const mysqlError = require('mysql-error-codes')

// Register user 
exports.register = async (req, res) => {
  try {
    const {
      device_id,
      firstName,
      lastName,
      email,
      password
    } = req.body; 
    let findUser = await User.findByEmail(email);
    console.table(findUser)
    if(findUser.length != 0) {
      return res.send({
        message: 'User already exist'
      });
    }
    const hasedPassword = bcrypt.hashSync(password, 8);

    await User.create({
      device_id,
      firstName,
      lastName,
      email,
      password: hasedPassword
    }); // store details databses

    res.status(201).send({
      status: 200,
      message: 'user created successfully'
    });

  } catch (err) {
    console.log(err);
    res.status(500).send({
      codes: err,
      message: 'error register user'
    });
  }
};

// Login user 
exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Find user by email
    const users = await User.findByEmail(email); // login with email
    if (users.length === 0) return res.status(404).send("User not found.");

    const user = users[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password); // decrypt the password

    if (!passwordIsValid) return res.status(401).send("Invalid credentials.");
    console.log(user.id)
    // Generate JWT
    const token = jwt.sign({
      id: user.id
    }, process.env.JWT_SECRET, {
      expiresIn: 86400, // 24 hours
    }); // generate JWT token 

    res.status(200).send({
      status: 200,
      message: 'User logedin',
      auth: true,
      token
    });
  } catch (err) {
    res.status(500).send("Error logging in.");
  }
};

//Send OTP   (currently not using)
exports.sendOtps = async (req, res) => {
  try {
    const {
      email
    } = req.body;
    const otp = generateOTP(); // gerate OTP
    await User.sendOTP({
      email,
      otp
    }); //store OTP in DB and and delete once it's used
    console.log('OTP sent')
    await sendEmail({
      to: email,
      subject: 'your OTP',
      message: `<h2>Your OTP ${otp} </h2>`
    }); // email template for shoe OTP

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
};

// verify OTP (currently not using)
exports.verifyOtp = async (req, res, next) => {
  try {
    const {
      email,
      otp
    } = req.body;

    const validOtp = await User.validateOtp({
      email,
      otp
    }); // validateing OTP with database
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
    console.error('Error verifying OTP:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}