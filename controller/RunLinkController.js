const Link = require('../model/LinkModel');

async function runLink(req, res) {
    try {
        const { linkId } = req.params;
        const cart = await Link.findById(linkId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = { runLink };