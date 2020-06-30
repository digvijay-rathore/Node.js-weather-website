const request = require("request");

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.aerisapi.com/forecasts/' + latitude + "," + longitude + '?&format=json&filter=24hr&limit=7&client_id=ifut4hxNBjNfwexyjIiHj&client_secret=x9HrwKga1c7FtGhXWvNSuTaDmEF6TjWaVClnge57';

    request({url, json : true}, (error, { body }) => {
        if(error){
            callback("Unable to connect to weather services!", undefined);
        }else if(body.error){
            callback(body.error.description, undefined);
        }else{
            callback(undefined, body.response[0].periods[0].weatherPrimary + ". It is currently " + body.response[0].periods[0].tempC + " degrees out."/* + "There is " + data.body.response[0].periods[0].pop + "% chance of rain."*/);
        }
    });
}

module.exports = forecast;