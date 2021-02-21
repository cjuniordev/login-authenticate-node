const bcrypt = require('bcrypt');
const modelUser = require('../models/user.model');
const hashPassword = require('../utils/hashPassword');

let userController = {};

// => Esse método identifica se o 'user' existe na base de dados
userController.userExists = async (user) => {
    return modelUser.findOne({ where: { username: user, }});
}

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
                        let encryptPassword;
                        try{
                            bcrypt.hash(req.body.password, 10)
                                .then(hash => {
                                    encryptPassword = hash;

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
                                    res.status(500).json({ sucess: false, message: 'Error on encryptation' + err });
                                });
                        }
                        catch(err){
                            res.status(500).json({ sucess: false, message: 'Error on sign up.', error: err });
                        }

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
        if(userController.userExists(req.params.username) != null){
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

// => Esse método é responsável por alterar os dados de um 'user'
userController.alterUser = async (req, res) => {
    modelUser.sync();
    try{
        if(userController.userExists(req.params.username) != null){
            let encryptPassword;
            try{
                encryptPassword = await hashPassword(req.body.password)
            }
            catch{
                res.status(500).json({ sucess: false, message: err });
            }
            
            await modelUser.update({ 
                username: req.body.username,
                password: encryptPassword,
                email: req.body.email,
            },
            { where: { username: req.params.username }});
            res.status(200).json({ sucess: true, message: 'User altered with sucess' });
        }
        else{
            res.status(404).json({ sucess: true, message: 'User not exists or not found on database' });
        }
    }
    catch(err){
        console.log(err)
        res.status(409).json({ sucess: false, error: err });
    }
}

module.exports = userController;