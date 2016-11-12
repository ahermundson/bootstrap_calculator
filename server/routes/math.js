var express = require('express');
var router = express.Router();
var calculateObject = {};
var result = {number: 0};


router.post('/add', function (req, res) {
  calculateObject = req.body;
  result.number = Number(calculateObject.firstNumber) + Number(calculateObject.secondNumber);
  console.log("add route");
  res.sendStatus(201);
});

router.post('/subtract', function (req, res){
  calculateObject = req.body;
  result.number = Number(calculateObject.firstNumber) - Number(calculateObject.secondNumber);
  console.log("subtract route");
  res.sendStatus(201);
});

router.post('/multiply', function (req, res) {
  calculateObject = req.body;
  result.number = Number(calculateObject.firstNumber) * Number(calculateObject.secondNumber);
  console.log("multiply route");
  res.sendStatus(201);
});

 router.post('/divide', function (req, res) {
  calculateObject = req.body;
  result.number = Number(calculateObject.firstNumber) / Number(calculateObject.secondNumber);
  console.log("divide route");
  res.sendStatus(201);
 });

// router.post('/', function (req, res) {
//
//   switch(calculateObject.operator) {
//     case "add":
//       result.number = Number(calculateObject.firstNumber) + Number(calculateObject.secondNumber);
//       console.log(result);
//       break;
//
//     case "subtract":
//       result.number = Number(calculateObject.firstNumber) - Number(calculateObject.secondNumber);
//       console.log(result);
//       break;
//
//     case "divide":
//       result.number = Number(calculateObject.firstNumber) / Number(calculateObject.secondNumber);
//       console.log(result);
//       break;
//
//     case "multiply":
//       result.number = Number(calculateObject.firstNumber) * Number(calculateObject.secondNumber);
//       console.log(result);
//       break;
//   }
//   res.sendStatus(201);
// });


router.get('/', function (req, res) {

  res.send(result);
});

module.exports = router;
