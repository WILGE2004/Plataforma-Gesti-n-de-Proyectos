const { Schema, model } = require('mongoose');

const activitiesModel = new Schema({
    name:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    hours:{
        type:Number,
        default:0
    }
},
{
    versionKey:false
});

module.exports=model('activities',activitiesModel);