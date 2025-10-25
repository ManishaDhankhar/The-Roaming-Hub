const Listing = require("./models/listing");
const Review = require("./models/review.js");
module.exports.isLogIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","first you have to login");
       return  res.redirect("/login");
    }
    next();
}

module.exports.saveUrl=(req,res,next)=>{
    if (req.session.redirectUrl) {
        // Only set the local variable if the session variable exists
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("owner");

    // 1. Check if the listing exists.
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    // 2. Check if the authenticated user exists.
    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in to do that.");
        return res.redirect("/login");
    }

    // 3. Compare the listing owner's ID with the current user's ID.
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }

    // If all checks pass, proceed to the next middleware.
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewID } = req.params;
    let review = await Review.findById(reviewID);

    // 1. Check if the review exists.
    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }

    // 2. Check if the authenticated user exists.
    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in to do that.");
        return res.redirect("/login");
    }

    // 3. Compare the review's author ID with the current user's ID.
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }

    // If all checks pass, proceed to the next middleware.
    next();
};