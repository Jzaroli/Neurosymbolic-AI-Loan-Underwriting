import { Schema, model } from 'mongoose';
// Company Schema
const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    vendor: {
        type: Boolean,
        required: true,
    },
    buyer: {
        type: Boolean,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    zip: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    primaryContact: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    revenue: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    useCase: {
        type: String,
        required: true
    },
    designPartner: {
        type: Boolean,
        required: true
    },
    funFact: {
        type: String,
        required: false
    },
    linkedin: {
        type: String,
        required: false
    },
    totalMeetings: {
        type: Number,
        required: false
    },
    feedbackScore: {
        type: Number,
        required: false
    },
    tokens: {
        type: Number,
        required: false
    },
}, 
// set this to use virtual below
{
    toJSON: {
        virtuals: true,
    },
});
const Company = model('Company', companySchema);
export default Company;
