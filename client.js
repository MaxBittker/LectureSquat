var request = require('browser-request')

var timeSelect = document.getElementById("time");
var btn = document.getElementById('goButton');
var resultDiv = document.getElementById("results");



var getClasses = function(time) {
    request('https://postgrest.herokuapp.com/sessions', function(er, res) {
        if (!er) {
            var node = document.createElement("h4"); // Create a <li> node
            // console.log(res.body)
            var textnode = document.createTextNode(JSON.stringify(JSON.parse(res.body)[0])); // Create a text node
            node.appendChild(textnode); // Append the text to <li>
            resultDiv.appendChild(node); // Append <li> to <ul> with 
        } else {
            console.log('There was an error')
            throw er
        }
    })
}

btn.addEventListener('click', function() {
    var time = timeSelect.options[timeSelect.selectedIndex].value;

    getClasses(time);
}, false);


var d = new Date();
var h = d.getHours();
var m = d.getMinutes();

if ((h < 8) || (h > 18)) {
    h = 8;
}
timeSelect.value = h.toString()
