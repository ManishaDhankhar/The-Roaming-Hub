const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync.js");
const { schemaValidation } = require("../schema.js");
const ExpressError = require("../util/ExpressError.js");
const Listing = require("../models/listing");
const {isLogIn, isOwner}=require("../middleware.js");
const controllerListing=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = schemaValidation.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// --- CORRECTED ROUTE DEFINITIONS ---
router.route("/")
// Index Route (Displays all listings)
.get(wrapAsync(controllerListing.index))
// Create Route
 .post(isLogIn,upload.single('listing[image]'),wrapAsync(controllerListing.createListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// });
// New Route (Shows the form to create a new listing)
router.get("/new",isLogIn,controllerListing.renderNewForm);

router.route("/:id")
// Show Route (Displays a single listing)
.get(wrapAsync(controllerListing.showListing))
// Update Route
.put(isLogIn,upload.single('listing[image]'),isOwner,validateListing, wrapAsync(controllerListing.updateListing))
// THE FIX: Delete Route now correctly uses router.delete()
.delete(isLogIn,isOwner, wrapAsync(controllerListing.destroyListing));

// Edit Route (Shows the form to edit a listing)
router.get("/:id/edit", isLogIn,isOwner,wrapAsync(controllerListing.renderEditForm));

module.exports = router;