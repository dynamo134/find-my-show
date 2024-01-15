// Get reference to the movies list element
const moviesDisplay = document.getElementById("movies-list");

// Array to store movie IDs from local storage
let moviesID = [];

// Variable to store the current movie ID
let currentMovieID;

// Loop through all items in local storage to retrieve movie IDs
for (let i = 0; i < localStorage.length; i++) {
  // Clear the movies list element HTML in each iteration
  document.getElementById("movies-list").innerHTML = "";

  // Get the key (movie ID) from local storage
  let key = localStorage.key(i);

  // Parse the movie ID from JSON stored in local storage
  let id = JSON.parse(localStorage.getItem(key));

  // Add the movie ID to the moviesID array (unshift adds to the beginning of the array)
  moviesID.unshift(id);
}

// Call the function to fetch and display movies from local storage
moviesFromLocalStorage();

// Function to fetch and display movies from local storage
async function moviesFromLocalStorage() {
  // Iterate through each movie ID in the moviesID array
  for (let i = 0; i < moviesID.length; i++) {
    // Get the current movie ID
    let id = moviesID[i];

    // Fetch detailed movie information using the IMDb ID
    const res = await fetch(`https://www.omdbapi.com/?apikey=74d77716&i=${id}`);

    // Convert the response to JSON format
    const data = await res.json();

    // Update the HTML page with the movie information
    updateMovie(data);

    // Add event listener to each remove-from-watchlist button
    removeFromWatchlist();
  }
}

// Function to update the HTML page with movie information
function updateMovie(movie) {
  // Destructure properties from the movie object
  let { Title, Runtime, Genre, Plot, imdbRating, Poster } = movie;

  // Append movie information to the movies list element
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

// Function to add event listeners for removing movies from the watchlist
function removeFromWatchlist() {
  // Get all buttons with the class "watchlist-btn"
  const watchlistMovies = document.querySelectorAll(".watchlist-btn");

  // Iterate through each remove-from-watchlist button
  for (let i = 0; i < watchlistMovies.length; i++) {
    // Add a click event listener to each button
    watchlistMovies.item(i).addEventListener("click", (e) => {
      // Get the current movie ID
      currentMovieID = moviesID[i];

      // Remove the movie from local storage using its ID
      localStorage.removeItem(JSON.stringify(currentMovieID));

      // Reload the page to reflect the updated watchlist
      location.reload();
    });
  }
}
