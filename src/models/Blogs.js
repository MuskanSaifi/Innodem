import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Technology', 'Health', 'Business', 'Education', 'Lifestyle', 'Other'],
    default: 'Other',
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String, // URL to the blog image
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: String,
      comment: String,
      date: { type: Date, default: Date.now },
    },
  ],
});


const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;  // Default export