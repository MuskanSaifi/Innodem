import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    name: "John Doe",
    title: "CEO, TechCorp",
    content: "This service exceeded our expectations. The team was, and delivered outstanding results!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane Smith",
    title: "Founder, GreenLeaf",
    content: "Working with them was a great experience. They really understood our needs and helped us grow.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Ali Khan",
    title: "CTO, DevSolutions",
    content: "Fantastic support and communication. Highly recommend them for any web-related projects!",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
  },
]

const Testimonials = () => {
  return (
   <section>
     <div className="bg-gradient-to-r from-indigo-100 to-purple-100 py-16 px-4 md:px-20">
      <h2 className="text-4xl font-bold text-center mb-12 text-purple-800">What Our Clients Say</h2>
      <Swiper
        spaceBetween={30}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1500: {
            slidesPerView: 3,
          },
        }}
        modules={[Autoplay, Pagination]}
        className="max-w-6xl mx-auto"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-10 text-center transition-all duration-500 hover:shadow-purple-400 mb-5 mx-4">
              <div className="flex flex-col items-center justify-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-24 h-24 rounded-full border-4 border-purple-300 shadow-lg mb-5 object-cover"
                />
                <FaQuoteLeft className="text-purple-400 text-3xl mb-4" />
                <p className="text-lg sm:text-xl text-gray-700 italic mb-6 max-w-xl">"{testimonial.content}"</p>
                <h3 className="text-2xl font-semibold text-purple-700">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
   </section>
  )
}

export default Testimonials
