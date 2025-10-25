const express = require("express");
// The 'mergeParams: true' option is crucial for accessing :id from the parent router
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../util/wrapAsync.js");
const ExpressError = require("../util/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {isLogIn, isOwner,isReviewAuthor}=require("../middleware.js");
const contollersReview=require("../controllers/review.js");
// Validation Middleware for Reviews
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Create Review Route
router.post("/",isLogIn,validateReview, wrapAsync(contollersReview.createReview));

// Delete Review Route
router.delete("/:reviewID",isLogIn,isReviewAuthor, wrapAsync(contollersReview.destroyReview));

module.exports = router;