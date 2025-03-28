function searchFunction() {
    const query = document.getElementById('search-input').value;
    console.log('Searching for:', query);
    alert('Searching for: ' + query);
    // You can later fetch travel recommendations from travel_recommendation.json based on the query.
  }
  
  function resetFunction() {
    document.getElementById('search-input').value = '';
  }