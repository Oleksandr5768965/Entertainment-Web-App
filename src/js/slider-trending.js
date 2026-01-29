import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const swiper = new Swiper('.swiper', {
  modules: [Navigation, Pagination],
  direction: 'horizontal',
  loop: false,
  effect: 'fade',
  fadeEffect: {
    crossFade:true
  },
  breakpoints: {
    0: {
        slidesPerView: 1.5,
        spacesBetween: 16
    },
    768: {
        slidesPerView: 2,
        spacesBetween: 24
    },
    1440: {
        slidesPerView:3,
        spaceBetween:32
    }
  }
});