const bcrypt = require('bcryptjs')

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(12)
        return await bcrypt.hash(password, salt);
    } catch (err) {
        return err
    }
}
const comparePassword = async (password, hash) => {
    try {
        const result = await bcrypt.compare(password, hash);
        return result;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
}
module.exports = {
    hashPassword,
    comparePassword,
}