const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

//global arr to have access to display input.
let userInputtedArr = [];
// allows you to parse body to view like json
app.use(bodyParser.urlencoded({extended:true}));
// access to static files in public route
app.use(express.static('public'));
// npm i ejs
// tells app to use ejs as the view. Must create a view folder as this will look in this folder.
app.set('view engine','ejs');

//get home route
app.get('/', (request,response) => {
    //get date
    let today = new Date();
    // set options to show date options dynamically.
    let options = {
      weekday: "long",
      day: "numeric",
      month: "long"
    };
    // set day to return string portion of date
    let day = today.toLocaleDateString("en-US", options)

    //render file called list in views folder
    // in listfile kindOfDay is the ejs var in html, and will have the value of variable day in app.js.
    response.render('list', {whatDay : day, newListItems : userInputtedArr });
});

app.post('/', (request,response) => {
  // save user input
  let userInputted = request.body.addtoDoInput;
  //push into global array to have access for scope
  userInputtedArr.push(userInputted);
  // redirect back to home route, to show results in the render 'list from get'.
  response.redirect('/')
});

app.listen(port, () => {
  console.log("Server up and running");
});
