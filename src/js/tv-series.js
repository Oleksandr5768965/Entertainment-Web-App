import { dot } from './main';
// =======================
// OBJECT WITH DOM ELEMENTS 
// =======================
const domElement = {
    categoryTvSeries: document.querySelector(".container.tv-series"),
    categoryTvSeriesTitle: document.querySelector('.tv-series__title'),
    searchField: document.querySelector('#search-field')
}
// =======================
// LOCAL STORAGE FOR BOOKMARKED MOVIE CARD
// =======================
const BOOKMARKS_KEY = 'bookmarks';

function getBookmarks() {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) ?? {};
}

function saveBookmark(id, value) {
    const bookmarks = getBookmarks();
    bookmarks[id] = value;
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}
// =======================
// GET ACCES TO DATA
// =======================
let movies = [];
fetch('./data.json')
    .then(res => res.json())
    .then(data => {
      movies = data;
      data.forEach(movie => {
    const movieCard = createTvSeriesCard(movie);
    if (movie.category === "TV Series") {
        domElement.categoryTvSeries.append(movieCard);
    }
     });
   });
// =======================
// CREATE MOVIE CARD
// =======================
function createTvSeriesCard(movie) {
    const article = document.createElement('article');
    article.className = 'movie-card';
    // IMAGE
    const imageWrap = document.createElement('div');
    imageWrap.className = 'movie-card__image';
    const img = document.createElement('img');
    img.className = 'poster-img';
    img.src = movie.thumbnail.regular.small;
    // auto change image 
    img.srcset = `
      ${movie.thumbnail.regular.small} 375w,
      ${movie.thumbnail.regular.medium}  768w,
      ${movie.thumbnail.regular.large} 1140w
    `;
    img.sizes = `
      (max-width:375px) 100%,
      (max-width: 768px) 100%,
      1440px
    `;
    img.alt = movie.title;
    // BOOKMARK
    const bookmark = document.createElement('button');
    bookmark.className = 'movie-card__bookmark';
    const bookmarkImg = document.createElement('img');
    bookmarkImg.className = 'bookmark-img';
    bookmark.append(bookmarkImg);
    // начальное состояние
    bookmark.classList.toggle('is-active', movie.isBookmarked);
    updateBookmarkIcon(bookmark, bookmarkImg);
    // обработчик клика
    bookmark.addEventListener('click', () => {
    movie.isBookmarked = !movie.isBookmarked;
    bookmark.classList.toggle('is-active', movie.isBookmarked);
    updateBookmarkIcon(bookmark, bookmarkImg);
    saveBookmark(movie.id, movie.isBookmarked);
    });
    imageWrap.append(img, bookmark);

    // INFO
    const info = document.createElement('div');
    info.className = 'movie-card__info';

    const meta = document.createElement('div');
    meta.className = 'movie-card__meta';

    const year = document.createElement('span');
    year.textContent = movie.year;

    const category = document.createElement('span');
    category.textContent = movie.category;

    const rating = document.createElement('span');
    rating.textContent = movie.rating;
    const categoryImg = document.createElement('img');
    const categoryIcons = {
      Movie: './src/assets/icon-category-movie.svg',
      'TV Series': './src/assets/icon-category-tv.svg'
    };
    categoryImg.src = categoryIcons[movie.category];
    categoryImg.alt = 'category Img';
    meta.append(year, dot(), categoryImg, category, dot(), rating);

    const title = document.createElement('h3');
    title.className = 'movie-card__title';
    title.textContent = movie.title;

    info.append(meta, title);

    article.append(imageWrap, info);

    return article;
}
// =======================
// RENDER MOVIES CARD FOR SEARCH
// =======================
// title for search mode
const searchTitle = document.createElement('h2');
searchTitle.className = 'movies__search-result-title';
searchTitle.style.display = 'none';
domElement.categoryTvSeries.parentNode.insertBefore(
    searchTitle,
    domElement.categoryTvSeries
);

function renderMovies(list) {
    domElement.categoryTvSeries.innerHTML = '';

    list.forEach(movie => {
        const card = createTvSeriesCard(movie);
        domElement.categoryTvSeries.append(card);
    });
}
// =======================
// FILTER MOVIES FOR SEARCH
// =======================
function filterMovies(query) {
    const q = query.toLowerCase();

    return movies.filter(movie =>
        movie.title.toLowerCase().includes(q)
    );
}
// =======================
// EVENT LISTENER ON THE INPUT
// =======================
domElement.searchField.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (!value) {
        searchTitle.style.display = 'none';
        domElement.moviesTvSeriesTitle.style.display = 'block';
        renderMovies(movies);
        return;
    }
    domElement.moviesTvSeriesTitle.style.display = 'none';
    const filteredMovies = filterMovies(value);
    searchTitle.textContent =
        `Found ${filteredMovies.length} results for '${value}'`;
    searchTitle.style.display = 'block';
    renderMovies(filteredMovies);
});
// =======================
// MARKING NAV BUTTONS ON ANOTHER PAGES
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const navMap = {
        'index.html': '.header__navbar-buttons--img.home',
        'movies.html': '.header__navbar-buttons--img.movies',
        'tv-series.html': '.header__navbar-buttons--img.tv-series',
        'bookmarked.html': '.header__navbar-buttons--img.bookmarked',
    };

    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const selector = navMap[currentPage];
    if (!selector) return;

    document.querySelector(selector)?.classList.add('active');
});
// =======================
// BOOKMARK ICON STATE
// =======================
function updateBookmarkIcon(bookmark, img) {
    img.src = bookmark.classList.contains('is-active')
        ? './src/assets/icon-bookmark-full.svg'
        : './src/assets/icon-bookmark-empty.svg';
}