const express = require('express');
const router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.AdminLogin && req.session.AdminPassword) {
        res.render('Admin/Client/AddClient', { title: 'AdminPanel' });
    }
    else {
        res.render('Admin/Enter', { title: 'AdminLogin' })
        ;}
});

//Вход
 router.post('/Enter', async (req, res, next) => {
     const adminLogin = req.body.adminLogin;
     const adminPassword = req.body.adminPassword;
     try {
         const bdAdmin = await models.Admin.findOne({login: adminLogin});
         if (bdAdmin.login === adminLogin && bdAdmin.password === adminPassword) {
             req.session.AdminLogin = bdAdmin.login;
             req.session.AdminPassword = bdAdmin.password;
             res.json("Все норм!")
         }
         else {res.json("Oooppss!")}
     } catch (err) {
         console.log(err)
     }
 });

 //(Client)вывод списка клиентов
router.get('/ClientList', async(req, res, next) => {
    if(req.session.AdminLogin && req.session.AdminPassword) {
        const clients = await models.Client.find();
        res.render('Admin/Client/ClientList', { title: 'AdminPanel', clients: clients });
    }
    else {
        res.render('Admin/Enter', { title: 'AdminLogin' })
        ;}
});

//(Client)вывод списка неактивных клиентов
router.get('/NotVerificationClientList', async(req, res, next) => {
    if(req.session.AdminLogin && req.session.AdminPassword) {
        const clients = await models.NotVerificationClient.find();
        res.render('Admin/Client/NotVerificationClientList', { title: 'AdminPanel', clients: clients });
    }
    else {
        res.render('Admin/Enter', { title: 'AdminLogin' })
        ;}
});

//(Client) добовление клиента
 router.post('/addClient', async (req, res, next) => {
     if(req.session.AdminLogin && req.session.AdminPassword) {
         const Login = req.body.clientLogin;
         const Password = req.body.clientPassword;
         const ExternalID = Math.floor(Math.random() * 1000);
         try {
             await models.Client.create({
                     login: Login,
                     password: Password,
                     clientPhNumber: Login,
                     creator: req.session.AdminLogin,
                     clientExternalID: ExternalID
                 })
         }
         catch (err) {
             console.log(err)
         }
     }});

//(Client) востановление клиента
router.post('/Client/proveClient', async (req, res, next) => {
    ID = req.body.id;
    if(req.session.AdminLogin && req.session.AdminPassword) {
        try {
            await models.NotVerificationClient.findByIdAndRemove( ID , function( err,client)  {
                models.Client.create({
                    login: client.login,
                    password: client.password,
                    creator: client.creator
                });
                res.json("Клиент " + client.login + " востановлен");
            })
        }
        catch (err) {
            console.log(err)
        }
    }});

//(Client)удаление Клиента (Переноc в пассивную базу)
router.post('/Client/deleteClient', async (req, res, next) => {
    ID = req.body.id;
    if(req.session.AdminLogin && req.session.AdminPassword) {
        try {
            await models.Client.findByIdAndRemove( ID , function( err,client)  {
                    models.NotVerificationClient.create({
                        login: client.login,
                        password: client.password,
                        creator: client.creator
                    });
                res.json("Клиент " + client.login + "удален");
                })
            }
        catch (err) {
            console.log(err)
        }
    }});

//(Client)полное удаление Клиента
router.post('/Client/altogetherDeleteClient', async (req, res, next) => {
    ID = req.body.id;
    if(req.session.AdminLogin && req.session.AdminPassword) {
        try {
            await models.NotVerificationClient.findByIdAndRemove( ID , function( err,client)  {
                res.json( client.login + " полностью удален");
            })
        }
        catch (err) {
            console.log(err)
        }
    }});

//(Service) добовление сервиса
router.get('/AddService', async(req, res, next) => {
    if(req.session.AdminLogin && req.session.AdminPassword) {
        res.render('Admin/Service/AddService', { title: 'AdminPanel'});
    }
    else {
        res.render('Admin/Enter', { title: 'AdminLogin' })
        ;}
});

//(Service) вывод списка сервисов
router.get('/ServiceList', async(req, res, next) => {
    if(req.session.AdminLogin && req.session.AdminPassword) {
        const services = await models.Service.find();
        res.render('Admin/Service/ServiceList', { title: 'AdminPanel', services: services });
    }
    else {
        res.render('Admin/Enter', { title: 'AdminLogin' })
        ;}
});

//(Service) добовление сервиса
router.post('/addService', async (req, res, next) => {
    if(req.session.AdminLogin && req.session.AdminPassword) {
        const Login = req.body.serviceLogin;
        const Password = req.body.servicePassword;
        try {
            await models.Service.create({
                login: Login,
                password: Password,
                creator: req.session.AdminLogin
            })
        }
        catch (err) {
            console.log(err)
        }
    }});

//(Service) удаление сервиса (Переноc в пассивную базу)
router.post('/Service/deleteService', async (req, res, next) => {
    ID = req.body.id;
    if(req.session.AdminLogin && req.session.AdminPassword) {
        try {
            await models.Service.findByIdAndRemove( ID , function( err,service)  {
                console.log(service);
                models.NotVerificationService.create({
                    login: service.login,
                    password: service.password,
                    creator: service.creator
                });
                res.json("Клиент " + service.login + "удален");
            })
        }
        catch (err) {
            console.log(err)
        }
    }});

//(Service) вывод списка неактивных клиентов
router.get('/NotVerificationServiceList', async(req, res, next) => {
    if(req.session.AdminLogin && req.session.AdminPassword) {
        const services = await models.NotVerificationService.find();
        res.render('Admin/Service/NotVerificationServiceList', { title: 'AdminPanel', services: services });
    }
    else {
        res.render('Admin/Enter', { title: 'AdminLogin' })
        ;}
});

//(Service) полное удаление Сервиса
router.post('/Service/altogetherDeleteService', async (req, res, next) => {
    ID = req.body.id;
    if(req.session.AdminLogin && req.session.AdminPassword) {
        try {
            await models.NotVerificationService.findByIdAndRemove( ID , function( err,service)  {
                res.json( service.login + " полностью удален");
            })
        }
        catch (err) {
            console.log(err)
        }
    }});

//(Service) востановление Сервиса
router.post('/Service/proveService', async (req, res, next) => {
    ID = req.body.id;
    if(req.session.AdminLogin && req.session.AdminPassword) {
        try {
            await models.NotVerificationService.findByIdAndRemove( ID , function( err, service)  {
                models.Service.create({
                    login: service.login,
                    password: service.password,
                    creator: service.creator
                });
                res.json("Клиент " + service.login + " востановлен");
            })
        }
        catch (err) {
            console.log(err)
        }
    }});

//выход
router.get('/logout', (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy(() => {
            res.redirect('/Admin');
        });
    } else {
        res.redirect('/Admin');
    }
});

module.exports = router;
