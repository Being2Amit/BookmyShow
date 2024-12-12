import React, { useState, useEffect } from 'react';
import { imagesData } from '../../api/Carousel';

function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    setCurrentSlide((prevIndex) => (prevIndex + 1) % imagesData.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prevIndex) => (prevIndex - 1 + imagesData.length) % imagesData.length);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div className="slideshow" style={{ position: 'relative', display: 'flex', transition: 'transform 0.5s ease', transform: `translateX(-${currentSlide * 100}%)` }}>
        {imagesData.map((imageData, index) => (
          <div key={index} style={{ minWidth: '100%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
            <img src={imageData.src} alt={`Slide ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
          </div>
        ))}
      </div>
      <button className="btn" onClick={handlePrev} style={{
        position: 'absolute', color: '#fff', top: '50%', left: '10px', height: '50px', display: 'flex', border: 'none', alignItems: 'center', cursor: 'pointer',
        justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', transform: 'translateY(-50%)', transition: 'background-color 0.3s ease',
      }} > &#8249;
      </button>
      <button className="btn" onClick={handleNext} style={{
        position: 'absolute', color: '#fff', top: '50%', right: '10px', height: '50px', display: 'flex', border: 'none', alignItems: 'center', cursor: 'pointer',
        justifyContent: 'center', transform: 'translateY(-50%)', backgroundColor: 'rgba(0, 0, 0, 0.6)', transition: 'background-color 0.3s ease',
      }}>&#8250;
      </button>
      <div className='dots' style={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '10px', width: '100%', gap: '8px' }}>
        {imagesData.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} 
            style={{ backgroundColor: currentSlide === index ? '#ff5733' : '#ccc', border: 'none', width: '10px', height:'10px', borderRadius:'50%', transition:'background-color 0.3s ease', cursor:'pointer' }}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
