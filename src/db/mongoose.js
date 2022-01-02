const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isemail');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true
})


