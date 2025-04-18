import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import SidebarMenu from './SidebarMenu';

const Bannerslider = () => {
  return (
    <>
    <div className="container-fluid mt-4">

    <div className="row">
      <div className="col-md-2">
        <SidebarMenu/>
      </div>
      <div className="col-md-10">
      <Carousel autoPlay={true} infiniteLoop={true} interval={6000}>
      <div>
        <img src="/assets/bannerslider/Indian Spices-min.png" alt="banner4" />
      </div>
      <div>
        <img src="/assets/bannerslider/Indian Spices-2-1-min.png" alt="banner1" />
      </div>
      <div>
        <img src="/assets/bannerslider/Indian Spices-3-min.png" alt="banner1" />
      </div>
     
      <div>
        <img src="/assets\bannerslider\Indian Spices-2-min.png" alt="banner 2" />
      </div>

    </Carousel>
      </div>
    </div>
    
    </div>

    </>
  );
};

export default Bannerslider;
