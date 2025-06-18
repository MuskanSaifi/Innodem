import SubcategoryProductPage from "./SubcategoryProductPage";



// Define fetchCategories function directly
export async function fetchCategories() {
  const response = await fetch(`https://www.dialexportmart.com/api/adminprofile/category`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}


export async function generateMetadata({ params }) {
  try {
    // Await params to resolve it before accessing properties
    const resolvedParams = await params;
    const { categories, subcategories } = resolvedParams;

    // Decode slugs for better matching
    const decodedCategorySlug = decodeURIComponent(categories || "");
    const decodedSubcategorySlug = decodeURIComponent(subcategories || "");

    const categoriesData = await fetchCategories();
    const category = categoriesData.find(
      (cat) => cat.categoryslug.toLowerCase() === decodedCategorySlug.toLowerCase()
    );

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested category does not exist.",
      };
    }

    const subcategory = category.subcategories?.find(
      (sub) => sub.subcategoryslug.toLowerCase() === decodedSubcategorySlug.toLowerCase()
    );

    if (!subcategory) {
      return {
        title: "Subcategory Not Found",
        description: "The requested subcategory does not exist.",
          alternates: {
          canonical: `https://www.dialexportmart.com/seller/not-found`,
        },
      };
    }

    return {
      title: subcategory.metatitle || subcategory.name,
      description:
        subcategory.metadescription ||
        `Explore ${subcategory.name} products under ${category.name}.`,
      keywords: subcategory.metakeywords || "",
       alternates: {
        canonical: `https://www.dialexportmart.com/seller/${category.categoryslug}/${subcategory.subcategoryslug}`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error",
      description: "An error occurred while generating metadata.",
    };
  }
}


export default function Page({ params }) {
  return <SubcategoryProductPage params={params} />;
}
