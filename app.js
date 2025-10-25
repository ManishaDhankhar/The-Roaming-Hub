if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./util/wrapAsync.js");
const ExpressError=require("./util/ExpressError.js");
const {schemaValidation,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const listingsrouter=require("./routes/listings.js");
const reviewsrouter=require("./routes/reviews.js");
const usersroute=require("./routes/users.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const User = require('./models/user');

const { saveUrl } = require('./middleware.js');
// Place saveUrl middleware as a global middleware
//to set some paths
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const dburl=process.env.ATLAS_URL;
const port=8080;
async function main(){
    // mongodb://127.0.0.1:27017/wanderlust
await mongoose.connect(dburl);
}
main().then((res)=>{
    console.log("mongoose working");
}).catch((err)=>{
    console.log(err);
});

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto: {
    secret: process.env.SECRET,
    touchAfter:24*3600,
  }
});

const cookieSession={
   store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};
store.on("error",()=>{
    console.log("ERROR MONGO SESSION STORE",err);
});
app.use(session(cookieSession));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//basic api
// app.get("/",(req,res)=>{
//     //console.log(req);
//     res.send("working");
// })
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error = req.flash('error');
    res.locals.currUser=req.user || null;
    next();
});
app.use(saveUrl);
// app.get("/demoProof",async(req,res)=>{
//     const newUser=new User({
//         email:"manishadhankhar@gmail.com",
//         username:"Manisha",
//     });
//   const fakeUser=await User.register(newUser,"helloWorld"); 
//   res.send(fakeUser);
// });
app.use("/listings",listingsrouter);
app.use("/listings/:id/review",reviewsrouter);
app.use("/",usersroute);
//validation error
const validateListing=(req,res,next)=>{
    let {error}=schemaValidation.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
} 
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
//Show Route

//Post Route
//review
// app.post("/listings/:id/review",validateReview,wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//   let listing=await Listing.findById(id).populate("review");
//   let newReview=new Review(req.body.review);
//   listing.review.push(newReview);
//   await listing.save();
//   await newReview.save();
//   console.log("new review was saved");
//  res.render("./listings/show.ejs",{listing});
// }))
// //Delete Route Review
// app.delete("/listings/:id/review/:reviewID",wrapAsync(async(req,res)=>{
//     let {id,reviewID}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{review:reviewID}});
//     await Review.findByIdAndDelete(reviewID);
//     res.redirect("/listing/" + id);
// }))
//creating a test document
// app.get("/testlisting",async(req,res)=>{
//     const samplelisting=new Listing({
//         title:"My New Valla",
//         description:"Best place you ever see",
//         location:"Gurugram,Haryana",
//         Price:7000,
//         country:"India"
//     });
//     await samplelisting.save();
//     console.log(samplelisting);
//     res.send("testcase working");
// })


// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// })
//for error handing we use middleware
app.use((err,req,res,next)=>{
   let {status=404,message="Something went Wrong"}=err;
   res.status(400).render("error.ejs",{err});
})
app.listen(port,()=>{//it is use to start the server
    console.log(`app is listening the port:${port}`);
})