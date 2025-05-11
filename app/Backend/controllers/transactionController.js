require('dotenv').config();
const Account = require('../models/account');
const Transaction = require('../models/transaction'); 
const ExcelJS = require('exceljs');


const getTransactionsByAccountNumber = async (req, res) => {
    const { accountNumber } = req.body;
    const { id } = req.user;
  
    try {
      const account = await Account.findOne({accountNumber: accountNumber, userId: id ,isdeleted: false});
  
      if (!account) {
        return res.status(400).json({ message: 'Invalid account' });
      }
  
      const transactions = await Transaction.find({
        $or: [
          {accountId: account._id},
          { senderAccountId: account._id },
          { receiverAccountId: account._id }
        ]
      });
  
      res.status(200).json({message:`Transactions for account Num : ${accountNumber}`, transactions });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  const getAllTransactionByUserId = async (req, res) => {
    const { id } = req.user;

    try {
        const accounts = await Account.find({ userId: id , isdeleted:false});
        const accountIds = accounts.map(account => account._id);

        const allTransactions = await Transaction.aggregate([
            {
                $match: {
                    $or: [
                        { accountId: { $in: accountIds } },
                        { senderAccountId: { $in: accountIds } },
                        { receiverAccountId: { $in: accountIds } }
                    ]
                }
            },
            {
              $sort: { createdAt: -1 }  
            }
        ]);

        res.status(200).json({ message: "All transactions:", transactions: allTransactions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

  const getAllTransactionHistory = async (req, res) => {
    try {
      const transactions = await Transaction.find({});
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Transactions');
  
      worksheet.columns = [
        { header: 'Account Number', key: 'accountNumber', width: 20 },
        { header: 'Bank', key: 'bank', width: 15 },
        { header: 'Transaction Type', key: 'transactionType', width: 20 },
        { header: 'Sender Account Number', key: 'senderAccountNumber', width: 25 },
        { header: 'Sender Bank', key: 'senderBank', width: 25 },
        { header: 'Receiver Account Number', key: 'receiverAccountNumber', width: 25 },
        { header: 'Receiver Bank', key: 'receiverBank', width: 25 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
      ];
  
      transactions.forEach(transaction => 
      {
        let amount = transaction.amount.$numberDecimal || transaction.amount; 
        amount = parseFloat(amount);
        const formattedAmount = isNaN(amount) ? '0.0' : amount.toFixed(2);
  
        worksheet.addRow({
          accountNumber: transaction.accountNumber,
          senderAccountNumber: transaction.transactionType === 'transfer' ? transaction.senderAccountNumber : '-',
          senderBank: transaction.transactionType === 'transfer' ? transaction.senderBank : '-',
          receiverAccountNumber: transaction.transactionType === 'transfer' ? transaction.receiverAccountNumber : '-',
          receiverBank: transaction.transactionType === 'transfer' ? transaction.receiverBank : '-',
          bank: transaction.bank,
          amount: formattedAmount, 
          status: transaction.status,
          transactionType: transaction.transactionType
        });
      });
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=transaction_history.xlsx');
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error('Error generating xlsx file', err);
      res.status(500).send('Server error');
    }
  };

  const getAllTransactionByUserIddownload = async (req, res) => {
    const { id } = req.user;
  
    try {
      const accounts = await Account.find({ userId: id, isdeleted: false });
      const accountIds = accounts.map((account) => account._id);
  
      const allTransactions = await Transaction.aggregate([
        {
          $match: {
            $or: [
              { accountId: { $in: accountIds } },
              { senderAccountId: { $in: accountIds } },
              { receiverAccountId: { $in: accountIds } }
            ]
          }
        },
        {
          $sort: { createdAt: -1 }  
        }
      ]);
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('User Transactions');
  
      worksheet.columns = [
        { header: 'Account Number', key: 'accountNumber', width: 20 },
        { header: 'Bank', key: 'bank', width: 15 },
        { header: 'Transaction Type', key: 'transactionType', width: 20 },
        { header: 'Sender Account Number', key: 'senderAccountNumber', width: 25 },
        { header: 'Sender Bank', key: 'senderBank', width: 25 },
        { header: 'Receiver Account Number', key: 'receiverAccountNumber', width: 25 },
        { header: 'Receiver Bank', key: 'receiverBank', width: 25 },
        { header: 'Amount', key: 'amount', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
      ];
  
      allTransactions.forEach(transaction => {
        let amount = transaction.amount.$numberDecimal || transaction.amount;
        amount = parseFloat(amount);
        const formattedAmount = isNaN(amount) ? '0.0' : amount.toFixed(2);
  
        worksheet.addRow({
          accountNumber: transaction.accountNumber,
          senderAccountNumber: transaction.transactionType === 'transfer' ? transaction.senderAccountNumber : '-',
          senderBank: transaction.transactionType === 'transfer' ? transaction.senderBank : '-',
          receiverAccountNumber: transaction.transactionType === 'transfer' ? transaction.receiverAccountNumber : '-',
          receiverBank: transaction.transactionType === 'transfer' ? transaction.receiverBank : '-',
          bank: transaction.bank,
          amount: formattedAmount,
          status: transaction.status,
          transactionType: transaction.transactionType
        });
      });
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=user_transactions.xlsx');
  
      await workbook.xlsx.write(res);
      res.end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = {getAllTransactionByUserId , getAllTransactionHistory , getTransactionsByAccountNumber, getAllTransactionByUserIddownload};