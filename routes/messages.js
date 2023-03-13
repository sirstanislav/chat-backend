const router = require('express').Router();

const { getAllMessage, createMessage } = require('../controllers/message');
const { postMessage } = require('../utils/messageValidation');

router.get('/messages', getAllMessage);

router.post('/messages', postMessage, createMessage);

module.exports = router;
