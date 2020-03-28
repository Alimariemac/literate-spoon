// import colors from './colorVue.js'

let url = "http://www.colr.org/json/color/ffba13"
var data;
var colorArray = []

//create color scheme

function getColorScheme(){
	//highest lat and long = 4095
	//multiply 90 by 45.4
	//multiply 180 by 22.75

	var latMult = 45.5
	var longMult = 22.75
	var lat = parseInt($('#lat').val())*latMult
	var long = parseInt($('#long').val())*longMult
	const myApp =  $('#list')
	var picker = d2h(lat,long)
	console.log(picker)
	// console.log(picker2)
	// show2Colors(picker,picker2)
	// console.log(`linear-gradient(${picker},${picker2})`)
	

//get color palette 

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

//get city closest to lat long function
function getCity(){
	var latMult = 45.5
	var longMult = 22.75
	var reverseHexcode = $("#hexcode").val()
	var hexBeg = reverseHexcode.slice(0,3)
	var hexEnd = reverseHexcode.slice(-3)
	var lat = parseInt(hexBeg,16)/latMult
	var long = parseInt(hexEnd,16)/longMult
	toDecimal = `this is the lat ${lat} , this is the long ${long} this is reverseHexcode ${reverseHexcode}`
	console.log(toDecimal)

	// var settings = {
	// 	"url": `http://geodb-free-service.wirefreethought.com/v1/geo/locations/40.744589-74.032514/nearbyCities?limit=5&offset=0&minPopulation=200000&radius=100'`,
	// 	"method": "GET",
	// 	"headers": {"Access-Control-Allow-Origin": "*"},
	// 	"timeout": 0,
	// };
	// $.ajax(settings).done(function (response) {
	//   console.log(response);


	// // });

	// });
}

function d2h(lat,long){
	var latAsHex = lat.toString(16);
	var longAsHex = long.toString(16)

		while(latAsHex.length < 3){
			latAsHex = "0" + latAsHex
		}

		while(longAsHex.length < 3){
			longAsHex = "0" + longAsHex
		}
	var latShort = latAsHex.slice(0,3)
	var longShort = longAsHex.slice(0,3)

	hexCode = `${latShort}${longShort}`
	console.log(long, longAsHex, longShort, lat, latAsHex, latShort)
	return ("#"+hexCode)

}

function show2Colors(picker, picker2){
	new Vue({
		el:"#mainColor",
		data:{
		gradient:`linear-gradient(${this.picker},${this.picker2})`
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




