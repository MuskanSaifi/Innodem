import SubcategoryProductPage from "./SubcategoryProductPage";

// ✅ Dynamic Metadata for Subcategory
export async function generateMetadata({ params }) {
  const encodedCategory = params.categories;
  const encodedSubcategory = params["sub-categories"];
  
  const formatName = (name) =>
    decodeURIComponent(name).replace(/-/g, " ").replace(/and/g, "&").trim().toLowerCase();

  const category = formatName(encodedCategory);
  const subcategory = formatName(encodedSubcategory);

  return {
    title: `${subcategory} | ${category} | Seller`,
    description: `Explore ${subcategory} under ${category}. Discover premium products tailored for your needs.`,
  };
}


export default function Page() {
  return <SubcategoryProductPage />;
}
