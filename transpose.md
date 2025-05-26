---
layout: default
title: Transpose Chord Otomatis
permalink: /transpose/
description: Alat transpose chord gitar otomatis yang mudah. Ubah kunci lagu secara real-time sesuai dengan range vokal Anda.
---

<div class="transpose-tools">
  <h1>🎸 Transpose Chord Otomatis</h1>
  <p>Ubah kunci chord secara otomatis dengan satu klik. Masukkan chord lagu dan pilih kunci baru!</p>

  <!-- Quick Controls -->
  <div class="quick-controls">
    <button class="quick-btn" id="transpose-down">♭ Turun 1</button>
    <button class="quick-btn" id="transpose-up">♯ Naik 1</button>
    <button class="quick-btn" id="reset-transpose">🔄 Reset</button>
    <button class="quick-btn" id="auto-detect">🎵 Auto Detect</button>
    <button class="quick-btn" id="copy-result">📋 Copy</button>
  </div>

  <!-- Current Key Display -->
  <div class="transpose-info">
    <span class="key-info">Kunci Sekarang: <span id="current-key">C</span></span>
    <span class="key-info">Transpose: <span id="current-steps">0</span> semitone</span>
  </div>

  <!-- Key Selector -->
  <div class="key-selector">
    <h3>🎵 Pilih Kunci Target</h3>
    <div class="key-buttons">
      <button class="key-btn" data-key="C">C</button>
      <button class="key-btn" data-key="C#">C#</button>
      <button class="key-btn" data-key="D">D</button>
      <button class="key-btn" data-key="D#">D#</button>
      <button class="key-btn" data-key="E">E</button>
      <button class="key-btn" data-key="F">F</button>
      <button class="key-btn" data-key="F#">F#</button>
      <button class="key-btn" data-key="G">G</button>
      <button class="key-btn" data-key="G#">G#</button>
      <button class="key-btn" data-key="A">A</button>
      <button class="key-btn" data-key="A#">A#</button>
      <button class="key-btn" data-key="B">B</button>
    </div>
  </div>

  <!-- Editor Container -->
  <div class="editor-container">
    <div class="editor-section">
      <h3>📝 Input Chord & Lirik</h3>
      <textarea id="chord-input" placeholder="Masukkan chord dan lirik di sini...
Contoh:
[C]Selamat pagi [Am]dunia
[F]Hari yang [G]cerah
[C]Mari bernyanyi [Am]bersama
[F]Dengan [G]gembira [C]

Tips: Tulis chord dalam kurung siku [C], [Am], [F], dll.">Selamat pagi [C]dunia
Hari yang [Am]cerah sekali
Mari bernyanyi [F]bersama [G]
Dengan [C]hati gembira

[C]Matahari [Am]bersinar
[F]Burung-burung [G]berkicau
[C]Dunia [Am]terasa indah
[F]Saat kita [G]bersa[C]ma</textarea>
    </div>

    <div class="editor-section">
      <h3>🎼 Hasil Transpose</h3>
      <div id="chord-output">Hasil transpose akan muncul di sini secara otomatis...</div>
    </div>
  </div>
</div>

<style>
.transpose-tools {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.quick-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 10px 20px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.quick-btn:hover {
  background: #b71c1c;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.editor-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.editor-section h3 {
  margin-top: 0;
  color: #c62828;
}

#chord-input, #chord-output {
  width: 100%;
  height: 300px;
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
}

#chord-output {
  background: #fff;
  border-color: #4caf50;
}

.chord-highlight {
  background: #ffeb3b;
  color: #c62828;
  font-weight: bold;
  padding: 2px 4px;
  border-radius: 3px;
}

.transpose-info {
  background: #e3f2fd;
  padding: 15px;
  border-radius: 5px;
  margin: 20px 0;
  text-align: center;
}

.key-info {
  display: inline-block;
  margin: 0 10px;
  font-weight: bold;
}

