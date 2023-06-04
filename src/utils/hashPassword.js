const bcrypt = require('bcryptjs')

const hashPassword =  (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const comparePassword =  (password, hash) => bcrypt.compare(password, hash);

module.exports = {
    hashPassword,
    comparePassword,
}