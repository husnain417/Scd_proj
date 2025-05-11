const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const { authenticateToken } = require('../middleware/middleware');

router.post('/beneficiary-add', authenticateToken, beneficiaryController.addBeneficiary);
router.get('/beneficiary-get', authenticateToken, beneficiaryController.getAllBeneficiaries);
router.post('/beneficiary-delete', authenticateToken, beneficiaryController.deleteBeneficiary);
router.post('/beneficiary-update', authenticateToken, beneficiaryController.updateBeneficiary);
router.post('/beneficiary-search', authenticateToken, beneficiaryController.searchByName);
router.post('/account-ids', authenticateToken, beneficiaryController.getAccountIdByAccountNum);

module.exports = router;