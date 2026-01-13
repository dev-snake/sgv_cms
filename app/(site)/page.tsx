import Hero from "@/components/home/Hero";
import ProductCategories from "@/components/home/ProductCategories";
import Fields from "@/components/home/Fields";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import News from "@/components/home/News";
import Partners from "@/components/home/Partners";
import ContactForm from "@/components/home/ContactForm";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <ProductCategories />
      <Fields />
      <FeaturedProjects />
      <News />
      <Partners />
      <ContactForm />
    </div>
  );
}
