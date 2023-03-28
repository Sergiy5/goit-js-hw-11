import axios from 'axios';

export default class ImageApiService {
  constructor() {
    this.serchQuery = '';
    this.page = 1;
  }
  async fetchArticles() {
    const BASE_URL = 'https://pixabay.com/api/';
    try {
      const response = await axios
        .get(`${BASE_URL}`, {
          params: {
            key: '34644212-a58abb2fa8dd8599bef437aea',
            q: `${this.serchQuery}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: `${this.page}`,
            per_page: 40,
          },
        });
    return response.data } catch (error) {
      console.log(error.message)
    }
  }

  get query() {
    return this.serchQuery;
  }
  set query(newQuery) {
    this.serchQuery = newQuery;
  }
  incrementPage() {
      this.page += 1;
  
  }

  resetPage() {
    this.page = 1
  }

}
  
