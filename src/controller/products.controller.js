const { productServices } = require("../service/index");
const { invalidProduct } = require("../utils/creatorMsg");
const CustomError = require("../utils/customError");
const generateProducts = require("../utils/productsFake");
const { ERROR_PRODUCT } = require("../utils/variablesError");
const HttpResponse = require("../utils/middleware/codErrors");

const HttpResp =  new HttpResponse


const getProductsBd = async (req, res, next) => {
  try {
    const { limit, page, sort, ...query } = req.query;
    const products = await productServices.getProduct(page, limit, sort, query);
    return HttpResp.OK(res , "Succes" , products)
  } catch (error) {
    return HttpResp.Error(res , "Error" , error)
  }
};


const getProductIdBd = async (req, res) => {
  try {
    
    const id = req.params.pid
    const getProductId = await productServices.getProductId(id);
    return HttpResp.OK(res , "Prodcuto Encontrado" , getProductId)
  } catch (error) {
    return HttpResp.BadRequest(res , "Error" , error)
  }
}

const addProductBd = async (req, res, next) => {
  try {
    const objeto= Object.keys(req.body).length === 0
    if (objeto){
      return next (CustomError.createError({code:ERROR_PRODUCT, msg: invalidProduct(), typeError:"ERROR_PRODUCT"})) 
    }
    const product = req.body;
    if (req.user.user.rol == "premium") {
      product.owner = req.user.user.email;
      const newproduct = await productServices.addProduct (product);
        return res.json({
        status: "success",
        msg: "Producto Creado con exito",
        newProduct:newproduct,
    })
    }  
  if (!product.owner) {
    const newproduct = await productServices.addProduct(product);
    return res.json({
      status: "success",
      msg: "Producto Creado con exito",
      newProduct:newproduct,
    })
  }

  } catch (error) {
    return HttpResp.BadRequest(res , "Error" , error)}
}

const updateProductBd = async (req, res) => {
  try {
    const id = req.params.pid
    const product = req.body
    const UpdateProductId = await productServices.updateProduct(id, product);
    return HttpResp.OK(res , "Succes" , UpdateProductId)
  } catch (error) {
    return HttpResp.BadRequest(res , "Error al actualizar producto" , error)}
}

const deleteProductBd = async (req, res) => {
  try {
  const id = req.params.pid;

  const productExist = await productServices.getProductId(id);
  if (!productExist) {
    return HttpResp.BadRequest(res , "Producto no existe")
  }

  if (req.user.user.rol === 'administrador') {
    const deleteproduct = await productServices.deleteProductId(id);
    return HttpResp.OK(res , "Producto Eliminado" , deleteproduct)
  }
  
  if (req.user.user.rol === 'premium') {
    if (req.user.user.email == productExist.owner) {
      await productServices.deleteProductId(id);
      return HttpResp.OK(res , "Producto Eliminado" )
    } else {
      return HttpResp.Unauthorized(res , "Usuario sin Permiso para Eliminar este producto")
    }
  } else {
    return HttpResp.Unauthorized(res , "Usuario sin Permiso para Eliminar este producto")
  }
  } catch (error) {
    return HttpResp.Error(res , "No se pudo eliminar Producto")
  }
}
const getmockingproducts = async (req,res)=>{
  try {
    const products = generateProducts()
    return HttpResp.OK(res , "Succes" , products)
  } catch (error) {
    return HttpResp.error(res , "Error" , error)
  }
}



module.exports = {
  getProductsBd,
  getProductIdBd,
  addProductBd,
  updateProductBd,
  deleteProductBd,
  getmockingproducts,
}
