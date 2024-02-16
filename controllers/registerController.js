const userDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async ( req, res ) => {
    const { user, pwd } = req.body;
    if(!user || !pwd) {
        return res.status(400).json({'message' : 'Username and password are required.'});
    }
    const duplicate = userDB.users.find(person => person.username === user);
    if(duplicate) return res.sendStatus(409); //conflict
    try{
        //encrypt the passwd
        const hashedpwd = await bcrypt.hash(pwd, 10); // 10 represents the salting 
        //store the new user
        const newUser = { "username" : user, "password": hashedpwd};
        userDB.setUsers([...userDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(userDB.users)
        );
        console.log(userDB.users);
        res.status(201).json({'message' : `New user ${user} created`});
    }catch(err){
        res.status(500).json({'message': err.message});
    }

}

module.exports = { handleNewUser };