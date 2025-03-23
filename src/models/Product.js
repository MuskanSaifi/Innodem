import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    name: { type: String },
    price: { type: Number },
    currency: { type: String, default: "INR" },
    minimumOrderQuantity: { type: Number },
    moqUnit: { type: String, default:"Number" },
    images: [{ url: String }],  
    video: { type: String },
    youtubeUrl: { type: String },
    description: { type: String },
    stock: { type: Number, default: 0 },
    state: {type: String},
    city: {type: String},
    cityimage: {type: String},
    country: {type: String},
   
    // for admin
     // ✅ Tags with default value false
  tags: {
    trending: { type: Boolean, default: false },
    upcoming: { type: Boolean, default: false },
    diwaliOffer: { type: Boolean, default: false },
    holiOffer: { type: Boolean, default: false }
  },

    // ✅ Trade Information
    tradeInformation: {
      supplyAbility: { type: String },
      deliveryTime: { type: String },
      fobPort: { type: String },
      samplePolicy: { type: String },
      sampleAvailable: { type: String, enum: ["Yes", "No", null], default: null },
      mainExportMarkets: { type: [String] },
      certifications: { type: String },
      packagingDetails: { type: String },
      paymentTerms: { type: String },
      mainDomesticMarket: { type: String },
    },

    // ✅ Specifications
    specifications: {
      productType: { type: String },
      material: { type: String },
      finish: { type: String },
      thicknessTolerance: { type: String },
      thicknessToleranceUnit: { type: String },
      width: { type: String },
      widthUnit: { type: String },
      length: { type: String },
      lengthUnit: { type: String },
      weight: { type: String },
      weightUnit: { type: String },
      metalsType: { type: [String], default: [] },
      widthTolerance: { type: String },
      widthToleranceUnit: { type: String },
      shape: { type: String },
      size: { type: String },
      productName: { type: String },
      thickness: { type: String },
      thicknessUnit: { type: String },
      color: { type: String },
      coating: { type: String },
      woodType: { type: String },
      usage: { type: String },
      processorType: { type: String },
      type: { type: String },
      design: { type: String },
      feature: { type: String },
      metalType: { type: String },
      application: { type: String },
      finishing: { type: String },
      origin: { type: String }, // ✅ Added from UI
      finishType: { type: String }, // ✅ Added from UI
      installationType: { type: String }, // ✅ Added from UI
      otherMaterial: { type: String }, // ✅ Added from UI
      coverMaterial: { type: String }, // ✅ Added from UI
      foldable: { type: Boolean, default: false }, // ✅ Checkbox field (Yes/No)
    },
    
    // ✅ Trade Shopping Details
    tradeShopping: {
      brandName: { type: String },
      gst: { type: Number, enum: [0, 5, 12, 18, 28, null], default: null },
      sellingPriceType: { type: String, enum: ["Fixed", "Slab Based", null], default: null },
      fixedSellingPrice: { type: Number }, // Only for "Fixed Selling Price"
      slabPricing: [
        {
          minQuantity: { type: Number },
          maxQuantity: { type: Number },
          price: { type: Number },
        },
      ], // Only for "Slab Based" pricing
      unit: { type: String },
      packSize: { type: Number },
      minOrderedPacks: { type: Number },
      isReturnable: { type: String, enum: ["Yes", "No", null], default: null},
      stockQuantity: { type: Number },
      weightPerUnit: { type: Number },
      weightUnit: { type: String },
      shippingType: {
        type: String,
        enum: ["Free", "Flat Rate", "% of Order Value", "Actual", null],
        default: null,
      },
      packageDimensions: {
        length: { type: Number, default: null }, // Change from 0 to null
        width: { type: Number, default: null },
        height: { type: Number, default: null },
        unit: { type: String, default: "cm" },
    },
    },
    
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", productSchema);
