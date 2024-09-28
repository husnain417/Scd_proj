const express = require('express');
const router = express.Router();
const AccountsController = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/middleware');

router.post('/accounts/create', authenticateToken, AccountsController.createAccount);
router.get('/accounts', authenticateToken, AccountsController.getAllAccountsbyId);
router.post('/deposit', authenticateToken, AccountsController.depositMoney);
router.post('/withdraw', authenticateToken, AccountsController.withdrawMoney);
router.post('/closing', authenticateToken, AccountsController.closeAccount);
router.post('/accounts/details', authenticateToken, AccountsController.getAccountDetails);
router.post('/account-balance', authenticateToken, AccountsController.getBalance);
router.post('/transfer', authenticateToken, AccountsController.moneyTransfer);
router.post('/receiver-accounts', authenticateToken, AccountsController.getAccountIdByAccountNum);


module.exports = router;
