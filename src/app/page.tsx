import FAQs from "@/components/FAQs";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Reviews from "@/components/Reviews";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <FAQs />
      <Reviews />
    </div>
  );
}
