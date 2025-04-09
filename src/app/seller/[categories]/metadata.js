// /app/seller/[categories]/metadata.js
import connectdb from "@/lib/dbConnect";
import Category from "@/models/Category";

export async function generateMetadata({ params }) {
  await connectdb();

  const category = await Category.findOne({ categoryslug: params.categories });

  if (!category) {
    return {
      title: "Category Not Found | Dial Export Mart",
      description: "The category you are looking for does not exist.",
    };
  }

  return {
    title: category.metatitle || `${category.name} | Dial Export Mart`,
    description: category.metadescription || "Browse export quality products.",
    keywords: category.metakeywords || "export, wholesale, trade",
  };
}
