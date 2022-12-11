const express = require("express");
const axios = require('axios');
const crypto = require('crypto');

const app = express();

const API_KEY = "";
const API_SECRET = "";

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

const createCBRequest = (method, url) => {
  var timeInSeconds = parseInt((new Date()).getTime() / 1000);
  var sigString = timeInSeconds + `${method}${url}`

  var hmac = crypto.createHmac('sha256', API_SECRET);
  signature = hmac.update(sigString).digest('hex');

  const config = {
    method,
    url: `https://api.coinbase.com${url}`,
    headers: {
      'CB-ACCESS-KEY': API_KEY,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-TIMESTAMP': timeInSeconds
    }
  };

  return axios(config);
}

app.get("/", async (req, res) => {
  try {
    const response = await createCBRequest('GET', '/v2/user');
    res.send({ response: response?.data })
  } catch (e) {
    console.log("Could not get user", e.response.data)
  }
});

app.get("/account", async (req, res) => {
  try {
    const response = await createCBRequest('GET', '/v2/accounts/BTC');
    res.send({ response: response?.data })
  } catch (e) {
    console.log("Could not get account", e.response.data)
  }
});

var port = process.env.PORT || 3006;

app.listen(port, '0.0.0.0', function () {
  console.log("Server starting on localhost:" + port);
});
