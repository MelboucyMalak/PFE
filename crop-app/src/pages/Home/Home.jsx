import { Navbar } from "./sections/Navbar/Navbar"; 
import { Hero } from "./sections/Hero/Hero"; 
import { Features } from "./sections/Features/Features";
import { About } from "./sections/About/About";
import styles from './Home.module.css' 

export default function Home() {
  return (
    <div className={styles.home}>
      <Navbar /> 
      <div className={styles.topographyBck} ></div>
      <Hero />
      <Features /> 
      <About/> 
    </div>
  );
}