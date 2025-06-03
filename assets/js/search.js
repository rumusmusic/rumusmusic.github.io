/**
 * Enhanced Jekyll Blog Search System
 * Provides comprehensive real-time search functionality for Jekyll posts
 * with advanced data access and template integration
 */
class JekyllSearch {
    constructor() {
        this.searchData = null;
        this.searchInput = null;
        this.searchResults = null;
        this.searchResultsList = null;
        this.searchClear = null;
        this.searchNoResults = null;
        this.searchLoading = null;
        this.searchError = null;
        this.searchResultsCount = null;
        this.searchResultsQuery = null;
        
        this.debounceTimer = null;
        this.minSearchLength = 2;
        this.maxResults = 20;
        this.searchHistory = [];
        this.maxHistory = 10;
        
        // Advanced search configurations
        this.searchConfig = {
            enableFuzzySearch: true,
            enableAdvancedFiltering: true,
            enableContentPreview: true,
            enableSearchSuggestions: true,
            searchInContent: true,
            searchInTags: true,
            searchInCategories: true,
            searchInExcerpts: true,
            highlightMatches: true
        };
        
        this.init();
    }
    
    /**
     * Initialize the search system
     */
    async init() {
        this.bindElements();
        this.bindEvents();
        await this.loadSearchData();
    }
    
