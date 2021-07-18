const { json } = require("express");
var express = require("express");
var router = express.Router();
const customerSchema = require("../models/customerSchema");
const invoiceSchema = require("../models/invoiceSchema");
const mailer = require("../helpers/mailer");

// route to render the list of invoice
router.get("/", async (req, res) => {
  try {
    let data = await invoiceSchema.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "invoice_customer",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          item: 1,
          duedate: 1,
          amount: 1,
          paid: 1,
          status: 1,
          invoice_customer: 1,
          name: "$user.name",
        },
      },
    ]);
    res.render("invoice/allInvoice", { data: data });
  } catch (err) {
    res.render("invoice/allInvoice", {
      errorMessage:
        "There is Some Error in displaying the Customer Information",
    });
  }
});

//route to render the add invoice page
router.get("/addInvoice", async function (req, res) {
  const customer = await customerSchema.find({});
  res.render("invoice/addInvoice", {
    customer: customer,
    invoice: new invoiceSchema(),
  });
});

//router to add the invoice data
router.post("/addInvoice", async (req, res) => {
  const invoice = new invoiceSchema({
    item: req.body.item,
    duedate: req.body.duedate,
    notes: req.body.notes,
    amount: req.body.amount,
    paid: req.body.paid,
    status: req.body.status,
    invoice_customer: req.body.invoice_customer,
  });
  try {
    const newInvoice = await invoice.save();
    res.redirect("/invoice");
  } catch (err) {
    res.render("invoice/addInvoice", {
      invoice: invoice,
      errorMessage:
        "Your Data is Not saved. There is Some Error. Try Again Please!",
    });
  }
});

//router to render the edit page of invoice
router.get("/editInvoice/:userId", async (req, res) => {
  try {
    let invoice = await invoiceSchema.findOne({ _id: req.params.userId });
    const customer = await customerSchema.find({});
    res.render("invoice/editInvoice", {
      invoice: invoice,
      customer: customer,
    });
  } catch (err) {
    res.render("invoice/editInvoice", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//router to edit the invoice data
router.post("/editInvoice", async (req, res) => {
  try {
    await invoiceSchema.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body }
    );
    res.redirect("/invoice");
  } catch (err) {
    res.render("invoice/editInvoice", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//route to delete the invoice data
router.get("/deleteInvoice/:userId", async (req, res) => {
  try {
    await invoiceSchema.findOneAndDelete({ _id: req.params.userId });
    res.redirect("/invoice");
  } catch (err) {
    res.render("invoice/allInvoice", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//route to display the paid invoices
router.get("/paidInvoice", async (req, res) => {
  try {
    let data = await invoiceSchema.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "invoice_customer",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          item: 1,
          duedate: 1,
          amount: 1,
          paid: 1,
          status: 1,
          invoice_customer: 1,
          name: "$user.name",
        },
      },
    ]);
    res.render("invoice/paidInvoice", { data: data });
  } catch (err) {
    res.render("invoice/allInvoice", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//route to display the late invoices
router.get("/lateInvoice", async (req, res) => {
  try {
    let data = await invoiceSchema.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "invoice_customer",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          item: 1,
          duedate: 1,
          amount: 1,
          paid: 1,
          status: 1,
          invoice_customer: 1,
          name: "$user.name",
        },
      },
    ]);
    res.render("invoice/lateInvoice", { data: data });
  } catch (err) {
    res.render("invoice/allInvoice", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//route to show the invoice
router.get("/showInvoice/:userId", async (req, res) => {
  try {
    const invoice = await invoiceSchema.findOne({ _id: req.params.userId });
    const customer = await customerSchema.findOne({
      _id: invoice.invoice_customer,
    });
    res.render("invoice/invoice-single", {
      invoice: invoice,
      customer: customer,
    });
  } catch (err) {
    res.render("invoice/allInvoice", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//router to send the email with the invoice
router.get("/sendInvoice/:userId", async (req, res) => {
  try {
    const invoice = await invoiceSchema.findOne({ _id: req.params.userId });
    const customer = await customerSchema.findOne({
      _id: invoice.invoice_customer,
    });
    await mailer(
      customer.email,
      "Invoice of your Item",
      `This is the Invoice sent from the Simple Invoice`,
      `
      <div>
                <div>
                    <h1>Invoice from Simple Invoice</h1>
                </div>
                <div style="text-align: right;">
                    <p class="muted" style="color: #999999;">Issued on ${invoice.date}
                    </p>
                </div>
            </div>
            <div class="pure-g">
                <div>
                    <h3>Company</h3>
                    <p>
                        <strong>Simple Invoice</strong><br>
                        Sample Address<br>
                        Sample Address
                    </p>
                </div>
                <div style="text-align: right;">
                    <h3>Billed to</h3>
                    <p>
                        <strong>
                             ${customer.name}
                        </strong><br>
                         ${customer.contact}<br>
                             ${customer.address}<br>
        
                    </p>
                </div>
            </div>
            <table align="center" id="table" style="border:1px solid black;width: 70%;">
                <thead style="color: #b3b3b3;">
                    <tr style="margin:10px;border:1px solid black;">
                        <th>Item</th>
                        <th>notes</th>
                        <th style="text-align: right;">Amount</th>
                        <th style="text-align: right;">Paid Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border:1px solid black;">
                        <td style="text-align: center;">
                             ${invoice.item} 
                        </td>
                        <td style="text-align: center;">
                             ${invoice.notes}
                        </td>
                        <td style="text-align: right;">₹ ${invoice.amount}
                        </td>
                        <td style="text-align: right;">₹ ${invoice.paid}
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td style="text-align: right;">Subtotal:</td>
                        <td style="text-align: right;">₹ ${invoice.paid}
                        </td>
                    </tr>
                    <tr class="bold" style="font-weight: bold;">
                        <td></td>
                        <td></td>
                        <td style="text-align: right;">Total:</td>
                        <td class="text-right" style="text-align: right;">₹ ${invoice.paid}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>And the Due date is ${invoice.duedate} <br>
                  You have to pay before the due date. If you have paid the amount just ignored it.
            </p><br>
            <div align="center">
                <p>Thank you for your business!</p>
            </div><br>
            `
    );
    res.redirect("/invoice");
  } catch (err) {
    res.render("invoice/allInvoice", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

module.exports = router;
