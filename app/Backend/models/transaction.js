const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Decimal = mongoose.Schema.Types.Decimal128;

const transactionsSchema = new Schema(
  {
    accountId:{
      type: Schema.Types.ObjectId,
      required: function() {
        return this.transactionType === 'withdrawal' || this.transactionType === 'deposit';
      },     
      ref: 'Account'
    },

    accountNumber:{
      type: String,
      required: function() {
        return this.transactionType === 'withdrawal' || this.transactionType === 'deposit';
      },     
      ref: 'Account'
    },

    senderAccountId: { 
      type: Schema.Types.ObjectId,
      required: function() {
        return this.transactionType === 'transfer';
      },     
      ref: 'Account'
    },

    senderAccountNumber: { 
      type: String,
      required: function() {
        return this.transactionType === 'transfer';
      },     
      ref: 'Account'
    },

    receiverAccountId: {
      type: Schema.Types.ObjectId,
      required: function() {
        return this.transactionType === 'transfer';
      },
      ref: 'Account'
    },

    receiverAccountNumber: {
      type: String,
      required: function() {
        return this.transactionType === 'transfer';
      },
      ref: 'Account'
    },

    bank:{
      type: String,
      required: function() {
        return this.transactionType === 'withdrawal' || this.transactionType === 'deposit';
      },     
      ref: 'Account'
    },

    senderBank:{
      type: String,
      required: function() {
        return this.transactionType === 'transfer';
      },     
      ref: 'Account'
    },

    receiverBank:{
      type: String,
      required: function() {
        return this.transactionType === 'transfer';
      },     
      ref: 'Account'
    },

    amount: {
      type: Decimal,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    transactionType: {
      type: String,
      required: true,
      enum: ['deposit', 'withdrawal', 'transfer']
    },
    description: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionsSchema);
module.exports = Transaction;
