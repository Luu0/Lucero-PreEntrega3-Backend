import { CartModel } from "../../models/cart.model.js";

class CartDao {
  async findCart() {
    return await CartModel.find();
  }

  async findById(_id) {
    return await CartModel.findById(_id);
  }

  async createCart(cart) {
    return await CartModel.create(cart);
  }

  async updateProducts(cid,cart){
    return await CartModel.findByIdAndUpdate(cid, cart)
  }
  
  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await CartModel.findById(cid);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const initialProductCount = cart.products.length;

      cart.products = cart.products.filter(p => !p._id.equals(pid));

      if (cart.products.length === initialProductCount) {
        throw new Error('Producto no encontrado en el carrito');
      }

      await cart.save();

      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export default new CartDao();