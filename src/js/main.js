document.addEventListener('DOMContentLoaded', () => {

    // =======================
    // DOM elements safe init
    // =======================
    const domElement = {
        recomendation: document.querySelector('.container.recomendation'),
        recomendationTitle: document.querySelector('.recomendation__title'),
        trending: document.querySelector('.container.trending'),
        trendingContainer: document.querySelector('.trending'),
        trendingTitle: document.querySelector('.trending__title'),
        searchField: document.querySelector('#search-field'),
        authorInfo: document.querySelector('.author-info')
    };
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
    // FETCH DATA
    // =======================
    let movies = [];

    fetch('./data.json')
        .then(res => res.json())
        .then(data => {
            movies = data;
            renderMovies(movies);
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

        const bookmark = document.createElement('button');
        bookmark.className = movie.isTrending
            ? 'movie-card-trending__bookmark'
            : 'movie-card__bookmark';

        const bookmarkImg = document.createElement('img');
        bookmarkImg.className = 'bookmark-img';
        bookmark.append(bookmarkImg);

        movie.isBookmarked = getBookmarks()[movie.id] ?? movie.isBookmarked;
        bookmark.classList.toggle('is-active', movie.isBookmarked);
        updateBookmarkIcon(bookmark, bookmarkImg);

        bookmark.addEventListener('click', () => {
            movie.isBookmarked = !movie.isBookmarked;
            bookmark.classList.toggle('is-active', movie.isBookmarked);
            updateBookmarkIcon(bookmark, bookmarkImg);
            saveBookmark(movie.id, movie.isBookmarked);
        });

        imageWrap.append(img, bookmark);

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
        categoryImg.alt = "category-img";

        meta.append(year, dot(), categoryImg, category, dot(), rating);

        const title = document.createElement('h3');
        title.className = movie.isTrending
            ? 'movie-card-trending__title'
            : 'movie-card__title';

        title.textContent = movie.title;
        info.append(meta, title);

        if (movie.isTrending) imageWrap.append(info), article.append(imageWrap);
        else article.append(imageWrap, info);

        return article;
    }

    // =======================
    // SEARCH RESULT TITLE node
    // =======================
    let searchTitle;
    if (domElement.trending) {
        searchTitle = document.createElement('h2');
        searchTitle.className = 'movies__search-result-title';
        searchTitle.style.display = 'none';
        domElement.trending.parentNode.insertBefore(searchTitle, domElement.trending);
    }

    // =======================
    // RENDER
    // =======================
    function renderMovies(list) {
        if (domElement.recomendation) domElement.recomendation.innerHTML = '';
        if (domElement.trending) domElement.trending.innerHTML = '';

        list.forEach(movie => {
            const card = createMovieCard(movie);
            if (movie.isTrending && domElement.trending)  domElement.trending.append(card);
            else if (!movie.isTrending && domElement.recomendation) domElement.recomendation.append(card); 
        });
    }

    // =======================
    // SEARCH
    // =======================
    function filterMovies(query) {
        const lowered = query.toLowerCase();
        return movies.filter(m => m.title.toLowerCase().includes(lowered));
    }
    if (domElement.searchField) { 
        domElement.searchField.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    // setting a state
    document.body.classList.toggle("is-searching", Boolean(value));
    if (!value) {
        searchTitle.style.display = 'none';
        domElement.authorInfo.style.display = 'block';
        renderMovies(movies);
        return;
    }

    domElement.authorInfo.style.display = 'none';

    const filteredMovies = filterMovies(value);
    searchTitle.textContent =
        `Found ${filteredMovies.length} results for '${value}'`;
    searchTitle.style.display = 'block';

    renderMovies(filteredMovies);
    });
    }
// =======================
// MARKING NAV BUTTONS ON ANOTHER PAGES
// =======================
// =======================
// MARKING NAV BUTTONS ON ANOTHER PAGES
// =======================
function getCurrentPage() {
    const path = window.location.pathname;

    if (path.endsWith('/') || path.endsWith('index.html')) {
        return 'index';
    }
    if (path.includes('movies')) return 'movies';
    if (path.includes('tv-series')) return 'tv-series';
    if (path.includes('bookmarked')) return 'bookmarked';

    return null;
}

const navMap = {
    index: '.header__navbar-buttons--img.home',
    movies: '.header__navbar-buttons--img.movies',
    'tv-series': '.header__navbar-buttons--img.tv-series',
    bookmarked: '.header__navbar-buttons--img.bookmarked'
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('dom load');
    const page = getCurrentPage();
    if (!page) return;

    const selector = navMap[page];
    const navBtn = document.querySelector(selector);

    if (!navBtn) {
        console.warn('Nav button not found:', selector);
        return;
    }

    navBtn.classList.add('active');
});
function updateBookmarkIcon(bookmark, img) {
    img.src = bookmark.classList.contains('is-active')
        ? './src/assets/icon-bookmark-full.svg'
        : './src/assets/icon-bookmark-empty.svg';
}

});
    export function dot() {
        const span = document.createElement('span');
        span.textContent = '•';
        span.className = 'movie-card__info-divider';
        return span;
    }

