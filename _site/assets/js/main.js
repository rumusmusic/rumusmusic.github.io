document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNav.classList.toggle('active');
    });
  }
  
  // Render chord diagrams where needed
  const chordDiagrams = document.querySelectorAll('.diagram[data-chord]');
  chordDiagrams.forEach(renderChordDiagram);
  
  // Initialize chord buttons to show chord diagrams when clicked
  initializeChordButtons();
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});

// Render a chord diagram in an SVG
function renderChordDiagram(element) {
  if (!element) return;
  
  const chordName = element.getAttribute('data-chord');
  if (!chordName) return;
  
  // Get chord data from the site's chord data
  let chordData = getChordData(chordName);
  
  // If no data found, use a basic representation
  if (!chordData) {
    chordData = {
      name: chordName,
      positions: [
        {
          frets: [0, 0, 0, 0, 0, 0],
          fingers: [0, 0, 0, 0, 0, 0]
        }
      ]
    };
  }
  
  // Create SVG
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "120");
  svg.setAttribute("height", "150");
  svg.setAttribute("viewBox", "0 0 120 150");
  svg.setAttribute("class", "chord-diagram-svg");
  
  // Draw the chord diagram
  const position = chordData.positions[0]; // Use first position
  
  // Draw the fretboard
  const fretboard = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  fretboard.setAttribute("x", "10");
  fretboard.setAttribute("y", "30");
  fretboard.setAttribute("width", "100");
  fretboard.setAttribute("height", "100");
  fretboard.setAttribute("fill", "none");
  fretboard.setAttribute("stroke", "currentColor");
  fretboard.setAttribute("stroke-width", "2");
  svg.appendChild(fretboard);
  
  // Draw the nut
  const nut = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  nut.setAttribute("x", "10");
  nut.setAttribute("y", "30");
  nut.setAttribute("width", "100");
  nut.setAttribute("height", "5");
  nut.setAttribute("fill", "currentColor");
  svg.appendChild(nut);
  
  // Draw the strings
  for (let i = 0; i < 6; i++) {
    const x = 10 + i * 20;
    const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
    string.setAttribute("x1", x);
    string.setAttribute("y1", "30");
    string.setAttribute("x2", x);
    string.setAttribute("y2", "130");
    string.setAttribute("stroke", "currentColor");
    string.setAttribute("stroke-width", "2");
    svg.appendChild(string);
  }
  
  // Draw the frets
  for (let i = 0; i < 5; i++) {
    const y = 30 + i * 25;
    const fret = document.createElementNS("http://www.w3.org/2000/svg", "line");
    fret.setAttribute("x1", "10");
    fret.setAttribute("y1", y);
    fret.setAttribute("x2", "110");
    fret.setAttribute("y2", y);
    fret.setAttribute("stroke", "currentColor");
    fret.setAttribute("stroke-width", i === 0 ? "4" : "1");
    svg.appendChild(fret);
  }
  
  // Draw the finger positions
  if (position && position.frets) {
    for (let i = 0; i < 6; i++) {
      const fret = position.frets[i];
      const x = 10 + i * 20;
      
      if (fret === -1) {
        // X mark for muted string
        const x1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        x1.setAttribute("x1", x - 5);
        x1.setAttribute("y1", "15");
        x1.setAttribute("x2", x + 5);
        x1.setAttribute("y2", "25");
        x1.setAttribute("stroke", "currentColor");
        x1.setAttribute("stroke-width", "2");
        svg.appendChild(x1);
        
        const x2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        x2.setAttribute("x1", x + 5);
        x2.setAttribute("y1", "15");
        x2.setAttribute("x2", x - 5);
        x2.setAttribute("y2", "25");
        x2.setAttribute("stroke", "currentColor");
        x2.setAttribute("stroke-width", "2");
        svg.appendChild(x2);
      } else if (fret === 0) {
        // Open string
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", "20");
        circle.setAttribute("r", "5");
        circle.setAttribute("stroke", "currentColor");
        circle.setAttribute("stroke-width", "1");
        circle.setAttribute("fill", "none");
        svg.appendChild(circle);
      } else {
        // Finger position
        const y = 30 + (fret - 0.5) * 25;
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "8");
        circle.setAttribute("fill", "currentColor");
        svg.appendChild(circle);
        
        // Finger number
        if (position.fingers && position.fingers[i] > 0) {
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", x);
          text.setAttribute("y", y + 4);
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("font-size", "12");
          text.setAttribute("fill", "white");
          text.textContent = position.fingers[i];
          svg.appendChild(text);
        }
      }
    }
  }
  
  // Add chord name
  const nameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  nameText.setAttribute("x", "60");
  nameText.setAttribute("y", "145");
  nameText.setAttribute("text-anchor", "middle");
  nameText.setAttribute("font-size", "16");
  nameText.setAttribute("fill", "currentColor");
  nameText.textContent = chordName;
  svg.appendChild(nameText);
  
  // Clear and append
  element.innerHTML = '';
  element.appendChild(svg);
}

