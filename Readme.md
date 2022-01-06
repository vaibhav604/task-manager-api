## Task Manager REST Api

Task manager application based on REST API design structure and built using **NodeJS** with **Express** and **MongoDB Atlas** database. App has been tested using **Jest** framework.

**Features**

* CRUD operations on tasks and user instances
* User authentication and data security with JWT tokens and bcrypt hashing
* Email service on user's signup and deactivation of the account
* Sorting, Pagination, and Filtering of tasks based on different parameters
* Users can upload profile-pic  

## Hosted Domain Link

[Task Manager REST API](https://vaibhav604-task-manager.herokuapp.com/)

## To test and run the API :

The below link will direct you to the postman collection. It allows you to interact with the live API.

**Note:** Make sure to select `Task Manager Api(prod)` environment


[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/a593e5920e1c60c4efc6?action=collection%2Fimport)


## API Endpoints

| Description   | Endpoints                     | Methods   |
| ------------- | ----------------------------- | --------- |          
| Create User   | /users                        | POST      |
| Login User    | /users/login                  | POST      |   
| Create Task   | /tasks                        | POST      |
| Read Profile  | /users/me                     | GET       |
| Read User     | /users/:id                    | GET       |
| Read Tasks    | /tasks?completed=true         | GET       |
| Read Tasks    | /tasks?sortBy=createdAt:desc  | GET       |
| Read Tasks    | /tasks?limit=10&skip=5        | GET       |
| Update User   | /users/me                     | PATCH     |
| Update Task   | /tasks/:id                    | PATCH     |
| Delete User   | /users/me                     | DELETE    |
| Delete Task   | /tasks/:id                    | DELETE    |
| Logout User   | /users/logout                 | POST      |
| LogoutAll User| /users/logoutall              | POST      |
| Upload Avatar | /users/me/avatar              | PATCH     |
| Delete Avatar | /users/me/avatar              | DELETE    |