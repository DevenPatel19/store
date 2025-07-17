import Invoice from "../models/invoice.model.js";


// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("customer");
    console.log("Fetched invoices:", invoices);
    res.json(invoices);
  } catch (error) {
    console.error("Error in getAllInvoices:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get one invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate("customer");
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new invoice
export const createInvoice = async (req, res) => {
  const {
    invoiceNumber,
    customer,
    date,
    dueDate,
    items,
    subtotal,
    taxRate,
    tax,
    amount,
    notes,
    terms,
    status,
    paidDate,
  } = req.body;

  const invoice = new Invoice({
    invoiceNumber,
    customer,
    date,
    dueDate,
    items,
    subtotal,
    taxRate,
    tax,
    amount,
    notes,
    terms,
    status: status || "Unpaid",
    paidDate,
  });

  try {
    const newInvoice = await invoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update Invoice (patch-style)
export const updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.remove();
    res.json({ message: "Invoice deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendInvoice = async (req, res) => {
  try {
    const { customer, amount, status, paidDate } = req.body;

    if (!customer || amount === undefined) {
      return res.status(400).json({ message: "Customer and amount are required" });
    }

    const newInvoice = new Invoice({
      customer,
      amount,
      status: status || "Unpaid",
      paidDate,
    });

    const savedInvoice = await newInvoice.save();

    // TODO: Add email or notification logic here if needed

    res.status(201).json({
      message: "Invoice sent successfully",
      invoice: savedInvoice,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};