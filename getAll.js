"use strict"
document.addEventListener('DOMContentLoaded', function() {
    var alertButton = document.getElementById('alertButton');
    alertButton.addEventListener('click', function() {
      alert('Hello from the Chrome extension!');
    });
  });