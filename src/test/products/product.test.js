const mongoose = require('mongoose')
const MONGODBURL = require('../../config/config')
const ProductDaoMongo = require('../../dao/mongoManager/BdProductManager')
const productModel = require('../../dao/models/products.model')
const { it } = require('mocha')
const { expect } = require('chai')
const testingIdMongo = ['642cc73acc02f558eed80d3e']

describe("Unit test for Products" , () => {
    let productDao; 

    before( async () => {
        console.log("BEFOREEE")
        mongoose.set("strictQuery", false);
        mongoose.connect(MONGODBURL.url, { useNewUrlParser: true, useUnifiedTopology: true})
    })

    after( async () => {
        console.log("AFTER")
        await mongoose.connection.close();
    })

    beforeEach ( () => {
        console.log("BEFORE EACH")
        productDao = ProductDaoMongo;
    })

    afterEach ( () => {
        console.log("AFTER EACH");
        productModel
        .deleteMany({})
        .then((res) => {})
        .catch((e) => {})
    }) 

    const product = [{
        title: "test title" ,
        description: "test description",
        code: "test code", 
        price: 1000 ,
        status: true ,
        stock: 10 ,
        category: "test category" ,
        thumbail: "test link "
    }, {
        title2: "test title" ,
        description2: "test description",
        code2: "test code", 
        price2: 1000 ,
        status2: true ,
        stock2: 10 ,
        category2: "test category" ,
        thumbail2: "test link "
    }
    ]


    it("Testing Obtencion de todos los Productos", async () => {
        ProductDaoMongo
        .create(product[0])
        .then((res) => {})
        .catch((e) => {}) 
        ProductDaoMongo
        .create(product[1])
        .then((res) => {})
        .catch((e) => {}) 
        ProductDaoMongo
        .get()
        .then((result) => {
            expect(result).to.have.lengthOf()
        })
        .catch((e) => {})
    });

    it("testing Creacion de Producto" , () => {
        ProductDaoMongo
        .create(product[0])
        .then((res) => {
            expect(res.title).to.equal(product[0].title);
            expect(res.description).to.equal(product[0].description);
            expect(res.code).to.equal(product[0].code);
            expect(res.status).to.equal(product[0].status);
            expect(res.price).to.equal(product[0].price);
            expect(res.category).to.equal(product[0].category);
            expect(res.thumbnail).to.equal(product[0].thumbail);
        })
        .catch((e) => {})
    })

    it("testing obtencion producto por ID" , () => {
        const createProduct = ProductDaoMongo.create(product[0]);
        createProduct.then((res) => {
            ProductDaoMongo
            .getId({ id : res.testingIdMongo})
            expect(res.title).to.equal(product[0].title);
            expect(res.description).to.equal(product[0].description);
            expect(res.code).to.equal(product[0].code);
            expect(res.status).to.equal(product[0].status);
            expect(res.price).to.equal(product[0].price);
            expect(res.category).to.equal(product[0].category);
            expect(res.thumbnail).to.equal(product[0].thumbail);
        })
    })

    it("testing para Borrar un producto" , () => {
        const createProduct =  ProductDaoMongo.create(product[0]);
        const createProduct2 = ProductDaoMongo.create(product[1]);
        const deleteProduct =  ProductDaoMongo.deleter(createProduct._id) 
        deleteProduct.then((res) =>{
            ProductDaoMongo
            .deleter({ id : createProduct._d})
            expect(deleteProduct.title).to.equal("test title")
            expect(deleteProduct).to.be.ok
            expect(deleteProduct.stock).to.equal(Number)

            const cantidadProduct = ProductDaoMongo.get(
            expect(cantidadProduct.lengh).to.equal(1)
            )
        })
    }) 
})