const express = require('express');
const bodyParser = require('body-parser');
// require module in js folder
const getDate = require(__dirname + '/public/javascript/date.js');
const app = express();
const port = 5000;

console.log(getDate)

//global arr to have access to display input.
const userInputtedArr = [];
// allows you to parse body to view like json
app.use(bodyParser.urlencoded({extended:true}));
// access to static files in public route
app.use(express.static('public'));
// npm i ejs
// tells app to use ejs as the view. Must create a view folder as this will look in this folder.
app.set('view engine','ejs');

//get home route
app.get('/', (request,response) => {
    const day = getDate.currentDate();
        //render file called list in views folder
        // whatDay is the ejs var, day is variable to access module for getDate js.
    response.render('list', {whatDay : day, newListItems : userInputtedArr });
});

app.post('/', (request,response) => {
  // save user input
  const userInputted = request.body.addtoDoInput;
  //push into global array to have access for scope
  userInputtedArr.push(userInputted);
  // redirect back to home route, to show results in the render 'list from get'.
  response.redirect('/')
});

app.listen(port, () => {
  console.log("Server up and running");
});
