import { notFound } from "next/navigation";
import ContactPage from "@/app/views/ContactPage";
import LandingPage from "@/app/views/LandingPage";
import BlogDetail from "@/app/views/blog/BlogDetail";
import BlogCategory from "@/app/views/blog/BlogCategory";
import ProductDetail from "@/app/views/product/ProductDetail";
import ProductCategory from "@/app/views/product/ProductCategory";

export default function DynamicPage({ params }: { params: { slug?: string[] } }) {
    const slug = params.slug?.join("/") || "";

    if (slug === "contact.html") return <ContactPage />;
    if (slug === "landingpage.html") return <LandingPage />;
    if (slug.endsWith(".html")) {
        if (slug.startsWith("blog-")) return <BlogDetail slug={slug} />;
        if (slug.startsWith("product-")) return <ProductDetail slug={slug} />;
    }
    if (slug.startsWith("blog")) return <BlogCategory slug={slug} />;
    if (slug.startsWith("product")) return <ProductCategory slug={slug} />;

    return notFound();
}
