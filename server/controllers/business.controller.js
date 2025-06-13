import Business from "../models/Business.model.js";
import User from "../models/User.model.js";

// Create business profile
export const createBusiness = async (req, res) => {
  try {
    const { name, contact, settings } = req.body;
    
    if (!name || !contact?.email) {
      return res.status(400).json({ 
        message: "Name and contact email are required" 
      });
    }

    const business = await Business.create({
      name,
      contact,
      settings,
      owner: req.user._id
    });
    
    // Link business to user
    req.user.business = business._id;
    await req.user.save();
    
    res.status(201).json(business);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error creating business: " + err.message 
    });
  }
};

// Get business profile
export const getBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user._id })
      .populate("owner", "username email");
      
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    
    res.json(business);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error getting business: " + err.message 
    });
  }
};

// Update business settings
export const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findOneAndUpdate(
      { owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    
    res.json(business);
  } catch (err) {
    res.status(500).json({ 
      message: "Server error updating business: " + err.message 
    });
  }
};