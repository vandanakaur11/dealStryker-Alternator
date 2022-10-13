module.exports = async(req, res) => { 

    let email = req.params.email;

    if(!req.params.email) { // check if there is no email in request
        return res.sendStatus(422).json({err: "Email is required."});
    }

    let userInfo = await User.find({email: email}).limit(1);

    if (userInfo[0] == "") {
        return res.sendStatus(422).json({err: "Email is not valid."});

    } else { // email is valid

        // need to send all users associated with same email
        // search has to be dynamic and not rely on them being a specefic role within dealership
        // get user Dealership Name and then search for all users associated with it.
        let dealershipName = userInfo[0].dealershipName;

        let dealerAssociates = await User.find({dealershipName});

        let team = [];
        
        
        for (let i = 0; i < dealerAssociates.length; i++) {

            // should add a filter for people who are already in the chat as well as not the user who is making the request

            team.push({ name: dealerAssociates[i].name ,
                id: dealerAssociates[i]._id
            })
           
          }

          res.send(team);

    }



}
