import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import SidebarMenu from './SidebarMenu';

const Bannerslider = () => {
  return (
    <>
    <div className="container-fluid mt-4">

    <div className="row">
      <div className="col-2">
        <SidebarMenu/>
      </div>
      <div className="col-10">
      <Carousel autoPlay={true} infiniteLoop={true} interval={6000}>
      <div>
        <img src="/assets/bannerslider/banner1.jpg" alt="banner1" />
      </div>
      <div>
        <img src="/assets/bannerslider/Best Distributer1.jpg" alt="banner1" />
      </div>
    
      <div>
        <img src="/assets/bannerslider/banner2.jpg" alt="banner 2" />
      </div>
     
      <div>
        <img src="/assets/bannerslider/Best Distributer2.jpg" alt="banner1" />
      </div>
      <div>
        <img src="/assets/bannerslider/Best Distributer3.jpg" alt="banner1" />
      </div>
      <div>
        <img src="/assets/bannerslider/Best Distributer4.jpg" alt="banner1" />
      </div>
    
    </Carousel>
      </div>
    </div>
    </div>

    </>
  );
};

export default Bannerslider;
