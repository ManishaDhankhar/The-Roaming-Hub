const mongoose=require("mongoose");
const Review=require("./review");
//schema declaired
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image: {
      url:String,
      filename:String,
        // type: String,
        // default:"https://assets.cntraveller.in/photos/61160b855ee2ad4060e8ca19/4:3/w_1440,h_1080,c_limit/Summertime_goa_indiasbestvilla_lead.jpg",
        // set: (v) => {
        //   if (!v || v.trim() === "") {
        //     return "https://assets.cntraveller.in/photos/61160b855ee2ad4060e8ca19/4:3/w_1440,h_1080,c_limit/Summertime_goa_indiasbestvilla_lead.jpg";
        //   }
        //   return v;
        // }
      }
      ,
    price:{
      type:Number,
      default:0,
      min:[0,"price should be a positive number"]
    },
    location:String,
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    country:String,
    review:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
      }
    ],
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
});
//middleware to delete listing
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.review}});
  }
})
//model
const Listing=mongoose.model("Listing",listingSchema);

module.exports=Listing;