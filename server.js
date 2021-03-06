//package and module requirements
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var Beer = require("/beerModel");

//let's get going...
var app = express();
mongoose.connect('mongodb://localhost/beers');

var beerSchema = new mongoose.Schema({
  name: {
    type: String
  },
  style: {
    type: String
  },
  image_url: {
    type: String
  },
  abv: {
    type: Number
  },
  ratingTotal: {
    type: Number
  },
  numberOfRatings: {
    type: Number
  }
});

var Beer = mongoose.model("Beer", beerSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.static('node_modules'));

var handler = function (res, next) {
  return function (err, beer) {
    if (err) {
      return next(err);
    }
    res.send(beer);
  }
}

app.get('/beers', function (req, res) {
  Beer.find(handler(res, next));
});

app.post('/beers', function (req, res) {
  Beer.create(handler(res, next));
});

app.delete('/beers/:beerId', function (req, res) {
  Beer.findByIdAndRemove(req.params.beerId, handler(res, next));
});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// main error handler warning - not for use in production code!
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({message: err.message, error: err});
});

app.put('/beers/:beerId', function (req, res, next) {
  Beer.findByIdAndUpdate(req.params.beerId, req.body, {
    new: true
  }, handler(res, next));
});
app.post('/beers/:id/ratings', function (req, res, next) {

  var update = {
    $push: {
      ratings: req.body.rating
    }
  };
  Beer.findByIdAndUpdate(req.params.id, update, {
    new: true
  }, handler(res, next));
});

app.listen(8000, function () {
  console.log("yo yo yo, on 8000!!")
});