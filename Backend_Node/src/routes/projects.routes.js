const router = require('express').Router();
const ctrlProjects = require('../controllers/projects.ctrl');
const auth = require('../lib/authentitacion');

// users

router.use(auth.verifyUserToken);

router.get('/projects',ctrlProjects.getProjects);

router.get('/projects/:id',ctrlProjects.getProject);

router.post('/new/activitie',ctrlProjects.newActivitie);

// leaders && admins

router.use(auth.verifyLeaderToken);

router.post('/new/project',ctrlProjects.newProject);

router.delete('/projects/:id',ctrlProjects.deleteProject);

router.post('/new/phase',ctrlProjects.newPhase);

router.put('/projects/phase/:id_act',ctrlProjects.updateActivitie);

router.get('/projects/search/user',ctrlProjects.searchUser);

router.put('/projects/:id',ctrlProjects.addUser);

router.delete('/projects/:id/:member',ctrlProjects.deleteUser);

module.exports=router;