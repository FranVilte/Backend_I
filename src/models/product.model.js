import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: { type: String },
    description: { type: String },
    code: { type: String },
    price: { type: Number },
    status: { type: Boolean },
    stock: { type: Number },
    category: { type: String },
    thumbnails: {
        type: [String],
        default: []
    },
}, { versionKey: false })

productSchema.plugin(mongoosePaginate);

export const productModel = model("products", productSchema);