// import model
import Product from "../models/product.model.js"

/**
 * 
 * @desc Create a product 
 *
* Create One
*/
export const createProduct = async (req, res) => {
    const {
      name,
      sku,
      barcodes,
      quantity,
      price,
      category,
      photoUrl,
      threshold,
    } = req.body;
   try {
    if (!name || !sku || price == null || quantity == null) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const product = await Product.create({
      name,
      sku: sku.toLowerCase(),
      barcodes: barcodes || undefined,
      quantity,
      threshold: threshold ?? 5,
      price,
      category: category || 'General1',
      photoUrl: photoUrl || undefined,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Add product error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get all products
 */
export const getProducts = async (req, res) => {
  const { category } = req.query;
  try {
    const query = category ? { category } : {};
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get a single product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Update a product
 */
export const updateProduct = async (req, res) => {
  const {
    name,
    sku,
    barcodes,
    quantity,
    price,
    category,
    photoUrl,
    threshold,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (name !== undefined) product.name = name;
    if (sku !== undefined) product.sku = sku.toLowerCase();
    if (barcodes !== undefined) product.barcodes = barcodes || undefined;
    if (category !== undefined) product.category = category;
    if (photoUrl !== undefined) product.photoUrl = photoUrl;
    if (quantity !== undefined) product.quantity = quantity;
    if (price !== undefined) product.price = price;
    if (threshold !== undefined) product.threshold = threshold;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete a product
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};