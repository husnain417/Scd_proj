require('dotenv').config();
const Account = require('../models/account');
const User = require('../models/user'); 
const Transaction = require('../models/transaction'); 


const createAccount = async (req, res) => {
    try {
      const { name, accountType,accountNumber, bankName } = req.body; 
      const { id } = req.user;
  
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(400).json({ message: 'Invalid Username' });
      }

      const accNumAlreadyExists = await Account.findOne({ accountNumber });
      if (accNumAlreadyExists) {
        return res.status(400).json({ message: `Account with number ${accountNumber} already exists` });
      }
  
      const newAccount = new Account({ userId: user._id, accountHolder: name, accountNumber,accountType, bank: bankName });
      await newAccount.save();
  
      res.status(200).json({ message: 'Account created successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  const getAllAccountsbyId = async(req,res)=>
  {
      const {id} = req.user;

      try {
        const accounts = await Account.find({ userId: id , isdeleted: false});
    
        res.status(200).json({ accounts });
      } catch (err) {
        console.log(err); 
        res.status(500).json({ message: 'Server error' }); 
      }
  }


  const depositMoney = async(req,res) => 
  {
      const {accountNumber, amount} = req.body;
      const { id } = req.user;

      try {
        const account = await Account.findOne({accountNumber : accountNumber , userId: id, isdeleted: false});
    
        if (!account) {
          return res.status(400).json({ message: 'Account not found' });
        }

        if(parseFloat(amount) <= 0)
        {
          return res.status(400).json({message: "Amount has to be greater than zero"});
        }

        const numericBalance = parseFloat(account.balance);
        const numericAmount = parseFloat(amount);

        account.balance = numericAmount + numericBalance;

        const newTransaction = new Transaction({accountId: account._id,
                                                accountNumber,
                                                bank: account.bank,
                                                amount,
                                                status: 'completed',
                                                transactionType: 'deposit'});

        await newTransaction.save();
        await account.save();

        res.status(200).json({message: "Money deposited successfully"});
      }
      catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
      }
  }

  const withdrawMoney = async(req,res) => 
  {
    const {accountNumber, amount} = req.body;
    const { id } = req.user;

    try {
      const account = await Account.findOne({accountNumber : accountNumber , userId: id, isdeleted: false});

      if (!account) {
        return res.status(400).json({ message: 'Account not found' });
      }

      const accountBalance = parseFloat(account.balance);
      const transactionAmount = parseFloat(amount);

      if(amount <= 0)
      {
        return res.status(400).json({message: "Amount has to be greater than zero"});
      }

      if(transactionAmount > accountBalance)
      {
        return res.status(400).json({message: "Insufficient amount in account"});
      }

      account.balance = accountBalance - transactionAmount;

      const newTransaction = new Transaction({accountId: account._id,
                                              accountNumber,
                                              bank: account.bank,
                                              amount,
                                              status: 'completed',
                                              transactionType: 'withdrawal'});
      await newTransaction.save();
      await account.save();

      res.status(200).json({message: "Money withdrawal successfull"});
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  }

  const closeAccount = async(req,res)=>
  {
    const {accountNumber} = req.body;
    const {id} = req.user;

    try{
        const account = await Account.findOne({accountNumber: accountNumber , userId: id, isdeleted: false});

        if (!account) {
            return res.status(400).json({ message: 'Account not found' });
          }

          if(account.balance != 0)
          {
            return res.status(400).json({message: 'Account must be empty before closing'})
          }

          account.isdeleted = true;
          await account.save();
          res.status(200).json({message: 'Account closed successfully'})
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
      }
  };

  const getAccountDetails = async(req,res)=>
  {
    const {accountNumber} = req.body;
    const {id} = req.user;

    try{
      const account = await Account.find({accountNumber: accountNumber , userId: id , isdeleted: false});

          if (!account) {
            return res.status(400).json({ message: 'Account not found' });
          }

         res.status(200).json({account})
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
      }
}

const getBalance = async (req, res) => {
    const { accountNumber } = req.body;
    const { id } = req.user;
  
    try {
      const account = await Account.findOne({accountNumber: accountNumber , userId: id , isdeleted: false});
  
      if (!account) {
        return res.status(400).json({ message: 'Account not found' });
      }
  
      res.status(200).json({balance: account.balance });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const moneyTransfer = async(req,res) => {

    const{senderAccountNum, receiverbank ,receiverAccountNum,amount} = req.body;
    const{id} = req.user;

    try {
      const senderAccount = await Account.findOne({accountNumber: senderAccountNum , userId: id , isdeleted: false});
        const receiverAccount = await Account.findOne({accountNumber: receiverAccountNum, bank: receiverbank , isdeleted: false});
    
        if (!senderAccount) {
          return res.status(400).json({ message: 'Invalid sender account' });
        }
        if (!receiverAccount) {
            return res.status(400).json({ message: 'Invalid receiver account' });
          }

          const numericSenderBalance = parseFloat(senderAccount.balance);
          const numericRecieverBalance = parseFloat(receiverAccount.balance);
          const numericAmount = parseFloat(amount);
  
        if(numericSenderBalance < numericAmount)
        {
            return res.status(400).json({message: 'Insufficient money in account'})
        }

        senderAccount.balance = numericSenderBalance - numericAmount;
        receiverAccount.balance = numericRecieverBalance + numericAmount ;

        const newTransaction = new Transaction({
          senderAccountId: senderAccount._id,
          senderAccountNumber: senderAccount.accountNumber,
          receiverAccountId: receiverAccount._id,
          receiverAccountNumber: receiverAccount.accountNumber,
          senderBank: senderAccount.bank,
          receiverBank: receiverAccount.bank,
          amount,
          status: 'completed',
          transactionType: 'transfer'
        });
        
        await newTransaction.save();
        await senderAccount.save();
        await receiverAccount.save();

        res.status(200).json({message: "money tranfered successfully"});

      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
      }
  };

  const getAccountIdByAccountNum = async (req, res) => {
    const { accountNumber , bank } = req.body; 
    try {
      if (!accountNumber || !bank) {
        return res.status(400).json({ message: 'account Number and Bank is required' });
      }
  
      const account = await Account.findOne({ accountNumber: accountNumber, bank: bank , isdeleted: false });
      if (!account) {
        return res.status(400).json({ message: 'Account not found' });
      }
  
      res.status(200).json({Accountid: account._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
    
module.exports = { 
                createAccount, 
                getAllAccountsbyId, 
                depositMoney, 
                withdrawMoney, 
                closeAccount, 
                getAccountDetails, 
                getBalance, 
                moneyTransfer, 
                getAccountIdByAccountNum
              };
