//declare variables to be used globally
var mathObject = {};
var keyFrame;
var positive = true;
var displayString = "";
var lowerDisplayString = "";
var firstOperator = true;
var keycodes = {
  48 : "0",
  49 : "1",
  50 : "2",
  51 : "3",
  52 : "4",
  53 : "5",
  54 : "6",
  55 : "7",
  56 : "8",
  57 : "9"
}

$(document).ready(function(){
  //toggle between negative and positive numbers
  $('#negative').on('click', positiveNegative);
  //update number in display
  $('.number').on('click', numberClick);
  //allow user to type in numbers
  $(document).on('keydown', keyUp);
  //clear out text in display
  $('#clear').on('click', clearClick);
  //add operator to object. if this is not the first operator selected, run proper calculation, put the result in mathObject.firstNumber, THEN put this operator in mathObject.operartor
  $('.operator').on('click', operatorClick);
  //get final result and display in dispaly window
  $('.operator-equals').on('click', equalsClick);
});


//update number in display
function numberClick() {
  lowerDisplayString += $(this).attr('id');
  displayString += $(this).attr('id');
  $('#display').text(displayString);
  $('#lower-display').text(lowerDisplayString);
  $(this).addClass('keyFrame');
  keyFrame = $(this);
  window.setTimeout(removeKeyframe, 250);
}

//allow user to type in numbers
function keyUp(e) {
  if (keycodes[e.keyCode] !== undefined) {
    lowerDisplayString += keycodes[e.keyCode];
    displayString += keycodes[e.keyCode];
    $('#display').text(displayString);
    $('#lower-display').text(lowerDisplayString);
  }
}

//clear out text in display
function clearClick() {
  displayString = "";
  lowerDisplayString = "";
  $('#display').text("0");
  $('#lower-display').text("0");
  mathObject.firstNumber = 0;
  firstOperator = true;
  console.log(mathObject);
}

//add operator to object. if this is not the first operator selected, run proper calculation, put the result in mathObject.firstNumber, THEN put this operator in mathObject.operartor
function operatorClick() {
  lowerDisplayString = lowerDisplayString + " " + $(this).text() + " ";
  $('#lower-display').text(lowerDisplayString);
  if (displayString !== "") {
    if (firstOperator === true) {
      mathObject.firstNumber = Number(displayString);
      mathObject.operator = $(this).attr('id');
      displayString = "";
      firstOperator = false;
      $(this).addClass('keyFrame');
      keyFrame = $(this);
      window.setTimeout(removeKeyframe, 250);
      positive = true;
    }
    else {
      //ajax request to get result of previous calculation
      mathObject.secondNumber = Number(displayString);
      mathObject.nextOperator = $(this).attr('id');
      console.log(mathObject);
      displayString = "";
      $(this).addClass('keyFrame');
      keyFrame = $(this);
      window.setTimeout(removeKeyframe, 250);
      doFirstCalculation();
      positive = true;
    }
  }
}

//get final result and display in dispaly window
function equalsClick() {
  //confirm that an operator has been selected
  if (mathObject.hasOwnProperty('operator')) {
    mathObject.secondNumber = Number(displayString);
    $(this).addClass('keyFrame');
    keyFrame = $(this);
    window.setTimeout(removeKeyframe, 250);
    console.log("operator-equals listener", mathObject);
    positive = true;
    $.ajax({
      type: 'POST',
      url: '/math/' + mathObject.operator,
      data: mathObject,
      success: function(mathObject) {
        getCompleted();
      },
      error: function() {
        console.log("error with operator-equals request");
      }
    });
  } else {
    console.log("nope");
  }
}


//function to get get the final result
function getCompleted() {
  $.ajax({
    type: 'GET',
    url: '/math',
    success: function(data) {
      console.log('got the completed data!');
      appendCompleted(data);
    },
    error: function() {
      console.log("error with getCompleted function");
    }
  });
}
//function to append final result to display
function appendCompleted(data) {
  console.log(data);
  $('#display').text(data.number);
}

//function to do calculation within string of operations
function doFirstCalculation() {
  $.ajax({
    type: 'POST',
    url: '/math/' + mathObject.operator,
    data: mathObject,
    success: function(mathObject) {
      updateFirstNumber();
    },
    error: function() {
      console.log("error with operator-equals request");
    }
  });
}

//function to update firstNumber in mathObject when doing string of operations
function updateFirstNumber() {
  $.ajax({
    type: 'GET',
    url: '/math',
    success: function(data) {
      console.log('got the completed data!');
      mathObject.firstNumber = data.number;
      mathObject.operator = mathObject.nextOperator;
      console.log(mathObject);
      $('#display').text(mathObject.firstNumber);
    },
    error: function() {
      console.log("error with getCompleted function");
    }
  });
}


//function that removes the keyFrame animation so that the animation will appear everytime a button is clicked
function removeKeyframe() {
  keyFrame.removeClass('keyFrame');
  console.log(keyFrame);
}

//function that toggles the number to positive or negative
function positiveNegative() {
  if (positive === true) {
    var splitIt = displayString.split('');
    splitIt.unshift('-');
    displayString = splitIt.join('');
    positive = false;
    $('#display').text(displayString);
    var lowerSplit = lowerDisplayString.split(' ');
    lowerSplit[lowerSplit.length - 1] = " " + displayString;
    lowerDisplayString = lowerSplit.join(' ');
    $('#lower-display').text(lowerDisplayString);
  } else {
    var splitIt = displayString.split('');
    splitIt.shift('-');
    displayString = splitIt.join();
    $('#display').text(displayString);
    var lowerSplit = lowerDisplayString.split(' ');
    lowerSplit[lowerSplit.length - 1] = displayString;
    lowerDisplayString = lowerSplit.join(' ');
    $('#lower-display').text(lowerDisplayString);
    positive = true;
  }
}
