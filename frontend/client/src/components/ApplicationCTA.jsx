import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

const steps = [
  {
    icon: FileText,
    title: "Submit Application",
    description: "Fill out our simple online application form",
  },
  {
    icon: Users,
    title: "Interview Round",
    description: "Meet our team and present your idea",
  },
  {
    icon: Calendar,
    title: "Start Building",
    description: "Join the cohort and begin your journey",
  },
];

const ApplicationCTA = () => {
  const navigate = useNavigate();
  
  const handleApplyNow = () => {
    if (isAuthenticated()) {
      navigate('/addidea');
    } else {
      navigate('/signup');
    }
  };
  
  return (
    <section id="apply" className="py-24 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-primary opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA Card */}
        <div className="max-w-5xl mx-auto">
          <div className="relative p-10 lg:p-16 rounded-3xl bg-gradient-light border border-border overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-black">
                Ready to Build the Future?
              </h2>
              <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
                Applications are now open for our next cohort. Join a community of ambitious
                founders and turn your vision into reality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 group"
                  onClick={handleApplyNow}
                >
                  Apply Now !!
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary/10 px-8"
                >
                  View Requirements
                </Button>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="text-center p-6 rounded-2xl bg-card border border-border/50"
                  style={{
                    animation: "fade-up 0.6s ease-out",
                    animationDelay: `${index * 0.15}s`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-sm font-semibold text-primary mb-2">
                    Step {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationCTA;