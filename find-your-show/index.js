// Get references to HTML elements using their IDs
const searchVal = document.getElementById("search-val");
const searchBtn = document.getElementById("search-btn");

// Arrays to store movie IDs and movie objects
let moviesID = [];
let movies = [];

// Variable to store the current movie ID
let currentMovieID;

// Event listener for the search button
searchBtn.addEventListener("click", searchMovie);

// Event listener for the Enter key in the search input field
searchVal.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovie();
  }
});

// Async function to search for movies using the OMDB API
async function searchMovie() {
  // Get the title from the search input field
  let title = searchVal.value;

  // Fetch data from the OMDB API using the title
  const res = await fetch(`https://omdbapi.com/?s=${title}&apikey=74d77716`);

  // Convert the response to JSON format
  const data = await res.json();

  // Clear the search input field
  searchVal.value = "";

  // Clear the movies list on the HTML page
  document.getElementById("movies-list").innerHTML = "";

  // Check if there are search results
  if (data.Search) {
    // Extract IMDb IDs from the search results
    moviesID = data.Search.map(function (movieID) {
      return movieID.imdbID;
    });

    // Iterate through each IMDb ID to fetch detailed movie information
    for (let i = 0; i < moviesID.length; i++) {
      let id = moviesID[i];

      // Fetch detailed movie information using IMDb ID
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=74d77716&i=${id}`
      );

      // Convert the response to JSON format
      const data = await res.json();

      // Update the HTML page with the movie information
      updateMovie(data);

      // Add the movie to the watchlist
      watchlist(data);
    }
  } else {
    // Display a message if no search results are found
    document.getElementById(
      "movies-list"
    ).innerHTML = `  <div class="initial-text">
      <h2>Oops! We couldn't find anything. Please try another search.</h2>
      </div>`;
  }
}

// Function to update the HTML page with movie information
function updateMovie(movie) {
  let { Title, Runtime, Genre, Plot, imdbRating, Poster, imdbID } = movie;
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
                    <div id="${imdbID}">
                        <button class="watchlist-btn">+</button>
                    </div>
                </div>
                <div class="bottom">
                    <p class="plot">${Plot}</p>
                </div>
            </div>
        </div>
    </div>`;
}

// Function to add movies to the watchlist
function watchlist(movie) {
  // Get all watchlist buttons on the page
  const watchlistMovies = document.querySelectorAll(".watchlist-btn");

  // Iterate through each watchlist button
  for (let i = 0; i < watchlistMovies.length; i++) {
    // Add click event listener to each watchlist button
    watchlistMovies.item(i).addEventListener("click", (e) => {
      // Set the current movie ID to the clicked movie's IMDb ID
      currentMovieID = moviesID[i];

      // Store the current movie ID in local storage
      localStorage.setItem(
        JSON.stringify(currentMovieID),
        JSON.stringify(currentMovieID)
      );

      // Update the HTML to show that the movie has been added to the watchlist
      document.querySelector(
        `#${currentMovieID}`
      ).innerHTML = `<button id=${currentMovieID} class="watchlist-btn" style="display: none;"></button>
        <p class="movie-added">✅ Added</p>`;
    });
  }
}
