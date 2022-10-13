const axios = require('axios');

const url = "http://localhost:5000"


axios.get(url + '/list-channels/bradley@dealstryker.com').then(function (response) {
    console.log(response);
}).catch(function (error) {
    console.log(error);
});
