// =======================
// OBJECT WITH DOM ELEMENTS 
// =======================
    const domElement = {
        recomendation: document.querySelector('.container.recomendation'),
        recomendationTitle: document.querySelector('.recomendation__title'),
        trending: document.querySelector('.container.trending'),
        trendingTitle: document.querySelector('.trending__title'),
        searchField: document.querySelector('#search-field'),
        authorInfo: document.querySelector('.author-info')
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
            const card = createMovieCard(movie);
            if (movie.isTrending) {
                domElement.trending.append(card);
            } else {
                domElement.recomendation.append(card);
            }
        });
    })
    .catch(console.error);
// =======================
// CREATE MOVIE CARD
// =======================
function createMovieCard(movie) {
    const article = document.createElement('article');
    article.className = movie.isTrending
        ? 'movie-card-trending swiper-slide'
        : 'movie-card';

    // IMAGE WRAP
    const imageWrap = document.createElement('div');
    imageWrap.className = movie.isTrending
        ? 'movie-card-trending__image'
        : 'movie-card__image';

    const img = document.createElement('img');
    img.className = 'poster-img';
    img.src = movie.thumbnail.regular.small;
    img.srcset = `
        ${movie.thumbnail.regular.small} 375w,
        ${movie.thumbnail.regular.medium} 768w,
        ${movie.thumbnail.regular.large} 1140w
    `;
    img.sizes = '(max-width: 768px) 100%, 1140px';
    img.alt = movie.title;

    // BOOKMARK
    const bookmark = document.createElement('button');
    bookmark.className = movie.isTrending
        ? 'movie-card-trending__bookmark'
        : 'movie-card__bookmark';

    const bookmarkImg = document.createElement('img');
    bookmarkImg.className = 'bookmark-img';

    bookmark.append(bookmarkImg);

    // bookmark state
    const bookmarks = getBookmarks();
    movie.isBookmarked = bookmarks[movie.id] ?? movie.isBookmarked;

    bookmark.classList.toggle('is-active', movie.isBookmarked);
    updateBookmarkIcon(bookmark, bookmarkImg);

    bookmark.addEventListener('click', () => {
        movie.isBookmarked = !movie.isBookmarked;
        bookmark.classList.toggle('is-active', movie.isBookmarked);
        updateBookmarkIcon(bookmark, bookmarkImg);
        saveBookmark(movie.id, movie.isBookmarked);
    });

    imageWrap.append(img, bookmark);

    // INFO
    const info = document.createElement('div');
    info.className = movie.isTrending
        ? 'movie-card-trending__info'
        : 'movie-card__info';

    const meta = document.createElement('div');
    meta.className = movie.isTrending
        ? 'movie-card-trending__meta'
        : 'movie-card__meta';

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
    title.className = movie.isTrending
        ? 'movie-card-trending__title'
        : 'movie-card__title';

    title.textContent = movie.title;

    info.append(meta, title);

    if (movie.isTrending) {
        imageWrap.append(info);
        article.append(imageWrap);
    } else {
        article.append(imageWrap, info);
    }

    return article;
}
// =======================
// RENDER MOVIES CARD FOR SEARCH
// =======================
// title for search mode
const searchTitle = document.createElement('h2');
searchTitle.className = 'recomendation__search-result-title';
searchTitle.style.display = 'none';
// domElement.trending.parentNode.insertBefore(
//     searchTitle,
//     domElement.trending
// );

function renderMovies(list) {
    domElement.recomendation.innerHTML = '';
    domElement.trending.innerHTML = '';

    list.forEach(movie => {
        const card = createMovieCard(movie);
       
        if (movie.isTrending) {
            domElement.trending.append(card);
        } else {
            domElement.recomendation.append(card);
        }
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
        domElement.recomendationTitle.style.display = 'block';
        domElement.trendingTitle.style.display = 'block';
        domElement.authorInfo.style.display = 'block';
        renderMovies(movies);
        return;
    }
    domElement.recomendationTitle.style.display = 'none';
    domElement.trendingTitle.style.display = 'none';
    domElement.authorInfo.style.display = 'none';
    const filteredMovies = filterMovies(value);
    searchTitle.textContent =
        `Found ${filteredMovies.length} results for '${value}'`;
    searchTitle.style.display = 'block';
    renderMovies(filteredMovies);
});
// =======================
// UPDATE BOOKMARK ICON STATE
// =======================
function updateBookmarkIcon(bookmark, img) {
    img.src = bookmark.classList.contains('is-active')
        ? './src/assets/icon-bookmark-full.svg'
        : './src/assets/icon-bookmark-empty.svg';
}
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
// DOT DIVIDER
// =======================
 export function dot() {
    const span = document.createElement('span');
    span.textContent = '•';
    span.className = 'movie-card__info-divider';
    return span;
}


