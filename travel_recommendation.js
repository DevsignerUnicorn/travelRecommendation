// Global array to hold all flattened destinations from the JSON file.
let allDestinations = [];

/**
 * Fetch the JSON data on page load.
 */
window.addEventListener('DOMContentLoaded', () => {
  fetch('travel_recommendation_api.json') // Ensure the file is in the correct path.
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Combine data from countries, temples, and beaches.
      allDestinations = combineAllData(data);
      console.log('Flattened travel data:', allDestinations);

      // Instead of showing all data on load, display a placeholder message.
      const resultsContainer = document.getElementById('recommendation-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = '<p>Please enter a search query to see recommendations.</p>';
      }
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    });
});

/**
 * Combine data from the provided JSON structure into one array.
 * The JSON structure includes:
 *  - data.countries (each with a nested cities array),
 *  - data.temples,
 *  - data.beaches.
 */
function combineAllData(data) {
  const combined = [];

  // Process each country's cities.
  if (Array.isArray(data.countries)) {
    data.countries.forEach(country => {
      if (Array.isArray(country.cities)) {
        country.cities.forEach(city => {
          combined.push({
            name: city.name,
            imageUrl: city.imageUrl,
            description: city.description,
            category: 'City',
            parentName: country.name // e.g., "Australia", "Japan", etc.
          });
        });
      }
    });
  }

  // Process temples.
  if (Array.isArray(data.temples)) {
    data.temples.forEach(temple => {
      combined.push({
        name: temple.name,
        imageUrl: temple.imageUrl,
        description: temple.description,
        category: 'Temple',
        parentName: '' // Not applicable.
      });
    });
  }

  // Process beaches.
  if (Array.isArray(data.beaches)) {
    data.beaches.forEach(beach => {
      combined.push({
        name: beach.name,
        imageUrl: beach.imageUrl,
        description: beach.description,
        category: 'Beach',
        parentName: '' // Not applicable.
      });
    });
  }

  return combined;
}

/**
 * Display the list of destinations in the #recommendation-results container.
 * @param {Array} destinations - The flattened list of destination objects.
 */
function displayRecommendations(destinations) {
  const resultsContainer = document.getElementById('recommendation-results');
  if (!resultsContainer) return;

  // Clear any existing results.
  resultsContainer.innerHTML = '';

  // If no destinations found, show a message.
  if (!destinations || destinations.length === 0) {
    resultsContainer.innerHTML = '<p>No recommendations found.</p>';
    return;
  }

  // Create a card for each destination.
  destinations.forEach(dest => {
    const card = document.createElement('div');
    card.classList.add('city-card');
    card.innerHTML = `
      <h3>${dest.name}</h3>
      <p><strong>Category:</strong> ${dest.category}</p>
      ${dest.parentName ? `<p><strong>Parent:</strong> ${dest.parentName}</p>` : ''}
      <img src="${dest.imageUrl}" alt="${dest.name}" style="max-width: 300px; display: block;">
      <p>${dest.description}</p>
    `;
    resultsContainer.appendChild(card);
  });
}

/**
 * Triggered when the user clicks the "Search" button.
 * Filters the allDestinations array based on the search query.
 */
function searchFunction() {
  const query = document.getElementById('search-input').value.trim();
  const lowerQuery = query.toLowerCase();
  console.log('Searching for:', lowerQuery);

  // If no query provided, show a placeholder message.
  if (!query) {
    const resultsContainer = document.getElementById('recommendation-results');
    resultsContainer.innerHTML = '<p>Please enter a search query to see recommendations.</p>';
    return;
  }

  if (!allDestinations || allDestinations.length === 0) {
    alert('Data not loaded yet. Please try again in a moment.');
    return;
  }

  let filtered = [];
  // Check if the query matches "beach" variations.
  if (lowerQuery === 'beach' || lowerQuery === 'beaches') {
    filtered = allDestinations.filter(item => item.category.toLowerCase() === 'beach');
  }
  // Check if the query matches "temple" variations.
  else if (lowerQuery === 'temple' || lowerQuery === 'temples') {
    filtered = allDestinations.filter(item => item.category.toLowerCase() === 'temple');
  }
  // Check if the query matches "country" variations.
  else if (lowerQuery === 'country' || lowerQuery === 'countries') {
    // Since we do not have country-level recommendations, show cities (which are grouped by country).
    filtered = allDestinations.filter(item => item.category.toLowerCase() === 'city');
  }
  // Otherwise, use default filtering (matches in name, description, or parentName).
  else {
    filtered = allDestinations.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      (item.parentName && item.parentName.toLowerCase().includes(lowerQuery))
    );
  }

  // Display the filtered results.
  const resultsContainer = document.getElementById('recommendation-results');
  if (resultsContainer) {
    displayRecommendations(filtered);
  } else {
    alert(`Found ${filtered.length} destinations matching your search.`);
  }
}

/**
 * Triggered when the user clicks the "Reset" button.
 * Clears the search input and shows a placeholder message.
 */
function resetFunction() {
  document.getElementById('search-input').value = '';
  const resultsContainer = document.getElementById('recommendation-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = '<p>Please enter a search query to see recommendations.</p>';
  }
}