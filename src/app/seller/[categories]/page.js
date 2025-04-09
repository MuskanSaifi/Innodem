import CategoryPage from "./CategoryPage";

export async function generateMetadata({ params }) {
  const categorySlug = decodeURIComponent(params.categories);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/adminprofile/category`, {
    cache: "no-store",
  });

  const categories = await res.json();

  const category = categories.find(
    (cat) => cat.categoryslug === categorySlug
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
