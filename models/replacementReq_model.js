const mongoose = require('mongoose');
const replacementsSchema = new mongoose.Schema({


    senderId: {
        type: String,
        required: true,
    },

    recipientId: {
        type: String,
        required: true,
    },

    slotID: {
        type: String,
        required: true
    },

    status: {
        type: String,
        uppercase: true,
        enum: ['ACCEPTED', 'REJECTED', 'PENDING'],
        default: 'PENDING'
    },

    canceled: {
        type: Boolean,
        default: false

    }

})

module.exports = mongoose.model('Replacements', replacementsSchema);