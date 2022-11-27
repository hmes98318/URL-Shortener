import { Schema, model } from 'mongoose';

const UrlSchema = new Schema({
    key: {
        type: String,
        required: true
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
});

export default model('Url', UrlSchema);