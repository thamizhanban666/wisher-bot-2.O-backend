const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
// const path = require("path");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const URI = process.env.MONGODB_URI;

mongoose.connect(URI).then((res) => console.log("mongoDB is connected")).catch((err) => console.log(err))

// cors
app.use(cors());

// Middleware
app.use(express.json());

// routes
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/scheduleemail', scheduleRoutes);

  app.get("/", (req, res) => {
    res.send("API is running")
  })  

//--------------------Deployment---------------------------

// const __dirname1 = path.resolve();
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   })
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running")
//   })  
// }

//--------------------Deployment---------------------------

// listen
app.listen(PORT, () => { console.log(`server is running at port-${PORT}`) });
