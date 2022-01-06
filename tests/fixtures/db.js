const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task')

const userOneId=new mongoose.Types.ObjectId()
const user1={
    _id:userOneId,
    name:'Mike',
    email:'mike21@gmail.com',
    password:'mike314',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwoId=new mongoose.Types.ObjectId()
const user2={
    _id:userTwoId,
    name:'Ethan',
    email:'ethan21@gmail.com',
    password:'ethan314',
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const task1={
    _id:new mongoose.Types.ObjectId(),
    description:'First Task',
    completed:true,
    owner:user1._id
}
const task2={
    _id:new mongoose.Types.ObjectId(),
    description:'Second Task',
    completed:true,
    owner:user1._id
}

const task3={
    _id:new mongoose.Types.ObjectId(),
    description:'Third Task',
    owner:user2._id
}

const setupDB=async()=>{
    await User.deleteMany()
    await Task.deleteMany()

    await new User(user1).save()
    await new User(user2).save()

    await new Task(task1).save()
    await new Task(task2).save()
    await new Task(task3).save()
}

module.exports={
    setupDB,
    userOneId,
    user1,
    userTwoId,
    user2,
    task1,
    task2,
    task3
}