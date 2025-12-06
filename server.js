const express = require('express');
const app = express();
const fs = require('node:fs');

app.use(express.json());

app.get("/", (req, res) =>{
    res.send("Home page");
});

app.get("/categories", (req, res)=>{
    const data = fs.readFileSync('data.json', 'utf-8');
    const dataObj = JSON.parse(data);
    res.json(dataObj);
})
app.post("/categories", (req, res)=>{
    const data = fs.readFileSync('data.json', 'utf-8');
    const dataObj = JSON.parse(data);
    const newData = req.body;
    dataObj.categories.push(newData);
    fs.writeFileSync('data.json', JSON.stringify(dataObj, null, 2));
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