$(document).ready(function(){
  var displayString = "";
  var mathObject = {};
  var operatorArray = [];
  var numberCounter = 1;



  $('.number').on('click', function() {
    displayString += $(this).attr('id');
    $('#display').text(displayString);
  });

  $('#clear').on('click', function() {
    displayString = "";
    $('#display').text("0");
  });

  $('.operator').on('click', function() {
    if (displayString !== "") {
      if (numberCounter === 1) {
        mathObject.firstNumber = Number(displayString);
        mathObject.operator = $(this).attr('id');
        displayString = "";
        console.log(mathObject);
      }
    }
  });

  $('.operator-equals').on('click', function() {
    if (mathObject.hasOwnProperty('operator')) {
      mathObject.secondNumber = Number(displayString);
      console.log("operator-equals listener", mathObject);
      $.ajax({
        type: 'POST',
        url: '/math',
        data: mathObject,
        success: function(mathObject) {
          getCompleted();
        }
      });
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






// $(document).ready(function() {
//
//   $('.operator').on('click', function(){
//     event.preventDefault();
//     var numbersObject = {};
//     var operation = $(this).attr('id');
//     $.each($('#calculatorInput').serializeArray(), function(i, field) {
//       numbersObject[field.name] = field.value;
//     });
//     numbersObject.type = operation;
//     $.ajax({
//       type: 'POST',
//       url: '/math',
//       data: numbersObject,
//       success: function(numbersObject) {
//         getCompleted();
//       }
//     });
//   });
//
//   $('#clear').on('click', clearForm);
//
// });
//
//
// function getCompleted() {
//   $.ajax({
//     type: 'GET',
//     url: '/math',
//     success: function(data) {
//       console.log('got the completed data!');
//       appendCompleted(data);
//     }
//   });
// }
//
// function appendCompleted(data) {
//   console.log(data);
//   $('#result').text(data.number);
// }
//
// function clearForm() {
//   $('form').find('input[type=number]').val("");
//   $('#result').text("");
// }
