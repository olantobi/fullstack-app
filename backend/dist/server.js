'use strict';

var _mongoose = _interopRequireDefault(require("mongoose"));

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _data = _interopRequireDefault(require("./data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var app = (0, _express["default"])();
app.use((0, _cors["default"])());

var router = _express["default"].Router();

var dbRoute = process.env.DB_URL;

_mongoose["default"].connect(dbRoute, {
  useNewUrlParser: true,
  useFindAndModify: false
});

var db = _mongoose["default"].connection;
db.once('open', function () {
  return console.log('connected to the database');
});
db.on('error', console.error.bind(console, 'Mongodb connection error:'));
app.use(_bodyParser["default"].urlencoded({
  extended: false
}));
app.use(_bodyParser["default"].json());
app.use((0, _morgan["default"])('dev'));
router.get('/getData', function (req, res) {
  _data["default"].find(function (err, data) {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true,
      data: data
    });
  });
});
router.put('/updateData', function (req, res) {
  console.log("call to updateData", req.body);
  var _req$body = req.body,
      id = _req$body.id,
      update = _req$body.update;

  _data["default"].findByIdAndUpdate(id, update, function (err) {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true
    });
  });
});
router["delete"]('/deleteData', function (req, res) {
  var id = req.body.id;

  _data["default"].findByIdAndRemove(id, function (err) {
    if (err) return res.send(err);
    return res.json({
      success: true
    });
  });
});
router.post('/createData', function (req, res) {
  console.log("call to createData", req.body);
  var data = new _data["default"]();
  var _req$body2 = req.body,
      id = _req$body2.id,
      message = _req$body2.message;

  if (!id && id !== 0 || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    });
  }

  data.message = message;
  data.id = id;
  data.save(function (err) {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true
    });
  });
});
var API_PORT = process.env.API_PORT;
app.use('/api', router);
app.listen(API_PORT, function () {
  return console.log("LISTENING ON PORT ".concat(API_PORT));
});