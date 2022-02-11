const Project = require("../models/project.model");
const Phase = require("../models/phase.model");
const Activitie = require("../models/activitie.model");
const User = require('../models/user.model');
const sendRes = require("../lib/sendRes");
const ctrlProjects = {};

ctrlProjects.getProjects = async (req, res) => {
  const { id, rol } = req.query;
  if (!rol) {
    return sendRes(res, 400, false, "Not rol providen");
  };
  let data = [];
  if (rol === "admin") {
    data = await Project.find();
  } else if (rol === "lider") {
    data = await Project.find({ leader: id });
  } else if (rol === "user") {
    data = await Project.find({ members: id });
  } else {
    return sendRes(res, 400, false, "Invalid Rol");
  };
  res.json(data);
};

ctrlProjects.getProject = async (req, res) => {
  const proj = await Project.findById(req.params.id);
  if(!proj){
    return res.json(null);
  };
  Project.findById(req.params.id, (err, project) => {
    Phase.populate(project, { path: "phases" }, (err, fullProject) => {
      Activitie.populate(fullProject.phases, { path: "activities" }, (err, act) => {
        User.populate(fullProject, { path: "leader", select: { name: 1, email: 1, rol: 1 } }, (err, leader) => {
          User.populate(fullProject, { path: "members", select: { name: 1, email: 1, rol: 1 } }, (err, members) => {
            res.json(fullProject);
          });
        });
      });
    });
  });
};

ctrlProjects.newProject = async (req, res) => {
  const { leader, name, desc, startDate, endDate } = req.body;
  const userFound = await User.findById(leader);
  if (!userFound) {
    return sendRes(res, 400, false, "User not found");
  };
  const project = new Project({ leader, name, desc, startDate, endDate });
  await project.save();
  console.log(project);
  sendRes(res, 200, true, "Proyect created");
};

ctrlProjects.deleteProject = async (req, res) => {
  const project = await Project.findOneAndDelete({ _id: req.params.id });
  if (!project) {
    return sendRes(res, 400, false, "Proyect not found");
  };
  sendRes(res, 200, true, "Project deleted");
};

ctrlProjects.newPhase = async (req, res) => {
  const { project, name } = req.body;
  const proFound = await Project.findById(project);
  if (!proFound) {
    return sendRes(res, 400, false, "Proyect not found");
  };
  const phase = new Phase({ name });
  await phase.save((err) => {
    if (err) {
      return sendRes(res, 400, false, "Invalid data");
    };
  });
  const projPhases = proFound.phases;
  projPhases.push(phase._id);
  await Project.findByIdAndUpdate(project, { phases: projPhases });
  sendRes(res, 200, true, "Phases added");
};

ctrlProjects.newActivitie = async (req, res) => {
  const { phase, name, state, startDate, endDate } = req.body;
  const phaFound = await Phase.findById(phase);
  if (!phaFound) {
    return sendRes(res, 400, false, "Phase not found");
  };
  const activitie = new Activitie({ name, state, startDate, endDate });
  await activitie.save((err) => {
    if (err) {
      return sendRes(res, 400, false, "Invalid data");
    };
  });
  const phaAct = phaFound.activities;
  phaAct.push(activitie._id);
  await Phase.findByIdAndUpdate(phase, { activities: phaAct });
  sendRes(res, 200, true, "activities added");
};

ctrlProjects.searchUser = async (req, res) => {
  const { name } = req.query;
  const emails = await User.find({ email: { $regex: name, $options: 'i' }, rol: "user" }, { name: 1, email: 1, rol: 1 }).limit(5);
  res.json(emails);
};

ctrlProjects.addUser = async (req, res) => {
  const { id_user } = req.body;
  const id_project = req.params.id;
  const userFound = await User.findById(id_user);
  if (!userFound) {
    return sendRes(res, 400, false, "User NO Found");
  };
  const projectFound = await Project.findById(id_project);
  if (!projectFound) {
    return sendRes(res, 400, false, "Project NO Found");
  };
  const miembros = projectFound.members;
  miembros.push(id_user);
  await Project.findByIdAndUpdate(id_project, { members: miembros });
  sendRes(res, 200, true, "Usser added");
};

ctrlProjects.deleteUser = async (req, res) => {
  const { id, member } = req.params;
  const proFound = await Project.findById(id);
  if (!proFound) {
    return sendRes(res, 400, false, 'Project not found');
  };
  const miembros = proFound.members.filter((mem) => mem !== member);
  await Project.findByIdAndUpdate(id, { members: miembros });
  sendRes(res, 200, true, 'User deleted');
};

ctrlProjects.updateActivitie = async (req, res) => {
  const { id_act } = req.params;
  const { id_project, id_phase, state, hours } = req.body;
  const project = await Project.findById(id_project, { hours: 1 });
  if (!project) {
    return sendRes(res, 400, false, 'Proyect not found');
  };
  if (state) {
    await Activitie.findByIdAndUpdate(id_act, { state });
  };
  if (hours) {
    await Activitie.findByIdAndUpdate(id_act, { hours });
    const phase = await Phase.findById(id_phase, { hours: 1 });
    const hoursPhase = parseInt(phase.hours) + 1;
    await Phase.findByIdAndUpdate(id_phase, { hours: hoursPhase });
    const hoursProject = parseInt(project.hours) + 1;
    await Project.findByIdAndUpdate(id_project, { hours: hoursProject });
  };
  sendRes(res, 200, true, 'Activitie updated');
}

module.exports = ctrlProjects;