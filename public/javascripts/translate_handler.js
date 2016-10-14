'use strict'

$(document).ready(function(){
  $("#translate").submit(function(e){
    e.preventDefault();
    var resultEl     = $("#result")
    var url          = "/translate"
    var formData     = $(e.target).serializeArray();
    var dataToSubmit = {};

    resultEl.html("Translating...")

    $.each(formData, function(index, val){
      dataToSubmit[val.name] = val.value;
    });

    function success(data) {
      resultEl.html(data.text)
    };

    $.post(url, dataToSubmit, success)

  })
})