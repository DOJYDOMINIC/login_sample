require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(bodyParser());
app.use(cors());


// MongoDB Connection

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

const userSchema = mongoose.Schema({
  fName : {
    type : String,
    required : true 
  },
  lName : String,
  age : Number,
  email : {
    type : String,
    required : true 
  },
  password : {
    type : String,
    required : true 
  },
  confirmPassword : {
    type : String,
    required : true 
  }
});

const User = mongoose.model("User", userSchema);



// API



app.post("/register", function(req, res) {

  const { email, password, confirmPassword } = req.body;
  
  User.findOne({ email : email})
  .then((foundUser) => {
    if(foundUser) {
      res.send({ message: "User already exist.", alert: false, data : foundUser });
    } else {
      if(password === confirmPassword) {
        const userData = new User(req.body);
        userData.save();
        res.send({ message : "User successfully registered", alert : true, data : foundUser });
      } else {
        res.send({ message: "Password and Confirm Password not equal.", alert: false, data : foundUser });
      }
      
    }
  })
  .catch((err) => {
    console.log(err);
  });
  
});




app.post("/login", (req, res) => {
  
  User.findOne({ email: req.body.email})
  .then((foundUser) => {
    if(foundUser) {
      if(foundUser.password === req.body.password) {
        res.send({ message : "Successfully logged in.", alert : true, data : foundUser });
      } else {
        res.send({ message : "Incorrect Password, please enter the correct password.", alert : false, data : foundUser });
      }
    } else {
      res.send({ message : "User account not found, please register.", alert : false, data : foundUser });
    }
  })
  .catch((err) => {
    console.log(err);
  });
});


// app.post("/user_login", (req, res) => {
//   const { userName, password } = req.body;
//     console.log(req.body);
//     if(userName == "romario" && password == "123") {
//       res.status(200).send({ message : "User login successful."});  
//     } else {
//       res.status(500).send({ message : "Incorrect username or password. Please enter a valid user name."});
//     }
// });


app.listen(3000, function() {
  console.log("Server started at port 3000.");
});