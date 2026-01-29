document.addEventListener('DOMContentLoaded', () => {
    const recomendation = document.querySelector('.container.recomendation');
    const trending = document.querySelector('.container.trending');

fetch('./data.json')
    .then(res => res.json())
    .then(data => {
        data.forEach(movie => {
            const card = createMovieCard(movie);
            if (movie.isTrending) {
                trending.append(card);
            } else {
                recomendation.append(card);
            }
        });
    })
    .catch(console.error);
});
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
// BOOKMARK ICON STATE
// =======================
function updateBookmarkIcon(bookmark, img) {
    img.src = bookmark.classList.contains('is-active')
        ? './src/assets/icon-bookmark-full.svg'
        : './src/assets/icon-bookmark-empty.svg';
}
// =======================
// TRENDING STYLES
// =======================
function applyTrendingStyles(card) {
    card.className = 'movie-card-trending swiper-slide';

    card.querySelector('.movie-card__image')
        .className = 'movie-card-trending__image';

    card.querySelector('.movie-card__bookmark')
        .className = 'movie-card-trending__bookmark';

    card.querySelector('.movie-card__info')
        .className = 'movie-card-trending__info';

    card.querySelector('.movie-card__meta')
        .className = 'movie-card-trending__meta';

    card.querySelector('.movie-card__title')
        .className = 'movie-card-trending__title';
}

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
// DOT
// =======================
 export function dot() {
    const span = document.createElement('span');
    span.textContent = '•';
    span.className = 'movie-card__info-divider';
    return span;
}

// local Storage
const BOOKMARKS_KEY = 'bookmarks';
function getBookmarks() {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) ?? {};
}

function saveBookmark(id, value) {
    const bookmarks = getBookmarks();
    bookmarks[id] = value;
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}


