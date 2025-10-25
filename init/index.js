const mongoose=require("mongoose");
const initdata=require("./data");
const Listing=require("../models/listing");

async function main(){
await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((res)=>{
    console.log("mongoose working");
}).catch((err)=>{
    console.log(err);
});

async function init(){
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner:'68bfa678f26e36c65ea741df',
    }))
    await Listing.insertMany(initdata.data);
    console.log("data was initalize");
}
init();