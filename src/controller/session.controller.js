const { COOKIE_USER}=  require("../config/config");
const { logger } = require("../config/config.winston");
const { DtoUser } = require("../dao/DTOs/dtoUsers");
const { sesionServices, productServices } = require("../service");
const { invalidEmail } = require("../utils/creatorMsg");
const CustomError = require("../utils/customError");
const { ERROR_USER } = require("../utils/variablesError");
const mailingService = require("../service/mailing.service");
const { generateToken, getUserByToken } = require("../utils/jwt");
const { comparePassword, hashPassword } = require("../utils/hashPassword");
const HttpResponse = require("../utils/middleware/codErrors");

const HttpResp =  new HttpResponse


const sessionLogin = async (req,res)=>{
    res
    .cookie(COOKIE_USER, req.user.token, { maxAge: 300000, httpOnly: true })
    .send(req.user )
}


const loginRegister = async (req,res)=>{
    logger.info('cliente Registrado con exito')
    res.send(req.user) 
}  


const getCurrent = (req, res)=>{
    newUser = DtoUser(req.user)
    res.send(newUser) 
}

const github = async(req, res) =>{
  try {
    
    const products= await productServices.getProduct();
    req.user.rol = "USER"
    const product = products.docs.map((product) => ({
        title:product.title,
        description:product.description,
        category:product.category,
        price:product.price,
        stock:product.stock,
    }
    )) 
    res.render("viewProduct", {
        products: product,
        totalPage: products.totalPages,
        page:products.page,
        prev: products.hasPrevPage,
        next: products.hasNextPage,
        firstName: req.user.firstName,
        rol: req.user.rol
    })
  } catch (error) {
      return HttpResp.Error(res,  "ERROR" , error)
  }
}


const forgotPassword = async (req, res, next)=>{
    try {
    const {email} = req.body
    const verifyUser = await sesionServices.getEmail({email:email}) 
    if (verifyUser === null) {
      return HttpResp.Error(res , "El email no encontrado")
    }
      const token = generateToken({id:verifyUser._id},"1h")
      mailingService.sendMail({
      to: verifyUser.email,
      subject: ` Hola ${verifyUser.firstName}`,
      html: `<a href="http://localhost:8080/forgotrecovery/?token=${token}" style="margin: 20px 0; color: #080808;">Restablecer Constraseña</a>`
    })
    res.json({
      status: "success",
      message:`Se Envio email a ${verifyUser.email} para restablecer su Contraseña`,
      
    })  
    
  } catch (error) {
    return next (CustomError.createError({code:ERROR_USER, msg: invalidEmail(), typeError:"ERROR_USER"})) 
  }  
  
}

const forgotrecovery = async (req, res, next)=>{
  try {
      const newPassword = req.body.password
      const token = req.params.token
        if (!newPassword || !token) {
          return HttpResp.BadRequest(res , "Invalid data");
    }
    const user = await getUserByToken(token);
    if (!user) {
      return HttpResp.Forbbiden(res , "Token Invalido")
    }
    const isValid = await comparePassword(newPassword, user.password);
    if (isValid) {
      return HttpResp.Forbbiden(res , "La contraseña no puede ser igual a la anterior")
    }
    const hashNewPassword = await hashPassword(newPassword);
    await sesionServices.updateUserPassword(user.id, hashNewPassword);
    return HttpResp.OK(res , "La contraseña se actualizo con exito")
    
  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error)
  }
  
}
const roleChange = async (req, res, next)=>{
    const {uid} = req.params
    const {rol}= req.body
    const user = await sesionServices.getUserId(uid)
    console.log(user)
    if (!user){
      return HttpResp.OK(res , "Usuario no Encontrado")
    }
    if (user.rol === rol){
      return HttpResp.OK(res , `El usuario ya tiene role ${rol}`)
  }
  await sesionServices.updateUserRole (user.id, rol);
    return HttpResp.OK(res , "El Role Cambiado con exito");
}

module.exports={
    sessionLogin,
    loginRegister,
    getCurrent,
    github,
    forgotPassword,
    forgotrecovery,
    roleChange,
}