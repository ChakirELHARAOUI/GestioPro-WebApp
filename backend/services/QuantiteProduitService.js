const db = require('../database/index');
const Product = db.Product;

exports.createProduct = async (productData) => {
  try {
    const product = await Product.create(productData);
    return product;
  } catch (error) {
    console.error('Error creating Product:', error);
    throw error;
  }
};

exports.getAllProducts = async () => {
  try {
    const products = await Product.findAll();
    return products;
  } catch (error) {
    console.error('Error fetching Products:', error);
    throw error;
  }
};

exports.getProductById = async (id) => {
  try {
    const product = await Product.findByPk(id);
    return product;
  } catch (error) {
    console.error('Error fetching Product by ID:', error);
    throw error;
  }
};

exports.updateProduct = async (id, updateData) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await product.update(updateData);
    return product;
  } catch (error) {
    console.error('Error updating Product:', error);
    throw error;
  }
};

exports.deleteProduct = async (id) => {
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await product.destroy();
    return { message: 'Product deleted successfully' };
  } catch (error) {
    console.error('Error deleting Product:', error);
    throw error;
  }
};
