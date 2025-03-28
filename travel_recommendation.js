// Global variable to store fetched data
let travelData = null;

// Fetch data as soon as the page loads
window.addEventListener('DOMContentLoaded', () => {
  // Attempt to fetch the JSON file
  fetch('travel_recommendation_api.json') // Update path/filename if needed
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      travelData = data;
      console.log('Fetched travel data:', travelData);

      // If you're on the home page (with #recommendation-results), display all results immediately
      const resultsContainer = document.getElementById('recommendation-results');
      if (resultsContainer && travelData.cities) {
        displayRecommendations(travelData.cities);
      }
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    });
});

/**
 * Displays the array of city objects inside the #recommendation-results container.
 * @param {Array} citiesArray - An array of city objects from the JSON.
 */
function displayRecommendations(citiesArray) {
  const resultsContainer = document.getElementById('recommendation-results');
  if (!resultsContainer) return; // If this element doesn't exist, skip.

  // Clear any existing results
  resultsContainer.innerHTML = '';

  // If no data or empty array, show a "no recommendations" message
  if (!citiesArray || citiesArray.length === 0) {
    resultsContainer.innerHTML = '<p>No recommendations found.</p>';
    return;
  }

  // Create a card for each city
  citiesArray.forEach(city => {
    const cityDiv = document.createElement('div');
    cityDiv.classList.add('city-card');

    // Use data from the JSON file (adjust properties to match your JSON)
    cityDiv.innerHTML = `
      <h3>${city.name}</h3>
      <img src="${city.imageURL}" alt="${city.name}" style="max-width: 300px; display: block;">
      <p>${city.description}</p>
    `;

    resultsContainer.appendChild(cityDiv);
  });
}

/**
 * Triggered when the user clicks the Search button.
 * Filters data based on the user’s query and displays the filtered list.
 */
function searchFunction() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  console.log('Searching for:', query);

  if (!travelData || !travelData.cities) {
    alert('Data not loaded yet. Please try again in a moment.');
    return;
  }

  // Filter the cities array by matching the query in either name or description
  const filteredCities = travelData.cities.filter(city =>
    city.name.toLowerCase().includes(query) ||
    city.description.toLowerCase().includes(query)
  );

  // Display filtered results (only if we're on the home page with #recommendation-results)
  displayRecommendations(filteredCities);
}

/**
 * Triggered when the user clicks the Reset button.
 * Clears the search input and displays all cities again.
 */
function resetFunction() {
  document.getElementById('search-input').value = '';

  if (travelData && travelData.cities) {
    // Show all data (only if #recommendation-results exists on this page)
    displayRecommendations(travelData.cities);
  }
}