const { Schema, model } = require('mongoose');

const phasesModel = new Schema({
    name:{
        type:String,
        required:true
    },
    activities:{
        type:Array,
        default:[],
        ref:"activities"
    },
    hours:{
        type:Number,
        default:0
    }
},
{
    versionKey:false
});

module.exports=model('phases',phasesModel);