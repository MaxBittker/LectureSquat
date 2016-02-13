'user strict';

// require("./node_modules/bootstrap/dist/css/bootstrap.min.css")
require("./main.css")

import React from 'react';
import ReactDOM from 'react-dom';
import Request from 'browser-request'

const dayOfWeekLookup = ["MONDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "MONDAY"]

const buildingList = {
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

const PlaceOptions =
          [{ value:"Anywhere",text:"Anywhere "},
          { value:"BEAMISH-MUNRO",text:" ILC "},
          { value:"BIOSCI",text:" BioSci "},
          { value:"BOTTER",text:" Botteral "},
          { value:"CHERNOFF",text:" Chernoff "},
          { value:"DOUGLAS",text:" Douglas "},
          { value:"DUNCAN",text:" Duncan "},
          { value:"DUNNING",text:" Dunning "},
          { value:"DUPUIS",text:" Dupuis "},
          { value:"ELLIS",text:" Ellis "},
          { value:"GOODES",text:" Goodes "},
          { value:"GOODWIN",text:" Goodwin "},
          { value:"HUMPHREY",text:" Humphrey "},
          { value:"JACKSON",text:" Jackson "},
          { value:"JEFFERY",text:" Jeffery "},
          { value:"JOHN",text:" The JDUC "},
          { value:"KINES",text:" Kines "},
          { value:"KINGSTON",text:" Kingston "},
          { value:"MACDONALD",text:" Macdonald "},
          { value:"MACINTOSH-CORRY",text:" Mac Corry "},
          { value:"MCLAUGHLIN",text:" McLaughlin "},
          { value:"MILLER",text:" Miller "},
          { value:"NICOL",text:" Nicol "},
          { value:"ONTARIO",text:" Ontario "},
          { value:"STAUFFER",text:" Stauffer "},
          { value:"STIRLING",text:" Stirling "},
          { value:"WALTER",text:" Walter Light "}]

const TimeOptions= [{ value:"17",text:"8:30"},
          { value:"18",text:"9:00"},
          { value:"19",text:"9:30"},
          { value:"20",text:"10:00"},
          { value:"21",text:"10:30"},
          { value:"22",text:"11:00"},
          { value:"23",text:"11:30"},
          { value:"24",text:"12:00"},
          { value:"25",text:"12:30"},
          { value:"26",text:"1:00"},
          { value:"27",text:"1:30"},
          { value:"28",text:"2:00"},
          { value:"29",text:"2:30"},
          { value:"30",text:"3:00"},
          { value:"31",text:"3:30"},
          { value:"32",text:"4:00"},
          { value:"33",text:"4:30"},
          { value:"34",text:"5:00"},
          { value:"35",text:"5:30"},
          { value:"36",text:"6:00"},
          { value:"37",text:"6:30"}]


function timePrinter(str) {
    var cmp = str.split(":")
    var hour = cmp[0]

    if (cmp[0] > 12)
        hour = hour % 12
	if(hour[0]==='0')
		hour = hour[1]
    
    return hour + ':' + cmp[1]
}

function timeSOLUSFormater(value) {
    var str = ((value / 2) | 0).toString()

    var end = ':00:00'

    if (value % 2)
        end = ':30:00'

    return str + end
}
function getDistanceComp(loc) {
	return function (l) {
	    if (loc === "Anywhere")
	        return 0
	    var hall = l.location.split(" ")[0]

	    var a = buildingList[loc]
	    var b = buildingList[hall]

	    if (b === undefined)
	        b = [44.22637, -76.49616]

	    return Math.sqrt(((a[0] - b[0]) * (a[0] - b[0])) + ((a[1] - b[1]) * (a[1] - b[1])))
	}
}
function nextGoodValue(){
	var date = new Date();
	var h = date.getHours();
	var m = date.getMinutes();
	
	if ((h < 8) || (h > 18)) {
	    h = 17; //default to morning
	}else{
		h = h * 2
		if (m > 7) {
			h++
		}
		if (m > 37) {
		    h++
		}
	}
	return h.toString()
}

export class ResultsBox extends React.Component{
	constructor(props) {
	    super(props);

	    this.state = {data : [],time:nextGoodValue(),place:"Anywhere"};
	    this.componentDidMount = this.componentDidMount.bind(this);

 		this.handleTimeChange = this.handleTimeChange.bind(this);
	    this.handlePlaceChange = this.handlePlaceChange.bind(this);
	    
	    this.updateData = this.updateData.bind(this);

 	}
 	handleTimeChange(time){
		this.setState ({time:time})
 		this.updateData(time)
 		
 	}
 	handlePlaceChange(place){
		this.setState ({place:place})
 		this.updateData(undefined,place)
 	}
 	updateData(time,place){

 		time = time || this.state.time
 		place = place || this.state.place
 		var date = new Date();
		var d = date.getDay()
		var query = '/section_classes?start_time=eq.' + timeSOLUSFormater(time)
		+ '&day_of_week=eq.' + dayOfWeekLookup[d]
		+ '&term_start=eq.2016-01-04&select= id,location,start_time,end_time,sections{id,type,courses{id,number,title,description,subjects{*}}}'
		// console.log(query)s
		Request({
			url:this.props.url + query,
			json:true
			},(err,res,bod)=>{

			if(err)
				throw err

            var list = bod.filter(function(item) {
                if (item.location === "TBA" || item.sections.type !== "LEC")
                    return false
                else
                    return true
            })
            if(list.length===0){
            	time++
				this.setState ({time:time})
            	this.updateData(time)
            	//TODO retain warning message
            	// resultDiv.innerHTML = "<li style='text-align:center;'>  No lectures found for " + timePrinter(timeSOLUSFormater(timeSelect.value)) + ", trying next time slot &#8227;</li>"
                // timeSelect.value++
                    // if (timeSelect.value < 38)
                        // update(false)
            }
            var getDistance = getDistanceComp(place)

            list=list.sort((a,b)=>(getDistance(a)-getDistance(b)))
			
			this.setState({data:list})
		})
	} 
	componentDidMount(){
 		this.updateData()
 	}
	
	render(){
		return (
      <div className='ResultsBox'>
      <InputForm time={this.state.time} place={this.state.place} handleTimeChange={this.handleTimeChange} handlePlaceChange={this.handlePlaceChange}/>
      <CourseList data={this.state.data} />
      Click for details. Please be respectful of host classrooms
Thanks to qcumber.ca for course details. <a href="./about.html">About</a>
      </div>
		);
	}
}


export class CourseList extends React.Component{
	render(){
		var courseNodes = this.props.data.map(function(course){
			return(
				<CourseCard title={course.sections.courses.subjects.abbreviation+" "+course.sections.courses.number+": "+course.sections.courses.title}
				 key={course.id}
				 location = {course.location}
				 >
					{course.sections.courses.description} 
					<b>{timePrinter(course.start_time)} -{timePrinter(course.end_time)} </b> 
				</CourseCard>
				)
		})
		return(
			<ul id="results">
				{courseNodes}
			</ul>
			)
	}
}

export class DropDownChoice extends React.Component{
	render(){
		return(
			<option value={this.props.data.value}>
			{this.props.data.text}
			</option>
		) 
	}
}

export class DropDown extends React.Component{
	constructor(props){
		super(props)
		this.handleChange = this.handleChange.bind(this)
	}
	handleChange(e){
		this.props.oC(e.target.value)
	}

	render(){
		var optionTags = this.props.data.map(function(choice){
			return (
				<DropDownChoice data={choice} key={choice.value}>
				</DropDownChoice>
				)
		})
		return(
			<select type="text"
					value={this.props.val.toString()}
					onChange={this.handleChange}
					className="ui">
			{optionTags}
			</select>)
	}
}

export class InputForm extends React.Component{
	constructor(props) {
	    super(props);
	}
 	render(){
		return(
			 <p className="prompt">Find me a lecture near&nbsp; 
				<DropDown data ={PlaceOptions} oC={this.props.handlePlaceChange} val = {this.props.place}/>
				 starting at&nbsp;
				<DropDown data ={TimeOptions} oC={this.props.handleTimeChange} val = {this.props.time}/>
			</p>
			)
	}
}

export class CourseCard extends React.Component{
	render(){
		return(
			<li>
			<div className="card">
				<h4 className="cardLeft">
				{this.props.title}
				</h4>
				<h4 className="cardRight">
				{this.props.location}
				</h4>
				</div>
				<br/>
				<p className='descT'>
				{this.props.children}
				</p>
			</li>
		)
	}
}
ReactDOM.render(
	<ResultsBox url="http://159.203.112.6:3000"/>,
	document.querySelector("#myApp")
);
