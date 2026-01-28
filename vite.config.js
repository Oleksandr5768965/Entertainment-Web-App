import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "login.html"),
        bookmarked: resolve(__dirname, "bookmarked.html"),
        login: resolve(__dirname, "index.html"),
        movies: resolve(__dirname, "movies.html"),
        signUp: resolve(__dirname, "sign-up.html"),
        tvSeries: resolve(__dirname, "tv-series.html"),
        account: resolve(__dirname, "account.html"),
      },
    },
  },
});