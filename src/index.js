
import ImageApiService from './queryAxios';
import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  serchForm: document.querySelector('.search-form'),
  btnSubmit: document.querySelector('button[type="submit"]'),
  btnLoadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const imageApiService = new ImageApiService();

refs.serchForm.addEventListener('submit', serchImage);
refs.btnLoadMore.addEventListener('click', onLoadMore);
refs.btnLoadMore.style.display = 'none'

async function serchImage(e) {
    e.preventDefault();

  const eSearch = e.currentTarget.elements.searchQuery.value;
  
// Перевірка чи співпадає запит з вже з існуючим запитом
  if (imageApiService.query !== eSearch) {
    onLoadSpiner();
    
  imageApiService.query = eSearch;
    imageApiService.resetPage();
    clearArticlesContainer();
    imageApiService
      .fetchArticles()
      .then(articles => {
        
        if (articles.hits.length === 0) {
          return notifyIfQueryEmpty();
        }
        infoTotalHits(articles);
        refs.btnLoadMore.style.display = 'block';
        
        return appendArticlesMarkup(articles);
      })
      .catch(e => console.log(e)).finally(response => { Loading.remove(); lightbox.refresh();});
  } 
}
 
function onLoadMore() {
  lightbox.refresh();
      onLoadSpiner();
      imageApiService
        .fetchArticles()
        .then(articles => {
          // Визначення номеру останньої сторінки (округлення до набільшого)
          const lastPage = Math.ceil(Number(articles.totalHits) / 40);

          if (lastPage === imageApiService.page - 2) {
            return onLastlHit(articles);
          }
          notifyTotalHits(articles);
          appendArticlesMarkup(articles);
        })
        .catch(e => console.log(e))
        .finally(Loading.remove());
    }

function appendArticlesMarkup(articles) {
    const markupArticles = articles.hits
      .map(
        ({
          webformatURL,
          tags,
          likes,
          views,
          comments,
          downloads,
          largeImageURL,
        }) => {
          return `<a class="gallery__item" href="${largeImageURL}" >
        <div class="photo-card">
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
</div></a>`;
        }
      )
      .join('');
  return refs.gallery.insertAdjacentHTML('beforeend', markupArticles);
  
}

function clearArticlesContainer() {
    refs.gallery.innerHTML = '';
}

function notifyIfQueryEmpty() {
  Notiflix.Notify.info(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function onLastlHit(articles) {
  refs.btnLoadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    ); 
}

function infoTotalHits(articles) {
  Notiflix.Notify.info(`Hooray! We found ${articles.totalHits} images.`);
}

function notifyTotalHits(articles) {
  let allHits = articles.totalHits;
  if (articles.totalHits > 40 ) {
    allHits =
      Number(articles.totalHits) - 40 * Number(imageApiService.page - 2);
  }
  Notiflix.Notify.info(`Everything is left here ${allHits} images.`);
}
function onLoadSpiner() {
  Loading.pulse({clickToClose: true, svgSize: '100px',});
}

const lightbox = new SimpleLightbox(".gallery a", {
  captionsData: 'alt',
  captionDelay: 250,
});