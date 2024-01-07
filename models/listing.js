const mongoose=require("mongoose");
const review = require("./review");
const Schema=mongoose.Schema;
const {types}=require("joi");
const Review=require("./review.js");


//const { title } = require("process");
//mongoose.set('strictQuery', false);

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        // type:Schema.Types.Mixed,
        // required:true,
        // default:{
        //     filename:'default-image',
        //     url:"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D",
        // },
        // set:(v)=>v===""?"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D":v,
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category:{
        type:String,
        enum:["mountains","rooms","farms","artic","beach","domes"],
    }

});

listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing; //exporting to app.js

//await Listing.insertMany(initDB.data); 