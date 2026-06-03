import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HomePage } from "@/components/HomePage";
import { LandingSeoSections } from "@/components/LandingSeoSections";

export default function Page() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <HomePage />
        <LandingSeoSections />
        <Footer />
      </div>
    </>
  );
}
