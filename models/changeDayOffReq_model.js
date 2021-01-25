const mongoose = require('mongoose');
const dayOffSchema = new mongoose.Schema({

    senderId: {
        type: String,
        required: true,
    },

    reqDay:{
        type:String,
        enum:[
            "Sunday","Monday","Tuesday","Wednesday","Thursday","Saturday"
        ],
        required: true
    },

    reason: {
        type: String,

    },

    status: {
        type: String,
        uppercase: true,
        enum: ['ACCEPTED', 'REJECTED', 'PENDING'],
        default: 'PENDING'
    },
    canceled: {
        type: Boolean,
        default: false,
    },
    comment:{
        type: String,
    }

})

module.exports = mongoose.model('DayOffs', dayOffSchema);