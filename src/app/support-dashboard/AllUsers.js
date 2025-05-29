import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaTimesCircle } from "react-icons/fa";
import { Table, Spinner, Button, Accordion, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import ProductTags from "./components/ProductTags";
import Image from "next/image";


const AllUsers = ({ supportPersonId }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state for name, email, company, mobile
  const [searchDate, setSearchDate] = useState(""); // ✅ Search state for registration date
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (supportPersonId) {
      fetchUsers(); // fetch only when supportPersonId exists
    }
  }, [supportPersonId]);
  

  useEffect(() => {
    if (supportPersonId) {
      console.log("Support Person ID from prop:", supportPersonId);
      fetchUsers();
    }
  }, [supportPersonId]);
  
  
  
  const fetchUsers = async () => {
    try {
      if (!supportPersonId) return; // Don't fetch if not available
  
      const response = await axios.get(
        `/api/adminprofile/support-users?supportPersonId=${supportPersonId}`
      );
      console.log("API Response:", response.data);
  
      if (response.data.success) {
        setUsers(response.data.users.reverse());
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire("Error", "Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Handle Delete Function
  const handleDeleteUser = () => {
    Swal.fire({
      icon: "info",
      title: "Restricted Action",
      text: "Only admin can delete User",
      confirmButtonColor: "#3085d6",
    });
  };


  // ✅ Handle Delete Function
   const handleDelete = () => {
     Swal.fire({
       icon: "info",
       title: "Restricted Action",
       text: "Only admin can delete User Products",
       confirmButtonColor: "#3085d6",
     });
   };


  // ✅ Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // ✅ Handle date filter change
  const handleDateFilter = (e) => {
    setSearchDate(e.target.value);
  };

  // ✅ Filter users based on searchTerm and date
  const filteredUsers = users.filter((user) => {
    const userDate = user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : null; // ✅ Prevent invalid dates

    return (
      (user.fullname?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.companyName?.toLowerCase().includes(searchTerm) ||
        user.mobileNumber?.includes(searchTerm)) &&
      (searchDate === "" || (userDate && userDate === searchDate)) // ✅ Ensure date is valid before comparing
    );
  });

  // calculatedprogreessbar
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

    checkAndCount(product);
    checkAndCount(product.tradeInformation);
    checkAndCount(product.specifications);
    checkAndCount(product.tradeShopping);

    if (product.images && product.images.length > 0) completedFields++;
    totalFields++;

    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  };

  const getStrengthLabel = (percentage) => {
    if (percentage <= 30) return { text: "Weak", color: "bg-danger" };
    if (percentage <= 70) return { text: "Medium Strength", color: "bg-warning" };
    return { text: "Strong", color: "bg-success" };
  };




  return (
    <div className="container mt-4">
      
      <h6 className="text-center mb-4 res-color2 text-light w-50 rounded-5	m-auto  p-2 common-shad">All Users & Their Products</h6>

      {/* ✅ Search & Date Filter */}
      <Form className="mb-3 d-flex gap-2 res-color2 rounded-3 common-shad p-3">
        <Form.Control
          type="text"
          placeholder="Search by name, email, company name, or phone number"
          value={searchTerm}
          onChange={handleSearch}
        />
        <Form.Control
          type="date"
          value={searchDate}
          onChange={handleDateFilter}
        />
        <Button variant="secondary" onClick={() => { setSearchTerm(""); setSearchDate(""); }}>
          Reset
        </Button>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table className="common-shad striped bordered hover responsive ">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>       
              <th>Company | TP | SP </th>
              <th>Registered On</th> {/* ✅ Added Date */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <React.Fragment key={user._id}>
                  <tr className="text-sm">
                    <td>{index + 1}</td>
                    <td>{user.fullname}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                 <td>{user.companyName} | {user.products?.length} | {user.supportPerson?.name}</td>
                   <td>
  {user.createdAt
    ? new Date(user.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "N/A"}
</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteUser()}>
                       🗑️
                      </Button> 
                    </td>
                  </tr><tr><td colSpan="7" className="td-bg">
                      {user.products?.length > 0 ? (
                        <Accordion>
                          {user.products.map((product, i) => {
                            const progress = calculateProgress(product);
                            const strength = getStrengthLabel(progress);

                            const formatDate = (date) =>
                              new Date(date).toLocaleString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: true,
                                timeZone: "Asia/Kolkata",
                              });
                            return (
                              <Accordion.Item key={product._id} eventKey={i.toString()} className="mb-2">
                                <Accordion.Header>
                                      <strong>{i + 1}. {product.name}</strong>
                                  <div className="nnn">
                                    <FaTimesCircle className="text-danger bg-light rounded-3 my-shad" role="button" onClick={() => handleDelete()} />
                                  </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                  <strong className="text-sm text-danger">{product._id}</strong>

                                  <div className="d-flex justify-content-between">
                                    <div>
                                    <span className="res-color2 text-light text-sm common-shad px-3 py-1 rounded-2">
                                    🕒 <b>Created At:</b> {formatDate(product.createdAt)}
                                    </span> <br></br>
                                    <span className="res-color2 text-light text-sm common-shad px-3 py-1 rounded-2">
                                    🕒 <b>Updated At: </b>{formatDate(product.updatedAt)}
                                    </span>
                                    </div>

                                    <div>
                                    <span className="text-sm rounded-2">
                                     <b>📍 State:</b> {product?.state} <br></br>
                                     <b>📍 City:</b> {product?.city}
                                    </span>
                                    </div>
                                  </div>

                                  <div className="row mb-3 mt-3">
                                    <div className="col-md-2">

<Image
  src={product?.images[0]?.url || "/default-image.jpg"} // ✅ Fallback image
  alt="Product"
  width={100}
  height={100}
  className="me-3 all-pro-img p-2 common-shad"
  style={{ objectFit: "cover", borderRadius: "5px" }}
  unoptimized
/>
                                    </div>

                                    <div className="col-md-2">
                                      <div className="res-color1 text-center p-2 rounded-3 common-shad">
                                        <span className="text-sm d-block">Product Name</span>  <span className="res1-text-color fw-bold">  {product.name}</span> 
                                      </div>
                                    </div>

                                    <div className="col-md-2">
                                      <div className="res-color1 text-center p-2 rounded-3 common-shad">
                                        <span className="text-sm d-block">Product Price</span>  <span className="res1-text-color fw-bold">{product.currency}  ₹{product.price} </span>
                                      </div>
                                    </div>

                                    <div className="col-md-2">
                                      <div className="res-color1 text-center p-2 rounded-3 common-shad">
                                        <span className="text-sm d-block">MOQ</span>   <span className="res1-text-color fw-bold"> {product.minimumOrderQuantity}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="res-color1 text-center p-2 rounded-3 common-shad">
                                        <span className="text-sm d-block">Category</span>   <span className="res1-text-color fw-bold"> {product?.category?.name}</span>
                                      </div>
                                    </div>
                                    <div className="col-md-2">
                                      <div className="res-color1 text-center p-2 rounded-3 common-shad">
                                        <span className="text-sm d-block">Sub Category</span>   <span className="res1-text-color fw-bold"> {product?.subCategory?.name}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="progress">
                                    <div className={`progress-bar ${strength.color}`} style={{ width: `${progress}%` }}>
                                      {progress}% Complete
                                    </div>
                                  </div>
                                  <div className="container">

                                    <div className="row">
                                      {/* Trade Information */}
                                      <div className="col-md-4">
                                        <h6 className="common-shad mt-2 mb-2 rounded-2 p-2 res1-text-color res-color1">Trade Information</h6>
                                        <ul className="res-color1 p-3 rounded-3 res1-text-color common-shad">
                                          <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Supply Ability:</div>
                                              <div className="col-5">{product.tradeInformation?.supplyAbility || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Delivery Time:</div>
                                              <div className="col-5">{product.tradeInformation?.deliveryTime || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">FOB Port:</div>
                                              <div className="col-5">{product.tradeInformation?.fobPort || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Sample Policy:</div>
                                              <div className="col-5">{product.tradeInformation?.samplePolicy || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Sample Available:</div>
                                              <div className="col-5">{product.tradeInformation?.sampleAvailable || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Main Export Markets:</div>
                                              <div className="col-5">{product.tradeInformation?.mainExportMarkets?.join(", ") || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Certifications:</div>
                                              <div className="col-5">{product.tradeInformation?.certifications || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Packaging Details:</div>
                                              <div className="col-5">{product.tradeInformation?.packagingDetails || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Payment Terms:</div>
                                              <div className="col-5">{product.tradeInformation?.paymentTerms || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Main Domestic Market:</div>
                                              <div className="col-5">{product.tradeInformation?.mainDomesticMarket || "N/A"}</div>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>
                                      {/* Specifications */}
                                      <div className="col-md-4">
                                        <h6 className="common-shad mt-2 mb-2 rounded-2 p-2 text-light res-color2">Specifications</h6>
                                        <ul className="res-color2 rounded-3 p-3 text-light common-shad">
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Product Type:</div>
                                              <div className="col-5">{product.specifications?.productType || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Material:</div>
                                              <div className="col-5">{product.specifications?.material || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Finish:</div>
                                              <div className="col-5">{product.specifications?.finish || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Thickness:</div>
                                              <div className="col-5">{product.specifications?.thickness || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Thickness Unit:</div>
                                              <div className="col-5">{product.specifications?.thicknessUnit || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Width:</div>
                                              <div className="col-5">{product.specifications?.width || "N/A"} {product.specifications?.widthUnit || ""}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Length:</div>
                                              <div className="col-5">{product.specifications?.length || "N/A"} {product.specifications?.lengthUnit || ""}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Weight:</div>
                                              <div className="col-5">{product.specifications?.weight || "N/A"} {product.specifications?.weightUnit || ""}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Shape:</div>
                                              <div className="col-5">{product.specifications?.shape || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Color:</div>
                                              <div className="col-5">{product.specifications?.color || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Coating:</div>
                                              <div className="col-5">{product.specifications?.coating || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Usage:</div>
                                              <div className="col-5">{product.specifications?.usage || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Origin:</div>
                                              <div className="col-5">{product.specifications?.origin || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Foldable:</div>
                                              <div className="col-5">{product.specifications?.foldable ? "Yes" : "No"}</div>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>

                                      {/* Trade Shopping */}
                                      <div className="col-md-4">
                                        <h6 className="common-shad mt-2 mb-2 rounded-2 p-2 text-light res-color3">Trade Shopping</h6>
                                        <ul className="res-color3 rounded-3 p-3 text-light common-shad">
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Brand Name:</div>
                                              <div className="col-5">{product.tradeShopping?.brandName || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">GST:</div>
                                              <div className="col-5">{product.tradeShopping?.gst || "N/A"}%</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Selling Price Type:</div>
                                              <div className="col-5">{product.tradeShopping?.sellingPriceType || "N/A"}</div>
                                            </div>
                                          </li> 

                                          {product.tradeShopping?.sellingPriceType === "Fixed" && (
                                            <>
                                               <li className="text-sm bm-2">
                                                <div className="row">
                                                  <div className="col-7">Fixed Selling Price:</div>
                                                  <div className="col-5">₹{product.tradeShopping?.fixedSellingPrice || "N/A"}</div>
                                                </div>
                                              </li> 
                                            </>
                                          )}

                                          {product.tradeShopping?.sellingPriceType === "Slab Based" && (
                                            <>
                                               <li className="text-sm bm-2">
                                                <div className="row">
                                                  <div className="col-7">Slab Pricing:</div>
                                                  <div className="col-5"></div>
                                                </div>
                                              </li>
                                              {product.tradeShopping?.slabPricing?.map((slab, index) => (
                                                <li key={index} className="text-sm">
                                                  <div className="row">
                                                    <div className="col-7">{slab.minQuantity} - {slab.maxQuantity}:</div>
                                                    <div className="col-5">₹{slab.price}</div>
                                                  </div>
                                                </li>
                                              ))}
                                              
                                            </>
                                          )}

                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Unit:</div>
                                              <div className="col-5">{product.tradeShopping?.unit || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Pack Size:</div>
                                              <div className="col-5">{product.tradeShopping?.packSize || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Min Ordered Packs:</div>
                                              <div className="col-5">{product.tradeShopping?.minOrderedPacks || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Is Returnable:</div>
                                              <div className="col-5">{product.tradeShopping?.isReturnable ? "Yes" : "No"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Stock Quantity:</div>
                                              <div className="col-5">{product.tradeShopping?.stockQuantity || "N/A"}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Weight Per Unit:</div>
                                              <div className="col-5">{product.tradeShopping?.weightPerUnit || "N/A"} {product.tradeShopping?.weightUnit || ""}</div>
                                            </div>
                                          </li> 
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Shipping Type:</div>
                                              <div className="col-5">{product.tradeShopping?.shippingType || "N/A"}</div>
                                            </div>
                                          </li> 

                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Package Dimensions:</div>
                                              <div className="col-5"></div>
                                            </div>
                                          </li>
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Length:</div>
                                              <div className="col-5">{product.tradeShopping?.packageDimensions?.length || "N/A"} cm</div>
                                            </div>
                                          </li>
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Width:</div>
                                              <div className="col-5">{product.tradeShopping?.packageDimensions?.width || "N/A"} cm</div>
                                            </div>
                                          </li>
                                           <li className="text-sm bm-2">
                                            <div className="row">
                                              <div className="col-7">Height:</div>
                                              <div className="col-5">{product.tradeShopping?.packageDimensions?.height || "N/A"} cm</div>
                                            </div>
                                          </li>
                                        </ul>

                                      </div>
                                    </div>

                                    <ProductTags productId={product._id} existingTags={product.tags} />


                                  </div>

                                </Accordion.Body>
                              </Accordion.Item>
                            );

                          })}
                        </Accordion>
                      ) : (
                        <span className="text-muted">No products available</span>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No matching users found.</td>
              </tr>
            )}
          </tbody>


        </Table>
      )}
    </div>
  );
};

export default AllUsers;
