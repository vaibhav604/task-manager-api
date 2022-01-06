const { Mongoose } = require('mongoose');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const User = require('../src/models/user');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const {setupDB,user1,userOneId} = require('./fixtures/db');

jest.setTimeout(30000)

beforeEach(setupDB)

test('should signup new user',async()=>{
    const response=await request(app).post('/users').send({
        name:'elsa',
        email:'elsa@gmailc.com',
        password:'elsa12345'
    }).expect(201)
    // Assert that database changed correctly
    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // assertions about response
    expect(response.body).toMatchObject({
        user:{
            name:'elsa',
            email:'elsa@gmailc.com'
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe('elsa12345')
})

test('should log in existing user',async()=>{
    const response= await request(app).post('/users/login').send({
        email:user1.email,
        password:user1.password
    }).expect(200)
    const user=await User.findById(response.body.user._id)
    expect(response.body).toMatchObject({
        token:user.tokens[1].token
    })
})

test('should not log in',async()=>{
    await request(app).post('/users/login').send({
        email:'john123@gmial.com',
        password:user1.password
    }).expect(400)
})

test('should authorize',async()=>{
    await request(app).get('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send().expect(200)
})

test('should not authorize',async()=>{
    await request(app).get('/users/me')
        .send().expect(401)
})

test('should delete user',async()=>{
    const response=await request(app).delete('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send().expect(200)

    const user=await User.findById(userOneId)
    expect(user).toBeNull()


})

test('should not delete user if unatuthorized',async()=>{
    await request(app).delete('/users/me')
    .send().expect(401)
})

test('should upload avatar pic',async()=>{
    await request(app).post('/users/me/avatar')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200 )

    const user=await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields',async()=>{
    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        name:'Ethan'
    }).expect(200)
    const user=await User.findById(userOneId)
    expect(user.name).toBe('Ethan')
})

test('should not update invalid user fields',async()=>{
    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        location:'Pune'
    }).expect(400)
})

test(' Should not signup user with invalid name/age/password',async()=>{
    //email
     await request(app).post('/users')
    .send({
        name:'ratan',
        email:'retan.com',
        password:'tarat2135!!'
    }).expect(400)


    //name
    await request(app).post('/users')
    .send({
        email:'james@expamp.com',
        password:'james12345'
    }).expect(400)

    //password
    await request(app).post('/users')
    .send({
        name:'james',
        email:'james@expamp.com',
        password:'jam'
    }).expect(400)

})

test('Should not update user if unauthenticated',async()=>{
    await request(app).patch('/users/me')
    .send({
        name:'John'
    }).expect(401)
})


test('Should not update user with invalid email',async()=>{
    //email
    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        email:'5255ratan.com'
    }).expect(400)
    const user=await User.findById(userOneId)
    expect(user.email).not.toBe('5255.com')
})

test('Should not update user with invalid password',async()=>{
    //password
    await request(app).patch('/users/me')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        password:'123'
    }).expect(400)
    const user = await User.findById(userOneId)
    const isSame = await bcrypt.compare('123', user.password)
    expect(isSame).toBe(false)
})