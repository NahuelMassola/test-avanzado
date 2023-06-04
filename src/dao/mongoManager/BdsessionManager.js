const userModel = require ('../models/user.model')

class BdsessionManager {
   
  getSession = (email, password) => userModel.findOne({email, password});
  
  getId = (id) => userModel.findById(id);
  
  getEmail = (email) => userModel.findOne(email);
  
  create = (user)=>{
      const { firstName, lastName, email, age, password,rol, cart} = user
      return userModel.create({firstName , lastName, email, age, password, rol,cart })
  }

  updatePassword = (id, newPassword) => userModel.findByIdAndUpdate(id ,{password:newPassword})

  updateRole = (id, newRole) => userModel.findByIdAndUpdate(id , {rol:newRole})
}
module.exports = new BdsessionManager