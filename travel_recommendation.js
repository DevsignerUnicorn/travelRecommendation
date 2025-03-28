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

      // If the home page is loaded (i.e. recommendation-results exists), display all destinations.
      const resultsContainer = document.getElementById('recommendation-results');
      if (resultsContainer) {
        displayRecommendations(allDestinations);
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
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  console.log('Searching for:', query);

  if (!allDestinations || allDestinations.length === 0) {
    alert('Data not loaded yet. Please try again in a moment.');
    return;
  }

  // Filter by name, description, or parent name.
  const filtered = allDestinations.filter(item => {
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      (item.parentName && item.parentName.toLowerCase().includes(query))
    );
  });

  // If on the home page (results container exists), display the filtered results.
  const resultsContainer = document.getElementById('recommendation-results');
  if (resultsContainer) {
    displayRecommendations(filtered);
  } else {
    alert(`Found ${filtered.length} destinations matching your search.`);
  }
}

/**
 * Triggered when the user clicks the "Reset" button.
 * Clears the search input and displays all destinations again.
 */
function resetFunction() {
  document.getElementById('search-input').value = '';
  const resultsContainer = document.getElementById('recommendation-results');
  if (resultsContainer && allDestinations.length > 0) {
    displayRecommendations(allDestinations);
  }
}