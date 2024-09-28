const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/middleware');

router.post('/transaction/id', authenticateToken, transactionController.getTransactionsByAccountNumber);
router.get('/transactions', authenticateToken, transactionController.getAllTransactionByUserId);
router.get('/transaction-history', transactionController.getAllTransactionHistory);
router.get('/transaction/id/download', authenticateToken,transactionController.getAllTransactionByUserIddownload);

module.exports = router;