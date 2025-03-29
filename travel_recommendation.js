// Global array to hold all flattened destinations from the JSON file.
let allDestinations = [];

// Fetch the JSON data when the page loads.
window.addEventListener('DOMContentLoaded', () => {
  fetch('travel_recommendation_api.json')
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

      // Instead of displaying all data on load, show a placeholder message.
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
            parentName: country.name
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
        parentName: ''
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
        parentName: ''
      });
    });
  }

  return combined;
}

/**
 * Display the list of destinations in the #recommendation-results container.
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

  // Create a container for all cards.
  const cardList = document.createElement('div');
  cardList.classList.add('card-list');

  // Create a card for each destination.
  destinations.forEach(dest => {
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('city-card');
    cardWrapper.innerHTML = `
      <img src="${dest.imageUrl}" alt="${dest.name}" class="city-image">
      <div class="card-content">
        <h3>${dest.name}</h3>
        <p>${dest.description}</p>
      </div>
    `;
    cardList.appendChild(cardWrapper);
  });

  // Append the cards to the results container.
  resultsContainer.appendChild(cardList);
}

/**
 * Triggered when the user clicks the "Search" button.
 */
function searchFunction() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  console.log('Searching for:', query);

  if (!query) {
    const resultsContainer = document.getElementById('recommendation-results');
    resultsContainer.innerHTML = '<p>Please enter a search query to see recommendations.</p>';
    return;
  }

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

  const resultsContainer = document.getElementById('recommendation-results');
  if (resultsContainer) {
    displayRecommendations(filtered);
  } else {
    alert(`Found ${filtered.length} destinations matching your search.`);
  }
}

/**
 * Triggered when the user clicks the "Reset" button.
 */
function resetFunction() {
  document.getElementById('search-input').value = '';
  const resultsContainer = document.getElementById('recommendation-results');
  if (resultsContainer) {
    resultsContainer.innerHTML = '<p>Please enter a search query to see recommendations.</p>';
  }
}
