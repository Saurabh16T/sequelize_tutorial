const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var crypto = require("crypto");

module.exports = {
    hashPasswordUsingBcrypt: async (plainTextPassword) => {
        return bcrypt.hashSync(plainTextPassword, 10);
    },

    comparePasswordUsingBcrypt: async (pass, hash) => {
        return bcrypt.compareSync(pass, hash);
    },

    generateRandomString : (n) =>{
        return crypto.randomBytes(n).toString('hex');
    },

    jwtSign: async (payload) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return jwt.sign(payload, process.env.secretKey, { expiresIn: process.env.expiresIn });
        } catch (error) {
            throw error;
        }
    },

    jwtVerify: async (token) => {
          return jwt.verify(token,  process.env.secretKey);
      },
}