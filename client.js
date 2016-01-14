var request = require('browser-request')
var _ = require('underscore')
var placeSelect = document.getElementById("loc");
var timeSelect = document.getElementById("time");
var btn = document.getElementById('goButton');
var resultDiv = document.getElementById("results");

var dayOfWeekLookup = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "SATURDAY"]
var buildingList = {
    "ACTON": [44.22387, -76.49149],
    "BEAMISH-MUNRO": [44.22820, -76.49248],
    "BIOSCI": [44.22637, -76.49123],
    "BOTTER": [44.22445, -76.49160],
    "BRUCE": [44.22714, -76.49314],
    "CATARAQUI": [44.22557, -76.49087],
    "CHERNOFF": [44.22444, -76.49868],
    "DOUGLAS": [44.22735, -76.49506],
    "DUNCAN": [44.22416, -76.51439],
    "DUNNING": [44.22744, -76.49602],
    "DUPUIS": [44.22866, -76.49269],
    "ELLIS": [44.22637, -76.49616],
    "ETHERINGTON": [44.22826, -76.49735],
    "GOODES": [44.22824, -76.49724],
    "GOODWIN": [44.22793, -76.49222],
    "HARRISON-LECAINE": [44.22537, -76.49691],
    "HUMPHREY": [44.22684, -76.49206],
    "IBCPA": [44.22032, -76.50679],
    "JACKSN": [44.22658, -76.49309],
    "JACKSON": [44.22658, -76.49309],
    "JEFFERY": [44.22592, -76.49602],
    "JOHN": [44.22826, -76.49520],
    "KINES": [44.22862, -76.49331],
    "KINGSTON": [44.22568, -76.49485],
    "MACDONALD": [44.22848, -76.49686],
    "MACINTOSH-CORRY": [44.22665, -76.49692],
    "MCLAUGHLIN": [44.22385, -76.49529],
    "MEDS": [44.22523, -76.49130],
    "MILLER": [44.22741, -76.49267],
    "NICOL": [44.22735, -76.49377],
    "ONTARIO": [44.22654, -76.49501],
    "RICHARDSON": [44.22687, -76.49606],
    "STAUFFER": [44.22847, -76.49615],
    "STIRLING": [44.22459, -76.49766],
    "THEOLOGICAL": [44.22572, -76.49351],
    "WALTER": [44.22796, -76.49167]
}

var courseTemplate = _.template("<h4><%= sections.courses.subjects.title %> <%= sections.courses.number %> - <%= sections.courses.title %> | <%= location %></h4><p class='desc'><%= sections.courses.description %></p>");

function getDistance(l) {
    if (placeSelect.value === "Anywhere")
        return 0
    if (l.location === "TBA")
        return 0
    if (l.sections.type !== "LEC")
        return 0

    var hall = l.location.split(" ")[0]
    var a = buildingList[placeSelect.value]
    var b = buildingList[hall]
    console.log(hall)

    return Math.sqrt(((a[0] - b[0]) * (a[0] - b[0])) + ((a[1] - b[1]) * (a[1] - b[1])))
}
var getClasses = function(time) {
    var query = 'section_classes?start_time=eq.' + timeSelect.value +
        ':30:00' + '&day_of_week=eq.' + dayOfWeekLookup[d] + '&term_start=eq.2016-01-04&select= location,sections{id,type,courses{id,number,title,description,subjects{*}}}'
        // console.log(query)
    request('http://159.203.112.6:3000/' + query, function(er, res) {
        if (!er) {
            resultDiv.innerHTML = '';

            var list = JSON.parse(res.body)
                // console.log(list)
            list = _.sortBy(list, getDistance)

            list.forEach(function(result) {
                if (result.location === "TBA")
                    return
                if (result.sections.type !== "LEC")
                    return
                    // console.log(result.location.split(" ")[0])

                var node = document.createElement("li"); // Create a <li> node
                node.innerHTML = courseTemplate(result); // Create a text node

                resultDiv.appendChild(node); // Append <li> to <ul> with
            })

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

var date = new Date();
var h = date.getHours();
var m = date.getMinutes();
var d = date.getDay()
if ((h < 8) || (h > 18)) {
    h = 8;
}
if (m > 47) {
    h++
}
timeSelect.value = h.toString()