.key-selector {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.key-selector h3 {
  margin-top: 0;
  color: #c62828;
}

.key-buttons {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.key-btn {
  padding: 12px;
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: all 0.2s ease;
}

.key-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.key-btn.active {
  background: #c62828;
  color: white;
  border-color: #c62828;
}

@media (max-width: 768px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
  
  .quick-controls {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const chordInput = document.getElementById('chord-input');
  const chordOutput = document.getElementById('chord-output');
  const transposeUpBtn = document.getElementById('transpose-up');
  const transposeDownBtn = document.getElementById('transpose-down');
  const resetBtn = document.getElementById('reset-transpose');
  const autoDetectBtn = document.getElementById('auto-detect');
  const copyBtn = document.getElementById('copy-result');
  const currentKeySpan = document.getElementById('current-key');
  const currentStepsSpan = document.getElementById('current-steps');

  // Chord mapping and transpose engine
  const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const enharmonics = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
  };
  
  let currentTransposeSteps = 0;
  let detectedKey = 'C';

  // Transpose a single chord
  function transposeChord(chord, steps) {
    if (!chord || steps === 0) return chord;
    
    // Handle enharmonics first
    chord = enharmonics[chord] || chord;
    
    // More sophisticated chord parsing
    const chordMatch = chord.match(/^([A-G][#b]?)(.*)$/);
    if (!chordMatch) return chord;
    
    const [, rootNote, chordSuffix] = chordMatch;
    const currentIndex = noteOrder.indexOf(rootNote);
    
    if (currentIndex === -1) return chord;
    
    // Calculate new position with proper modulo
    let newIndex = (currentIndex + steps) % 12;
    if (newIndex < 0) newIndex += 12;
    
    return noteOrder[newIndex] + chordSuffix;
  }

  // Extract all chords from text
  function extractChords(text) {
    const chordRegex = /\[([^\]]+)\]/g;
    const chords = new Set();
    let match;
    
    while ((match = chordRegex.exec(text)) !== null) {
      chords.add(match[1]);
    }
    
    return Array.from(chords);
  }

  // Auto-detect key from chord progression
  function detectKeyFromChords(chords) {
    const keyScores = {};
    
    // Common chord progressions by key
    const keySignatures = {
      'C': ['C', 'Dm', 'Em', 'F', 'G', 'Am'],
      'G': ['G', 'Am', 'Bm', 'C', 'D', 'Em'],
      'D': ['D', 'Em', 'F#m', 'G', 'A', 'Bm'],
      'A': ['A', 'Bm', 'C#m', 'D', 'E', 'F#m'],
      'F': ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm']
    };
    
    // Score each key based on chord matches
    Object.keys(keySignatures).forEach(key => {
      let score = 0;
      const keyChords = keySignatures[key];
      
      chords.forEach(chord => {
        const rootMatch = chord.match(/^([A-G][#b]?)/);
        if (rootMatch) {
          const root = rootMatch[1];
          if (keyChords.includes(root) || keyChords.includes(root + 'm')) {
            score += 1;
          }
          if (keyChords[0] === root) score += 2; // Bonus for tonic
        }
      });
      
      keyScores[key] = score;
    });
    
    // Return the key with highest score
    return Object.keys(keyScores).reduce((a, b) => 
      keyScores[a] > keyScores[b] ? a : b
    );
  }

  // Transpose entire text with chord highlighting
  function transposeText(text, steps) {
    if (!text) return '';
    
    return text.replace(/\[([^\]]+)\]/g, function(match, chord) {
      const transposedChord = transposeChord(chord, steps);
      return `<span class="chord-highlight">[${transposedChord}]</span>`;
    });
  }

  // Update the output display
  function updateOutput() {
    const inputText = chordInput.value;
    if (!inputText.trim()) {
      chordOutput.innerHTML = 'Hasil transpose akan muncul di sini secara otomatis...';
      return;
    }
    
    const transposedText = transposeText(inputText, currentTransposeSteps);
    chordOutput.innerHTML = transposedText;
    
    // Update UI displays
    const newKey = transposeChord(detectedKey, currentTransposeSteps);
    currentKeySpan.textContent = newKey;
    currentStepsSpan.textContent = currentTransposeSteps > 0 ? `+${currentTransposeSteps}` : currentTransposeSteps;
  }

  // Event listeners
  chordInput.addEventListener('input', updateOutput);

  transposeUpBtn.addEventListener('click', function() {
    currentTransposeSteps++;
    if (currentTransposeSteps > 12) currentTransposeSteps = 12;
    updateOutput();
  });

  transposeDownBtn.addEventListener('click', function() {
    currentTransposeSteps--;
    if (currentTransposeSteps < -12) currentTransposeSteps = -12;
    updateOutput();
  });

  resetBtn.addEventListener('click', function() {
    currentTransposeSteps = 0;
    updateOutput();
  });

  autoDetectBtn.addEventListener('click', function() {
    const chords = extractChords(chordInput.value);
    if (chords.length > 0) {
      detectedKey = detectKeyFromChords(chords);
      currentTransposeSteps = 0;
      updateOutput();
      alert(`🎵 Kunci terdeteksi: ${detectedKey}\nChord ditemukan: ${chords.join(', ')}`);
    } else {
      alert('❌ Tidak ada chord yang ditemukan.\nPastikan chord ditulis dalam format [C], [Am], [F], dll.');
    }
  });

  copyBtn.addEventListener('click', function() {
    const outputText = chordOutput.textContent || chordOutput.innerText;
    navigator.clipboard.writeText(outputText).then(function() {
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy';
      }, 2000);
    }).catch(function() {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = outputText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy';
      }, 2000);
    });
  });

  // Key selector button handlers
  document.querySelectorAll('.key-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetKey = this.dataset.key;
      const originalIndex = noteOrder.indexOf(detectedKey);
      const targetIndex = noteOrder.indexOf(targetKey);
      
      currentTransposeSteps = targetIndex - originalIndex;
      if (currentTransposeSteps > 6) currentTransposeSteps -= 12;
      if (currentTransposeSteps < -6) currentTransposeSteps += 12;
      
      // Update active state
      document.querySelectorAll('.key-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      updateOutput();
    });
  });

  // Set initial active key
  document.querySelector('.key-btn[data-key="C"]').classList.add('active');

  // Initialize with sample content
  updateOutput();
});
</script>