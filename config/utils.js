const bcrypt = require('bcryptjs');
const jwtToken = require('jsonwebtoken');

// Using Asychronous fuction for both generate and compare
const generatePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error generating password');
  }
};
const comparePassword = async (inputPassword, originalPassword) => {
  try {
    const isMatch = await bcrypt.compare(inputPassword, originalPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// for sychronous fuction
// const generatePassword = (password) => bcrypt.hashSync(password, 8);
// const comparePassword = (inputPassword, originalPassword) => bcrypt.compareSync(inputPassword, originalPassword);


const generateToken = (data) => jwtToken.sign(data, process.env.JWT_SECRET_KEY);

const verifyToken = (token) => {
  try {
      return jwtToken.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
      throw new Error('Invalid token');
  }
};

module.exports = { generatePassword, comparePassword, generateToken, verifyToken };
