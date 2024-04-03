import { CartModel } from "./models/Cart.model.js";

class CartsManager {
  async addCart(cart) {
    try {
      await CartModel.create(cart);
    } catch (error) {
      console.log(error);
    }
    return "Se creó el carrito";
  }

  async getCartById(id) {
    let cart;
    try {
      cart = await CartModel.findById(id).populate("products.product").lean();
    } catch (error) {
      console.log(error);
    }
    return cart;
  }

  async addProductToCart(cId, pId) {
    let prodInCart = await CartModel.find({
      $and: [{ _id: cId }, { "products.product": pId }],
    });

    if (prodInCart[0]) {
      try {
        await CartModel.updateOne(
          { _id: cId },
          { $inc: { "products.$[p].quantity": 1 } },
          { arrayFilters: [{ "p.product": pId }] }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      let prodForCart = { product: pId, quantity: 1 };
      try {
        await CartModel.updateOne(
          { _id: cId },
          { $push: { products: prodForCart } }
        );
      } catch (error) {
        console.log(error);
      }
    }

    return "Producto agregado al carrito";
  }

  async deleteProductFromCart(cId, pId) {
    try {
      await CartModel.updateOne(
        { _id: cId },
        { $pull: { products: { product: pId } } }
      );
      return "Producto eliminado";
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateCart(cId, newProducts) {
    try {
      await CartModel.updateOne(
        { _id: cId },
        { $set: { products: newProducts } }
      );
      return "Carrito actualizado";
    } catch (error) {
      return error.message;
    }
  }

  async updateProductQuantity(cId, pId, newQuantity) {
    // El formato para enviar la cantidad es {"quantity" : cantidad}
    try {
      await CartModel.updateOne(
        { _id: cId },
        { $set: { "products.$[p].quantity": newQuantity } },
        { arrayFilters: [{ "p.product": pId }] }
      );
      return "Cantidad actualizada";
    } catch (error) {
      console.log(error);
    }
  }

  async emptyCart(cId) {
    return this.updateCart(cId, []);
  }
}

export default CartsManager;
