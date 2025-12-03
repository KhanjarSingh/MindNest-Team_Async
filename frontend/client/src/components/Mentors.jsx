import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const mentors = [
  { name: "Krushn Tooka Dayshmookh", designation: "Ex-Software Engineer", company: "Siemens", image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/67c9a85a8ee0cf38f40b3a0e_Krushn%20Tooka%20Dayshmookh_4_11zon.avif" },
  { name: "Gaurav Gehlot ", designation: "Ex-Software Engineer", company: "Goldman Sachs", image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/67c9a85abbb13db5024a0eaf_Gaurav%20Gehlot_7_11zon.avif" },
  { name: "Deepak Gour", designation: "Ex-Software Engineer", company: "Google", image: "https://cdn.prod.website-files.com/62e8d2ea218fb7676b6892a6/67d16edc33f3a55f42a1aa84_62d5e1a9345238afd277aec64dd1dd07_Deepak%20Sir%20.avif" },
  { name: "Shreyas Malewar", designation: "Research Assistant ", company: "Radiomics Lab", image: "https://media.licdn.com/dms/image/v2/D5603AQH8ue07-yRRQw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1729485733914?e=1766620800&v=beta&t=eE4q-xXt-ebm8fuJ10O2Az2uV8atXwjKvt3qnvkYIyw" },
];

const Mentors = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % mentors.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + mentors.length) % mentors.length);
  };

  const getVisibleMentors = () => {
    return [mentors[currentIndex]];
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
            OUR MENTORS
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground">
            Meet Your <span className="text-primary italic">Guides</span>
          </h3>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="px-12 md:px-16">
            <div className="md:grid md:grid-cols-3 md:gap-6">
            {getVisibleMentors().map((mentor, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-1">{mentor.name}</h4>
                <p className="text-sm text-muted-foreground mb-1">{mentor.designation}</p>
                <p className="text-primary font-medium">{mentor.company}</p>
              </div>
            ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {mentors.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mentors;
