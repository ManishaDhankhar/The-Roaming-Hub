const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
let mapToken="pk.eyJ1IjoibWFuaXNoYS0yMDA1IiwiYSI6ImNtaDF5NzI1djA4MzYyaXM5cGY2ZWF5aXcifQ.Of9VMTKYC9ce1I-NNabpfw";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index=async (req, res) => {
    const alllistings = await Listing.find();
    res.render("./listings/index.ejs", { alllistings });
}

module.exports.renderNewForm=(req, res) => {
    res.render("./listings/newlisting.ejs");
}

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"review",
        populate:{
            path:"author",
            select: "username",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
}

module.exports.createListing=async (req, res, next) => {
 let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
    let url=req.file.path;
    let filename=req.file.filename;
    const addlisting = new Listing(req.body.listing);
    addlisting.owner=req.user._id;
    addlisting.image={url,filename};
    addlisting.geometry=response.body.features[0].geometry;
    let saved=await addlisting.save();
    console.log(saved);
    req.flash("success", "You added a new listing!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const editlisting = await Listing.findById(id);
    if (!editlisting) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }
    let orignalImageURL=editlisting.image.url;
    orignalImageURL=orignalImageURL.replace("/upload","/upload/c_fill,h_200,w_250/bo_5px_solid_lightblue/")
    res.render("./listings/edit.ejs", { editlisting, orignalImageURL});
}

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }
    // Apply form fields to the listing
    Object.assign(listing, req.body.listing);
    // Only access req.file if it exists
    if (typeof req.file !== "undefined" && req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
    }
    await listing.save();
    req.flash("success", "You updated the listing!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "You deleted the listing.");
    res.redirect("/listings");
}