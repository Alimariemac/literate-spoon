// import colors from './colorVue.js'

let url = "http://www.colr.org/json/color/ffba13"
var data;
var colorArray = []
var cityArray= []
var latMult = 45.5
var longMult = 22.75


var north = $("#north")
var east =$("#east")

$("#verticalChoices .btn").click(toggles)
$("#horizontalChoices .btn").click(toggles)
//deal with toggles
function toggles(){
	$(this).addClass('active').siblings().removeClass('active')
}

//check if positive or negative
function posCheck(a){	
	if(a.parents(".btn").hasClass('active')){
		return "+"
	}
	return "-"
}

//remove char before 
function removeChar(c){
	var ex = new RegExp(/[-#+]/);
	if(ex.test(c.charAt(0))){
		return (c.substring(1))
	}
	console.log(c)
	return(c)	
}


//create color scheme

function getColorScheme(){
	//highest lat and long = 4095
	//multiply 90 by 45.4
	//multiply 180 by 22.75
	var lat = removeChar($('#lat').val())
	var long = removeChar($('#long').val())
	var latHex = d2h(lat,latMult)
	var longHex = d2h(long,longMult)
	var picker = `#${latHex}${longHex}`

	const myApp =  $('#list')
	var splitPicker = picker.split("#")
	var mode = $("#mode").val()
	var count = $("#count").val()

	var settings = {
		"url": `http://127.0.0.1:3000/colors/${splitPicker[1]}/${mode}/${count}`,
		"method": "GET",
		"headers": {"Access-Control-Allow-Origin": "*"},
		"timeout": 0,
	};	

	$.ajax(settings).done(function (response) {
	  console.log(response);
	  var colors = response.colors;
	  for (var i = 0; i < colors.length; i++){
		let color = colors[i].hex.value;
		let name = colors[i].name.value;
		let contrast = colors[i].contrast.value;
		let index = {name: name, color: color, contrast:contrast};
		colorArray.unshift(index)
	  }
	  myApp.show()

	  getColors(colorArray,picker)

	});

}

//decimal to hexcode
function d2h(l,m){
	var lAsInt = parseInt(l*m)
	var lAsHex = lAsInt.toString(16);
		while(lAsHex.length < 3){
			lAsHex = "0" + lAsHex
		}
	var lShort = lAsHex.slice(0,3)
	return (lShort)
}

//hexcode to decimal
function h2d(hex, num, dir,m){
	let hexSlice = ""
	if(num > 0){
		hexSlice = hex.slice(0,num)
	}
	else{
		hexSlice = hex.slice(num)
	}
	var l = parseInt(hexSlice,16)/m
	var lFront = posCheck(dir)
	console.log(`${lFront}${l}`)
	return(`${lFront}${l}`)

}

//get city closest to lat long function
function getCity(){
	
	const myCities= $('#cities')
	var reverseHexcode = removeChar($("#hexcode").val())
	
	var latAnswer=h2d(reverseHexcode,3,north,latMult)
	var longAnswer=h2d(reverseHexcode,-3,east,longMult)

	toDecimal = `this is the lat ${latAnswer} , this is the long ${longAnswer} this is reverseHexcode ${reverseHexcode}`
	console.log(toDecimal)

	var settings = {
		"url": `http://geodb-free-service.wirefreethought.com/v1/geo/locations/${latAnswer}${longAnswer}/nearbyCities?limit=5&offset=0&radius=100000`,
		"method": "GET",
		"headers": {"Access-Control-Allow-Origin": "*"},
		"timeout": 0,
	};
	$.ajax(settings).done(function (response) {
	  console.log(response.data);
	  var cities = response.data
	  for(var i =0; i< cities.length; i++)
	  {	
		  let city = cities[i].city
		  let country = cities[i].country
		  let lat2 = cities[i].latitude
		  let long2 = cities[i].longitude
		  let index = {city: city, country: country, lat:lat2, long:long2};
		  cityArray.unshift(index)
	  }
	  myCities.show()
	  getCities(cityArray,reverseHexcode, latAnswer,longAnswer)

	});
}


function getCities(cityArray, reverseHexcode, lat, long){
	new Vue({
		el:"#cities",
		data(){
			return{componentKey:0,cities:cityArray}
		}
	}),
	new Vue({
		el:"#hexColor",
		data(){
			return{color:`#${reverseHexcode}`, lat:lat, long:long}
		}
	})
}

function getColors(colorArray,picker){
	console.log(colorArray);
	console.log(picker)

	new Vue({
		el:"#mainColor",
		data:{color:picker}
	}),

	new Vue({
	el:"#list",
	data(){
		return {componentKey:0, colors: colorArray};

	}
	})

}




