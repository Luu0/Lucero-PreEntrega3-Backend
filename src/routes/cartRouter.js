import { Router } from "express";
import cartDao from "../daos/dbManager/cart.dao.js";
import productDao from "../daos/dbManager/product.dao.js";

const router = Router();

router.get("/", async (req, res) => {
  try{
    const Carts = await cartDao.findCart();
    res.json({
      data: Carts,
      message: "Cart List"
    });
  }catch(error){
    res.json({
      error,
      message: "Error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const Cart = await cartDao.createCart(req.body);

    res.json({
      Cart,
      message: "Cart created",
    });
  } catch (error) {
    res.json({
      error,
      message: "Error",
    });
  }
});

// router.post("/:cid/products/:pid", async (req, res) => {
//   const { cid, pid } = req.params;
//   const { quantity } = req.body;

//   try {
//     const productAdded = await cartManager.addProductToCart(Number(cid), Number(pid), quantity);
//     if (productAdded) {
//       return res.status(201).json(productAdded);
//     } else {
//       return res.status(404).json({ message: "El carrito o el producto con los IDs especificados no existe" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error interno del servidor", error: error.message });
//   }
// });

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.findById(cid);

    if (!cart) return res.json({ message: "Cart not found" });

    res.json({
      cart,
      message: "Cart found",
    });
  } catch (error) {

    res.status(500).json({
      error: error.message,  
      message: "Error",
    });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({ message: "Invalid quantity format" });
    }

    let cart = await cartDao.findById(req.params.cid);

    cart.products.forEach((product) => {
      product.quantity += quantity;
    });

    const updatedCart = await cartDao.updateProducts(cart._id, cart);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});


router.put('/:cid/product/:pid', async (req, res) => {
  try {
    let cart = await cartDao.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const productIndex = cart.products.findIndex((p) => p._id.toString() === req.params.pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity = req.body.quantity;

      const updatedCart = await cartDao.updateProducts(cart._id, cart);

      return res.status(200).json(updatedCart);
    } else {
      return res.status(404).json({ error: "Product not found in Cart" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});


router.delete('/:cid', async (req,res)=>{
  try{
      let deleted = await cartDao.findById(req.params.cid)
      deleted.products = []
      let updatedCart = cartDao.updateProducts(req.params.cid,deleted)
      res.status(201).json(deleted.message)
  }
  catch(err){ res.status(500).json({error:err})}
  
})

router.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const result = await cartDao.deleteProductFromCart(cid, pid);
    res.json({
      result,
      message: "Product deleted"
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




export default router;

