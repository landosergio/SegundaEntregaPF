import { Router } from "express";
import CartsManager from "../dao/CartsManagerMongo.js";

const cartsRouter = Router();
const manager = new CartsManager();

cartsRouter.post("/", async (req, res) => {
  let message = await manager.addCart(req.body);
  res.send(message);
});

cartsRouter.get("/:cid", async (req, res) => {
  let cart = await manager.getCartById(req.params.cid);
  res.send(cart?.products || "No existe el carrito");
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
  let message = await manager.addProductToCart(req.params.cid, req.params.pid);
  res.send(message);
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  let message = await manager.deleteProductFromCart(
    req.params.cid,
    req.params.pid
  );
  res.send(message);
});

cartsRouter.put("/:cid", async (req, res) => {
  let message = await manager.updateCart(req.params.cid, req.body);

  res.send(message);
});
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  let message = await manager.updateProductQuantity(
    req.params.cid,
    req.params.pid,
    req.body.quantity
  );

  res.send(message);
});

cartsRouter.delete("/:cid", async (req, res) => {
  let message = await manager.emptyCart(req.params.cid);
  res.send(message);
});

export default cartsRouter;