// Get chord data from the site's data or return a default
function getChordData(chordName) {
  // This would normally fetch from _data/chords.yml but we'll use hardcoded basic chords
  const basicChords = {
    'C': {
      name: 'C',
      positions: [
        {
          frets: [0, 1, 0, 2, 3, -1],
          fingers: [0, 1, 0, 2, 3, 0]
        }
      ]
    },
    'D': {
      name: 'D',
      positions: [
        {
          frets: [-1, -1, 0, 2, 3, 2],
          fingers: [0, 0, 0, 1, 3, 2]
        }
      ]
    },
    'E': {
      name: 'E',
      positions: [
        {
          frets: [0, 2, 2, 1, 0, 0],
          fingers: [0, 3, 2, 1, 0, 0]
        }
      ]
    },
    'G': {
      name: 'G',
      positions: [
        {
          frets: [3, 2, 0, 0, 0, 3],
          fingers: [2, 1, 0, 0, 0, 3]
        }
      ]
    },
    'A': {
      name: 'A',
      positions: [
        {
          frets: [0, 0, 2, 2, 2, 0],
          fingers: [0, 0, 1, 2, 3, 0]
        }
      ]
    },
    'Am': {
      name: 'Am',
      positions: [
        {
          frets: [0, 0, 2, 2, 1, 0],
          fingers: [0, 0, 2, 3, 1, 0]
        }
      ]
    },
    'F': {
      name: 'F',
      positions: [
        {
          frets: [1, 3, 3, 2, 1, 1],
          fingers: [1, 4, 3, 2, 1, 1]
        }
      ]
    }
  };
  
  return basicChords[chordName];
}

// Initialize chord buttons
function initializeChordButtons() {
  const chordButtons = document.querySelectorAll('.chord-button');
  
  chordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const chordName = this.getAttribute('data-chord');
      const modal = document.createElement('div');
      modal.className = 'chord-modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'chord-modal-content';
      
      const closeButton = document.createElement('button');
      closeButton.className = 'chord-modal-close';
      closeButton.innerHTML = '&times;';
      closeButton.addEventListener('click', function() {
        document.body.removeChild(modal);
      });
      
      const title = document.createElement('h3');
      title.textContent = chordName + ' Chord';
      
      const diagram = document.createElement('div');
      diagram.className = 'diagram';
      diagram.setAttribute('data-chord', chordName);
      
      modalContent.appendChild(closeButton);
      modalContent.appendChild(title);
      modalContent.appendChild(diagram);
      modal.appendChild(modalContent);
      
      document.body.appendChild(modal);
      renderChordDiagram(diagram);
      
      // Close on outside click
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    });
  });
}

// When user scrolls down, make header sticky with smaller size
window.addEventListener('scroll', function() {
  const header = document.querySelector('.site-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});
