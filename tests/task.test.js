const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {setupDB,
    userOneId,
    user1,
    userTwoId,
    user2,
    task1,
    task2,
    task3} = require('./fixtures/db');

jest.setTimeout(30000)

beforeEach(setupDB)

test('should create task for user',async()=>{
    const res=await request(app).post('/tasks')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        description:'Watch Netflix',
    })
    .expect(201)

    const task=await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('get all tasks of user',async()=>{
    const res=await request(app).get('/tasks')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body.length).toEqual(2)
})

test('should not delete unauthorized task',async()=>{
    const res=await request(app).delete(`/tasks/${task1._id}`)
    .set('Authorization',`Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)
    const task=await Task.findById(task1._id)
    expect(task).not.toBeNull()
})

// Should not create task with invalid description/completed
test('Should not create task with invalid description',async()=>{
    const res=await request(app).post('/tasks')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        'description':''
    })
    .expect(400)
    const task=await Task.findById(res.body._id)
    expect(task).toBeNull()
})

test('Should not create task with invalid completed',async()=>{
    const res=await request(app).post('/tasks')
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        'completed':'false'
    })
    .expect(400)
    const task=await Task.findById(res.body._id)
    expect(task).toBeNull()
})

// Should not update task with invalid description/completed
test('Should not update task with invalid description',async()=>{
    await request(app).patch(`/tasks/${task1._id}`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        'description':''
    }).expect(500)
    const task=await Task.findById(task1._id)
    expect(task.description).toBe('First Task')
})

test('Should not update task with invalid completed',async()=>{
    await request(app).patch(`/tasks/${task1._id}`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send({
        completed:'daniel'
    }).expect(500)
    const task=await Task.findById(task1._id)
    expect(task.completed).toBe(true)
})

// Should delete user task
test('Should delete user task',async()=>{
    await request(app).delete(`/tasks/${task1._id}`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send().expect(200)
    const task=await Task.findById(task1._id)
    expect(task).toBeNull()
})

// Should not delete task if unauthenticated
test('Should not delete task if unauthenticated',async()=>{
    await request(app).delete(`/tasks/${task1._id}`)
    .send().expect(401)
    const task=await Task.findById(task1._id)
    expect(task).not.toBeNull()
})
// Should not update other users task
test('Should not update other users task',async()=>{
    await request(app).patch(`/tasks/${task1._id}`)
    .set('Authorization',`Bearer ${user2.tokens[0].token}`)
    .send({
        description:'New Task'
    }).expect(404)
    const task=await Task.findById(task1._id)
    expect(task.description).toBe('First Task')
})

// Should fetch user task by id
test('Should fetch user task by id',async()=>{
    const res=await request(app).get(`/tasks/${task1._id}`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)

    const task=await Task.findById(task1._id)
    expect(res.body.description).toBe(task1.description)
    expect(res.body.completed).toBe(task1.completed)

})

// Should not fetch user task by id if unauthenticated
test('Should not fetch user task by id if unauthenticated',async()=>{
    await request(app).get(`/tasks/${task1._id}`)
    .send()
    .expect(401)

})

// Should not fetch other users task by id
test('Should not fetch other users task by id',async()=>{
    const res=await request(app).get(`/tasks/${task1._id}`)
    .set('Authorization',`Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(404)
})

// Should fetch only completed tasks
test('Should fetch only completed tasks',async()=>{
    const res=await request(app).get(`/tasks?completed=true`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body.length).toBe(2)
})

// Should fetch only incomplete tasks
test('Should fetch only incomplete tasks',async()=>{
    const res=await request(app).get(`/tasks?completed=false`)
    .set('Authorization',`Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body.length).toBe(1)
})

// Should sort tasks by description/createdAt/updatedAt
test('Should sort tasks by description',async()=>{
    const res=await request(app).get(`/tasks?sortBy=description:desc`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body[0].description).toBe('Second Task')
})

test('Should sort tasks by createdAt',async()=>{
    const res=await request(app).get(`/tasks?sortBy=createdAt:desc`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body[0].description).toBe('Second Task')
})

test('Should sort tasks by updatedAt',async()=>{
    const res=await request(app).get(`/tasks?sortBy=updatedAt:desc`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body[0].description).toBe('Second Task')
})

// Should fetch page of tasks
test('Should fetch page of tasks',async()=>{
    const res=await request(app).get(`/tasks?limit=1&skip=1`)
    .set('Authorization',`Bearer ${user1.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body[0].description).toBe('Second Task')
})