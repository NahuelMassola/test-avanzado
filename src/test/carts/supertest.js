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
const testingCart = ['647297d35aa8ee002b708a08']

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

    it(`Testing de Creacion de carritos `, async () => {
        const response = await request.post(`/api/session/login`).send({
            email: "prueba123asdqwe@gmail.com",
            password: "123456"
        });
        const { headers } = response;
        const array = headers['set-cookie'][0].split('=');
        cookie = {
            name: array[0],
            value: array[1],
        };
        const { statusCode, ok, _body } = await request.post('/api/carts').set('Cookie', `${cookie.name}=${cookie.value}`);
        expect(statusCode).to.deep.equal(200);
        expect(ok).to.be.true;
        expect(_body).to.be.an.instanceof(Object);
    });

    it(`Testing de obtencion de carrito por ID `, async () => {
        const { statusCode, ok, _body } = await request.get(`/api/carts/${testingCart}`);
        expect(statusCode).to.deep.equal(200);
        expect(ok).to.be.true;
        expect(_body).to.be.an.instanceof(Object);
    });

})