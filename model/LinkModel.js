const mongoose = require('mongoose');


const linkSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: String, required: true },
            variantId: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
}, { timestamps: true });

linkSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

module.exports = mongoose.model('Cart', linkSchema);