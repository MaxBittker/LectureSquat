var request = require('browser-request')
var _ = require('underscore')
var placeSelect = document.getElementById("loc");
var timeSelect = document.getElementById("time");
var btn = document.getElementById('goButton');
var resultDiv = document.getElementById("results");

var dayOfWeekLookup = ["MONDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "MONDAY"]

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
    "DUNMCAN": [44.22416, -76.51439],
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

function timePrinter(str) {
    var cmp = str.split(":")
    var hour = cmp[0]

    if (cmp[0] > 12)
        hour = hour % 12

    return hour + ':' + cmp[1]
}

function timeSOLUSFormater(value) {
    var str = ((value / 2) | 0).toString()

    if (value % 2)
        end = ':30:00'
    else
        end = ':00:00'

    return str + end
}
var courseTemplate = _.template("<div class='card'><h4 class='cardLeft'><%= sections.courses.subjects.title %> <%= sections.courses.number %> - <%= sections.courses.title %> </h4> <h4 class='cardRight'> <%= location %> </h4></div><br> <p class='desc'> <%= sections.courses.description %>  <b><%= start_time %> - <%= end_time %></b> </p> ");

function getDistance(l) {
    if (placeSelect.value === "Anywhere")
        return 0
    var hall = l.location.split(" ")[0]

    var a = buildingList[placeSelect.value]
    var b = buildingList[hall]

    if (b === undefined)
        b = [44.22637, -76.49616]

    return Math.sqrt(((a[0] - b[0]) * (a[0] - b[0])) + ((a[1] - b[1]) * (a[1] - b[1])))
}
var getClasses = function(time, clear) {
    var query = 'section_classes?start_time=eq.' + timeSOLUSFormater(timeSelect.value) + '&day_of_week=eq.' + dayOfWeekLookup[d] + '&term_start=eq.2016-01-04&select= location,start_time,end_time,sections{id,type,courses{id,number,title,description,subjects{*}}}'
    request.get({
        url: 'http://159.203.112.6:3000/' + query,
        withCredentials: true
    }, function(er, res) {
        if (!er) {
            if (clear !== false)
                resultDiv.innerHTML = '';

            var list = JSON.parse(res.body)
            list = _.filter(list, function(item) {
                if (item.location === "TBA" || item.sections.type !== "LEC")
                    return false
                else
                    return true
            })

            if (list.length === 0) {
                console.log(timeSelect.toString())
                resultDiv.innerHTML = "<li style='text-align:center;'>  No lectures found for " + timePrinter(timeSOLUSFormater(timeSelect.value)) + ", trying next time slot &#8227;</li>"
                timeSelect.value++
                    if (timeSelect.value < 38)
                        update(false)
                return
            }

            list = _.sortBy(list, getDistance)

            list.forEach(function(result) {
                var node = document.createElement("li"); // Create a <li> node
                result.start_time = timePrinter(result.start_time)
                result.end_time = timePrinter(result.end_time)

                node.innerHTML = courseTemplate(result); // Create a text node

                node.addEventListener('mouseup', classToggle, false);
                node.addEventListener('touchend', classToggle, false);

                resultDiv.appendChild(node); // Append <li> to <ul> with
            })

        } else {
            console.log('There was an error')
            throw er
        }
    })
}

function classToggle() {
    this.classList.toggle('open');
    console.log('clicked')
}

function update(clear) {
    if (clear === undefined)
        clear = true
    var time = timeSelect.valuevalue;
    getClasses(time, clear);
}
placeSelect.addEventListener('change', update, false)
timeSelect.addEventListener('change', update, false)

var date = new Date();
var h = date.getHours();
var m = date.getMinutes();
var d = date.getDay()
if ((h < 8) || (h > 18)) {
    h = 8;
}
h = h * 2
if (m > 7) {
    h++
}
if (m > 37) {
    h++
}
timeSelect.value = h.toString()
update()
