// сервисы
const Service = require('./Service');
const NotVerificationService = require('./NotVerificationService');

// клиенты
const Client = require('./Client');
const NotVerificationClient = require('./NotVerificationClient');

// администратор
const Admin = require('./Admin');

// заказы
const ActiveOrder = require('./ActiveOrder');
const NoActiveOrder = require('./NoActiveOrder');
const OldOrder = require('./OldOrder');

module.exports = {
    NotVerificationService,
    Service,
    Client,
    NotVerificationClient,
    ActiveOrder,
    Admin,
    NoActiveOrder,
    OldOrder
};