$(document).ready(function(){
  var displayString = "";
  var lowerDisplayString = "";
  var mathObject = {};
  var numberCounter = 1;

  //update number in display
  $('.number').on('click', function() {
    lowerDisplayString += $(this).attr('id');
    displayString += $(this).attr('id');
    $('#display').text(displayString);
    $('#lower-display').text(lowerDisplayString);
  });


  //clear out text in display
  $('#clear').on('click', function() {
    displayString = "";
    $('#display').text("0");
    $('#lower-display').text("0");
  });

  //add operator to object. if this is not the first operator selected, run proper calculation, put the result in mathObject.firstNumber, THEN put this operator in mathObject.operartor
  $('.operator').on('click', function() {
    lowerDisplayString = lowerDisplayString + " " + $(this).text() + " ";
    $('#lower-display').text(lowerDisplayString);
    if (displayString !== "") {
      if (numberCounter === 1) {
        mathObject.firstNumber = Number(displayString);
        mathObject.operator = $(this).attr('id');
        displayString = "";
        console.log(mathObject);
        numberCounter++;
      }
      else {
        //ajax request to get result of previous calculation

      }
    }
  });

  $('.operator-equals').on('click', function() {
    //confirm that an operator has been selected
    if (mathObject.hasOwnProperty('operator')) {
      mathObject.secondNumber = Number(displayString);
      console.log("operator-equals listener", mathObject);
      $.ajax({
        type: 'POST',
        url: '/math/' + mathObject.operator,
        data: mathObject,
        success: function(mathObject) {
          getCompleted();
        }
      });
    } else {
      console.log("nope");
    }
  });
});

function getCompleted() {
  $.ajax({
    type: 'GET',
    url: '/math',
    success: function(data) {
      console.log('got the completed data!');
      appendCompleted(data);
    }
  });
}

function appendCompleted(data) {
  console.log(data);
  $('#display').text(data.number);
}

function clearForm() {
  $('form').find('input[type=number]').val("");
  $('#result').text("");
}
