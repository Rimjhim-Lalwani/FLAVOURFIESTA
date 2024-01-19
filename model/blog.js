const mongoose=require("mongoose");
const {Schema}=mongoose;
const blogSchema=new mongoose.Schema({
    title:String,
    ingredients:String,
    steps:String,
    image:String,
    
    user:{
        type:Schema.Types.ObjectId, 
        ref:"User"
    },
    createdAt: { type: Date, default: Date.now },
    verify:{
        type:Boolean,
        default:false
    }

})
module.exports=mongoose.model("blog",blogSchema);