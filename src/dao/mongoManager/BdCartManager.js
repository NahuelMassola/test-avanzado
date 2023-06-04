const cartsModel = require('../models/carts.model');
const tiketModel = require('../models/tiket.model');

class BdCartsManager {
    getId = (id) => cartsModel.findById(id).lean().populate('products.product');
    create = (carts) => cartsModel.create(carts);
    update = (cid,cart)=> cartsModel.updateOne(cid,cart);
    crateTicket = (ticket) => tiketModel.create(ticket) 
    getAllCart = (carts) => cartsModel.find(carts)
    deleter = (id) => cartsModel.deleteOne(id)
}




module.exports = new BdCartsManager ;
