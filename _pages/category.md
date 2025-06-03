---
layout: default
title: Kategori Artikel
permalink: /category/
description: Jelajahi artikel tutorial gitar berdasarkan kategori. Temukan chord, teknik, dan tips bermain musik yang sesuai dengan kebutuhan Anda.
---

<div class="category-page">
  <div class="container">
    <h1>📚 Kategori Artikel</h1>
    <p class="page-intro">Jelajahi artikel tutorial gitar berdasarkan kategori dan tingkat kesulitan.</p>

    <!-- Alpha Navigation -->
    <div class="alpha-nav">
      <div class="alpha-nav-inner">
        {% assign letters = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z" | split: "," %}
        {% for letter in letters %}
          <a href="/category/{{ letter | downcase }}/" class="alpha-link">{{ letter }}</a>
        {% endfor %}
      </div>
    </div>

    <!-- Articles by Category -->
    <div class="articles-grid">
      {% assign posts_by_category = site.posts | group_by: 'categories' %}
      {% for category_group in posts_by_category %}
        {% if category_group.name != '' %}
        <section class="category-section" id="{{ category_group.name | first | slugify }}">
          <h2>{{ category_group.name | first | capitalize }}</h2>
          <div class="articles-list">
            {% for post in category_group.items limit: 10 %}
            <article class="article-card">
              <div class="article-meta">
                <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
                {% if post.tags %}
                  {% for tag in post.tags limit: 2 %}
                    <span class="tag">{{ tag }}</span>
                  {% endfor %}
                {% endif %}
              </div>
              <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
              {% if post.excerpt %}
                <p class="article-excerpt">{{ post.excerpt | strip_html | truncatewords: 25 }}</p>
              {% endif %}
              <a href="{{ post.url | relative_url }}" class="read-more">Baca Selengkapnya →</a>
            </article>
            {% endfor %}
          </div>
          {% if category_group.items.size > 10 %}
            <div class="view-more">
              <a href="/category/{{ category_group.name | first | slugify }}/" class="btn btn-outline">
                Lihat Semua {{ category_group.name | first | capitalize }} ({{ category_group.items.size }})
              </a>
            </div>
          {% endif %}
        </section>
        {% endif %}
      {% endfor %}
    </div>

    <!-- All Articles Alphabetically -->
    <section class="all-articles">
      <h2>📝 Semua Artikel (A-Z)</h2>
      <div class="alphabetical-listing">
        {% assign posts_by_letter = site.posts | group_by_exp: 'post', 'post.title | slice: 0 | upcase' %}
        {% for letter_group in posts_by_letter %}
        <div class="letter-section" id="{{ letter_group.name }}">
          <h3>{{ letter_group.name }}</h3>
          <div class="posts-compact">
            {% for post in letter_group.items %}
            <div class="post-compact">
              <a href="{{ post.url | relative_url }}">
                <span class="post-title">{{ post.title }}</span>
                <span class="post-date">{{ post.date | date: "%d/%m/%Y" }}</span>
              </a>
            </div>
            {% endfor %}
          </div>
        </div>
        {% endfor %}
      </div>
    </section>

    <!-- Pagination for future expansion -->
    {% if paginator %}
    <div class="pagination">
      {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path | relative_url }}" class="prev">← Sebelumnya</a>
      {% endif %}
      
      {% for page in (1..paginator.total_pages) %}
        {% if page == paginator.page %}
          <span class="current-page">{{ page }}</span>
        {% elsif page == 1 %}
          <a href="{{ '/category/' | relative_url }}">{{ page }}</a>
        {% else %}
          <a href="{{ site.paginate_path | relative_url | replace: ':num', page }}">{{ page }}</a>
        {% endif %}
      {% endfor %}
      
      {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path | relative_url }}" class="next">Selanjutnya →</a>
      {% endif %}
    </div>
    {% endif %}
  </div>
</div>

<style>
.category-page {
  padding: 2rem 0;
}

.page-intro {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
}

/* Alpha Navigation */
.alpha-nav {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 2px solid #e9ecef;
}

.alpha-nav-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.alpha-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: white;
  color: #495057;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid #dee2e6;
}

.alpha-link:hover, .alpha-link.active {
  background: #c62828;
  color: white;
  transform: translateY(-2px);
}

/* Category Sections */
.category-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.category-section h2 {
  color: #c62828;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f8f9fa;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.article-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #c62828;
  transition: transform 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.article-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.article-meta time {
  font-size: 0.85rem;
  color: #6c757d;
}

.tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.article-card h3 {
  margin: 0.5rem 0;
}

.article-card h3 a {
  color: #212529;
  text-decoration: none;
  font-size: 1.1rem;
}

.article-card h3 a:hover {
  color: #c62828;
}

.article-excerpt {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.read-more {
  color: #c62828;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.read-more:hover {
  color: #b71c1c;
}

.view-more {
  text-align: center;
  margin-top: 1.5rem;
}

/* Alphabetical Listing */
.all-articles {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.letter-section {
  margin-bottom: 2rem;
}

.letter-section h3 {
  color: #c62828;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  display: inline-block;
}

.posts-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.5rem;
}

.post-compact {
  border-bottom: 1px solid #f8f9fa;
  padding: 0.75rem 0;
}

.post-compact a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  color: #495057;
  transition: color 0.2s ease;
}

.post-compact a:hover {
  color: #c62828;
}

.post-title {
  font-weight: 500;
  flex: 1;
}

.post-date {
  font-size: 0.8rem;
  color: #6c757d;
  margin-left: 1rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
}

.pagination a, .pagination span {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  text-decoration: none;
  color: #495057;
}

.pagination a:hover {
  background: #c62828;
  color: white;
  border-color: #c62828;
}

.pagination .current-page {
  background: #c62828;
  color: white;
  border-color: #c62828;
}

/* Responsive */
@media (max-width: 768px) {
  .articles-list {
    grid-template-columns: 1fr;
  }
  
  .posts-compact {
    grid-template-columns: 1fr;
  }
  
  .post-compact a {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .post-date {
    margin-left: 0;
    margin-top: 0.25rem;
  }
  
  .alpha-nav-inner {
    gap: 0.25rem;
  }
  
  .alpha-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling for alpha navigation
  document.querySelectorAll('.alpha-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active state
        document.querySelectorAll('.alpha-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Highlight active letter on scroll
  const observerOptions = {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.alpha-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  // Observe letter sections
  document.querySelectorAll('.letter-section').forEach(section => {
    observer.observe(section);
  });
});
</script>