const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema(
    {
        clientPhNumber: {
            type: String,
            required: true,
        },
        clientName: {
            type: String,
        },
        service: {
            type: String,
            required: true
        },
        description: {
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

module.exports = mongoose.model('NoActiveOrder', schema);