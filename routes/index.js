var express = require('express');
var router = express.Router();
var app = express();
app.set('view engine', 'ejs');
const shiurFinder = require("../public/javascripts/shiurFinder");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shivtei Shiurim'});
});

router.get('/all-shiurim', function(req, res) {
  let shiurim = shiurFinder.all();
  res.render('shiur', {shiurim: shiurim});
});



module.exports = router;
