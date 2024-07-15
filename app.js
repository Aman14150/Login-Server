// app.js
const express = require('express');
const { connectDb } = require('./config/mongoConfig');
const UserModel = require('./models/users');
const { generatePassword, comparePassword, generateToken, verifyToken } = require('./config/utils');
const { authHandler, adminAuth } = require('./middleware/authMid');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/user', authHandler, async (req, res) => {
    try {
        const data = await UserModel.find();
        res.send({ data });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Oops, something went wrong !!' });
    }
});

app.post('/user/signUp', async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await generatePassword(password);

        const newUser = await UserModel.create({ name, email, password: hashedPassword });
        return res.status(201).send({ message: 'SignUp successful', user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Oops, something went wrong!!' });
    }
});

app.post('/user/signIn', async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.status(400).json({ error: "Please fill all the fields" });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isPasswordValid = await comparePassword(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid password' });
        }

        const token = generateToken({ userId: existingUser._id });
        return res.send({ message: 'User logged in successfully', token });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Oops, something went wrong!!' });
    }
});

app.post('/user/updatePassword', async (req, res) => {
    try {
        let { email, oldPassword, newPassword } = req.body;
        email = email.trim();
        oldPassword = oldPassword.trim();
        newPassword = newPassword.trim();

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isOldPasswordValid = await comparePassword(oldPassword, existingUser.password);
        if (!isOldPasswordValid) {
            return res.status(400).send({ message: 'Old password is incorrect' });
        }

        const hashedNewPassword = await generatePassword(newPassword);
        existingUser.password = hashedNewPassword;

        await existingUser.save();

        return res.send({ message: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Oops, something went wrong!!' });
    }
});

// Uncomment and complete the forgot password functionality when needed
// const sendResetPasswordEmail = async (email, token) => {
//   const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASSWORD
//       }
//   });

//   const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Password Reset Request',
//       text: `You requested for a password reset. Please use the following token to reset your password: ${token}`
//   };

//   await transporter.sendMail(mailOptions);
// };

// app.post('/user/forgetPassword', async (req, res) => {
//   try {
//     let { email } = req.body;
//     email = email.trim();

//     if (!email) {
//       return res.status(400).json({ error: "Please provide an email" });
//     }

//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       const randomString = randomstring.generate();
//       await UserModel.updateOne({ email }, { $set: { token: randomString } });

//       await sendResetPasswordEmail(email, randomString);

//       return res.send({ message: "Check your mail inbox" });
//     } else {
//       return res.status(404).send({ message: 'User not found' });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: 'Oops, something went wrong' });
//   }
// });

// app.post('/user/resetPassword', async (req, res) => {
//   try {
//     let { token, newPassword } = req.body;
//     token = token.trim();
//     newPassword = newPassword.trim();

//     if (!token || !newPassword) {
//       return res.status(400).json({ error: "Please provide the token and new password" });
//     }

//     const user = await UserModel.findOne({ token });
//     if (!user) {
//       return res.status(400).send({ message: 'Invalid token' });
//     }

//     const hashedNewPassword = await generatePassword(newPassword);
//     user.password = hashedNewPassword;
//     user.token = ''; // Clear the token

//     await user.save();

//     return res.send({ message: 'Password reset successfully' });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: 'Oops, something went wrong' });
//   }
// });

app.listen(5000, async () => {
    try {
        await connectDb();
        console.log('Server Connection Successful');
    } catch (err) {
        console.log(err);
    }
    console.log('Server is running on port 5000');
});
