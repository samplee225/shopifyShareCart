const Link = require('../model/LinkModel');

async function shareLink(req, res) {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Items are required' });
        }

        // Normalize each item so all product info is stored,
        // even if the frontend sends title/name instead.
        const normalizedItems = items.map(item => ({
            productId: item.productId || item.product_id || '',
            variantId: item.variantId || item.variant_id || item.id || '',
            quantity: Number(item.quantity) || 1,
            productName: item.productName || item.product_name || item.title || item.name || '',
            variantName: item.variantName || item.variant_title || item.variant_name || '',
            price: item.price || '',
            linePrice: item.linePrice || item.line_price || '',
            sku: item.sku || '',
            vendor: item.vendor || '',
            image: item.image || '',
            productUrl: item.productUrl || item.product_url || item.url || '',
            handle: item.handle || '',
            productType: item.productType || item.product_type || '',
            tags: item.tags || '',
            properties: item.properties || {},
            variation: item.variation || item.options_with_values || item.options || []
        }));

        const newCart = new Link({ items: normalizedItems });
        const savedCart = await newCart.save();
        res.status(201).json({ linkId: savedCart._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }   
}

module.exports = { shareLink };

