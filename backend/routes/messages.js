const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const sendMessage = require('../controllers/messageControllers')

const router = express.Router()

router.use(protect)

router.post('/', sendMessage )
// router.get('/:chatId', allMessages )

module.exports = router