
const { productServices, cartsServices } = require("../service/index");
const { mapProductCart, calculateQuantityTotal, calculateCartTotal } = require('../utils/calculosCarts');
const fecha = require("../utils/Fecha");
const { v4 } = require("uuid");
const HttpResponse = require("../utils/middleware/codErrors");

const HttpResp =  new HttpResponse

const createCarts = async (req, res) => {
  try {

    const cart = {
      priceTotal: 0,
      quantityTotal: 0,
      products: [],
    }
    await cartsServices.createCart(cart)
    return HttpResp.OK(res , "Carrito Creado" , cart)
  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error.message)
  }
}

const getAllCart = async (req , res) => {
  const getAll = await cartsServices.getAllCart()
  return HttpResp.OK(res , "Todos los Carritos Existentes" , getAll )
}

const addProductsToCart = async (req, res) => {
  try {
    const { cid } = req.params
    const { products = [] } = req.body
    const cart = await cartsServices.getCartsId(cid);
    if (!cart) {
      return HttpResp.BadRequest(res , "Carrito no encontrado" , cart)
    }
    let { productCartList } = await mapProductCart(products)
    const productCart = {
      priceTotal: calculateCartTotal(productCartList),
      quantityTotal: calculateQuantityTotal(productCartList),
      products: productCartList,
    }
    await cartsServices.updateToCart(cid, productCart)
    return HttpResp.OK(res , "Productos Agregados al Carrito" , productCart)

  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error.message)
  }
}

const bdgetCartId = async (req, res) => {
  try {
    const { cid } = req.params
    const cart = await cartsServices.getCartsId(cid);
    if (cart) {
      return HttpResp.OK(res , "Carrito encontrado" , cart)
    }

  } catch (error) {
    return HttpResp.BadRequest(res , "ERROR" , error)
  }
}


const emptyToCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const Cart = await cartsServices.getCartsId(cid);
    Cart.products = [];
    Cart.quantityTotal = 0
    Cart.priceTotal = 0
    await cartsServices.updateToCart(cid, Cart)
    return res.json({
      msg: "Carrito Vacio",
    })

  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error)
  }

}

const deleteProductToCart = async (req, res) => {
  try {
    const { products = [] } = req.body
    let { productCartList } = await mapProductCart(products)
    const { cid, pid } = req.params;
    const Cart = await cartsServices.getCartsId(cid);
    if (!Cart) {
      return HttpResp.BadRequest(res , "Carrito no encontrado")
    }

    const product = await productServices.getProductId(pid);
    if (!product) {
      return HttpResp.BadRequest(res , "Producto no encontrado")
    }


    const findProductTocart = Cart.products.some(({ product }) => product._id == pid)

    if (!findProductTocart) {
      return HttpResp.BadRequest(res , "Producto no Existe en el carrito")
    }
    Cart.products = Cart.products.filter(({ product }) => product._id != pid)
    Cart.quantityTotal = calculateQuantityTotal(productCartList)
    Cart.priceTotal = calculateCartTotal(Cart.products)
    await cartsServices.updateToCart(cid, Cart)
    return HttpResp.OK(res , "Producto Eliminado" , Cart)

  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error)
  }
}


const updateToQuantityProduct = async (req, res) => {
  try {
    const { cid, pid, } = req.params;
    const { quantity = 0 } = req.body;

    const Cart = await cartsServices.getCartsId(cid);
    if (!Cart) {
      return HttpResp.BadRequest(res , "Carrito no encontrado")
    }
    const product = await productServices.getProductId(pid);
    if (!product) {
      return HttpResp.BadRequest(res , "Producto no encontrado en Base de Datos")
    }
    const findProductTocart = Cart.products.findIndex(({ product }) => product._id == pid)

    if (findProductTocart === -1) {
      return HttpResp.BadRequest(res , "Producto no Encontrado en el carrito")
    }
    Cart.products[findProductTocart].quantity += quantity
    Cart.priceTotal = calculateCartTotal(Cart.products)
    await cartsServices.updateToCart(cid, Cart)
    return HttpResp.OK(res , "Cantidad Actualizada" , Cart)


  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error)
  }

}


const updateToProductsToCart = async (req, res) => {

  try {
    const { cid } = req.params
    const Cart = await cartsServices.getCartsId(cid);
    if (!Cart) {
      return HttpResp.BadRequest(res , "Carrito inexistente")
    }
    const { products = [] } = req.body
    let { productCartList } = await mapProductCart(products)

    const upateCart = {
      priceTotal: calculateCartTotal(productCartList),
      quantityTotal: calculateQuantityTotal(productCartList),
      products: productCartList,
    }
    await cartsServices.updateToCart(cid, upateCart)

    return res.json({
      msg: "Carrito Actualizado",
      payload: { productCartList, productsNotFound },
      carts: Cart
    })

  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error)
  }
}

const pucharse = async (req, res) => {
  try {
    const { email } = req.user.user
    let sinStock = []
    let tiketTotal = 0
    const { cid } = req.params
    const cart = await cartsServices.getCartsId(cid);
    if (!cart) {
      return HttpResp.BadRequest(res , "Carrito no encontrado" , cart)
    }

    for (let i = 0; i < cart.products.length; i++) {
      const productBd = await productServices.getProductId(cart.products[i].product._id)

      if (productBd.stock >= cart.products[i].quantity) {
        tiketTotal += productBd.price * cart.products[i].quantity
        productBd.stock = productBd.stock - cart.products[i].quantity
        await productServices.updateProduct(productBd.id, productBd)
      } else {
        sinStock.push(productBd.id)
      }

    }
    let { productCartList } = await mapProductCart(sinStock)
    const upateCart = {
      priceTotal: calculateCartTotal(productCartList),
      quantityTotal: calculateQuantityTotal(productCartList),
      products: productCartList,
    }
    await cartsServices.updateToCart(cid, upateCart)
    const ticket = {
      code: v4(),
      purchase_datetime: fecha(),
      amount: tiketTotal,
      parchaser: email,
    }
    const createTicket = await cartsServices.createTicket(ticket)

    if (!createTicket) {
      return HttpResp.BadRequest(res , "Error al generar ticket" , createTicket)
    }
    return res.json({
      msg: "Tiket Creado",
      playload: createTicket,
      ProductSinStock: sinStock,
    })
  } catch (error) {
    return HttpResp.Error(res , "ERROR" , error)
  }
}



module.exports = {
  createCarts,
  addProductsToCart,
  bdgetCartId,
  getAllCart,
  deleteProductToCart,
  emptyToCart,
  updateToQuantityProduct,
  updateToProductsToCart,
  pucharse,
}

