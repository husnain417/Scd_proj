const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Decimal = mongoose.Schema.Types.Decimal128;

const accountsSchema = new Schema(
  {
    userId: 
    { 
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    accountHolder: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      enum: ['saving', 'bussiness', 'current'],
      required: true
    },
    balance: {
      type: Decimal,
      required: false,
      default: 0
    },
    bank: {
      type: String,
      required: true
    },
    isdeleted: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  { timestamps: true }
);

const Account = mongoose.model('Account', accountsSchema);
module.exports = Account;
