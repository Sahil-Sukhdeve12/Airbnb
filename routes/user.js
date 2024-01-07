const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const UserController=require("../controllers/user.js");

router.route("/signup")
.get(UserController.Rendersignup)
.post(wrapAsync(UserController.signup));

router.route("/login")
.get(UserController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true})
,wrapAsync(UserController.login));

router.get("/logout",(UserController.logout));

module.exports=router;
