const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  duedate: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  paid: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  invoice_customer: {
    type: require("mongoose").Types.ObjectId,
    ref: "customer",
  },
});

module.exports = mongoose.model("invoices", invoiceSchema);
