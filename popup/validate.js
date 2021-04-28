var form_validate;
$().ready(function () {
  $('#date').hide();

  $.validator.addMethod("startDatime", function (value, element, param) {
    // $("#txtDate").val($.);
    // $.format.toBrowserTimeZone("2013-09-14T23:22:33Z", dateFormat)

    var startDate = Date.parse($(param[0]).val()),
      curent_date = new Date()
    console.log('current', Date.parse(curent_date));
    console.log('st', startDate)

    if (curent_date > startDate) {
      param = false;
    }
    return param;
  }, "The start date must be greater than the current date");

  $.validator.addMethod("datesInOrder", function (value, element, param) {
    var startDate = Date.parse($(param[0]).val()),
      endDate = Date.parse($(param[1]).val());
    if (startDate > endDate) {
      param = false;
    }
    return param;
  }, "End date must be after start date.");

  form_validate =  $("#form_popup").validate({
    onfocusout: false,
    onkeyup: false,
    onclick: false,
    rules: {
      "firstname": {
        required: true,
        maxlength: 15
      },
      "email": {
        required: true,
        maxlength: 50,
        email: true
      },
      "calenda_start_date": {
        required: true,
        date: true,
        startDatime: ["#start_date"],
        datesInOrder: ["#start_date", "#end_date"]
      },
      "calenda_end_date": {
        required: true,
        date: true,
      },
      "subject": {
        required: true,
      },
    }
  });

  $("#several_days").click(function () {
    $('#date').show();
  });

  let arr = ['#morning', '#afternoon', '#fullday']
  for (var i = 0; i < arr.length; i++) {
    $(arr[i]).click(function () {
      $('#date').hide();
    });
  }
  console.log(form_validate.valid());
});

export {form_validate}
