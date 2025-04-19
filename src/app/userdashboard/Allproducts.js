import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap"; // ✅ Import Bootstrap Modal
import LocationSelector from "./components/LocationSelector";
import Image from "next/image";


const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedField, setSelectedField] = useState("");

  const [formData, setFormData] = useState({
    basicDetails: {
      name: "",
      productslug:"",
      price: "",
      currency: "INR",
      minimumOrderQuantity: "",
      moqUnit: "Number",
      stock: "",
      state: "",
      city: "",
      images: [],
    },
    tradeIndiaShopping: "",
    description: "",
    specifications: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("User not authenticated");
          return;
        }
        const res = await axios.get(`/api/userprofile/manageproducts`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          toast.error(res.data.message || "No products found.");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

   fetchProducts();
  }, []);

  // ✅ Handle Delete Function
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("User not authenticated");
            return;
          }
          const res = await axios.delete(
            `/api/userprofile/manageproducts/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (res.data.success) {
            toast.success("Product deleted successfully!");
            setProducts((prev) => prev.filter((product) => product._id !== id));
          } else {
            toast.error(res.data.message || "Failed to delete product.");
          }
        } catch (error) {
          toast.error("Failed to delete product.");
        }
      }
    });
  };


  // ✅ Open Modal Function
  const openModal = (product, field) => {
    setSelectedProduct(product);
    setSelectedField(field);
    setFormData({
      basicDetails: {
        name: product.name || "",
        productslug: product.productslug || "",
        price: product.price || "",
        currency: product.currency || "INR",
        minimumOrderQuantity: product.minimumOrderQuantity || "",
        moqUnit: product.moqUnit || "Number",
        stock: product.stock || "",
        state: product.state || "",
        city: product.city || "",
      },
      description: product.description || "",
      specifications: { ...product.specifications },
      tradeShopping: { ...product.tradeShopping },
    });
    setShowModal(true);
  };
  

  
    // ✅ Handle Input Change
    const handleChange = (e) => {
      const { name, value } = e.target;
      const keys = name.split(".");
    
      setFormData((prevData) => {
        if (keys.length === 1) {
          return { ...prevData, [name]: value };
        } else {
          const [section, field] = keys;
          return {
            ...prevData,
            [section]: {
              ...prevData[section],
              [field]: value,
            },
          };
        }
      });
    };
    

    const handleUpdate = async () => {
      if (!selectedProduct) return;
    
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("User not authenticated");
          return;
        }
    
        // ✅ Merge with existing product data to prevent data loss
        const updateData = {
          ...selectedProduct, // Preserve all existing data
          productId: selectedProduct._id, // Keep Product ID
          images: formData.basicDetails.images, // ✅ Ensure images are sent in the request

        };
    
        if (selectedField === "basicDetails") {
          updateData.name = formData.basicDetails.name;
          updateData.productslug = formData.basicDetails.productslug;
          updateData.price = formData.basicDetails.price;
          updateData.currency = formData.basicDetails.currency;
          updateData.minimumOrderQuantity = formData.basicDetails.minimumOrderQuantity;
          updateData.moqUnit = formData.basicDetails.moqUnit;
          updateData.stock = formData.basicDetails.stock;
          updateData.state = formData.basicDetails.state;
          updateData.city = formData.basicDetails.city;
        } else if (selectedField === "description") {
          updateData.description = formData.description;
        } else if (selectedField === "specifications") {
          updateData.specifications = {
            ...selectedProduct.specifications,
            ...formData.specifications,
          };
        } else if (selectedField === "tradeShopping") {
          updateData.tradeShopping = {
            ...selectedProduct.tradeShopping,
            ...formData.tradeShopping,
            packageDimensions: {
              ...selectedProduct.tradeShopping?.packageDimensions,
              ...formData.tradeShopping?.packageDimensions,
            },
          };
        }
    
        // ✅ Send update request
        const res = await axios.patch(
          `/api/userprofile/manageproducts/${selectedProduct._id}`,
          updateData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
    
        if (res.data.success) {
          toast.success("Product updated successfully!");

          // ✅ Ensure the updated product is correctly reflected in the state
          setProducts((prev) =>
            prev.map((p) => (p._id === selectedProduct._id ? updateData : p))
          );
    
          setShowModal(false);
        } else {
          toast.error(res.data.message || "Failed to update product.");
        }
      } catch (error) {
        console.error("❌ Error updating product:", error);
        toast.error("Failed to update product.");
      }
    };
    
    const handleImageUpload = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 5) {
        toast.error("You can upload up to 5 images only.");
        return;
      }
    
      const uploadedImages = await Promise.all(files.map(convertToBase64));
    
      setFormData((prevData) => ({
        ...prevData,
        basicDetails: { ...prevData.basicDetails, images: uploadedImages }, // ✅ Update images
      }));
    };
    
    
    
    // ✅ Convert Image File to Base64
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(",")[1]; // Extract base64 part
          resolve(`data:image/jpeg;base64,${base64String}`); // Ensure proper format
        };
        reader.onerror = (error) => reject(error);
      });
    };
    
    
        // Function to determine badge color
      const getBadgeClass = (strength) => {
          switch (strength) {
              case "High":
                  return "bg-success"; // Green
              case "Medium":
                  return "bg-warning"; // Yellow
              case "Low":
                  return "bg-danger"; // Red
              default:
                  return "bg-secondary"; // Gray
          }
      };

// Function to calculate progress percentage based on filled fields
const calculateProgress = (product) => {
  let totalFields = 0;
  let completedFields = 0;

  const checkAndCount = (obj) => {
    if (!obj) return;
    Object.keys(obj).forEach((key) => {
      totalFields++;
      if (obj[key] !== null && obj[key] !== "" && obj[key] !== undefined) {
        completedFields++;
      }
    });
  };

  checkAndCount(product); // Main product fields
  checkAndCount(product.tradeInformation); // Trade Information
  checkAndCount(product.specifications); // Specifications
  checkAndCount(product.tradeShopping); // Trade Shopping
  if (product.images && product.images.length > 0) completedFields++; // Image check
  totalFields++; // Counting image field

  return totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
};
    
  return (
    <div className="container mt-4">
      {/* <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>{products.length} Products</h5>
        <button className="btn btn-primary">+ Add More Product</button>
      </div> */}

      {loading ? (
        <p className="text-center">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        products.map((product) => {

          // ✅ Fix: Ensure product.images exists and has data before converting
let productImage = product.image || "https://via.placeholder.com/100"; // Default Image

if (product.images && product.images.length > 0 && product.images[0].data) {
  try {
    productImage = `data:${product.images[0].contentType};base64,${Buffer.from(
      product.images[0].data
    ).toString("base64")}`;
  } catch (error) {
    console.error("Error decoding image:", error);
  }
}
          return (
            <div key={product._id} className="p-3 mb-3 bg-white all-pro-img rounded-3">
            <div className="d-flex flex-column flex-md-row align-items-start gap-3">              
              <Image
                src={productImage || "/default-image.jpg"}
                alt="Product"
                width={100}
                height={100}
                className="all-pro-img p-2"
                style={{ objectFit: "cover", borderRadius: "5px" }}
                unoptimized
              />
          
              <div className="w-100">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                  <h6 className="mb-1">{product.name}</h6>
                  <div className="d-flex flex-column text-start text-sm-end">
                    <span className="text-grey text-sm common-shad px-3 rounded-2 mb-1">
                      <b>Created At:</b> {product?.createdAt ? new Date(product.createdAt).toLocaleString("en-IN", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
                      }) : "null"}
                    </span>
                    <span className="text-grey text-sm common-shad px-3 rounded-2">
                      <b>Updated At:</b> {product?.updatedAt ? new Date(product.updatedAt).toLocaleString("en-IN", {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
                      }) : "null"}
                    </span>
                  </div>
                </div>
          
          
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
                  <strong>INR {product.price ? product.price.toFixed(2) : "N/A"}</strong>
                  <span className="text-muted text-sm">{product.minimumOrderQuantity || "N/A"} Min Order</span>
                </div>
          
                <div className="progress mt-2" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${calculateProgress(product)}%` }}
                  ></div>
                </div>
          
                <div className="d-flex justify-content-between mt-2 flex-column flex-sm-row gap-2">
                  <small className="text-muted">{Math.round(calculateProgress(product))}% Complete</small>
                  <span className={`badge ${getBadgeClass(product.strength)}`}>
                    {product.strength} Strength
                  </span>
                </div>
          
                <hr />
          
                <div className="mt-2 position-relative d-flex flex-wrap align-items-center gap-3">
                  <span className="text-primary text-sm" role="button" onClick={() => openModal(product, "basicDetails")}>
                    + Add Basic Details
                  </span>
                  <span className="text-primary text-sm" role="button" onClick={() => openModal(product, "description")}>
                    + Add Description
                  </span>
                  <span className="text-primary text-sm" role="button" onClick={() => openModal(product, "specifications")}>
                    + Add Specifications
                  </span>
                  <span className="text-primary text-sm" role="button" onClick={() => openModal(product, "tradeShopping")}>
                    + Add Trade Shopping
                  </span>
          
                  <FaTrash className="text-danger del-pro-btn" role="button" onClick={() => handleDelete(product._id)} />
                </div>
              </div>
            </div>
          </div>
          
          );
        })
      )}



            {/* ✅ Bootstrap Modal (Now works properly) */}
