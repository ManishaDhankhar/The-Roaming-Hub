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
const User = require('./models/user');
const { saveUrl } = require('./middleware.js');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require("./models/booking");

// 1. Basic Settings
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

// 2. Database Connection
const dburl=process.env.ATLAS_URL;
const port=8080;
async function main(){
    await mongoose.connect(dburl);
}
main().then(()=>{
    console.log("mongoose working");
}).catch((err)=>{
    console.log(err);
});

// 3. Session & Store Setup
const store=MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>{
    console.log("ERROR MONGO SESSION STORE", err);
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

// 4. Initialize Session & Flash (CRITICAL ORDER)
app.use(session(cookieSession));
app.use(flash());

// 5. Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 6. Global Variables Middleware (Defines 'success' and 'error' for EJS)
app.use((req,res,next)=>{
    res.locals.success = req.flash("success") || [];
    res.locals.error = req.flash('error') || [];
    res.locals.currUser = req.user || null;
    next();
});

app.use(saveUrl);

// 7. Razorpay Instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// 8. Razorpay Routes (Placed AFTER Session/Flash so they can use req.flash)
app.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(Number(amount) * 100), 
            currency: "INR",
            receipt: "receipt_" + Math.floor(Math.random() * 1000),
        };
        const order = await instance.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).send("Razorpay Order Error");
    }
});

app.post("/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, listingId, amount } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        const newBooking = new Booking({
            listing: listingId,
            user: req.user._id, 
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: Number(amount) / 100,
        });
        await newBooking.save();
        
        req.flash("success", "Payment successful! Your stay is booked.");
        res.json({ status: "success" });
    } else {
        res.status(400).json({ status: "failure" });
    }
});

// 9. Main Routes
app.use("/listings", listingsrouter);
app.use("/listings/:id/review", reviewsrouter);
app.use("/", usersroute);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// 10. Error Handling Middleware
app.use((err,req,res,next)=>{
   let {status=500, message="Something went Wrong"}=err;
   res.status(status).render("error.ejs",{err});
})

app.listen(port,()=>{
    console.log(`app is listening the port:${port}`);
})