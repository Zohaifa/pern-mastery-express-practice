const express = require('express');
const app = express();

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Home page");
});

app.get("/categories", (req, res)=>{
    res.send("category fetched");
})
app.post("/categories", (req, res)=>{
    res.send("category added");
})
app.put("/categories", (req, res)=>{
    res.send("category updated");
})
app.delete("/categories", (req, res)=>{
    res.send("category deleted");
})

app.listen(3000, ()=>{
    console.log("Listening to port http://localhost:3000");
});