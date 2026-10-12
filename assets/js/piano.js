/* Native Web Audio with local Salamander Grand Piano samples; no framework. */
(() => {
  'use strict';
  const piano = document.querySelector('.piano-interlude');
  if (!piano) return;
  const board = piano.querySelector('.piano-board');
  const particles = piano.querySelector('.piano-notes');
  const output = piano.querySelector('.piano-current-note');
  const muteButton = piano.querySelector('.piano-mute');
  const hint = piano.querySelector('.piano-hint');
  const originalHint = hint.innerHTML;
  const sampleBankURL = new URL('../audio/piano/salamander-samples.js', document.currentScript.src).href;
  const heldInputs = new Map();
  const quarterMs = 60000 / 120;
  // Nearest common note value, with a decorative maximum of one whole note.
  const noteValues = [
    { name: 'sixteenth', beats: .25, flags: 2, hollow: false },
    { name: 'eighth', beats: .5, flags: 1, hollow: false },
    { name: 'quarter', beats: 1, flags: 0, hollow: false },
    { name: 'half', beats: 2, flags: 0, hollow: true },
    { name: 'whole', beats: 4, flags: 0, hollow: true }
  ];
  let rhythmFrame = 0;
  const voices = new Set();
  const buffers = new Map();
  const shortcuts = { a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67, y: 68, h: 69, u: 70, j: 71, k: 72, o: 73, l: 74, p: 75, ';': 76 };
  let context;
  let master;
  let muted = false;
  let bank;
  let bankPromise;
  let playbackGeneration = 0;

  function unavailable(message = 'Sound is unavailable here. The keys still dance.') {
    piano.dataset.audioState = 'unavailable';
    hint.textContent = message;
  }

  function loadSampleBank() {
    if (bank) return Promise.resolve(bank);
    if (bankPromise) return bankPromise;
    bankPromise = new Promise((resolve, reject) => {
      // A classic local script also works under file://, without a fetch/CORS requirement.
      const script = document.createElement('script');
      script.src = sampleBankURL;
      script.async = true;
      script.onload = () => {
        bank = window.HaoranPianoSamples;
        delete window.HaoranPianoSamples;
        script.remove();
        if (bank && Object.keys(bank).length) resolve(bank);
        else { bankPromise = null; reject(new Error('Piano samples are missing')); }
      };
      script.onerror = () => {
        script.remove();
        bankPromise = null;
        reject(new Error('Piano samples could not load'));
      };
      document.head.append(script);
    });
    return bankPromise;
  }

  async function sampleFor(midi) {
    const samples = await loadSampleBank();
    const nearest = Object.keys(samples).map(Number).reduce((best, note) =>
      Math.abs(note - midi) < Math.abs(best - midi) ? note : best);
    if (!buffers.has(nearest)) {
      const bytes = Uint8Array.from(atob(samples[nearest]), character => character.charCodeAt(0));
      buffers.set(nearest, context.decodeAudioData(bytes.buffer).catch(error => {
        buffers.delete(nearest);
        throw error;
      }));
    }
    return { buffer: await buffers.get(nearest), midi: nearest };
  }

  async function playTone(midi, press) {
    if (muted) return;
    const generation = playbackGeneration;
    try {
      if (!context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) { unavailable(); return; }
        context = new AudioContext();
        master = context.createGain();
        master.gain.value = .8;
        const compressor = context.createDynamicsCompressor();
        compressor.threshold.value = -12;
        compressor.knee.value = 8;
        compressor.ratio.value = 2;
        compressor.attack.value = .005;
        compressor.release.value = .15;
        master.connect(compressor);
        compressor.connect(context.destination);
      }
      if (context.state !== 'running') await context.resume();
      if (context.state !== 'running') { unavailable(); return; }
      const sample = await sampleFor(midi);
      // Do not replay pending notes after muting or leaving the page.
      if (muted || generation !== playbackGeneration || press.cancelled) return;
      const frequency = 440 * Math.pow(2, (midi - 69) / 12);
      const rate = Math.pow(2, (midi - sample.midi) / 12);
      const now = context.currentTime;
      const duration = Math.min(sample.buffer.duration / rate, 5);
      const source = context.createBufferSource();
      source.buffer = sample.buffer;
      source.playbackRate.value = rate;
      const voiceGain = context.createGain();
      voiceGain.gain.setValueAtTime(0, now);
      voiceGain.gain.linearRampToValueAtTime(.85, now + .003);
      voiceGain.gain.setValueAtTime(.85, now + Math.max(.004, duration - .3));
      voiceGain.gain.linearRampToValueAtTime(0, now + duration);
      source.connect(voiceGain);
      voiceGain.connect(master);
      const voice = {
        stop() {
          voiceGain.gain.cancelScheduledValues(context.currentTime);
          voiceGain.gain.setTargetAtTime(0, context.currentTime, .015);
          source.stop(context.currentTime + .08);
          voices.delete(voice);
        }
      };
      if (voices.size >= 24) voices.values().next().value.stop();
      voices.add(voice);
      source.onended = () => {
        source.disconnect();
        voiceGain.disconnect();
        voices.delete(voice);
        piano.dataset.activeVoices = String(voices.size);
      };
      source.start(now);
      source.stop(now + duration + .02);
      piano.dataset.audioState = 'running';
      piano.dataset.audioEngine = 'Salamander Grand Piano';
      piano.dataset.lastFrequency = frequency.toFixed(3);
      piano.dataset.lastSampleMidi = String(sample.midi);
      piano.dataset.lastPlaybackRate = rate.toFixed(6);
      piano.dataset.activeVoices = String(voices.size);
      if (hint.innerHTML !== originalHint) hint.innerHTML = originalHint;
    } catch (_) {
      unavailable('Piano sound could not load. Tap a key to retry.');
    }
  }

  function valueFor(milliseconds) {
    return noteValues.reduce((best, value) =>
      Math.abs(milliseconds - value.beats * quarterMs) < Math.abs(milliseconds - best.beats * quarterMs) ? value : best);
  }

  function drawNote(note, value) {
    if (note.dataset.value === value.name) return;
    note.dataset.value = value.name;
    note.dataset.beats = String(value.beats);
    // Single un-beamed notes: hollow half/whole heads; flags only on short notes.
    const whole = value.name === 'whole';
    const head = whole
      ? '<ellipse cx="13" cy="36" rx="8" ry="5.2" fill="currentColor"/><ellipse cx="13" cy="36" rx="3.2" ry="4.2" transform="rotate(-20 13 36)" fill="white"/>'
      : `<ellipse cx="11" cy="36" rx="6.6" ry="4.4" transform="rotate(-24 11 36)" fill="${value.hollow ? 'white' : 'currentColor'}" stroke="currentColor" stroke-width="1.6"/>`;
    const stem = whole ? '' : '<path d="M17 34V7" fill="none" stroke="currentColor" stroke-width="1.8"/>';
    let flags = '';
    for (let i = 0; i < value.flags; i++) {
      flags += `<path d="M17 ${7 + i * 7}C18 ${14 + i * 7} 29 ${14 + i * 7} 24 ${26 + i * 7}C27 ${16 + i * 7} 19 ${19 + i * 7} 17 ${16 + i * 7}Z" fill="currentColor"/>`;
    }
    note.innerHTML = `<svg viewBox="0 0 32 46" aria-hidden="true">${head}${stem}${flags}</svg>`;
  }

  function updateHeldNotes() {
    const now = performance.now();
    heldInputs.forEach(press => drawNote(press.note, valueFor(now - press.started)));
    rhythmFrame = heldInputs.size ? requestAnimationFrame(updateHeldNotes) : 0;
  }

  function beginPress(key, input) {
    if (heldInputs.has(input)) return;
    const midi = Number(key.dataset.midi);
    key.classList.add('is-pressed');
    const keyRect = key.getBoundingClientRect();
    const pianoRect = piano.getBoundingClientRect();
    const note = document.createElement('span');
    note.className = 'piano-floating-note is-held';
    const center = keyRect.left + keyRect.width / 2 - pianoRect.left;
    note.style.left = `${Math.max(16, Math.min(pianoRect.width - 16, center))}px`;
    note.style.top = `${keyRect.top + keyRect.height * .35 - pianoRect.top - 38}px`;
    note.style.setProperty('--drift', `${(midi % 5 - 2) * 12}px`);
    drawNote(note, noteValues[0]);
    // Discard old released particles first; held notes remain until release/cancel.
    if (particles.childElementCount >= 32) particles.querySelector('.is-released')?.remove();
    particles.append(note);
    const press = { key, note, started: performance.now(), cancelled: false };
    heldInputs.set(input, press);
    piano.dataset.heldNotes = String(heldInputs.size);
    if (!rhythmFrame) rhythmFrame = requestAnimationFrame(updateHeldNotes);
    void playTone(midi, press);
  }

  function endPress(input, cancelled = false) {
    const press = heldInputs.get(input);
    if (!press) return;
    heldInputs.delete(input);
    press.cancelled = cancelled;
    if (cancelled) delete press.key.dataset.keyboardClick;
    if (![...heldInputs.values()].some(other => other.key === press.key)) press.key.classList.remove('is-pressed');
    piano.dataset.heldNotes = String(heldInputs.size);
    if (cancelled) { press.note.remove(); return; }
    const duration = performance.now() - press.started;
    const value = valueFor(duration);
    drawNote(press.note, value);
    press.note.classList.replace('is-held', 'is-released');
    output.textContent = press.key.dataset.note;
    output.setAttribute('aria-label', `${press.key.dataset.note}, ${value.name} note at 120 beats per minute`);
    piano.dataset.lastNoteValue = value.name;
    piano.dataset.lastHoldMs = duration.toFixed(1);
    piano.dataset.lastBeats = String(value.beats);
    press.note.addEventListener('animationend', () => press.note.remove(), { once: true });
    setTimeout(() => press.note.remove(), 1600);
  }

  function cancelHeldNotes() {
    [...heldInputs.keys()].forEach(input => endPress(input, true));
    cancelAnimationFrame(rhythmFrame);
    rhythmFrame = 0;
  }

  board.querySelectorAll('button').forEach(key => { key.disabled = false; });
  muteButton.disabled = false;
  board.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const key = event.target.closest('.piano-key');
    if (!key) return;
    key.setPointerCapture(event.pointerId);
    beginPress(key, `pointer:${event.pointerId}`);
  });
  board.addEventListener('contextmenu', event => event.preventDefault());
  board.addEventListener('pointerup', event => endPress(`pointer:${event.pointerId}`));
  board.addEventListener('pointercancel', event => endPress(`pointer:${event.pointerId}`, true));
  board.addEventListener('lostpointercapture', event => endPress(`pointer:${event.pointerId}`, true));
  // Assistive technologies can activate buttons without pointer/key events.
  board.addEventListener('click', event => {
    if (event.detail !== 0 || event.target.dataset.keyboardClick === 'true') return;
    const key = event.target.closest('.piano-key');
    if (!key) return;
    const input = Symbol('accessible click');
    beginPress(key, input);
    endPress(input);
  });
  muteButton.addEventListener('click', () => {
    muted = !muted;
    playbackGeneration++;
    muteButton.setAttribute('aria-pressed', String(muted));
    muteButton.setAttribute('aria-label', muted ? 'Unmute piano' : 'Mute piano');
    muteButton.querySelector('span').textContent = muted ? 'Sound off' : 'Sound on';
    if (master) master.gain.setTargetAtTime(muted ? 0 : .8, context.currentTime, .02);
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target.closest('input, textarea, select, a, summary, [contenteditable="true"], button:not(.piano-key)')) return;
    const input = `keyboard:${event.code || event.key}`;
    if (heldInputs.has(input)) { event.preventDefault(); return; }
    if (event.repeat) return;
    const focusedKey = event.target.closest('.piano-key');
    const activateFocused = focusedKey && (event.key === ' ' || event.key === 'Enter');
    const midi = shortcuts[event.key.toLowerCase()];
    if (!activateFocused && midi === undefined) return;
    const rect = board.getBoundingClientRect();
    if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
    const key = activateFocused ? focusedKey : board.querySelector(`[data-midi="${midi}"]`);
    if (!key || !key.getClientRects().length) return;
    event.preventDefault();
    // Suppress the synthetic click some browsers emit for Enter/Space.
    if (activateFocused) key.dataset.keyboardClick = 'true';
    beginPress(key, input);
  });
  document.addEventListener('keyup', event => {
    const input = `keyboard:${event.code || event.key}`;
    const press = heldInputs.get(input);
    if (!press) return;
    event.preventDefault();
    endPress(input);
    setTimeout(() => { delete press.key.dataset.keyboardClick; }, 0);
  });
  window.addEventListener('blur', cancelHeldNotes);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelHeldNotes();
  });
  window.addEventListener('pagehide', () => {
    cancelHeldNotes();
    playbackGeneration++;
    voices.forEach(voice => voice.stop());
    // Suspending also allows notes to work after back/forward cache restoration.
    if (context && context.state === 'running') void context.suspend().catch(() => {});
  });
  // Prepare the compressed bank near the footer; decode only notes that are played.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        void loadSampleBank().catch(() => {});
        observer.disconnect();
      }
    }, { rootMargin: '500px' });
    observer.observe(piano);
  }
  piano.addEventListener('pointerenter', () => { void loadSampleBank().catch(() => {}); }, { once: true });
  piano.addEventListener('focusin', () => { void loadSampleBank().catch(() => {}); }, { once: true });
})();
