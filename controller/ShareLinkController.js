const Link = require('../model/LinkModel');

async function shareLink(req, res) {
    try {
        const { items } = req.body;
        const newCart = new Link({ items });
        const savedCart = await newCart.save();
        res.status(201).json({ linkId: savedCart._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }   
}

module.exports = { shareLink };