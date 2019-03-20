const mongoose = require("mongoose");
const config = require('../config.js');

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });

const models = require('../models');
const Admin = models.Admin;



Admin.create({login: "1", password: "1"}, function(err, doc){

    if(err) return console.log(err);

    console.log("Сохранен объект user", doc);
});