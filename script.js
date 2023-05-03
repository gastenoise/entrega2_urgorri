const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch (err) {
      console.log(`Error leyendo archivo: ${err}`);
    }
  }

  saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data, 'utf-8');
    } catch (err) {
      console.log(`Error escribiendo archivo: ${err}`);
    }
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log('Todos los campos son requeridos');
      return;
    }

    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
      console.log('Producto con el mismo código ya existe');
      return;
    }

    const id = this.products.length + 1;
    const newProduct = { id, ...product };
    this.products.push(newProduct);
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      console.log('Producto no encontrado');
      return;
    }
    return product;
  }

  updateProduct(id, updatedProduct) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.log('Producto no encontrado');
      return;
    }

    const updatedFields = Object.keys(updatedProduct);
    updatedFields.forEach(field => {
      if (field !== 'id') {
        this.products[productIndex][field] = updatedProduct[field];
      }
    });

    this.saveProducts();
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.log('Producto no encontrado');
      return;
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();
  }
}