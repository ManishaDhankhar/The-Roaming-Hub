const express = require("express");
const router = express.Router();
const wrapAsync=require("../util/wrapAsync.js");
const User = require('../models/user.js');
const passport = require("passport");
const { isLogIn } = require("../middleware.js");
const { saveUrl } = require("../middleware.js");
const controllerUser=require("../controllers/user.js");

router.route("/signup").get(controllerUser.signUp)
.post(wrapAsync(controllerUser.renderSignUpForm));

router.route("/login").get(controllerUser.login)
.post(passport.authenticate('local', { failureRedirect: '/login',failureFlash:true}),async(req,res)=>{
    req.flash("success","welcome to Wanderlust");
    let redirectUrl=res.locals.redirectUrl||"/listings";
     delete req.session.redirectUrl; 
    res.redirect(redirectUrl);
});

router.get("/logout",isLogIn,controllerUser.logOut);

module.exports=router;