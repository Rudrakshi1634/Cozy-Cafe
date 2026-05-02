const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

let currentUser = null;

/* FILE PATH (IMPORTANT FOR RENDER) */
const filePath = path.join(__dirname, "data.json");

/* READ DATA */
function readData(){
  if(!fs.existsSync(filePath)){
    fs.writeFileSync(filePath, JSON.stringify({users: []}, null, 2));
  }
  return JSON.parse(fs.readFileSync(filePath));
}

/* WRITE DATA */
function writeData(data){
  fs.writeFileSync(filePath, JSON.stringify(data,null,2));
}

/* HOME */
app.get("/",(req,res)=>{

  if(!currentUser){
    return res.redirect("/login");
  }

  let data = readData();

  let user = data.users.find(u => u.username === currentUser);

  if(!user.completedTasks) user.completedTasks = [];
  if(!user.completedHabits) user.completedHabits = [];

  res.render("home",{
    tasks: user.tasks,
    habits: user.habits,
    completedTasks: user.completedTasks,
    completedHabits: user.completedHabits
  });

});

/* FOCUS MODE */
app.get("/focus",(req,res)=>{

  if(!currentUser){
    return res.redirect("/login");
  }

  res.render("focus");

});

/* LOGIN PAGE */
app.get("/login",(req,res)=>{
  res.render("login");
});

/* LOGIN */
app.post("/login",(req,res)=>{

  let data = readData();

  let user = data.users.find(u => u.username === req.body.username);

  if(user){
    currentUser = user.username;
    res.redirect("/");
  }else{
    res.send("User not found");
  }

});

/* SIGNUP PAGE */
app.get("/signup",(req,res)=>{
  res.render("signup");
});

/* SIGNUP */
app.post("/signup",(req,res)=>{

  let data = readData();

  let newUser = {
    username: req.body.username,
    tasks: [],
    completedTasks: [],
    habits: ["Read","Code","Exercise"],
    completedHabits: []
  };

  data.users.push(newUser);

  writeData(data);

  res.redirect("/login");

});

/* ADD TASK */
app.post("/add-task",(req,res)=>{

  let data = readData();

  let user = data.users.find(u => u.username === currentUser);

  user.tasks.push(req.body.task);

  writeData(data);

  res.redirect("/");

});

/* COMPLETE TASK */
app.post("/complete-task",(req,res)=>{

  let data = readData();

  let user = data.users.find(u => u.username === currentUser);

  let completed = user.tasks.splice(req.body.index,1)[0];

  user.completedTasks.push({
    task: completed,
    date: new Date().toLocaleDateString()
  });

  writeData(data);

  res.redirect("/");

});

/* DELETE TASK */
app.post("/delete-task",(req,res)=>{

  let data = readData();

  let user = data.users.find(u => u.username === currentUser);

  user.tasks.splice(req.body.index,1);

  writeData(data);

  res.redirect("/");

});

/* ADD HABIT */
app.post("/add-habit",(req,res)=>{

  let data = readData();

  let user = data.users.find(u => u.username === currentUser);

  user.habits.push(req.body.habit);

  writeData(data);

  res.redirect("/");

});

/* COMPLETE HABIT */
app.post("/complete-habit",(req,res)=>{

  let data = readData();

  let user = data.users.find(u => u.username === currentUser);

  let habit = user.habits[req.body.index];

  user.completedHabits.push({
    habit: habit,
    date: new Date().toLocaleDateString()
  });

  writeData(data);

  res.redirect("/");

});

/* DELETE HABIT */
app.post("/delete-habit",(req,res)=>{

  let data = readData();

  let user = data.users.find(u => u.username === currentUser);

  user.habits.splice(req.body.index,1);

  writeData(data);

  res.redirect("/");

});

/* PORT FIX FOR DEPLOYMENT */
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("Server running on port " + PORT);
});