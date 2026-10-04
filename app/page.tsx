import Hero from "../components/Home/hero";
import ProjectGallery from "../components/Home/ProjectGallery";
import TestimonialsStack from "../components/Home/TestimonialsStack";
import TestimonialMarquee from "../components/Home/TestimonialMarquee";

export default function Home() {
  return (<main className="w-full min-w-0"> <section> <Hero /> </section>
    <section>
      <ProjectGallery />
    </section>

    <section>
      <TestimonialsStack />
    </section>

    <section>
      <TestimonialMarquee />
    </section>
  </main>


  );
}
