import express from 'express';
import request from 'request-promise';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const API_KEY = process.env.API_KEY;

const baseUrl = `http://api.scraperapi.com?api_key=${API_KEY}&autoparse=true`;

// Schema

const ProductSchema = new mongoose.Schema({
    name: String,
    brand: String,
    product_information: [],
    pricing: String,
    shipping_price: String,
    availability_quantity: Number,
    availability_status: String,
    images: [],
    average_rating: String,
    small_description: String,
    full_description: String,
    feature_bullets: [],
    total_reviews: String,
    Colors: [{ asin: String, is_selected: Boolean, value: String, image: String}],
    Capacity: [{ asin: String, is_selected: Boolean, value: String, image: String}],
    Set: [{ asin: String, is_selected: Boolean, value: String, image: String}],
    Style: [{ asin: String, is_selected: Boolean, value: String, image: String}],
    CPU: [{ asin: String, is_selected: Boolean, value: String, image: String}]
}, {
    collection: "Laptop"
});

const Product = mongoose.model('Product', ProductSchema);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to Amazon Scraper API.');
});

// GET Product Details
app.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const response = await request(`${baseUrl}&url=https://www.amazon.com/dp/${productId}`);

        const data = JSON.parse(response)
        res.json(data);
        const newProduct = new Product({
            name: data.name,
            brand: data.brand,
            product_information: data.product_information,
            pricing: data.pricing,
            shipping_price: data.shipping_price,
            availability_quantity: data.availability_quantity,
            availability_status: data.availability_status,
            images: data.images,
            average_rating: data.average_rating,
            small_description: data.small_description,
            full_description: data.full_description,
            feature_bullets: data.feature_bullets,
            total_reviews: data.total_reviews,
            customization_options: data.customization_options,
            Colors: data.customization_options.Color,
            Capacity: data.customization_options.Capacity,
            memory_storage_Capacity: data.customization_options['Memory Storage Capacity'],
            Style: data.customization_options.Style,
            Size: data.customization_options.Size
        });
        newProduct.save();

    } catch (error) {
        res.json(error);
    }
});

try {
    mongoose.connect(MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
} catch (error) {
    console.log(error);
}