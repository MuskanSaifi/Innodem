// pages/api/buyerform.js

import connectdb from "@/lib/dbConnect";
import Buyer from "@/models/Buyer";
import purchaseRequestSchema from "@/models/purchaseRequestSchema";


export default async function handler(req, res) {
  await connectdb();

  if (req.method === "POST") {
    try {
      const {
        productname,
        quantity,
        unit,
        orderValue,
        currency,
        buyer: buyerMobileNumber,
        requirementFrequency,
        sellerId,
        productId
      } = req.body;

      // 1. Find the buyer using mobile number
      const buyer = await Buyer.findOne({ mobileNumber: buyerMobileNumber });

      if (!buyer) {
        return res.status(404).json({ error: "Buyer not found" });
      }

      // 2. Create PurchaseRequest
      const purchaseRequest = await purchaseRequestSchema.create({
        buyer: buyer._id,
        seller: sellerId,         // pass from frontend
        product: productId,       // pass from frontend
        quantity,
        unit,
        approxOrderValue: {
          amount: orderValue,
          currency,
        },
        requirementFrequency,     // 'one-time' or 'recurring'
      });

      return res.status(200).json({ success: true, purchaseRequest });

    } catch (error) {
      console.error("Error creating purchase request:", error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
