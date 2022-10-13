const mongoose = require("mongoose");

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {  // if not local (not prod)
    const mongodbURL = "mongodb+srv://DealStryker:4rDlX5UcVur9K0f2@dealstryker-ieho9.mongodb.net/test?retryWrites=true&w=majority";
    
    mongoose.connect(mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, succ) => {
        if (err) {
            console.log(err);
        }
        if (succ) {
            console.log("Connected to database");
        }
    });

 } else { // if on server (prod)
    const mongodbURL = process.env.MongoDB ;
    
    mongoose.connect(mongodbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, succ) => {
        if (err) {
            console.log(err);
        }
        if (succ) {
            console.log("Connected to database");
        }
    });

}


