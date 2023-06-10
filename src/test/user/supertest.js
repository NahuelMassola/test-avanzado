const chai = require('chai')
const { response } = require('express')
const { default: mongoose } = require('mongoose')
const superTest = require('supertest')
const portUrl = 'http://localhost:8080'
const request = superTest(portUrl)
const expect = chai.expect
const ProductDaoMongo = require('../../dao/mongoManager/BdProductManager')
const productModel = require('../../dao/models/products.model')
const { MONGODBURL } = require('../../config/config')

describe('test e2e User', ()=>{

    before( async () => {
        console.log("BEFOREEE")
        mongoose.set("strictQuery", false);
        mongoose.connect(MONGODBURL, { useNewUrlParser: true, useUnifiedTopology: true})
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


    const user ={
        firstName:"test firstName",
        lastName: "test lastName",
        age:30,
        email:"testing@gmail.com",
        password: "123456",
        rol:"premium"
    }
    
    it(`Testing Register User-${portUrl}/api/session/register` , async () => {
            const response = await request.post(`/api/session/register`).send({
            ...user  
            })
            const { statusCode, ok, _body } = response
            expect(statusCode).to.deep.equal(200);
            expect(ok).to.be.true;
            expect(_body.status).to.deep.equal('success')
    });
    
    let cookie; 

    it(`Testing login User-${portUrl}/api/session/login` , async () => {
        const response = await request.post(`/api/session/login`).send({
            email:"testing@gmail.com",
            password:"123456"  
        })
        
        const { statusCode, ok, _body, headers } = response
        
        const arrayCookie = response.headers['set-cookie'][0].split("=")
        expect(arrayCookie).to.be.ok
        cookie = {
            name : arrayCookie[0],
            value : arrayCookie[1],
        }
        expect(cookie.name).to.be.ok.and.equal("cookie-user")
        expect(cookie.value).to.be.ok
        expect(statusCode).to.deep.equal(200);
        expect(ok).to.be.true;
        expect(_body.token).to.be.ok       
        
    });
    
    it.only(`Testing current ${portUrl}/api/session/current` , async () => {
        const response = await request.get(`/api/session/current`).set('Cookie',[`${cookie.name}=${cookie.value}`])
        const { statusCode, ok, _body, headers} = response
        expect(statusCode).to.deep.equal(401);
        expect(ok).to.be.false;
    });
})