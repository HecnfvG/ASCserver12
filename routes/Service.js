const express = require('express');
const router = express.Router();
const models = require('../models');
const mqtt_client = require('../mqtt');

/* GET home page. */
router.get('/', async (req, res, next) => {
    if(req.session.ServiceLogin && req.session.ServiceID) {
        const Service = req.session.ServiceLogin;
        try{
            const orders = await models.ActiveOrder.find({ service: Service});
            res.render('Service/ActiveOrderList', { title: 'ServicePanel', orders: orders});
        }
        catch(err){
            console.log(err);
        }
    }
    else {
        res.render('Service/Enter', { title: 'ServiceLogin' })
        ;}
});

//Вход
router.post('/Enter', async (req, res, next) => {
    const serviceLogin = req.body.serviceLogin;
    const servicePassword = req.body.servicePassword;
    try {
        const bdService = await models.Service.findOne({login: serviceLogin});
        if (bdService.password === servicePassword) {
            req.session.ServiceLogin = bdService.login;
            req.session.ServiceID = bdService.id;
            res.json("Все норм!")
        }
        else {res.json("Oooppss!")}
    } catch (err) {
        console.log(err)
    }
});

//Добавление заказа (AddOrder GET)
router.get('/AddOrder', function(req, res, next) {
    if(req.session.ServiceLogin && req.session.ServiceID) {
        res.render('Service/AddOrder', { title: 'ServicePanel' });
    }
    else {
        res.render('Service/Enter', { title: 'ServiceLogin' })
        ;}
});

//Добавление заказа (AddOrder POST)
router.post('/AddOrder', async (req, res, next) => {
    if(req.session.ServiceLogin && req.session.ServiceID) {
        const Service = req.session.ServiceLogin;
        const clientPhNumber = req.body.clientPhNumber;
        const orderDescription = req.body.orderDescription;
        try {
            await models.NoActiveOrder.create({
                clientPhNumber: clientPhNumber,
                service: Service,
                description: orderDescription
            }, ()=>
            {
                res.json('Ok');
            })
        }
        catch (err) {
            console.log(err)
        }
    }});

//Список активных заказов
router.get('/ActiveOrderList', async(req, res, next) => {
    const Service = req.session.ServiceLogin;
    try{
        const orders = await models.ActiveOrder.find({ service: Service});
        res.render('Service/ActiveOrderList', { title: 'ServicePanel', orders: orders});
    }
    catch(err){
        console.log(err);
    }
});

//Список неактивных заказов
router.get('/NoActiveOrderList', async(req, res, next) => {
    const Service = req.session.ServiceLogin;
    console.log(Service);
    try{
        const orders = await models.NoActiveOrder.find({ service: Service});
        res.render('Service/NoActiveOrderList', { title: 'ServicePanel', orders: orders});
    }
    catch(err){
        console.log(err);
    }
});

// Страница заказа
router.get('/Order/:orderID', async(req, res, next) => {
    const orderID = req.params["orderID"];
    const Order = await models.ActiveOrder.findById(orderID);
    const cookieService = req.session.ServiceLogin;
    if (cookieService === Order.service) {
        res.render('Service/Order', {
            title: "ServicePanel",
            order: Order
        })
    }
    else {
        res.json("Oooops!")
    }
});

//Открытие двери
router.post('/DoorOpen', async (req, res, next) => {
    if(req.session.ServiceLogin && req.session.ServicePassword) {
        const ServiceSession = req.session.ServiceLogin;
        const externalID = req.body.externalID;
        const orderID = req.body.orderID;
        try {
            const order = await models.ActiveOrder.findById({orderID});
            const client = await models.Client.find({clientPhNumber: order.clientPhNumber});
            if ( client.clientExternalID === externalID && order.service === ServiceSession) {
                mqtt_client.publish(client.clientESP.topic, 'Open');}
        } catch (err) {
            console.log(err)
        }
    }});

//Удаление неактивного заказа
router.post('/deleteNoActiveOrder', async (req, res, next) => {
    orderID = req.body.id;
    if (req.session.ServiceID) {
        await models.NoActiveOrder.findByIdAndRemove(orderID);
        res.json('Ok')
    }
});

//Удаление активного заказа
router.post('/deleteActiveOrder', async (req, res, next) => {
    orderID = req.body.id;
    if (req.session.ServiceID) {
        await models.ActiveOrder.findByIdAndRemove(orderID);
        res.json('Ok')
    }
});

// Выход
router.get('/logout', (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy(() => {
            res.redirect('/Service');
        });
    } else {
        res.redirect('/Service');
    }
});


module.exports = router;
