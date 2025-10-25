const Listing=require("../models/listing");
const Review = require("../models/review.js");

module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New review created successfully!");
    // Corrected to redirect to the show page using a PLURAL path
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview=async (req, res) => {
    const { id, reviewID } = req.params;
    // The $pull operator correctly removes the review ID from the listing's array
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewID } });
    await Review.findByIdAndDelete(reviewID);

    req.flash("success", "Review deleted successfully!");
    // Corrected to redirect to the show page using a PLURAL path
    res.redirect(`/listings/${id}`);
}