const axios = require('axios');

const url = "http://localhost:5000"


axios.post(url + '/add-channel', {
    user: {
        offerId: '614a68efe7e05f0004940bc6',
        email: 'bradleyjhumble@gmail.com',
        name: "Jay"


    }
}).then(function (response) {
    console.log(response);
}).catch(function (error) {
    console.log(error);
});
