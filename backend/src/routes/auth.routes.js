const express = require('express');
const router = express.Router();
const { 
  registerFamily, 
  registerLawyer, 
  login, 
  logout 
} = require('../controllers/auth.controller');

router.post('/register/family', registerFamily);
router.post('/register/lawyer', registerLawyer);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
