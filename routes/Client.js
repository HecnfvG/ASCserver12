const express = require('express');
const router = express.Router();
const models = require('../models');
const mqtt_client = require('../mqtt');

/* GET home page. */
router.get('/', async (req, res, next) => {
    if(req.session.ClientLogin && req.session.ClientID) {
        const Client = req.session.ClientLogin;
        try{
            const orders = await models.ActiveOrder.find({ clientPhNumber: Client});
            res.render('Client/ActiveOrderList', { title: 'ClientPanel', orders: orders});
        }
        catch(err){
            console.log(err);
        }
    }
    else {
        res.render('Client/Enter', { title: 'ClientLogin' })
        ;}
});

//Вход
router.post('/Enter', async (req, res, next) => {
    const clientLogin = req.body.clientLogin;
    const clientPassword = req.body.clientPassword;
    try {
        const bdClient = await models.Client.findOne({login: clientLogin});
        if (bdClient.password === clientPassword) {
            req.session.ClientLogin = bdClient.login;
            req.session.ClientPassword = bdClient.password;
            req.session.ClientID = bdClient.id;
            res.json("Все норм!")
        }
        else {res.json("Oooppss!")}
    } catch (err) {
        console.log(err)
    }
});

// асктивация заказа
router.post('/ActivateOrder', async (req, res, next) => {
    if(req.session.ClientLogin && req.session.ClientPassword) {
        const orderID = req.body.id;
        try {
            const order = await models.NoActiveOrder.findByIdAndRemove( orderID );
            await models.ActiveOrder.create({
                clientPhNumber: order.clientPhNumber,
                service: order.service,
                description: order.description
            });
            res.json('ok');
        }
        catch (err) {
            console.log(err)
        }
    }});

//Список активных заказов
router.get('/ActiveOrderList', async(req, res, next) => {
    const Client = req.session.ClientLogin;
    try{
        const orders = await models.ActiveOrder.find({ clientPhNumber: Client});
        res.render('Client/ActiveOrderList', { title: 'ClientPanel', orders: orders});
    }
    catch(err){
        console.log(err);
    }
});

//Список активных заказов
router.get('/NoActiveOrderList', async(req, res, next) => {
    const Client = req.session.ClientLogin;
    try{
        const orders = await models.NoActiveOrder.find({ clientPhNumber: Client});
        res.render('Client/NoActiveOrderList', { title: 'ClientPanel', orders: orders});
    }
    catch(err){
        console.log(err);
    }
});

//Настройка
router.get('/Settings', async (req, res, next) =>{
    clientID = req.session.ClientID;
    clientBD = await models.Client.findById(clientID);
    res.render('Client/Settings',
        {title: 'ClientPanel',
            client: clientBD
        })
});

//внесение изменений настроек
router.post('/SetSettings', async (req, res, next) =>{
    const clientID = req.session.ClientID;
    const clientName = req.body.clientName;
    const clientLastName = req.body.clientLastName;
    const clientPhNumber = req.body.clientPhNumber;
    const clientEmail = req.body.clientEmail;
    const city = req.body.city;
    const street = req.body.street;
    const house = req.body.house;
    const apartment = req.body.apartment;
    const entrance = req.body.entrance;
    const floor = req.body.floor;
await models.Client.findByIdAndUpdate( clientID , {
    clientName: clientName,
    clientLastName: clientLastName,
    clientPhNumber: clientPhNumber,
    clientEmail: clientEmail,
    clientAddress: {
        city: city,
        street: street,
        house: house,
        apartment: apartment,
        entrance: entrance,
        floor: floor
    }
}, ()=>{
    res.json('Ok');
    })
});

//Управление дверью
router.get('/DoorControl', async(req, res, next) => {
    const Client = req.session.ClientLogin;
    try{
        res.render('Client/DoorControl', { title: 'ClientPanel', client: Client});
    }
    catch(err){
        console.log(err);
    }
});

//Открытие двери
router.post('/DoorOpen', async (req, res, next) => {
    sessionClient = req.session.ClientLogin;
    const postClient = req.body.client;
    if(sessionClient === postClient){
        try{
            const BDClient = models.Client.findOne({login: postClient});
            mqtt_client.publish(BDClient.clientESP.topic, 'Open');
        }
        catch (e) {
            console.log(e)
        }
    }
    });

//Удаление сессий
router.get('/logout', (req, res) => {
    if (req.session) {
        // delete session object
        req.session.destroy(() => {
            res.redirect('/Client');
        });
    } else {
        res.redirect('/Client');
    }
});

module.exports = router;
