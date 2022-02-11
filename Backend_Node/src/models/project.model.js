const { Schema, model } = require('mongoose');

const projectsModel = new Schema({
    leader:{
        type:Schema.ObjectId,
        ref:"users",
        required:true
    },
    members:{
        type:Array,
        ref:"users",
        default:[]
    },
    name:{
        type:String,
        required:true
    },
    desc:{
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
    phases:{
        type:Array,
        ref:"phases",
        default:[]
    },
    hours:{
        type:Number,
        default:0
    }
},
{
    versionKey:false
});

module.exports=model('projects',projectsModel);