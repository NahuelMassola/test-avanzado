const { expect } = require('chai');
const { hashPassword } = require('../../utils/hashPassword');

describe(' test Fucncion Util con Bcrypt' , () => {

    describe('Test hashPassword method' , () => {
        it('should test if hash is created succesfully' , async () => {
            const password = "123456";
            const hash = await hashPassword(password)
        })
    })
})