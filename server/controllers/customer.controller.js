import Customer from "../models/Customer.model.js";

// Create new customer
export const createCustomer = async (req, res) => {
  try {
    // Temporarily disable business requirement
    // if (!req.user.business) {
    //   return res.status(400).json({ 
    //     message: "User is not associated with a business" 
    //   });
    // }
    
    const { name, contact } = req.body;
    
    if (!name || !contact?.email) {
      return res.status(400).json({ 
        message: "Name and contact email are required" 
      });
    }
    
    const customer = await Customer.create({
      ...req.body,
      // business: req.user.business
    });
    
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error creating customer: " + err.message 
    });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    // Temporarily disable business requirement
    // if (!req.user.business) {
    //   return res.status(400).json({ 
    //     message: "User is not associated with a business" 
    //   });
    // }
    
    // const customers = await Customer.find({ 
    //   business: req.user.business 
    // });
    const customers = await Customer.find(); // fetch all customers without business filter
    
    res.json(customers);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error getting customers: " + err.message 
    });
  }
};

// Get single customer
export const getCustomerById = async (req, res) => {
  try {
    // Temporarily disable business requirement
    // if (!req.user.business) {
    //   return res.status(400).json({ 
    //     message: "User is not associated with a business" 
    //   });
    // }
    
    // const customer = await Customer.findOne({
    //   _id: req.params.id,
    //   business: req.user.business
    // });
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json(customer);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error getting customer: " + err.message 
    });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    // Temporarily disable business requirement
    // if (!req.user.business) {
    //   return res.status(400).json({ 
    //     message: "User is not associated with a business" 
    //   });
    // }
    
    // const customer = await Customer.findOneAndUpdate(
    //   { _id: req.params.id, business: req.user.business },
    //   req.body,
    //   { new: true, runValidators: true }
    // );
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json(customer);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error updating customer: " + err.message 
    });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    // Temporarily disable business requirement
    // if (!req.user.business) {
    //   return res.status(400).json({ 
    //     message: "User is not associated with a business" 
    //   });
    // }
    
    // const customer = await Customer.findOneAndDelete({
    //   _id: req.params.id,
    //   business: req.user.business
    // });
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.json({ message: "Customer removed" });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error deleting customer: " + err.message 
    });
  }
};
