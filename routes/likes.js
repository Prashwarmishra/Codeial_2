const express = require('express');
const router = express.Router();

const likesSchema = require('../controllers/likes_controller');

router.post('/toggle', likesSchema.toggleLike);

module.exports = router;