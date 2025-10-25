const mongoose=require("mongoose");
const {Schema}=mongoose;

const reviewSchema=new Schema({
    content:String,
    rating:
        {
            type:Number,
            min:1,
            max:5
        }
    ,
    CreatedAt:{
        type:Date,
        default:Date.now(),
     } ,
     author:{
        type:Schema.Types.ObjectId,
        ref:"User",
     }
    }
    )

module.exports=mongoose.model("Review",reviewSchema);
 