import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import SidebarMenu from './SidebarMenu';
import Image from 'next/image';

const Bannerslider = () => {
  const banners = [
    "/assets/bannerslider/banner-4.png",
    "/assets/bannerslider/banner-1.png",
    "/assets/bannerslider/banner-2.png",
    "/assets/bannerslider/banner-3.png"
  ];

  return (
    <>
      <section>
        <div className="container-fluid mt-4">
          <div className="row">
            <div className="col-md-2">
              <SidebarMenu />
            </div>
            <div className="col-md-10">
              <Carousel
                autoPlay
                infiniteLoop
                interval={6000}
                showThumbs
                showStatus={false}
                renderThumbs={() =>
                  banners.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`thumb ${index + 1}`}
                      style={{ objectFit: 'cover' }}
                    />
                  ))
                }
              >
                {banners.map((src, index) => (
                  <div key={index}>
                    <Image
                      src={src}
                      alt={`banner ${index + 1}`}
                      width={2000}
                      height={650}
                      quality={100}                // ✅ Full Quality
                      priority={index === 0}        // ✅ Preload first image
                      placeholder="empty"           // ✅ Disable default blur
                      style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .carousel .slide {
          max-height: 650px;
        }

        .carousel .thumb {
          border: 2px solid transparent;
        }

        .carousel .thumb.selected {
          border-color: rgb(0, 0, 0);
        }
      `}</style>
    </>
  );
};

export default Bannerslider;
