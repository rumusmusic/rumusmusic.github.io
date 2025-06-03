---
layout: default
title: Belajar Kunci Gitar - Panduan Lengkap
permalink: /chords/
description: Pelajari kunci-kunci gitar dasar dengan panduan lengkap dan diagram chord yang mudah dipahami untuk pemula.
---

<div class="chord-learning-page">
  <div class="container">
    <h1>Belajar Kunci Gitar - Panduan Lengkap</h1>
    <p class="page-intro">Pelajari kunci-kunci gitar dasar dengan panduan lengkap dan diagram chord yang mudah dipahami. Cocok untuk pemula yang ingin menguasai dasar-dasar bermain gitar.</p>

    <!-- Basic Chords Section -->
    <section class="chord-section">
      <h2>Kunci Dasar Mayor</h2>
      <p>Kunci mayor menghasilkan suara yang cerah dan bahagia. Berikut adalah kunci mayor yang paling sering digunakan:</p>
      
      <div class="chord-grid">
        <div class="chord-card">
          <h3>C Major</h3>
          <div class="chord-diagram" data-chord="C">
            <div class="chord-visual">
              <canvas width="120" height="140" class="chord-canvas"></canvas>
            </div>
          </div>
          <div class="chord-info">
            <p><strong>Posisi Jari:</strong></p>
            <ul>
              <li>Jari 1: Fret 1, Senar B (2)</li>
              <li>Jari 2: Fret 2, Senar D (4)</li>
              <li>Jari 3: Fret 3, Senar A (5)</li>
            </ul>
            <button class="play-chord" data-chord="C">♪ Mainkan</button>
          </div>
        </div>

        <div class="chord-card">
          <h3>D Major</h3>
          <div class="chord-diagram" data-chord="D">
            <div class="chord-visual">
              <canvas width="120" height="140" class="chord-canvas"></canvas>
            </div>
          </div>
          <div class="chord-info">
            <p><strong>Posisi Jari:</strong></p>
            <ul>
              <li>Jari 1: Fret 2, Senar G (3)</li>
              <li>Jari 2: Fret 2, Senar E (1)</li>
              <li>Jari 3: Fret 3, Senar B (2)</li>
            </ul>
            <button class="play-chord" data-chord="D">♪ Mainkan</button>
          </div>
        </div>

        <div class="chord-card">
          <h3>G Major</h3>
          <div class="chord-diagram" data-chord="G">
            <div class="chord-visual">
              <canvas width="120" height="140" class="chord-canvas"></canvas>
            </div>
          </div>
          <div class="chord-info">
            <p><strong>Posisi Jari:</strong></p>
            <ul>
              <li>Jari 1: Fret 2, Senar A (5)</li>
              <li>Jari 2: Fret 3, Senar Low E (6)</li>
              <li>Jari 3: Fret 3, Senar E (1)</li>
            </ul>
            <button class="play-chord" data-chord="G">♪ Mainkan</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Practice Section -->
    <section class="practice-section">
      <h2>Latihan Progres Chord</h2>
      <p>Coba latihan progres chord yang populer untuk meningkatkan kemampuan bermain gitar Anda:</p>
      
      <div class="chord-progression">
        <h3>Progres 1: C - Am - F - G</h3>
        <div class="progression-chords">
          <button class="chord-btn" data-chord="C">C</button>
          <span class="arrow">→</span>
          <button class="chord-btn" data-chord="Am">Am</button>
          <span class="arrow">→</span>
          <button class="chord-btn" data-chord="F">F</button>
          <span class="arrow">→</span>
          <button class="chord-btn" data-chord="G">G</button>
        </div>
      </div>
    </section>
  </div>
</div>

<style>
.chord-learning-page {
  padding: 2rem 0;
}

.page-intro {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
  text-align: center;
}

.chord-section, .practice-section {
  margin-bottom: 4rem;
}

.chord-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.chord-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.chord-card:hover {
  transform: translateY(-5px);
}

.chord-card h3 {
  color: #c62828;
  margin-bottom: 1rem;
}

.chord-visual {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.chord-canvas {
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
}

.chord-info ul {
  text-align: left;
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.chord-info li {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.play-chord {
  background: #c62828;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.play-chord:hover {
  background: #b71c1c;
}

.chord-progression {
  background: #f0f8ff;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
}

.progression-chords {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.chord-btn {
  background: #2196f3;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chord-btn:hover {
  background: #1976d2;
  transform: scale(1.05);
}

.arrow {
  font-size: 1.5rem;
  color: #666;
}

@media (max-width: 768px) {
  .chord-grid {
    grid-template-columns: 1fr;
  }
  
  .progression-chords {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .arrow {
    transform: rotate(90deg);
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Chord diagrams data
  const chordData = {
    'C': { frets: [0, 1, 0, 2, 3, 0], fingers: [0, 1, 0, 2, 3, 0] },
    'D': { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    'G': { frets: [3, 2, 0, 0, 3, 3], fingers: [3, 2, 0, 0, 4, 4] },
    'Am': { frets: [0, 1, 2, 2, 0, 0], fingers: [0, 1, 2, 3, 0, 0] },
    'F': { frets: [1, 1, 3, 3, 2, 1], fingers: [1, 1, 3, 4, 2, 1] }
  };

  // Draw chord diagrams
  function drawChordDiagram(canvas, chordName) {
    const ctx = canvas.getContext('2d');
    const chord = chordData[chordName];
    if (!chord) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw fretboard
    const startX = 20;
    const startY = 20;
    const fretWidth = 80;
    const fretHeight = 20;
    const numFrets = 5;
    const numStrings = 6;

    // Draw frets (horizontal lines)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= numFrets; i++) {
      ctx.beginPath();
      ctx.moveTo(startX, startY + i * fretHeight);
      ctx.lineTo(startX + fretWidth, startY + i * fretHeight);
      ctx.stroke();
    }

    // Draw strings (vertical lines)
    for (let i = 0; i < numStrings; i++) {
      ctx.beginPath();
      ctx.moveTo(startX + i * (fretWidth / (numStrings - 1)), startY);
      ctx.lineTo(startX + i * (fretWidth / (numStrings - 1)), startY + numFrets * fretHeight);
      ctx.stroke();
    }

    // Draw finger positions
    ctx.fillStyle = '#c62828';
    for (let i = 0; i < chord.frets.length; i++) {
      const fret = chord.frets[i];
      if (fret > 0) {
        const x = startX + i * (fretWidth / (numStrings - 1));
        const y = startY + (fret - 0.5) * fretHeight;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw finger number
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(chord.fingers[i].toString(), x, y + 3);
        ctx.fillStyle = '#c62828';
      } else if (fret === 0) {
        // Open string
        const x = startX + i * (fretWidth / (numStrings - 1));
        const y = startY - 8;
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#c62828';
      }
    }
  }

  // Initialize all chord diagrams
  document.querySelectorAll('.chord-canvas').forEach(canvas => {
    const chordName = canvas.closest('.chord-diagram').dataset.chord;
    drawChordDiagram(canvas, chordName);
  });

  // Play chord sound placeholder
  document.querySelectorAll('.play-chord').forEach(button => {
    button.addEventListener('click', function() {
      const chord = this.dataset.chord;
      console.log(`Playing chord: ${chord}`);
      this.textContent = '🎵 Dimainkan!';
      setTimeout(() => {
        this.textContent = '♪ Mainkan';
      }, 1000);
    });
  });
});
</script>