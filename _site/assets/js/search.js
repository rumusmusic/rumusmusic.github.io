document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchForm || !searchInput) return;
  
  // Initialize search index on first focus
  let searchIndex = null;
  let searchData = null;
  
  searchInput.addEventListener('focus', function() {
    if (!searchIndex) {
      initSearchIndex();
    }
  });
  
  searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    
    if (query.length < 2) {
      searchResults.classList.remove('active');
      searchResults.innerHTML = '';
      return;
    }
    
    if (searchIndex) {
      performSearch(query);
    } else {
      initSearchIndex().then(() => performSearch(query));
    }
  });
  
  document.addEventListener('click', function(e) {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.classList.remove('active');
    }
  });
  
  searchForm.addEventListener('submit', function(e) {
    const query = searchInput.value.trim();
    if (!query) {
      e.preventDefault();
    }
  });
  
  // Initialize search index
  function initSearchIndex() {
    return fetch('/search.json')
      .then(response => response.json())
      .then(data => {
        searchData = data;
        
        // Simple search index
        searchIndex = {};
        
        data.forEach((item, index) => {
          // Index title
          const titleTokens = tokenize(item.title);
          titleTokens.forEach(token => {
            if (!searchIndex[token]) searchIndex[token] = [];
            if (!searchIndex[token].includes(index)) {
              searchIndex[token].push(index);
            }
          });
          
          // Index artist
          const artistTokens = tokenize(item.artist);
          artistTokens.forEach(token => {
            if (!searchIndex[token]) searchIndex[token] = [];
            if (!searchIndex[token].includes(index)) {
              searchIndex[token].push(index);
            }
          });
          
          // Index content if available
          if (item.content) {
            const contentTokens = tokenize(item.content);
            contentTokens.forEach(token => {
              if (!searchIndex[token]) searchIndex[token] = [];
              if (!searchIndex[token].includes(index)) {
                searchIndex[token].push(index);
              }
            });
          }
        });
        
        return searchIndex;
      })
      .catch(error => {
        console.error('Error initializing search index:', error);
      });
  }
  
  // Tokenize text
  function tokenize(text) {
    if (!text) return [];
    
    // Convert to lowercase and remove special characters
    const normalized = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Split into tokens
    return normalized.split(' ').filter(token => token.length > 1);
  }
  
  // Perform search
  function performSearch(query) {
    const tokens = tokenize(query);
    
    if (tokens.length === 0) {
      searchResults.classList.remove('active');
      searchResults.innerHTML = '';
      return;
    }
    
    // Get matching document indices
    let matchingIndices = [];
    
    tokens.forEach(token => {
      const exactMatches = searchIndex[token] || [];
      
      // Find partial matches
      const partialMatches = [];
      Object.keys(searchIndex).forEach(indexedToken => {
        if (indexedToken.includes(token) && indexedToken !== token) {
          partialMatches.push(...searchIndex[indexedToken]);
        }
      });
      
      // Combine and deduplicate
      const allMatches = [...new Set([...exactMatches, ...partialMatches])];
      
      if (matchingIndices.length === 0) {
        matchingIndices = allMatches;
      } else {
        // Intersection for AND search behavior
        matchingIndices = matchingIndices.filter(idx => allMatches.includes(idx));
      }
    });
    
    // Get result items
    const results = matchingIndices.map(idx => searchData[idx]);
    
    // Display results
    if (results.length > 0) {
      searchResults.innerHTML = results.slice(0, 10).map(item => `
        <div class="search-result-item">
          <a href="${item.url}">
            <div class="result-title">${item.title}</div>
            <div class="result-artist">${item.artist}</div>
          </a>
        </div>
      `).join('');
      
      if (results.length > 10) {
        searchResults.innerHTML += `
          <div class="search-result-item">
            <a href="/search.html?q=${encodeURIComponent(query)}">
              <div class="result-title">Lihat semua hasil (${results.length})</div>
            </a>
          </div>
        `;
      }
    } else {
      searchResults.innerHTML = `
        <div class="no-results">
          <p>Tidak ada hasil untuk "${query}"</p>
        </div>
      `;
    }
    
    searchResults.classList.add('active');
  }
});
