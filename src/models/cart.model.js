import mongoose, { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [
            {
                product: { type: Schema.Types.ObjectId, ref: 'products'},
                quantity: { type: Number},
            },
        ],
}, { versionKey: false })

cartSchema.plugin(mongoosePaginate);

export const cartModel = model("cart", cartSchema);