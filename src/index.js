import imageCardTpl from './templates/imageCard.hbs';

import getRefs from './js/get-refs';
import PicturesApiService from './js/apiService';

import * as basicLightbox from 'basiclightbox';
import * as PNotify from '@pnotify/core/dist/PNotify';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile';
import '@pnotify/core/dist/BrightTheme.css';
import { defaults } from '@pnotify/core';

PNotify.defaultModules.set(PNotifyMobile, {});
defaults.delay = 2000;

const refs = getRefs();

const picturesApiService = new PicturesApiService();

refs.searchForm.addEventListener('submit', onSearch);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  picturesApiService.query = evt.currentTarget.elements.query.value;

  if (picturesApiService.query === '') {
    return PNotify.error({
      text: 'Please, enter something to search!',
    });
  }

  picturesApiService.resetPage();
  picturesApiService.fetchPictures().then(hits => {
    // нотификации
    if (hits.length !== 0) {
      PNotify.success({
        text: 'Look, what have been found!',
      });
    } else {
      PNotify.error({
        text: 'Please, check your query!',
      });
    }

    clearGalleryContainer();
    appendPicturesMarkup(hits);
  });
}

function appendPicturesMarkup(hits) {
  refs.galleryContainer.insertAdjacentHTML('beforeend', imageCardTpl(hits));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

// infinite Scroll
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && picturesApiService.query !== '') {
      picturesApiService.fetchPictures().then(hits => {
        appendPicturesMarkup(hits);
      });
    }
  });
};
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '100px',
});
observer.observe(refs.infiniteScroll);

// largeImage on click

refs.galleryContainer.addEventListener('click', onImgClick);

function onImgClick(evt) {
  evt.preventDefault();

  // const isGalleryImageEl = evt.target.classList.contains('image');
  // if (!isGalleryImageEl) {
  //   return;
  // }
  const largeImageURL = evt.target.alt;
  // console.log(largeImageURL);

  const instance = basicLightbox.create(`<img src="${largeImageURL}" width="100%">`);
  instance.show();
}
