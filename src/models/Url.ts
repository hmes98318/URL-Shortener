import { Schema, model } from 'mongoose';

const UrlSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    }
});

export default model('Url', UrlSchema);