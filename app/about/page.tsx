import About from "@/components/About/hero";
import Journey from "@/components/About/Journey";
import TechStack from "@/components/About/TechStack";


export const metadata = {
  title: "About | Abhijeet Kulkarni",
  description:
    "Learn more about Abhijeet Kulkarni, a developer and entrepreneur building digital products, AI-powered solutions, and software for businesses.",
};

export default function AboutPage() {
  return (
  <main className="min-h-screen w-full overflow-x-clip"> 
  <About /> 
  <Journey />
  <TechStack />
  </main>
  );
}
