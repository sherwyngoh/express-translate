'use strict'

$(document).ready(function(){
  $("#translate").submit(function(e){
    e.preventDefault();
    var resultEl     = $("#result")
    var url          = "/translate"

    resultEl.html("Translating...")

    function success(data) {
      resultEl.html(data.text)
    };

    function fail() {
      $('#notice').html('Failed to get a response from the server');
      $('#notice').fadeIn();
      function hideNotice(){
        $('#notice').fadeOut('fast');
        resultEl.html("");
      }
      setTimeout(hideNotice, 3000);
    }

    $.post(url, $(e.target).serialize(), success).fail(fail)

  })
})