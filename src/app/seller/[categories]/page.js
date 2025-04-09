import CategoryPage from "./CategoryPage";

// ✅ Dynamic metadata
export async function generateMetadata({ params }) {
  const encodedCategory = params.categories;

  const formatCategoryName = (name) =>
    decodeURIComponent(name)
      .replace(/-/g, " ")
      .replace(/and/g, "&")
      .trim()
      .toLowerCase();

  const formattedCategory = formatCategoryName(encodedCategory);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/adminprofile/category`);
  const categories = await res.json();

  const category = categories.find(
    (cat) => cat.name.trim().toLowerCase() === formattedCategory
  );

  if (!category) {
    return {
      title: "Category Not Found",
      description: "No matching category found",
    };
  }

  return {
    title: category.metatitle || category.name,
    description: category.metadescription || "",
    keywords: category.metakeywords || "",
  };
}

export default function Page() {
  return <CategoryPage />;
}
