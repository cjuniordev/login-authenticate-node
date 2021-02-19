const bcrypt = require('bcrypt');
const modelUser = require('../models/user.model');

let userController = {};

// => Esse método lista todos 'users' registrados
userController.allUsers = async (req, res) => {
    modelUser.sync();
    let users = await modelUser.findAll();
    if (users === null) {
        res.status(404).json({ sucess: false, message: 'Not found!' })
    } else {
        res.status(200).json(users);
    }
}

// => Esse método cria novos 'users' no BD
// => Recebe os seguintes parametros:
// -- username = Nome Único(apelido) { STRING }
// -- password = Senha { STRING }
// -- password2 = Confirmação da Senha { STRING }
// -- email = Email válido { STRING }
// -- isAdmin = Permissão de Admin { BOOL }
userController.newUser = async (req, res) => {
    modelUser.sync();
    if(req.body.username && req.body.password){
        if(req.body.password2 && req.body.password == req.body.password2){
            
            modelUser.findOne({ where: { username: req.body.username }})
                .then(user => {
                    if(user){
                        res.json({ sucess: false, message: 'Invalid username' });
                    }
                    else{

                        bcrypt.hash(req.body.password, 10)
                            .then(hash => {
                                let encryptPassword = hash;

                                let newUser = new modelUser({
                                    username: req.body.username,
                                    password: encryptPassword,
                                    email: req.body.email,
                                    isAdmin: req.body.isAdmin
                                });

                                newUser.save()
                                    .then(() => {
                                        res.status(201).json({ sucess: true, message: 'User created with sucess' });
                                    })
                                    .catch(err => {
                                        res.status(500).json({ sucess: false, message: err });
                                    });
                            })
                            .catch(err => {
                                res.status(500).json({ sucess: false, message: err });
                            }) 
                }
            })
        }
        else{
            res.status(400).json({ sucess: false, message: 'Passwords dont match' });
        }
    }
    else{
        res.status(400).json({ sucess: false, message: 'Username and passwords fields are requireds' })
    }
}

// => Esse método deleta um 'user'
// => Recebe um 'user' (STRING) como parametro
userController.deleteUser = async (req, res) => {
    modelUser.sync();
    try{
        const userExists = modelUser.findOne({ where: { username: req.params.username, }});
        if(userExists != null){
            modelUser.destroy({ where: { username: req.params.username }});
            res.status(200).json({ sucess: true, message: 'User deleted with sucess' });
        }
        else{
            res.status(404).json({ sucess: true, message: 'User not exists or not found on database' });
        }
    }
    catch(err){
        res.status(409).json({ sucess: false, error: err });
    }
}

module.exports = userController;