<Modal show={showModal} onHide={() => setShowModal(false)} centered
dialogClassName="custom-modal">
  <Modal.Header closeButton>
    <Modal.Title>Update {selectedField.replace(/([A-Z])/g, " $1")}</Modal.Title>
  </Modal.Header>
  <Modal.Body>


{/* Basic details */}
{selectedField === "basicDetails" && (
  <div>
    {/* Product Name */}
{/* Product Name */}
<div className="mb-3">
  <label className="form-label">Product Name</label>
  <input
    type="text"
    className="form-control"
    name="name"
    value={formData.basicDetails.name}
    onChange={(e) => {
      const name = e.target.value;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")      // remove invalid chars
        .trim()
        .replace(/\s+/g, "-");             // replace spaces with dashes

      setFormData({
        ...formData,
        basicDetails: {
          ...formData.basicDetails,
          name,
          productslug: slug,
        },
      });
    }}
  />
</div>

{/* Product Slug (Read-only or editable, your choice) */}
<div className="mb-3">
  <label className="form-label">Product Slug</label>
  <input
    type="text"
    className="form-control"
    name="productSlug"
    value={formData.basicDetails.productslug}
    readOnly 
    disabled
  />
</div>


    {/* Product Image  */}
    <div className="mb-3">
  <label className="form-label">Upload Images</label>
  <input
    type="file"
    className="form-control"
    multiple
    accept="image/*"
    onChange={handleImageUpload} // ✅ Add event handler
  />
</div>


    {/* Price */}
    <div className="mb-3">
      <label className="form-label">Price</label>
      <input
        type="number"
        className="form-control"
        name="price"
        value={formData.basicDetails.price}
        onChange={(e) =>
          setFormData({
            ...formData,
            basicDetails: { ...formData.basicDetails, price: e.target.value },
          })
        }
      />
    </div>

    {/* Currency Dropdown */}
    <div className="mb-3">
      <label className="form-label">Currency</label>
      <select
        className="form-control"
        name="currency"
        value={formData.basicDetails.currency}
        onChange={(e) =>
          setFormData({
            ...formData,
            basicDetails: { ...formData.basicDetails, currency: e.target.value },
          })
        }
      >
        <option value="INR">INR (₹)</option>
        <option value="USD">USD ($)</option>
        <option value="EUR">EUR (€)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>


    {/* Stock */}
    <div className="mb-3">
      <label className="form-label">Stock</label>
      <input
        type="number"
        className="form-control"
        name="stock"
        value={formData.basicDetails.stock}
        onChange={(e) =>
          setFormData({
            ...formData,
            basicDetails: { ...formData.basicDetails, stock: e.target.value },
          })
        }
      />
    </div>


    <LocationSelector formData={formData} setFormData={setFormData} />



  </div>
)}

