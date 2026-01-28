import { dot } from './main';
const categoryMovies = document.querySelector(".container.movies");

fetch('./data.json')
    .then(res => res.json())
    .then(data => {
      data.forEach(movie => {
        const movieCard = createMovieCard(movie);
            if (movie.category === "Movie") {
                categoryMovies.append(movieCard);
            }
      });
    });
function createMovieCard(movie) {
    const article = document.createElement('article');
    article.className = 'movie-card';
    // IMAGE
    const imageWrap = document.createElement('div');
    imageWrap.className = 'movie-card__image';
    const img = document.createElement('img');
    img.className = 'poster-img';
    img.src = movie.thumbnail.regular.small;
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

    meta.append(year, dot(), category, dot(), rating);

    const title = document.createElement('h3');
    title.className = 'movie-card__title';
    title.textContent = movie.title;

    info.append(meta, title);

    article.append(imageWrap, info);

    return article;
}
function updateBookmarkIcon(bookmark, img) {
    img.src = bookmark.classList.contains('is-active')
        ? './src/assets/icon-bookmark-full.svg'
        : './src/assets/icon-bookmark-empty.svg';
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