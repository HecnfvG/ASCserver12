const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        login: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        //
        clientPhNumber: {
            type: String,
            required: true
        },
        //
        clientEmail: {
            type: String,
        },
        //
        clientName: {
            type: String,
        },
        //
        clientLastName: {
            type: String,
        },
        clientAddress: {
            //
            city: {
                type: String,
            },
            //
            street: {
                type: String,
            },
            //
            house: {
                type: String,
            },
            //
            apartment: {
                type: String,
            },
            //
            entrance: {
                type: String,
            },
            //
            floor: {
                type: String,
            }
        },
        clientExternalID: {
            type: Number
        },
        clientESP: {
            login: {
                type: String,
            },
            password: {
                type: String,
            },
            topic: {
                type: String,
            }
        },
        creator: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Client', schema);