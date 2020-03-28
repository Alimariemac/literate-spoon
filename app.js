const express = require('express')
const app = express()
const port = 3000
var request = require('request');
const fetch = require('node-fetch')
const cors = require('cors')

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/colors/:hex/:mode/:count', async (request, response) => {
	var hex = request.params.hex
	var mode = request.params.mode
	var count = request.params.count
	var url = `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=${count}`

    const fetch_response = await fetch(url);
    const json = await fetch_response.json();
    response.json(json)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))