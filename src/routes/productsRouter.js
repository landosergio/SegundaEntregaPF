import { Router } from "express";
import ProductManager from "../dao/ProductManagerMongo.js";

const productsRouter = Router();
const manager = new ProductManager();

productsRouter.get("/", async (req, res) => {
  let { limit, page, sort, query } = req.query;

  let response = await manager.getProducts(limit, page, sort, query);

  if (response) {
    (response.prevLink =
      response.hasPrevPage &&
      `http://localhost:8080/api/products/?limit=${response.linkOptions.limit}${
        (response.linkOptions.query &&
          `&query=${response.linkOptions.query}`) ||
        ""
      }${
        response.linkOptions.sort ? "&sort=" + response.linkOptions.sort : ""
      }&page=${response.prevPage}`),
      (response.nextLink =
        response.hasNextPage &&
        `http://localhost:8080/api/products/?limit=${
          response.linkOptions.limit
        }${
          (response.linkOptions.query &&
            `&query=${response.linkOptions.query}`) ||
          ""
        }${
          response.linkOptions.sort ? "&sort=" + response.linkOptions.sort : ""
        }&page=${response.nextPage}`);

    delete response.linkOptions;

    res.send(response);
  } else {
    res.send("No existe la página");
  }
});

productsRouter.get("/:pid", async (req, res) => {
  let product = await manager.getProductById(req.params.pid);

  res.send(product || "El producto no existe");
});

productsRouter.post("/", async (req, res) => {
  let newProd = req.body;
  newProd.status = true;

  let message = await manager.addProduct(newProd);
  let products = await manager.getProducts();

  req.socketServer.emit("realTimeProducts", products);
  res.send(message);
});

productsRouter.put("/:pid", async (req, res) => {
  let message = await manager.updateProduct(req.params.pid, req.body);
  res.send(message);
});

productsRouter.delete("/:pid", async (req, res) => {
  let message = await manager.deleteProduct(req.params.pid);
  let products = await manager.getProducts();

  req.socketServer.emit("realTimeProducts", products);

  res.send(message);
});

export default productsRouter;
