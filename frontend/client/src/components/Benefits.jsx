import { DollarSign, Users, Lightbulb, Rocket, Code, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Funding Support",
    description: "Access to seed funding and investor connections to kickstart your venture",
  },
  {
    icon: Users,
    title: "Expert Mentorship",
    description: "One-on-one guidance from successful entrepreneurs and industry leaders",
  },
  {
    icon: Lightbulb,
    title: "Innovation Labs",
    description: "State-of-the-art workspace and resources to build your product",
  },
  {
    icon: Rocket,
    title: "Launch Support",
    description: "Comprehensive go-to-market strategy and launch assistance",
  },
  {
    icon: Code,
    title: "Technical Resources",
    description: "Access to development tools, cloud credits, and technical support",
  },
  {
    icon: TrendingUp,
    title: "Growth Network",
    description: "Connect with fellow founders, alumni, and potential partners",
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            WHAT WE OFFER
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to <span className="text-primary italic">Succeed</span>
          </h3>
          <p className="text-lg text-muted-foreground">
            Get funding, mentorship, and guidance to build the next big thing
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="group p-4 md:p-8 rounded-3xl bg-card backdrop-blur-lg border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 aspect-square md:aspect-auto flex flex-col justify-center"
                style={{
                  animation: "fade-up 0.6s ease-out",
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 md:mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 md:w-7 md:h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h4 className="text-sm md:text-xl font-semibold text-foreground mb-2 md:mb-3">
                  {benefit.title}
                </h4>
                <p className="text-xs md:text-base text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
