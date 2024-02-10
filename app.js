if(process.env.NODE_ENV!="production"){
    require('dotenv').config()              ;
}           

const express=require("express");
const app=express();
const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");

const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport"); 
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
 
const dbUrl=process.env.ATLASDB_URL; 
// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
    async function main(){
        await mongoose.connect(dbUrl);
        // await mongoose.connect(MONGO_URL);
    }

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); //we write this to parse data i.e we are getting from express.
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); //to use static files

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24*3600.
   
  });

  store.on("error" , ()=>{
    console.log("error in mongo session store", err);
  });

const sessionOptions={
    store,
    secret:process.env.SECRET,  
    resave:false,
    saveUninitialized:true,
    cookie:{
        // secure : true,
        expires:Date.now()+7*24*60*60*1000, //ms
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash()); //flash should be used after session



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
     res.locals.error=req.flash("error");
     res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//error handling
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});

});

app.listen(8000,()=>{
    console.log("server is listening to port 8000");
    console.log("working");
});
//revisiting
