import { Schema, model } from 'mongoose';
import { randomUUID } from 'crypto';

// Chat Schema
const chatSchema = new Schema({
    id: {
        type: String,
        default: () => randomUUID(),
    },
   
    content: {
        type: String,
        required: true,
    },
    
});

// User Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: [
       chatSchema
    ],
   
});

// Create the models

const User = model('User', userSchema);

export { User };
