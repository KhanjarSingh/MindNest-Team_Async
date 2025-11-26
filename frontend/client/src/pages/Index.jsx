import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Benefits from "@/components/Benefits";
import ApplicationCTA from "@/components/ApplicationCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Benefits />
      <ApplicationCTA />
      <Footer />
    </div>
  );
};

export default Index;