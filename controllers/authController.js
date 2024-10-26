const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const sendEmail = require('../utils/sendemails');
const {
  generateOTP
} = require('../utils/helpers');


const authController = {
  // Register user 
  register: async (req, res) => {
    try {
      const {
        device_id,
        firstName,
        lastName,
        email,
        password
      } = req.body;
      let findUser = await User.findByEmail(email); 
      if (findUser.length != 0) {
        return res.send({
          status: 400,
          message: 'User already exist'
        });
      }
      let getDeviceId = await User.getDeviceId(device_id);
      console.log(getDeviceId)
      if (getDeviceId == 0) {
        return res.send({
          status: 400,
          message: 'Device is not registered'
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
        message: 'error register user'
      });
    }
  },

  // Login user
  login: async (req, res) => {
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
  },

  // Get All users data
  GetAllUsers: async (req, res) => {
    try {
      let allUsersdata = await User.GetAllUser();
      // remove password from user object
      const results = allUsersdata.map(user => {
        return Object.keys(user)
          .filter(key => !key.includes('password'))
          .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: user[key]
            })
          }, {});
        // return filteredUserData
      })

      console.log(results);
      if (allUsersdata != 0) {
        return res.send({
          status: 200,
          message: 'All users data',
          data: results
        })
      } else {
        return res.send({
          status: 400,
          message: 'No users data'
        })
      }
    } catch (error) {
      console.log("Error getting user data", error);
      res.send({
        status: 500,
        message: 'Error getting all user data',
      })
    }
  },
  //Send OTP 
  sendOtps: async (req, res) => {
    try {
      const {
        email
      } = req.body;
      const otp = generateOTP(); // gerate OTP
      let response = await User.sendOTP({
        email,
        otp
      });
      console.log(response)
      let string = JSON.stringify(response);
      let json = JSON.parse(string);

      async function deleteOtp() {
        let response = await User.deleteOtps(json[0].otp_id);
        if (response == 0) {
          return res.send({
            status: 400,
            message: 'Otp expired',
            data: results
          })
        }
      }
      setTimeout(deleteOtp, 50000); // delete OTP after 3 minutes
      let options = {
        to: email,
        subject: 'your OTP',
        message: `<h2>Your OTP ${otp} </h2>`
      }
      await sendEmail(options); // email template for shoe OTP

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
  },

  // verify OTP (currently not using)
  verifyOtp: async (req, res, next) => {
    try {
      const {
        email,
        otp
      } = req.body;

      // validateing OTP with database
      const validOtp = await User.validateOtp({
        email,
        otp
      });

      if (validOtp == 0) {
        return res.send({
          status: 400,
          message: 'not valid OTP'
        })
      }
      if (validOtp) {
        res.status(200).json({
          status: 200,
          success: true,
          message: 'Your OTP is valid',
        });

        //after using OTP delete from DB
        let string = JSON.stringify(validOtp);
        let json = JSON.parse(string);
        await User.deleteOtps(json[0].otp_id);

        next();
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }, 
}

module.exports = authController;