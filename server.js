const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Home page");
})

app.listen(3000, ()=>{
    console.log("Listening to port http://localhost:3000");
})