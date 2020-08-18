const express = require("express");
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.get('/practise', homeController.practise);
router.get('/profile', homeController.profile);

module.exports = router;