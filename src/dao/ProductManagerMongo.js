import { ProductModel } from "./models/Product.model.js";
import { JSONify } from "../utils.js";

class ProductManager {
  async addProduct(prod) {
    if (
      prod.code &&
      prod.title &&
      prod.description &&
      prod.price &&
      prod.thumbnail &&
      prod.stock
    ) {
      try {
        await ProductModel.create(prod);
      } catch (error) {
        return "El código de producto ya existe.";
      }
      return "Producto agregado.";
    } else {
      return "Datos del producto incompletos.";
    }
  }

  async getProductById(id) {
    let prod;
    try {
      prod = await ProductModel.findById(id);
    } catch (error) {
      prod = 0;
    }

    return prod;
  }

  async getProducts(limit = 10, page = 1, sort = null, query) {
    let queryJSON;

    if (query) {
      queryJSON = JSONify(query);
    }

    query ? (queryJSON = JSON.parse(queryJSON)) : (queryJSON = {});

    let productPagination;

    try {
      productPagination = await ProductModel.paginate(queryJSON, {
        limit: limit,
        page: page,
        sort: sort && { price: sort, _id: 1 },
        lean: true,
      });
    } catch (error) {
      return error.message;
    }

    if (page > productPagination.totalPages || page < 1 || isNaN(page)) {
      return 0;
    }

    let response = {
      status: "success",
      payload: productPagination.docs,
      totalPages: productPagination.totalPages,
      prevPage: productPagination.prevPage,
      nextPage: productPagination.nextPage,
      page: productPagination.page,
      hasPrevPage: productPagination.hasPrevPage,
      hasNextPage: productPagination.hasNextPage,
      linkOptions: { limit, sort, query },
    };

    return response;
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock }
  ) {
    let message;
    try {
      message = await ProductModel.updateOne(
        { _id: id },
        { title, description, price, thumbnail, code, stock }
      );
    } catch (error) {
      message = 0;
    }

    return message
      ? "Se actualizó el producto"
      : "Producto no encontrado o código repetido";
  }

  async deleteProduct(id) {
    try {
      await ProductModel.deleteOne({ _id: id });
    } catch (error) {
      return "Producto no encontrado";
    }
    return "Producto eliminado";
  }
}

export default ProductManager;
