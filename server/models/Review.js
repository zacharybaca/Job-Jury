import mongoose from 'mongoose';


const reviewSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    title: { type: String },
    body: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    salary: { type: Number },
    jobTitle: { type: String },
    isAnonymous: { type: Boolean, default: true },
}, { timestamps: true });

reviewSchema.post('findOne', function(doc, next) {
    if (doc) {
        if (doc.isAnonymous) {
            if (doc.author) {
                doc.author = { username: 'Anonymous User' };
            } else {
                doc.author = null;
            }
        }
    }
    next();
});

reviewSchema.post('find', function(docs, next) {
    docs.forEach(doc => {
        if (doc.isAnonymous) {
            if (doc.author) {
                doc.author = { username: 'Anonymous User' };
            } else {
                doc.author = null;
            }
        }
    });
    next();
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
