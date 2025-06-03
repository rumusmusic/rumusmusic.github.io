document.addEventListener('DOMContentLoaded', function() {
  // Chord definitions
  const chords = {
    'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    'C#': ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C'],
    'Db': ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'],
    'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
    'D#': ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'],
    'Eb': ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
    'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
    'F': ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
    'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
    'Gb': ['Gb', 'Ab', 'Bb', 'B', 'Db', 'Eb', 'F'],
    'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
    'G#': ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G'],
    'Ab': ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'],
    'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
    'A#': ['A#', 'C', 'D', 'D#', 'F', 'G', 'A'],
    'Bb': ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
    'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
  };
  
  // Equivalent chord names (enharmonic)
  const equivalentChords = {
    'C#': 'Db', 'Db': 'C#',
    'D#': 'Eb', 'Eb': 'D#',
    'F#': 'Gb', 'Gb': 'F#',
    'G#': 'Ab', 'Ab': 'G#',
    'A#': 'Bb', 'Bb': 'A#',
  };
  
  // Chord types
  const chordTypes = ['', 'm', '7', 'm7', 'maj7', 'dim', 'aug', 'sus2', 'sus4', '6', 'm6', '9', 'add9'];
  
  // All keys in order
  const allKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Check if we're on the transpose tool page
  const transposeForm = document.getElementById('transpose-form');
  const transposeInput = document.getElementById('transpose-input');
  const transposeFromKey = document.getElementById('from-key');
  const transposeToKey = document.getElementById('to-key');
  const transposeResult = document.getElementById('transpose-result');
  const transposeButton = document.getElementById('transpose-button');
  const copyButton = document.getElementById('copy-button');
  
  // Check if we're on a chord page
  const transposeUp = document.getElementById('transpose-up');
  const transposeDown = document.getElementById('transpose-down');
  const resetTranspose = document.getElementById('reset-transpose');
  const currentKey = document.getElementById('current-key');
  const chordContent = document.getElementById('chord-content');
  
  // Transpose tool page functionality
  if (transposeForm && transposeInput && transposeFromKey && transposeToKey && transposeButton) {
    // Populate key dropdowns
    populateKeyDropdowns();
    
    transposeForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const fromKey = transposeFromKey.value;
      const toKey = transposeToKey.value;
      const content = transposeInput.value;
      
      if (content.trim() === '') {
        alert('Please enter chord content to transpose');
        return;
      }
      
      const transposedContent = transposeChordContent(content, fromKey, toKey);
      transposeResult.textContent = transposedContent;
      
      // Show the result section
      document.getElementById('result-section').style.display = 'block';
      
      // Scroll to result
      document.getElementById('result-section').scrollIntoView({ behavior: 'smooth' });
    });
    
    if (copyButton) {
      copyButton.addEventListener('click', function() {
        const resultText = transposeResult.textContent;
        
        if (resultText.trim() === '') {
          alert('No content to copy');
          return;
        }
        
        // Copy to clipboard
        navigator.clipboard.writeText(resultText)
          .then(() => {
            // Temporarily change button text
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            
            setTimeout(() => {
              copyButton.textContent = originalText;
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
          });
      });
    }
  }
  
  // Chord page functionality
  if (transposeUp && transposeDown && resetTranspose && currentKey && chordContent) {
    const originalContent = chordContent.innerHTML;
    let currentKeyValue = currentKey.textContent.trim();
    let transposeFactor = 0;
    
    transposeUp.addEventListener('click', function() {
      transposeFactor++;
      updateTransposedContent();
    });
    
    transposeDown.addEventListener('click', function() {
      transposeFactor--;
      updateTransposedContent();
    });
    
    resetTranspose.addEventListener('click', function() {
      transposeFactor = 0;
      chordContent.innerHTML = originalContent;
      currentKey.textContent = currentKeyValue;
    });
    
    function updateTransposedContent() {
      // Get the new key
      const startKeyIndex = allKeys.indexOf(currentKeyValue);
      if (startKeyIndex === -1) return; // Invalid key
      
      const newKeyIndex = (startKeyIndex + transposeFactor + 12) % 12;
      const newKey = allKeys[newKeyIndex];
      currentKey.textContent = newKey;
      
      // Parse and transpose content
      const parser = new DOMParser();
      const doc = parser.parseFromString(originalContent, 'text/html');
      const textNodes = [];
      
      // Get all text nodes
      function getTextNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
          textNodes.push(node);
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            getTextNodes(node.childNodes[i]);
          }
        }
      }
      
      getTextNodes(doc.body);
      
      // Transpose each text node
      textNodes.forEach(node => {
        node.textContent = transposeChordText(node.textContent, currentKeyValue, newKey);
      });
      
      // Update the content
      chordContent.innerHTML = doc.body.innerHTML;
    }
  }
  
  // Helper functions
  function populateKeyDropdowns() {
    if (!transposeFromKey || !transposeToKey) return;
    
    allKeys.forEach(key => {
      const fromOption = document.createElement('option');
      fromOption.value = key;
      fromOption.textContent = key;
      
      const toOption = document.createElement('option');
      toOption.value = key;
      toOption.textContent = key;
      
      transposeFromKey.appendChild(fromOption);
      transposeToKey.appendChild(toOption);
    });
    
    // Set defaults
    transposeFromKey.value = 'C';
    transposeToKey.value = 'G';
  }
  
  function transposeChordContent(content, fromKey, toKey) {
    if (fromKey === toKey) return content;
    
    const lines = content.split('\n');
    const transposedLines = lines.map(line => transposeChordText(line, fromKey, toKey));
    
    return transposedLines.join('\n');
  }
  
  function transposeChordText(text, fromKey, toKey) {
    if (fromKey === toKey) return text;
    
    // Calculate transpose semitones
    const fromIndex = allKeys.indexOf(fromKey);
    const toIndex = allKeys.indexOf(toKey);
    if (fromIndex === -1 || toIndex === -1) return text;
    
    const semitones = (toIndex - fromIndex + 12) % 12;
    
    // Regex to match chord patterns
    const chordPattern = /\b([A-G][b#]?)([a-zA-Z0-9]*)\b/g;
    
    return text.replace(chordPattern, (match, root, type) => {
      // Get the new root note
      const rootIndex = allKeys.indexOf(root);
      if (rootIndex === -1) return match;
      
      const newRootIndex = (rootIndex + semitones) % 12;
      const newRoot = allKeys[newRootIndex];
      
      return newRoot + type;
    });
  }
});
