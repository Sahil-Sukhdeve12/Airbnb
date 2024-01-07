if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
//console.log(process.env.secret);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
mongoose.set('strictQuery', false);
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const dbUrl=process.env.ATLASDB_URL; 
console.log(dbUrl);
 //const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
 

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

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });
    async function main(){
        //await mongoose.connect(MONGO_URL);
        await mongoose.connect(dbUrl);
    }
    

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true})); //we write this to parse data i.e we are getting from express.
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); //to use static files

// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// });

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
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure : true,
        expires:Date.now()+7*24*60*60*1000, //ms
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

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

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new User({
//         email:"student@gmail.com",
//         username:"student",
//     });
//     let newuser=await User.register(fakeuser,"hello world");
//     res.send(newuser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong!!"}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(8000,()=>{
    console.log("server is listening to port 8000");
    console.log("working fine");
});