var express = require("express");
var router = express.Router();
var customerSchema = require("../models/customerSchema");

// route to render the list of customers
router.get("/", async (req, res) => {
  try {
    let data = await customerSchema.find();
    res.render("customer/allCustomer", { data: data });
  } catch (err) {
    res.render("customer/allCustomer", {
      errorMessage:
        "There is Some Error in displaying the Customer Information",
    });
  }
});

// route to render the add customer page
router.get("/addCustomer", (req, res) => {
  res.render("customer/addCustomer", { customer: new customerSchema() });
});

// route to add the customer data
router.post("/addCustomer", async (req, res) => {
  const customer = new customerSchema({
    name: req.body.name,
    address: req.body.address,
    email: req.body.email,
    contact: req.body.contact,
  });
  try {
    const newCustomer = await customer.save();
    res.redirect("/customer");
  } catch (err) {
    res.render("customer/addCustomer", {
      customer: customer,
      errorMessage:
        "Your Data is Not saved. There is Some Error. Try Again Please!",
    });
  }
});

//route to render the edit the customer details
router.get("/editCustomer/:userId", async (req, res) => {
  try {
    let customer = await customerSchema.findOne({ _id: req.params.userId });
    res.render("customer/editCustomer", { customer: customer });
  } catch (err) {
    res.render("/customer/editCustomer", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//route to save the edited customer details
router.post("/editCustomer", async (req, res) => {
  try {
    await customerSchema.findOneAndUpdate(
      { _id: req.body._id },
      { $set: req.body }
    );
    res.redirect("/customer");
  } catch (err) {
    res.render("customer/editCustomer", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

//route to delete the data
router.get("/deleteCustomer/:userId", async (req, res) => {
  try {
    await customerSchema.findOneAndDelete({ _id: req.params.userId });
    res.redirect("/customer");
  } catch (err) {
    res.render("customer/allCustomer", {
      errorMessage: "There is some Error here Please Try again",
    });
  }
});

module.exports = router;
