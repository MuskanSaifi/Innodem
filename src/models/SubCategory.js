import mongoose from "mongoose";


const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String },
    subcategoryslug: { type: String },
    metatitle: { type: String },
    metadescription: { type: String },
    metakeyword: { type: String }, // 👈 Add this
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);


// ✅ Ensure model is not re-registered
const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subcategorySchema);
export default SubCategory;
