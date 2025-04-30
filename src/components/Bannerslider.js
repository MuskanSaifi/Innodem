import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import SidebarMenu from './SidebarMenu';


const Bannerslider = () => {
  return (
    <>
  <section>
  <div className="container-fluid mt-4">
    <div className="row">
      <div className="col-md-2">
        <SidebarMenu/>
      </div>
      <div className="col-md-10">
      <Carousel autoPlay={true} infiniteLoop={true} interval={6000}>
        
      <div>
        <img src="/assets\bannerslider\banner-4.png" alt="banner 4" />
      </div>
      <div>
      <img src="/assets/bannerslider/banner-1.png" alt="banner 1" />
      </div>
      <div>
        <img src="/assets/bannerslider/banner-2.png" alt="banner 2" />
      </div>
      <div> 
        <img src="/assets/bannerslider/banner-3.png" alt="banner 3" />
      </div>
     
    </Carousel>
      </div>
    </div>
    
    </div>
  </section>
    {/* Scoped internal CSS */}
    <style jsx global>{`
        .carousel .slide {
          max-height: 650px;
        }
      `}</style>
    </>
  );
};

export default Bannerslider;