{/* Description */}
{selectedField === "description" && (
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          rows="3"
        />
      </div>
)}

{/* Product Specifications Section */}
{selectedField === "specifications" && (
  <>
 <h5 className="mt-3">Trade Information</h5>
<div className="row">

<div className="col-md-6">
  <label className="form-label">Supply Ability</label>
  <div className="d-flex">
    {/* Numeric Input */}
    <input
      type="number"
      className="form-control me-2"
      name="tradeInformation.supplyQuantity"
      value={formData.tradeInformation?.supplyQuantity || ""}
      onChange={handleChange}
      placeholder="Enter quantity"
    />

    {/* Dropdown for Per Time Unit */}
    <select
      className="form-select"
      name="tradeInformation.supplyUnit"
      value={formData.tradeInformation?.supplyUnit || ""}
      onChange={handleChange}
    >
      <option value="Per Day">Per Day</option>
      <option value="Per Week">Per Week</option>
      <option value="Per Month">Per Month</option>
      <option value="Per Year">Per Year</option>
    </select>
  </div>
</div>


  <div className="col-md-6">
    <label className="form-label">Delivery Time</label>
    <select
      className="form-control"
      name="tradeInformation.deliveryTime"
      value={formData.tradeInformation?.deliveryTime || ""}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="7 Days">7 Days</option>
      <option value="15 Days">15 Days</option>
      <option value="30 Days">30 Days</option>
    </select>
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">FOB Port</label>
    <input
      type="text"
      className="form-control"
      name="tradeInformation.fobPort"
      value={formData.tradeInformation?.fobPort || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Sample Policy</label>
    <select
      className="form-control"
      name="tradeInformation.samplePolicy"
      value={formData.tradeInformation?.samplePolicy || ""}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="Free Sample">Free Sample</option>
      <option value="Paid Sample">Paid Sample</option>
    </select>
  </div>
</div>

{/* Sample Available Radio Buttons */}
<div className="mb-3 mt-3">
  <label className="form-label d-block">Sample Available</label>
  <div className="d-flex gap-3">
    {["Yes", "No"].map((option) => (
      <div key={option} className="form-check">
        <input
          type="radio"
          className="form-check-input"
          name="tradeInformation.sampleAvailable"
          value={option}
          checked={formData.tradeInformation?.sampleAvailable === option}
          onChange={handleChange}
        />
        <label className="form-check-label">{option}</label>
      </div>
    ))}
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Main Export Market(s)</label>
    <select
      className="form-control"
      name="tradeInformation.mainExportMarkets"
      value={formData.tradeInformation?.mainExportMarkets || ""}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="Asia">Asia</option>
      <option value="Europe">Europe</option>
      <option value="North America">North America</option>
    </select>
  </div>

  <div className="col-md-6">
    <label className="form-label">Certifications</label>
    <input
      type="text"
      className="form-control"
      name="tradeInformation.certifications"
      value={formData.tradeInformation?.certifications || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="mb-3">
  <label className="form-label">Packaging Details</label>
  <textarea
    className="form-control"
    name="tradeInformation.packagingDetails"
    value={formData.tradeInformation?.packagingDetails || ""}
    onChange={handleChange}
    rows="2"
  />
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Payment Terms</label>
    <select
      className="form-control"
      name="tradeInformation.paymentTerms"
      value={formData.tradeInformation?.paymentTerms || ""}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="T/T">T/T</option>
      <option value="L/C">L/C</option>
    </select>
  </div>

  <div className="col-md-6">
    <label className="form-label">Main Domestic Market</label>
    <select
      className="form-control"
      name="tradeInformation.mainDomesticMarket"
      value={formData.tradeInformation?.mainDomesticMarket || ""}
      onChange={handleChange}
    >
      <option value="">Select</option>
      <option value="All India">All India</option>
      <option value="North India">North India</option>
    </select>
  </div>
</div>

<h5 className="mt-3">Product Specifications</h5>
<div className="row">
  <div className="col-md-6">
    <label className="form-label">Product Type</label>
    <input
      type="text"
      className="form-control"
      name="specifications.productType"
      value={formData.specifications?.productType || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Material</label>
    <input
      type="text"
      className="form-control"
      name="specifications.material"
      value={formData.specifications?.material || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Finish</label>
    <input
      type="text"
      className="form-control"
      name="specifications.finish"
      value={formData.specifications?.finish || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Thickness Tolerance</label>
    <input
      type="text"
      className="form-control"
      name="specifications.thicknessTolerance"
      value={formData.specifications?.thicknessTolerance || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Width</label>
    <input
      type="text"
      className="form-control"
      name="specifications.width"
      value={formData.specifications?.width || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Length</label>
    <input
      type="text"
      className="form-control"
      name="specifications.length"
      value={formData.specifications?.length || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Weight</label>
    <input
      type="text"
      className="form-control"
      name="specifications.weight"
      value={formData.specifications?.weight || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Metals Type</label>
    <input
      type="text"
      className="form-control"
      name="specifications.metalsType"
      value={formData.specifications?.metalsType || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Width Tolerance</label>
    <input
      type="text"
      className="form-control"
      name="specifications.widthTolerance"
      value={formData.specifications?.widthTolerance || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Shape</label>
    <input
      type="text"
      className="form-control"
      name="specifications.shape"
      value={formData.specifications?.shape || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Size</label>
    <input
      type="text"
      className="form-control"
      name="specifications.size"
      value={formData.specifications?.size || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Product Name</label>
    <input
      type="text"
      className="form-control"
      name="specifications.productName"
      value={formData.specifications?.productName || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Thickness</label>
    <input
      type="text"
      className="form-control"
      name="specifications.thickness"
      value={formData.specifications?.thickness || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Color</label>
    <input
      type="text"
      className="form-control"
      name="specifications.color"
      value={formData.specifications?.color || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Coating</label>
    <input
      type="text"
      className="form-control"
      name="specifications.coating"
      value={formData.specifications?.coating || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Wood Type</label>
    <input
      type="text"
      className="form-control"
      name="specifications.woodType"
      value={formData.specifications?.woodType || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Usage</label>
    <input
      type="text"
      className="form-control"
      name="specifications.usage"
      value={formData.specifications?.usage || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Processor Type</label>
    <input
      type="text"
      className="form-control"
      name="specifications.processorType"
      value={formData.specifications?.processorType || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Type</label>
    <input
      type="text"
      className="form-control"
      name="specifications.type"
      value={formData.specifications?.type || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Design</label>
    <input
      type="text"
      className="form-control"
      name="specifications.design"
      value={formData.specifications?.design || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="row mt-2">
  <div className="col-md-6">
    <label className="form-label">Feature</label>
    <input
      type="text"
      className="form-control"
      name="specifications.feature"
      value={formData.specifications?.feature || ""}
      onChange={handleChange}
    />
  </div>

  <div className="col-md-6">
    <label className="form-label">Metal Type</label>
    <input
      type="text"
      className="form-control"
      name="specifications.metalType"
      value={formData.specifications?.metalType || ""}
      onChange={handleChange}
    />
  </div>
</div>

<div className="mb-3">
  <label className="form-label">Application</label>
  <input
    type="text"
    className="form-control"
    name="specifications.application"
    value={formData.specifications?.application || ""}
    onChange={handleChange}
  />
</div>

  </>
)}

{/* Product tradeShopping Section */}

{selectedField === "tradeShopping" && (
  <>
    <div className="mb-3">
      <label className="form-label">Brand Name *</label>
      <input
        type="text"
        className="form-control"
        name="tradeShopping.brandName"
        value={formData.tradeShopping?.brandName || ""}
        onChange={handleChange}
      />
    </div>

    {/* GST Section */}
    <div className="mb-3">
      <label className="form-label d-block">GST *</label>
      <div className="d-flex gap-3">
        {[0, 5, 12, 18, 28].map((tax) => (
          <div key={tax} className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="tradeShopping.gst"
              value={tax}
              checked={formData.tradeShopping?.gst === tax}
              onChange={handleChange}
            />
            <label className="form-check-label">{tax}%</label>
          </div>
        ))}
      </div>
    </div>

    {/* Selling Price Section */}
    <div className="mb-3">
      <label className="form-label d-block">Selling Price (Without GST) *</label>
      <div className="d-flex gap-3">
        {["Fixed", "Slab Based"].map((type) => (
          <div key={type} className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="tradeShopping.sellingPriceType"
              value={type}
              checked={formData.tradeShopping?.sellingPriceType === type}
              onChange={handleChange}
            />
            <label className="form-check-label">{type}</label>
          </div>
        ))}
      </div>
      <input
        type="number"
        className="form-control mt-2"
        name="tradeShopping.sellingPrice"
        value={formData.tradeShopping?.sellingPrice || ""}
        onChange={handleChange}
        placeholder="₹ Enter Selling Price"
      />
    </div>

    {/* MRP Field */}
    <div className="mb-3">
      <label className="form-label">MRP *</label>
      <input
        type="number"
        className="form-control"
        name="tradeShopping.mrp"
        value={formData.tradeShopping?.mrp || ""}
        onChange={handleChange}
      />
    </div>

    {/* Unit & Pack Size */}
    <div className="row">
      <div className="col-md-6">
        <label className="form-label">Unit *</label>
        <select
          className="form-select"
          name="tradeShopping.unit"
          value={formData.tradeShopping?.unit || ""}
          onChange={handleChange}
        >
          <option value="">Select Unit</option>
          <option value="kg">kg</option>
          <option value="liter">liter</option>
          <option value="piece">piece</option>
        </select>
      </div>
      <div className="col-md-6">
        <label className="form-label">Pack Size *</label>
        <input
          type="number"
          className="form-control"
          name="tradeShopping.packSize"
          value={formData.tradeShopping?.packSize || ""}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Minimum Order Packs */}
    <div className="mb-3">
      <label className="form-label">Minimum Ordered Packs *</label>
      <input
        type="number"
        className="form-control"
        name="tradeShopping.minOrderedPacks"
        value={formData.tradeShopping?.minOrderedPacks || ""}
        onChange={handleChange}
      />
    </div>

    {/* Is Returnable Section */}
    <div className="mb-3">
      <label className="form-label d-block">Is Returnable? *</label>
      <div className="d-flex gap-3">
        {["Yes", "No"].map((option) => (
          <div key={option} className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="tradeShopping.isReturnable"
              value={option}
              checked={formData.tradeShopping?.isReturnable === option}
              onChange={handleChange}
            />
            <label className="form-check-label">{option}</label>
          </div>
        ))}
      </div>
    </div>

    {/* Stock Quantity & Weight */}
    <div className="row">
      <div className="col-md-6">
        <label className="form-label">Stock Quantity *</label>
        <input
          type="number"
          className="form-control"
          name="tradeShopping.stockQuantity"
          value={formData.tradeShopping?.stockQuantity || ""}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Weight Per Unit *</label>
        <input
          type="number"
          className="form-control"
          name="tradeShopping.weightPerUnit"
          value={formData.tradeShopping?.weightPerUnit || ""}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Shipping Type */}
    <div className="mb-3">
      <label className="form-label d-block">Shipping Type *</label>
      <div className="d-flex gap-3">
        {["Free", "Flat Rate", "% of Order Value", "Actual"].map((type) => (
          <div key={type} className="form-check">
            <input
              type="radio"
              className="form-check-input"
              name="tradeShopping.shippingType"
              value={type}
              checked={formData.tradeShopping?.shippingType === type}
              onChange={handleChange}
            />
            <label className="form-check-label">{type}</label>
          </div>
        ))}
      </div>
    </div>

    {/* Package Dimensions */}
    <h5 className="mt-4">Package Dimensions *</h5>
    <div className="row">
      <div className="col-md-4">
        <label className="form-label">Length</label>
        <input
          type="number"
          className="form-control"
          name="tradeShopping.packageDimensions.length"
          value={formData.tradeShopping?.packageDimensions?.length || ""}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Width</label>
        <input
          type="number"
          className="form-control"
          name="tradeShopping.packageDimensions.width"
          value={formData.tradeShopping?.packageDimensions?.width || ""}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label">Height</label>
        <input
          type="number"
          className="form-control"
          name="tradeShopping.packageDimensions.height"
          value={formData.tradeShopping?.packageDimensions?.height || ""}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Dimension Unit */}
    <div className="mt-3">
      <label className="form-label">Dimension Unit</label>
      <select
        className="form-select"
        name="tradeShopping.packageDimensions.unit"
        value={formData.tradeShopping?.packageDimensions?.unit || ""}
        onChange={handleChange}
      >
        <option value="">Select Unit</option>
        <option value="cm">cm</option>
        <option value="inch">inch</option>
      </select>
    </div>
  </>
)}

  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleUpdate}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
};

export default AllProducts;
