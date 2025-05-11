const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const beneficiarySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    beneficiaryAccountNumber: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
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

const Beneficiary = mongoose.models.Beneficiary || mongoose.model('Beneficiary', beneficiarySchema);
module.exports = Beneficiary;
