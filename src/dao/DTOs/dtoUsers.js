
const DtoUser = (user) => {
  
  const newUserDto = {
    id:user.user._id,
    firstName :user.user.firstName,
    lastName :user.user.lastName,
    rol : user.user.rol
  }
  return newUserDto
} 

module.exports = {
  DtoUser 
}

