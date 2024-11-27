const express = require("express");
const app = express();

const PORT = 1000;
const vegetables = require("./data/vegetables.js");

//=================================Using jsx-view-engine==================================//
const jsxViewEngine = require("jsx-view-engine");

app.set("view engine", "jsx");
app.set("views", "./views");
app.engine("jsx", jsxViewEngine());

//=================================Using MethodOverride==================================//

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//====================================Middleware==========================================//
//========================================================================================//
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

app.use((req, res, next) => {
  console.log("-Middleware: I run for all routes");
  next();
});

app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-${time.toLocaleDateString()}: Received a ${req.method} request to ${
      req.url
    }`
  );
  // console.log(req.body);
  // console.log(Object.keys(req.body));
  // console.log(`${JSON.stringify(req.body)}`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(req.body);
    console.log(Object.keys(req.body));
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

//========================================================================================//

app.listen(PORT, () => {
  console.log(`Server is runing on ${PORT}.`);
});

app.get("/", (req, res) => {
  res.send("You have arrived at the home page");
});

//========================================================================================//
app.get("/api/vegetables", (req, res) => {
  res.send(vegetables);
});

app.get("/api/vegetables", (req, res) => {
  res.json(vegetables);
});

app.get("/api/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    res.json(vegetables[req.params.id]);
  } else {
    res.send("<p>Enter a valid id</p>");
  }
});

//=========================================CREATE===============================================//
app.post("/api/vegetables", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  vegetables.push(req.body);
  res.json(vegetables);
});

app.get("/vegetables/new", (req, res) => {
  res.render("vegetables/New");
});

//=========================================UPDATE===============================================//
app.put("/api/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    vegetables[req.params.id] = req.body;
    res.json(vegetables[req.params.id]);
  } else {
    res.send("<p>Please enter a valid ID</p>");
  }
});

app.patch("/api/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id <= vegetables.length) {
    const newVegetable = { ...vegetables[req.params.id], ...req.body };
    //console.log(newVegetable);
    vegetables[req.params.id] = newVegetable;
    res.json(vegetables[req.params.id]);
  } else {
    res.send("<p>Please enter a valid ID</p>");
  }
});

app.get("/vegetables/:id/Edit", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    res.render("vegetables/Edit", {
      vegetables: vegetables[req.params.id],
      id: req.params.id,
    });
  } else {
    res.send("<p>That is not a valid id</p>");
  }
});

//=========================================DELETE===============================================//
app.delete("/api/vegetables/:id", (req, res) => {
  if (req.params.id >= 0 && req.params.id < vegetables.length) {
    vegetables.splice(req.params.id, 1);
    res.json(vegetables);
  } else {
    res.send("<p>Please enter a valid ID</p>");
  }
});

//=============================This always runs at the end======================================//
app.use((req, res) => {
  console.log(
    "I am only in this middleware if no other routes have sent a response"
  );
  res.status(404);
  res.json({ error: "Resources not found" });
});
