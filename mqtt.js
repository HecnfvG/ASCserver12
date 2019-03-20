const mqtt = require('mqtt');
const config = require('./config');

//connection to mqtt-broker
const client  = mqtt.connect( config.MQTT_BROKER, config.MQTT_CLIENT);


module.exports = client;
