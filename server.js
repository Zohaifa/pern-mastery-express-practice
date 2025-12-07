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
app.get("/categories/:id", (req, res)=>{
    const targetId = parseInt(req.params.id);
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
    for(let i = 0; i<data.categories.length; i++){
        console.log(data.categories[i]);
        if(data.categories[i].id === targetId){
            res.json(data.categories[i]);
        }
    }
    res.send("no such products with that id");
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
    const data = fs.readFileSync('data.json', 'utf-8');
    let dataObj = JSON.parse(data);
    for(let i = 0; i < dataObj.categories.length; i++){
        if(dataObj.categories[i].id === req.body.id){
            dataObj.categories[i] = req.body;
        }
    }
    fs.writeFileSync("data.json", JSON.stringify(dataObj, null, 2));
    res.send("category updated");
})
app.delete("/categories", (req, res)=>{
    const data = fs.readFileSync('data.json', 'utf-8');
    let dataObj = JSON.parse(data);
    const targetId = parseInt(req.body.id);
    dataObj.categories = dataObj.categories.filter((element)=> element.id !== targetId);
    fs.writeFileSync("data.json", JSON.stringify(dataObj, null, 2));
    res.send("category deleted");
})

app.listen(3000, ()=>{
    console.log("Listening to port http://localhost:3000");
});