//declare math object to be used globally
var mathObject = {};
var keyFrame;
var positive = true;
var displayString = "";
var lowerDisplayString = "";
var firstOperator = true;


$(document).ready(function(){





  $('#negative').on('click', positiveNegative);
  //update number in display
  $('.number').on('click', function() {
    lowerDisplayString += $(this).attr('id');
    displayString += $(this).attr('id');
    $('#display').text(displayString);
    $('#lower-display').text(lowerDisplayString);
    $(this).addClass('keyFrame');
    keyFrame = $(this);
    window.setTimeout(removeKeyframe, 250);
  });

  //clear out text in display
  $('#clear').on('click', function() {
    displayString = "";
    lowerDisplayString = "";
    $('#display').text("0");
    $('#lower-display').text("0");
    mathObject.firstNumber = 0;
    firstOperator = true;
    console.log(mathObject);
  });

  //add operator to object. if this is not the first operator selected, run proper calculation, put the result in mathObject.firstNumber, THEN put this operator in mathObject.operartor
  $('.operator').on('click', function() {
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
  });

  //get final result and display in dispaly window
  $('.operator-equals').on('click', function() {
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
  });
});
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
