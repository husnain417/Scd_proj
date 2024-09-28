require('dotenv').config();
const Beneficiary = require('../models/beneficiary');
const Account = require('../models/account');
const User = require('../models/user'); 
const mongoose = require('mongoose');

const addBeneficiary = async (req, res) => {
    const { accountNumber } = req.body;
    const { id } = req.user;

    try {
        const user = await User.findById(id);
        const account = await Account.findOne({accountNumber: accountNumber , isdeleted: false});

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!account) {
            return res.status(400).json({ message: 'Account not found' });
        }

        const existingBeneficiary = await Beneficiary.findOne({ userId: id, beneficiaryAccountNumber: accountNumber, isdeleted: false });

        if (existingBeneficiary) {
            return res.status(400).json({ message: 'Beneficiary with this account number already exists' });
        }

        const { username: name, email } = await User.findById(account.userId);

        const newBeneficiary = new Beneficiary({
            userId: id,
            beneficiaryAccountNumber: accountNumber,
            name,
            email,
            bank: account.bank
        });

        await newBeneficiary.save();

        res.status(200).json({ message: 'Beneficiary added successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const getAllBeneficiaries = async (req, res) => {
    const { id } = req.user;
    try {
        const beneficiaries = await Beneficiary.find({ userId: id, isdeleted: false });

        const validBeneficiaries = await Promise.all(
            beneficiaries.map(async (beneficiary) => {
                const account = await Account.findOne({ accountNumber: beneficiary.beneficiaryAccountNumber, isdeleted: false });
                return account ? beneficiary : null;
            })
        );

        const filteredBeneficiaries = validBeneficiaries.filter(beneficiary => beneficiary !== null);

        if (filteredBeneficiaries.length === 0) {
            return res.status(404).json({ message: 'No valid beneficiaries found' });
        }

        res.status(200).json({ message: 'All valid beneficiaries:', beneficiaries: filteredBeneficiaries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteBeneficiary = async (req, res) => {
    const { accountNumber } = req.body;
    const { id } = req.user;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const beneficiary = await Beneficiary.findOne({ beneficiaryAccountNumber: accountNumber, userId: id, isdeleted: false });
        if (!beneficiary) {
            return res.status(400).json({ message: 'Beneficiary not found' });
        }

        beneficiary.isdeleted = true;
        await beneficiary.save();
        res.status(200).json({ message: `Beneficiary with account Num ${accountNumber} deleted successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateBeneficiary = async(req,res) => {
    const { id } = req.user;
    const { accountNumber, newName } = req.body;
    
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const beneficiary = await Beneficiary.findOne({ beneficiaryAccountNumber: accountNumber, userId: id , isdeleted: false});
        if (!beneficiary) {
            return res.status(400).json({ message: 'Beneficiary not found' });
        }

        beneficiary.name = newName;
        beneficiary.save();

        res.status(200).json({ message: `Beneficiary info updated` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const searchByName = async (req, res) => {
    const { name } = req.body;
    const { id } = req.user;

    if (!name) {
        return res.status(400).json({ message: 'Name is required in the request body' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const beneficiaries = await Beneficiary.find({
            userId: id,
            name: { $regex: name, $options: 'i' }, 
            isdeleted: false
        });

        const validBeneficiaries = await Promise.all(
            beneficiaries.map(async (beneficiary) => {
                const account = await Account.findOne({
                    accountNumber: beneficiary.beneficiaryAccountNumber,
                    isdeleted: false
                });
                return account ? beneficiary : null;
            })
        );

        const filteredBeneficiaries = validBeneficiaries.filter(beneficiary => beneficiary !== null);

        const names = filteredBeneficiaries.map(beneficiary => beneficiary.name);

        res.status(200).json({
            message: `Matching beneficiaries with name containing '${name}':`,
            result: names
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


  const getAccountIdByAccountNum = async (req, res) => {
    const { accountNumber , bank } = req.body; 
    const {id} = req.user;
    try {
      if (!accountNumber || !bank) {
        return res.status(400).json({ message: 'account Number or Bank is required' });
      }

      const receiver = await Beneficiary.findOne({userId: id, beneficiaryAccountNumber: accountNumber, bank: bank , isdeleted: false});

      if (!receiver) {
        return res.status(400).json({ message: 'Beneficiary not found' });
      }
  
      const Accounts = await Account.findOne({ accountNumber: receiver.beneficiaryAccountNumber });
      if (!Accounts) {
        return res.status(400).json({ message: 'Account not found' });
      }
  
      res.status(200).json({Accountid: Accounts._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  


module.exports = {addBeneficiary, 
                  getAllBeneficiaries, 
                  deleteBeneficiary, 
                  updateBeneficiary, 
                  searchByName, 
                  getAccountIdByAccountNum};