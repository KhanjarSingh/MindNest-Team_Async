import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const highlights = [
  "12-week intensive incubation program",
  "Weekly workshops and masterclasses",
  "Access to global investor network",
  "Legal and compliance support",
  "Marketing and branding guidance",
  "Post-program continued support",
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-gradient-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 rounded-bl-[100px] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
              ABOUT MindNest
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Nurturing Student{" "}
              <span className="text-primary italic">Entrepreneurs</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              MindNest is more than just an incubator – it's a comprehensive ecosystem designed
              to transform innovative ideas into successful ventures. We provide the perfect
              blend of resources, mentorship, and community support.
            </p>

            {/* Highlights */}
            <div className="space-y-3 mb-8">
              {highlights.map((highlight, index) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3 animate-fade-up"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both",
                  }}
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{highlight}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="rounded-full group">
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Image/Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Glass Card */}
              <div className="relative p-8 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl">
                <div className="aspect-square rounded-2xl bg-gradient-primary flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <div className="text-6xl font-bold mb-4">🚀</div>
                    <p className="text-xl font-semibold">Your Journey</p>
                    <p className="text-lg opacity-90">Starts Here</p>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-secondary/20 backdrop-blur-sm border border-border/30 flex items-center justify-center animate-float">
                <span className="text-3xl">💡</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm border border-border/30 flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;