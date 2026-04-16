import farmer from '../../images/farmer-hero.png';
import './Hero.css';


export function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <p className="hero-title">Know Your Soil, 
Grow Your Future</p>
        <p className="hero-description">Torbati gives you personalized crop recommendations based on your soil, climate and region — so you can farm smarter, not harder.</p>
        <button className="hero-button">Get My Recommendation <div> →</div></button>
      </div>
      <img className='hero-image' src={farmer} alt="Farmer" />
    </div>
   ) 
};