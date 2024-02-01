import { query } from "express";
import { postModel } from "../../models/product.model.js";

class ProductDao {
  async findProducts(limit = 10, page = 1, query, sort) {
    let consult = {}

    if (query != undefined){
        consult[query.split(":")[0]] = query.split(":")[1]
    }

    return await postModel.paginate(consult,{limit:limit,page:page,sort:sort == undefined ? {}: {price:Number(sort)}})
  }

  async createProduct(post) {
    return await postModel.create(post);
  }

  async updateProduct(_id, post) {
    return await postModel.findOneAndUpdate({ _id }, post);
  }

  async deleteProduct(_id) {
    return await postModel.findByIdAndDelete({ _id });
  }

  async getProductById(id){
    return await postModel.findById(id)
}
}

export default new ProductDao;