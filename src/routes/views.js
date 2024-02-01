import { Router } from "express";
import productDao from "../daos/dbManager/product.dao.js";
const router = Router();

router.get("/",(req,res)=>{
  res.render("home.hbs")
});

router.get("/products", async (req,res) => {
  const { limit, page, query, sort } = req.query;
  const products = await productDao.findProducts(limit, page, query, sort);

  const userData = req.session.user;
  const welcomeMessage = 'Bienvenido';

  res.render("products.hbs", { products, user: userData, welcomeMessage }, (err, html) => {
      if (err) {
          throw err
      }
    res.send(html)
  })
})

router.get("/chat",(req,res)=>{
  res.render("chat.hbs");
});

export default router