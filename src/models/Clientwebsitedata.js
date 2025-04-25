import mongoose from 'mongoose';

const clientWebsiteDataSchema = new mongoose.Schema({
  websitename: { type: String },
  name: { type: String },
  number: { type: String },
  companyName: { type: String },
  email: { type: String },
  address: { type: String },
  requirement: { type: String }
});


// ✅ Ensure model is not re-registered
const ClientWebsiteData = mongoose.models.ClientWebsiteData || mongoose.model("ClientWebsiteData", clientWebsiteDataSchema);
export default ClientWebsiteData;