    /**
     * Bind DOM elements
     */
    bindElements() {
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        this.searchResultsList = document.getElementById('search-results-list');
        this.searchClear = document.getElementById('search-clear');
        this.searchNoResults = document.getElementById('search-no-results');
        this.searchLoading = document.getElementById('search-loading');
        this.searchError = document.getElementById('search-error');
        this.searchResultsCount = document.getElementById('search-results-count');
        this.searchResultsQuery = document.getElementById('search-results-query');
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });
            
            this.searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.clearSearch();
                }
            });
        }
        
        if (this.searchClear) {
            this.searchClear.addEventListener('click', () => {
                this.clearSearch();
            });
        }
        
        // Handle clicks on search results
        if (this.searchResultsList) {
            this.searchResultsList.addEventListener('click', (e) => {
                const resultItem = e.target.closest('.search-result-item');
                if (resultItem) {
                    const link = resultItem.querySelector('.search-result-title');
                    if (link && e.target !== link) {
                        link.click();
                    }
                }
            });
        }
    }
    
    /**
     * Load search data from JSON file with enhanced data processing
     */
    async loadSearchData() {
        try {
            this.showLoading();
            
            // Try multiple endpoints for comprehensive data access
            const endpoints = ['/search.json', './search.json', `${window.location.origin}/search.json`];
            let response = null;
            
            for (const endpoint of endpoints) {
                try {
                    response = await fetch(endpoint);
                    if (response.ok) break;
                } catch (e) {
                    console.warn(`Failed to fetch from ${endpoint}:`, e);
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`HTTP error! status: ${response?.status || 'Network error'}`);
            }
            
            this.searchData = await response.json();
            
            if (!this.searchData || !this.searchData.posts || !Array.isArray(this.searchData.posts)) {
                throw new Error('Invalid search data format');
            }
            
            // Enhanced data processing
            this.processSearchData();
            this.loadSearchHistory();
            this.hideAllStates();
            
            // Auto-focus search input if on search page
            if (window.location.pathname.includes('search') && this.searchInput) {
                this.searchInput.focus();
            }
            
            console.log(`Search index loaded: ${this.searchData.posts.length} posts`);
            
        } catch (error) {
            console.error('Failed to load search data:', error);
            this.showError();
        }
    }
    
    /**
     * Process and enhance search data for better search performance
     */
    processSearchData() {
        if (!this.searchData || !this.searchData.posts) return;
        
        this.searchData.posts = this.searchData.posts.map(post => {
            // Create searchable content combining all text fields
            const searchableContent = [
                post.title || '',
                post.content || '',
                post.excerpt || '',
                (post.tags || []).join(' '),
                (post.categories || []).join(' ')
            ].join(' ').toLowerCase();
            
            // Extract keywords for better search matching
            const keywords = this.extractKeywords(searchableContent);
            
            // Calculate content metrics
            const wordCount = (post.content || '').split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // Average reading speed
            
            return {
                ...post,
                searchableContent,
                keywords,
                wordCount,
                readingTime,
                // Ensure arrays exist
                tags: post.tags || [],
                categories: post.categories || []
            };
        });
    }
    
    /**
     * Extract keywords from content for enhanced search
     */
    extractKeywords(content) {
        const commonWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'
        ]);
        
        return content
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !commonWords.has(word))
            .reduce((acc, word) => {
                acc[word] = (acc[word] || 0) + 1;
                return acc;
            }, {});
    }
    
    /**
     * Load search history from localStorage
     */
    loadSearchHistory() {
        try {
            const history = localStorage.getItem('jekyll-search-history');
            if (history) {
                this.searchHistory = JSON.parse(history);
            }
        } catch (error) {
            console.warn('Failed to load search history:', error);
            this.searchHistory = [];
        }
    }
    
    /**
     * Save search to history
     */
    saveSearchToHistory(query) {
        if (!query || query.length < this.minSearchLength) return;
        
        const timestamp = new Date().toISOString();
        const searchEntry = { query, timestamp };
        
        // Remove existing entry if it exists
        this.searchHistory = this.searchHistory.filter(entry => entry.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift(searchEntry);
        
        // Limit history size
        if (this.searchHistory.length > this.maxHistory) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistory);
        }
        
        try {
            localStorage.setItem('jekyll-search-history', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.warn('Failed to save search history:', error);
        }
    }
    
    /**
     * Handle search input with debouncing
     */
    handleSearchInput(query) {
        // Clear previous timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
        
        // Update clear button visibility
        this.updateClearButton(query);
        
        // Debounce search
        this.debounceTimer = setTimeout(() => {
            this.performSearch(query);
        }, 150);
    }
    
    /**
     * Update clear button visibility
     */
    updateClearButton(query) {
        if (this.searchClear) {
            this.searchClear.style.display = query.length > 0 ? 'flex' : 'none';
        }
    }
    
    /**
     * Perform enhanced search with multiple algorithms
     */
    performSearch(query) {
        const trimmedQuery = query.trim();
        
        if (trimmedQuery.length === 0) {
            this.hideAllStates();
            return;
        }
        
        if (trimmedQuery.length < this.minSearchLength) {
            this.hideAllStates();
            return;
        }
        
        if (!this.searchData) {
            this.showError();
            return;
        }
        
        // Save successful search to history
        this.saveSearchToHistory(trimmedQuery);
        
        const results = this.searchPosts(trimmedQuery);
        this.displayResults(results, trimmedQuery);
    }
    
    /**
     * Enhanced search through posts with multiple search strategies
     */
    searchPosts(query) {
        const searchTerms = this.normalizeQuery(query);
        const results = [];
        
        for (const post of this.searchData.posts) {
            const score = this.calculateEnhancedRelevanceScore(post, searchTerms, query);
            
            if (score > 0) {
                // Generate content preview with context
                const contentPreview = this.generateContentPreview(post, query);
                
                results.push({
                    ...post,
                    score: score,
                    highlightedTitle: this.highlightMatches(post.title, query),
                    highlightedExcerpt: this.highlightMatches(post.excerpt, query),
                    contentPreview: contentPreview,
                    matchContext: this.getMatchContext(post, query)
                });
            }
        }
        
        // Sort by relevance score (highest first), then by date (newest first)
        results.sort((a, b) => {
            if (Math.abs(a.score - b.score) < 5) {
                return new Date(b.date) - new Date(a.date);
            }
            return b.score - a.score;
        });
        
        // Apply fuzzy search if enabled and no exact matches found
        if (results.length === 0 && this.searchConfig.enableFuzzySearch) {
            return this.performFuzzySearch(query);
        }
        
        // Limit results
        return results.slice(0, this.maxResults);
    }
    
    /**
     * Generate content preview with search context
     */
    generateContentPreview(post, query) {
        if (!this.searchConfig.enableContentPreview || !post.content) {
            return post.excerpt || '';
        }
        
        const content = post.content.toLowerCase();
        const searchQuery = query.toLowerCase();
        const matchIndex = content.indexOf(searchQuery);
        
        if (matchIndex === -1) {
            return post.excerpt || post.content.substring(0, 200) + '...';
        }
        
        // Extract context around the match
        const contextLength = 100;
        const start = Math.max(0, matchIndex - contextLength);
        const end = Math.min(content.length, matchIndex + searchQuery.length + contextLength);
        
        let preview = post.content.substring(start, end);
        if (start > 0) preview = '...' + preview;
        if (end < content.length) preview = preview + '...';
        
        return preview;
    }
    
    /**
     * Get match context for better result understanding
     */
    getMatchContext(post, query) {
        const context = {
            titleMatch: post.title.toLowerCase().includes(query.toLowerCase()),
            excerptMatch: post.excerpt.toLowerCase().includes(query.toLowerCase()),
            contentMatch: post.content.toLowerCase().includes(query.toLowerCase()),
            tagMatches: post.tags.filter(tag => tag.toLowerCase().includes(query.toLowerCase())),
            categoryMatches: post.categories.filter(cat => cat.toLowerCase().includes(query.toLowerCase()))
        };
        
        return context;
    }
    
    /**
     * Perform fuzzy search for approximate matches
     */
    performFuzzySearch(query) {
        const fuzzyResults = [];
        const queryWords = this.normalizeQuery(query);
        
        for (const post of this.searchData.posts) {
            let fuzzyScore = 0;
            
            // Check for partial matches in keywords
            for (const word of queryWords) {
                for (const keyword in post.keywords) {
                    if (keyword.includes(word) || word.includes(keyword)) {
                        fuzzyScore += post.keywords[keyword] * 2;
                    }
                    
                    // Levenshtein distance for similar words
                    const distance = this.levenshteinDistance(word, keyword);
                    if (distance <= 2 && keyword.length > 4) {
                        fuzzyScore += post.keywords[keyword] * (3 - distance);
                    }
                }
            }
            
            if (fuzzyScore > 5) {
                fuzzyResults.push({
                    ...post,
                    score: fuzzyScore,
                    highlightedTitle: post.title,
                    highlightedExcerpt: post.excerpt,
                    contentPreview: post.excerpt,
                    isFuzzyMatch: true
                });
            }
        }
        
        return fuzzyResults
            .sort((a, b) => b.score - a.score)
            .slice(0, Math.floor(this.maxResults / 2));
    }
    
    /**
     * Calculate Levenshtein distance for fuzzy matching
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    /**
     * Normalize search query
     */
    normalizeQuery(query) {
        return query.toLowerCase()
            .split(/\s+/)
            .filter(term => term.length > 0)
            .map(term => term.replace(/[^\w\s-]/g, ''));
    }
    
    /**
     * Calculate enhanced relevance score with advanced algorithms
     */
    calculateEnhancedRelevanceScore(post, searchTerms, originalQuery) {
        let score = 0;
        const normalizedTitle = post.title.toLowerCase();
        const normalizedContent = post.content.toLowerCase();
        const normalizedExcerpt = post.excerpt.toLowerCase();
        const normalizedTags = post.tags.map(tag => tag.toLowerCase());
        const normalizedCategories = post.categories.map(cat => cat.toLowerCase());
        
        // Exact phrase matching (highest priority)
        const exactQuery = originalQuery.toLowerCase();
        if (normalizedTitle.includes(exactQuery)) {
            score += 150; // Increased weight for title matches
        }
        if (normalizedExcerpt.includes(exactQuery)) {
            score += 75;
        }
        if (normalizedContent.includes(exactQuery)) {
            score += 35;
        }
        
        // Boost score for posts with multiple exact matches
        const exactMatches = [
            normalizedTitle.includes(exactQuery),
            normalizedExcerpt.includes(exactQuery),
            normalizedContent.includes(exactQuery)
        ].filter(Boolean).length;
        
        if (exactMatches > 1) {
            score += exactMatches * 25;
        }
        
        // Individual term matching with enhanced weighting
        for (const term of searchTerms) {
            if (term.length === 0) continue;
            
            // Title matches (highest priority)
            if (normalizedTitle.includes(term)) {
                const isExactMatch = normalizedTitle === term;
                const isWordBoundary = normalizedTitle.match(new RegExp(`\\b${term}\\b`));
                score += isExactMatch ? 120 : (isWordBoundary ? 60 : 40);
            }
            
            // Tag matches (very high priority)
            for (const tag of normalizedTags) {
                if (tag.includes(term)) {
                    score += tag === term ? 80 : 45;
                }
            }
            
            // Category matches (high priority)
            for (const category of normalizedCategories) {
                if (category.includes(term)) {
                    score += category === term ? 60 : 30;
                }
            }
            
            // Excerpt matches (medium priority)
            if (normalizedExcerpt.includes(term)) {
                const wordBoundaryMatch = normalizedExcerpt.match(new RegExp(`\\b${term}\\b`));
                score += wordBoundaryMatch ? 25 : 15;
            }
            
            // Content matches with frequency consideration
            const contentMatches = (normalizedContent.match(new RegExp(term, 'g')) || []).length;
            if (contentMatches > 0) {
                score += Math.min(contentMatches * 8, 40); // Cap content score
            }
            
            // Keyword frequency boost
            if (post.keywords && post.keywords[term]) {
                score += post.keywords[term] * 3;
            }
        }
        
        // Recency boost (newer posts get slight preference)
        const postDate = new Date(post.date);
        const now = new Date();
        const ageInDays = (now - postDate) / (1000 * 60 * 60 * 24);
        
        if (ageInDays < 30) {
            score += 10;
        } else if (ageInDays < 90) {
            score += 5;
        }
        
        // Content quality indicators
        if (post.wordCount > 500) {
            score += 5; // Longer content might be more comprehensive
        }
        
        if (post.tags.length > 2) {
            score += 3; // Well-tagged content
        }
        
        return Math.round(score);
    }
    
    /**
     * Highlight matching terms in text
     */
    highlightMatches(text, query) {
        if (!text || !query) return text;
        
        const searchTerms = this.normalizeQuery(query);
        let highlightedText = text;
        
        // First, try to highlight the exact phrase
        const exactQuery = query.trim();
        if (exactQuery.length > 0) {
            const regex = new RegExp(`(${this.escapeRegExp(exactQuery)})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        }
        
        // Then highlight individual terms that weren't already highlighted
        for (const term of searchTerms) {
            if (term.length > 0) {
                const regex = new RegExp(`(?!<mark>.*?)(${this.escapeRegExp(term)})(?!.*?</mark>)`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
            }
        }
        
        return highlightedText;
    }
    
    /**
     * Escape special regex characters
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    /**
     * Display search results
     */
    displayResults(results, query) {
        if (results.length === 0) {
            this.showNoResults();
            return;
        }
        
        this.updateResultsHeader(results.length, query);
        this.renderResults(results);
        this.showResults();
    }
    
    /**
     * Update results header
     */
    updateResultsHeader(count, query) {
        if (this.searchResultsCount) {
            this.searchResultsCount.textContent = `${count} result${count !== 1 ? 's' : ''}`;
        }
        
        if (this.searchResultsQuery) {
            this.searchResultsQuery.textContent = `for "${query}"`;
        }
    }
    
    /**
     * Render search results
     */
    renderResults(results) {
        if (!this.searchResultsList) return;
        
        this.searchResultsList.innerHTML = '';
        
        for (const result of results) {
            const resultElement = this.createResultElement(result);
            this.searchResultsList.appendChild(resultElement);
        }
    }
    
    /**
     * Create enhanced result element with rich information
     */
    createResultElement(result) {
        const article = document.createElement('article');
        article.className = 'search-result-item';
        
        // Add fuzzy match indicator
        if (result.isFuzzyMatch) {
            article.classList.add('fuzzy-match');
        }
        
        // Format tags with better styling
        const tagsHtml = result.tags.length > 0 
            ? `<div class="search-result-tags">
                 <i class="fas fa-tags"></i>
                 ${result.tags.map(tag => {
                     const isMatch = result.matchContext?.tagMatches?.includes(tag);
                     return `<span class="search-result-tag ${isMatch ? 'tag-match' : ''}">${this.escapeHtml(tag)}</span>`;
                 }).join('')}
               </div>`
            : '';
        
        // Format categories
        const categoriesHtml = result.categories.length > 0 
            ? `<div class="search-result-categories">
                 <i class="fas fa-folder"></i>
                 ${result.categories.map(cat => {
                     const isMatch = result.matchContext?.categoryMatches?.includes(cat);
                     return `<span class="search-result-category ${isMatch ? 'category-match' : ''}">${this.escapeHtml(cat)}</span>`;
                 }).join('')}
               </div>`
            : '';
        
        // Add reading time and word count
        const metaInfo = `
            <div class="search-result-info">
                ${result.readingTime ? `<span class="reading-time"><i class="fas fa-clock"></i> ${result.readingTime} min read</span>` : ''}
                ${result.wordCount ? `<span class="word-count"><i class="fas fa-file-word"></i> ${result.wordCount} words</span>` : ''}
                <span class="relevance-score" title="Relevance Score: ${result.score}">
                    <i class="fas fa-star"></i> ${Math.min(Math.round(result.score / 20), 5)}/5
                </span>
            </div>
        `;
        
        // Use content preview if available
        const contentToShow = result.contentPreview || result.highlightedExcerpt;
        
        // Add match indicators
        const matchIndicators = [];
        if (result.matchContext?.titleMatch) matchIndicators.push('Title');
        if (result.matchContext?.excerptMatch) matchIndicators.push('Excerpt');
        if (result.matchContext?.contentMatch) matchIndicators.push('Content');
        if (result.matchContext?.tagMatches?.length > 0) matchIndicators.push('Tags');
        if (result.matchContext?.categoryMatches?.length > 0) matchIndicators.push('Categories');
        
        const matchInfo = matchIndicators.length > 0 
            ? `<div class="match-indicators">
                 <small>Matches in: ${matchIndicators.join(', ')}</small>
               </div>`
            : '';
        
        article.innerHTML = `
            <div class="result-header">
                <a href="${result.url}" class="search-result-title">${result.highlightedTitle}</a>
                ${result.isFuzzyMatch ? '<span class="fuzzy-badge">Similar</span>' : ''}
            </div>
            <div class="search-result-meta">
                <div class="search-result-date">
                    <i class="fas fa-calendar-alt"></i>
                    <time datetime="${result.date}">${result.date}</time>
                </div>
                ${tagsHtml}
                ${categoriesHtml}
            </div>
            ${metaInfo}
            <div class="search-result-excerpt">${contentToShow}</div>
            ${matchInfo}
            <div class="result-actions">
                <a href="${result.url}" class="search-result-link">
                    Read more <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        return article;
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Clear search
     */
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();
        }
        
        this.updateClearButton('');
        this.hideAllStates();
    }
    
    /**
     * Show loading state
     */
    showLoading() {
        this.hideAllStates();
        if (this.searchLoading) {
            this.searchLoading.style.display = 'block';
        }
    }
    
    /**
     * Show error state
     */
    showError() {
        this.hideAllStates();
        if (this.searchError) {
            this.searchError.style.display = 'block';
        }
    }
    
    /**
     * Show no results state
     */
    showNoResults() {
        this.hideAllStates();
        if (this.searchNoResults) {
            this.searchNoResults.style.display = 'block';
        }
    }
    
    /**
     * Show search results
     */
    showResults() {
        this.hideAllStates();
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
        }
    }
    
    /**
     * Hide all state elements
     */
    hideAllStates() {
        const elements = [
            this.searchResults,
            this.searchNoResults,
            this.searchLoading,
            this.searchError
        ];
        
        elements.forEach(element => {
            if (element) {
                element.style.display = 'none';
            }
        });
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if search elements are present
    if (document.getElementById('search-input')) {
        new JekyllSearch();
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JekyllSearch;
}
