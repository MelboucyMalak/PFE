import { Navbar } from "./sections/Navbar/Navbar"; 
import { Hero } from "./sections/Hero/Hero";
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <Navbar /> 
      <div className="topography-bck" ></div>
      <Hero />
      

    </div>
  );
}