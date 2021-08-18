export default function getRefs() {
  return {
    searchForm: document.querySelector('#search-form'),
    galleryContainer: document.querySelector('.js-gallery'),
    img: document.querySelector('.gallery__item'),
    loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
    scrollElem: document.querySelector('.scroll-elem'),
  };
}
