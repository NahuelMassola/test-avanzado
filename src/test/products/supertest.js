const mongoose = require('mongoose')
const MONGODBURL = require('../../config/config')
const ProductDaoMongo = require('../../dao/mongoManager/BdProductManager')
const productModel = require('../../dao/models/products.model')
const chai = require('chai')
const { response } = require('express')
const superTest = require('supertest')
const portUrl = 'http://localhost:8080'
const request = superTest(portUrl)
const expect = chai.expect
const testingProducts =['6484097fb2db6d3382b4e661']


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

    const product ={
        title:"test title",
        description:"test description",
        code:"test code",
        price:1000,
        status:true,
        stock:10,    
        category:"test category",
        thumbnail:"link",
    }
    it(`Testing obtencion de todos los productos-${portUrl}/api/products` , async () => {
            const response = await request.get(`/api/products`).send()
            const { statusCode, ok, _body } = response
            expect(statusCode).to.deep.equal(200);
            expect(ok).to.be.true;
    })

    it(`Testing obtencion de un producto por ID - ${portUrl}/api/products/:pid`, async () => {
        const { statusCode, ok, _body } = await request.get(`/api/products/${testingProducts[0]}`);
        expect(statusCode).to.deep.equal(200);
        expect(ok).to.be.true;
        expect(_body).to.be.an.instanceof(Object);
    });

    it(`Testing de creacion de un producto - ${portUrl}/api/products/`, async () => {
        const response = await request.post(`/api/session/login`).send({
            email: "adminCoder@coder.com",
            password: "123456" 
    })
        const {headers} =response         
        const arrayCookie = headers['set-cookie'][0].split("=")
        cookie = {
            name : arrayCookie[0],
            value : arrayCookie[1],
        }
        
        const { statusCode, ok, _body} = await request.post(`/api/products/`).send(product).set('Cookie',`${cookie.name}=${cookie.value}`);
        expect(statusCode).to.deep.equal(200);
        expect(ok).to.be.true;
        expect(_body).to.be.an.instanceof(Object);
    });
})
