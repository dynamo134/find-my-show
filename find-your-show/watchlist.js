const moviesDisplay = document.getElementById("movies-list");
let moviesID = [];
let currentMovieID;

for (let i = 0; i < localStorage.length; i++) {
  document.getElementById("movies-list").innerHTML = "";
  let key = localStorage.key(i);
  let id = JSON.parse(localStorage.getItem(key));
  moviesID.unshift(id);
}

moviesFromLocalStorage();

async function moviesFromLocalStorage() {
  for (let i = 0; i < moviesID.length; i++) {
    let id = moviesID[i];
    const res = await fetch(`https://www.omdbapi.com/?apikey=74d77716&i=${id}`);
    const data = await res.json();
    updateMovie(data);
    removeFromWatchlist();
  }
}

function updateMovie(movie) {
  let { Title, Runtime, Genre, Plot, imdbRating, Poster } = movie;

  document.getElementById("movies-list").innerHTML += `
    
    <div class="container">
      <div class="flex">
          <div class="left-container">
              <img class="movie-poster" src=${Poster} alt="N/A" onerror="this.onerror=null;this.src='./crying.jpg';">
          </div>
          <div class="right-container">
              <div class="flex top">
                  <h2 class="title">${Title}</h2>
                  <p class="imdb-rating">⭐ ${imdbRating}</p>
              </div>
              <div class="flex middle">
                <div class="flex-col">
                    <p class="runtime">${Runtime}</p>
                    <p class="genre">${Genre}</p>
                </div>
                <button class="watchlist-btn" type="submit">-</button>
              </div>
              <div class="bottom">
                  <p class="plot">${Plot}</p>
              </div>
          </div>
      </div>
  </div>
  
    `;
}

function removeFromWatchlist() {
  const watchlistMovies = document.querySelectorAll(".watchlist-btn");
  for (let i = 0; i < watchlistMovies.length; i++) {
    watchlistMovies.item(i).addEventListener("click", (e) => {
      currentMovieID = moviesID[i];
      localStorage.removeItem(JSON.stringify(currentMovieID));
      location.reload();
    });
  }
}
