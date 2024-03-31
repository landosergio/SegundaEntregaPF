import { Router } from "express";
import ProductManager from "../dao/ProductManagerMongo.js";
import CartsManager from "../dao/CartsManagerMongo.js";

const viewsRouter = Router();
const pManager = new ProductManager();
const cManager = new CartsManager();

viewsRouter.get("/products", async (req, res) => {
  let { limit, page, sort, query } = req.query;

  let response = await pManager.getProducts(limit, page, sort, query);

  (response.prevLink =
    response.hasPrevPage &&
    `http://localhost:8080/products/?limit=${response.linkOptions.limit}${
      (response.linkOptions.query && `&query=${response.linkOptions.query}`) ||
      ""
    }${
      response.linkOptions.sort ? "&sort=" + response.linkOptions.sort : ""
    }&page=${response.prevPage}`),
    (response.nextLink =
      response.hasNextPage &&
      `http://localhost:8080/products/?limit=${response.linkOptions.limit}${
        (response.linkOptions.query &&
          `&query=${response.linkOptions.query}`) ||
        ""
      }${
        response.linkOptions.sort ? "&sort=" + response.linkOptions.sort : ""
      }&page=${response.nextPage}`);

  delete response.linkOptions;

  res.render("home", { response });
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  let cart = await cManager.getCartById(req.params.cid);
  console.log(cart);

  if (!cart) {
    return res.send("No existe el carrito");
  }

  res.render("cart", { cart });
});

viewsRouter.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts");
});

export default viewsRouter;
