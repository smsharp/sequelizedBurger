// Dependencies
var express = require('express');
var router = express.Router();

// Connects to burger models
var models = require('../models');

// Create all our routes and set up logic within those routes where required.
router.get('/', function (req, res) {
  res.redirect('/index');
});

// Render all burgers to DOM)
router.get('/index', function (req, res) {
  models.burgers.findAll({
   include: [{model: models.devourers}]
  }).then(function(data){

    // Pass the returned data into a Handlebars object and then render it
    var hbsObject = { burgers: data };
    // console.log the data;
    res.render('index', hbsObject);

  })
});

// Create a New Burger
router.post('/burger/create', function (req, res) {
  models.burgers.create(
    {
      burger_name: req.body.burger_name,
      devoured: false
    }
  ).then(function(){
    res.redirect('/index');
  });
});

// Devour a Burger
router.post('/burger/eat/:id', function (req, res) {
  // If not name was added, make it "Anonymous"
  if(req.body.burgerEater == "" || req.body.burgerEater == null){
    req.body.burgerEater = "Anonymous";
  }

  // Create a new burger devourer (and also associate it to the eaten burger's id)
  models.devourers.create({
    devourer_name: req.body.burgerEater,
    burgerId: req.params.id
  })

  // Then, select the eaten burger by it's id
  .then(function(newDevourer){

    models.burgers.findOne( {where: {id: req.params.id} } )

    // Then, use the returned burger object to...
    .then(function(eatenBurger){
      // Update the burger's status to devoured
      eatenBurger.update({
        devoured: true,
      })

      // Then, the burger is devoured, so refresh the page
      .then(function(){
        res.redirect('/index');
      });

    });

  });

});

// Export routes for server.js to use.
module.exports = router;