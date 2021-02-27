//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//Install mongoose using npm i mongoose to use require mongoose. Check in package.json to see if installed.
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Connect to mongoDB using url giving a name for database to be connected to.
// mongoose.connect("mongodb://localhost:27017/todolistDB", {
//   useNewUrlParser: true,
// });

mongoose.connect(
  "mongodb+srv://jyothi_0303:mongo123@jocluster.rm1se.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);
//Define a schema which can be used by a model called Item which is a Table which contains a collection of items. Give singular name as mongoDB is intelligent to make it plural.
const itemSchema = {
  name: String,
};

//attach a schema to a model
const Item = mongoose.model("Item", itemSchema);

//Create a JS object to insert into mongoDB for collection (which ideally means table)
const itemsList = [
  {
    name: "Eat",
  },
  {
    name: "Sleep",
  },
  {
    name: "Dance",
  },
];
//Insert all the items into Item model.

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    console.log(foundItems.length);
    if (foundItems.length === 0) {
      Item.insertMany(itemsList, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully Inserted default items !!!");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});
app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItem = req.body.checkbox;
  console.log(checkedItem);
  Item.findByIdAndRemove(checkedItem, function (err, res) {
    if (err) {
      console.log(`Error during deletion ${err}`);
    } else {
      console.log(`Successfully Deleted ${res}`);
    }
  });
  res.redirect("/");
});

// app.get("/delete", function (req, res) {
//   res.redirect("/");
// });

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
