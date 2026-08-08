const mongoose = require('mongoose');


const linkSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: String, required: true },
            variantId: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            productName: { type: String, default: '' },
            variantName: { type: String, default: '' },
            price: { type: String, default: '' },
            linePrice: { type: String, default: '' },
            sku: { type: String, default: '' },
            vendor: { type: String, default: '' },
            image: { type: String, default: '' },
            productUrl: { type: String, default: '' },
            handle: { type: String, default: '' },
            productType: { type: String, default: '' },
            tags: { type: String, default: '' },
            properties: { type: mongoose.Schema.Types.Mixed, default: {} },
            variation: { type: mongoose.Schema.Types.Mixed, default: [] }
        }
    ],
}, { timestamps: true, strict: false });

linkSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

module.exports = mongoose.model('Cart', linkSchema);

