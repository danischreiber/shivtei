var express = require('express');
var router = express.Router();
var app = express();
app.set('view engine', 'ejs');
const shiurFinder = require("../public/javascripts/shiurFinder");
const shiurAdmin = require("../public/javascripts/shiurAdmin");
const fileupload = require("express-fileupload");
app.use(fileupload());
const formidable = require('formidable');
const path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shivtei Shiurim'});
});

router.get('/all-shiurim', function(req, res) {
  let shiurim = shiurFinder.all();
  res.render('shiur', {shiurim: shiurim});
});

router.get('/aws-shiurim', function(req, res){
  shiurFinder.awsAll(res);
});

router.get('/drive-all', function(req, res){
  shiurFinder.driveAll(res);
});

router.post('/add-shiur', function(req, res){
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.keepExtensions = true;
  form.uploadDir = '';
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: err })
      shiurAdmin.uploadFileDrive(files[""]);

    res.status(200).json({ uploaded: true })
  });
});


module.exports = router;
