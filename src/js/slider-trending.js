import Swiper from 'swiper';
import { Parallax, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';


const swiper = new Swiper('.swiper', {
  modules: [ Parallax, Pagination, Navigation],
  speed:800,
  paralax: true,
  direction: 'horizontal',
  loop: false,
  slidesPerView: 'auto',
  spaceBetween: 0,
  watchOverflow: true,
  centeredSlides: false,
  effect: 'fade',
  fadeEffect: {
    crossFade:true
  },
  mousewheel: {
    forceToAxis: true,
  },
  breakpoints: {
    0: {
        slidesPerView: 1,
        spacesBetween: 16
    },
    768: {
        slidesPerView: 2,
        spacesBetween: 40
    },
    1440: {
        slidesPerView:3,
        spaceBetween:32
    }
  }
});