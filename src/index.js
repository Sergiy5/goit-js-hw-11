
import ImageApiService from './queryAxios';
import axios from 'axios';



const refs = {
  serchForm: document.querySelector('.search-form'),
  btnSubmit: document.querySelector('button[type="submit"]'),
  btnLoadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const imageApiService = new ImageApiService();

// console.log(imageApiService);

refs.serchForm.addEventListener('submit', serchImage);
refs.btnLoadMore.addEventListener('click', onLoadMore);

async function serchImage(e) {
    e.preventDefault();

    imageApiService.query = e.currentTarget.elements.searchQuery.value;
    imageApiService.resetPage();
    clearArticlesContainer();
    imageApiService.fetchArticles().then(appendArticlesMarkup);
   
}
 
    function onLoadMore() {
        imageApiService.fetchArticles().then(appendArticlesMarkup);
    }

function appendArticlesMarkup(articles) {
    const markupArticles = articles.map(({ webformatURL, tags, likes, views, comments, downloads }) => {
        return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`;
    });
    return refs.gallery.insertAdjacentHTML('beforeend', markupArticles);
}

function clearArticlesContainer() {
    refs.gallery.innerHTML = '';
}