const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const Project = require("../models/project.model");
const sendRes = require('../lib/sendRes');
const auth = require('../lib/authentitacion');
const ctrlAuth = {};


ctrlAuth.login = async (req, res) => {
    const { email, pass } = req.body;
    const userFound = await UserModel.findOne({ email });
    if (!userFound) {
        return sendRes(res, 400, false, 'Invalid credentials');
    };
    const passHash = await bcrypt.compare(pass, userFound.pass);
    if (!passHash) {
        return sendRes(res, 400, false, 'Invalid credentials');
    };
    const token = await auth.genToken({ id: userFound._id, user: userFound.name, rol: userFound.rol }, req.app.get('secret_key'));
    sendRes(res, 200, true, 'User logged', token);
};

ctrlAuth.signup = async (req, res) => {
    const { name, email, pass, rol } = req.body;
    const passHash = await bcrypt.hash(pass, 12);
    const newUser = new UserModel({ name, email, pass: passHash, rol });
    await newUser.save(err => {
        if (err) {
            console.log(err.message)
            return sendRes(res, 400, false, 'Invalid credentials');
        };
        sendRes(res, 200, true, 'Usuario registrado');
    });
};

ctrlAuth.getUsers = async (req, res) => {
    const users = await UserModel.find();
    res.json(users);
};

ctrlAuth.deleteUser = async (req, res) => {
    const { id } = req.params;
    const { rol } = req.query;
    let userProjects = [];
    if (!id && !rol) {
        return sendRes(res, 400, false, 'Invalid data');
    };
    if (rol === "lider") {
        userProjects = await Project.find({ leader: id }, { _id: 1 });
        if (!userProjects) {
            return sendRes(res, 400, false, 'User not found');
        };
        userProjects.map(async projects => await Project.findByIdAndDelete(projects._id));
    } else if (rol === "user") {
        userProjects = await Project.find({ members: id }, { _id: 1, members: 1 });
        if (!userProjects) {
            return sendRes(res, 400, false, 'User not found');
        };
        userProjects.map(async projects => {
            const { members } = projects;
            const miembros = members.filter(mem => mem !== id);
            await Project.findByIdAndUpdate(projects._id, { members: miembros });
        });
    };
    const user = await UserModel.findOneAndDelete({ _id: req.params.id });
    if (!user) {
        return sendRes(res, 400, false, 'User not found');
    };
    sendRes(res, 200, true, 'User deleted');
};

module.exports = ctrlAuth;