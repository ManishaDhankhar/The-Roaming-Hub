const User = require('../models/user.js');
module.exports.signUp=(req,res)=>{
    res.render("./users/signup.ejs");
}

module.exports.renderSignUpForm=async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({username,email});
    let resisterUser=await User.register(newUser,password);
     console.log(resisterUser);
     req.login(resisterUser,(err)=>{
        if(err){
            return next(err);
        }
           req.flash("success","welcome to Wanderlust");
           res.redirect("/listings");
     })
    }catch(e){
        req.flash("error",e.message);
        return res.redirect("/signup")
    }
}

module.exports.login=(req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You successfully logout");
        res.redirect("/listings");
    })
}