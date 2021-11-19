const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const _ = require('lodash');
const app = express();
const port = 5000;

//start up DB with sample items.
main().catch(err => console.log(err));
// connection for mongodb, todolistdb
async function main() {
  await mongoose.connect('mongodb://localhost:27017/todoListDB');
};
//create schema
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Input required"]
  }
});
//create collection
const Item = new mongoose.model('Item', itemsSchema);

//sample items
const item1 = new Item({
  name:"Lets get started."
});

const item2 = new Item({
  name:"Add one item before removing default items."
});


const item3 = new Item({
  name:"Click the + button to add items."
});

const item4 = new Item({
  name:"Check the box to delete an item."
});

const defaultItems = [item1,item2,item3,item4];


const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

//end db items

// allows you to parse body to view like json
app.use(bodyParser.urlencoded({extended:true}));
// access to static files in public route
app.use(express.static('public'));
// npm i ejs
// tells app to use ejs as the view. Must create a view folder as this will look in this folder.
app.set('view engine','ejs');

//get home route
app.get('/', (request,response) => {
    // whatDay is the ejs var, day is variable to access module for getDate js.
    Item.find({},(err,results) => {
      if(results.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if(err) {
            console.log(err);
          } else {
            console.log("Successfully added DEFAULT items.");
          }
        });
        response.redirect("/");
      } else {
        response.render('list', {whatDay : "Today", newListItems :results })
      }
    });
});


app.get('/:customListName', (request,response) => {
  // what the user entered for URL.
  const customListName = _.capitalize = (request.params.customListName);
  List.findOne({name:customListName}, (err,foundList) => {
    if(!err) {
      if(!foundList) {
        const list = new List({
          name:customListName,
          items:defaultItems
        });
        list.save();
        response.redirect("/" + customListName);
      } else {
        response.render('list', {whatDay : foundList.name, newListItems :foundList.items });
      }
    }
  });
});

app.post('/', (request,response) => {
  // save user input
  const userInputtedItemName = request.body.addtoDoInput;
  const listName = request.body.list;

  const item = new Item({
    name: userInputtedItemName
  });

  if(listName === "Today") {
    item.save();
    response.redirect('/')
  } else {
    List.findOne({name: listName}, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      response.redirect("/" + listName );
    })
  }
});

app.post('/delete', (request,response) => {
  let checkedId = request.body.checkbox;
  let listName = request.body.checkList;

  if(listName === "Today") {
    Item.findByIdAndRemove(checkedId, (err) => {
      if(!err) {
        console.log("Deleted item from " + listName + " list successfully.")
        response.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedId}}}, (err, foundList) => {
      if(!err) {
        console.log("Deleted item from " + foundList.name + " list successfully.")
        response.redirect("/" + listName);
      }
    });
  }
});


app.listen(port, () => {
  console.log("Server up and running");
});
