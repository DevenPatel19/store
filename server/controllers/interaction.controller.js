import Interaction from "../models/Interaction.model.js";

// Create new interaction
export const createInteraction = async (req, res) => {
  try {
    if (!req.user.business) {
      return res.status(400).json({ 
        message: "User is not associated with a business" 
      });
    }
    
    const { customer, type, title } = req.body;
    
    if (!customer || !type || !title) {
      return res.status(400).json({ 
        message: "Customer, type and title are required" 
      });
    }
    
    const interaction = await Interaction.create({
      ...req.body,
      user: req.user._id
    });
    
    res.status(201).json(interaction);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error creating interaction: " + err.message 
    });
  }
};

// Get interactions for a customer
export const getCustomerInteractions = async (req, res) => {
  try {
    const interactions = await Interaction.find({
      customer: req.params.customerId,
      user: req.user._id
    });
    
    res.json(interactions);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error getting interactions: " + err.message 
    });
  }
};

// Update interaction
export const updateInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findOneAndUpdate(
      { 
        _id: req.params.id, 
        user: req.user._id 
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" });
    }
    
    res.json(interaction);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error updating interaction: " + err.message 
    });
  }
};

// Delete interaction
export const deleteInteraction = async (req, res) => {
  try {
    const interaction = await Interaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" });
    }
    
    res.json({ message: "Interaction removed" });
  } catch (err) {
    res.status(500).json({ 
      message: "Server error deleting interaction: " + err.message 
    });
  }
};