// App-Logik: Persistenz, automatische Progression/Deload, Timer, minimal-tap Rendering

const STORAGE_KEY = "fitnessAppState_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    sessionCount: 0,
    lastWeights: {},
    currentWeights: {},
    currentFeedback: {},
    history: {},
    lastCompletedDate: null,
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = loadState();

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function roundStep(value, step) {
  const s = step || 0.5;
  return Math.round(value / s) * s;
}

function getTodayPlan() {
  const idx = state.sessionCount % PLAN.days.length;
  return PLAN.days[idx];
}

function isDeloadWeek() {
  const n = PLAN.meta.deloadEveryNSessions;
  return state.sessionCount > 0 && state.sessionCount % n === 0;
}

function baseWeightFor(ex) {
  return state.lastWeights[ex.id];
}

function displayWeightFor(ex) {
  if (state.currentWeights[ex.id] != null) return state.currentWeights[ex.id];
  const base = baseWeightFor(ex);
  if (base == null) return null;
  if (isDeloadWeek()) return roundStep(base * 0.8, ex.increment || 0.5);
  return base;
}

function nextBaseWeight(ex, usedWeight, feedback) {
  if (!ex.increment) return usedWeight;
  const inc = ex.increment;
  if (feedback === "leicht") return roundStep(usedWeight + inc * 1.5, inc);
  if (feedback === "schwer") return usedWeight;
  return roundStep(usedWeight + inc, inc);
}

// ---------- Timer ----------
let activeTimer = null;

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

function startHoldTimer(seconds, displayEl) {
  clearActiveTimer();
  let remaining = seconds;
  displayEl.textContent = `⏱ ${remaining}s`;
  activeTimer = setInterval(() => {
    remaining--;
    if (remaining <= 0) {
      clearInterval(activeTimer);
      activeTimer = null;
      displayEl.textContent = "✅ Fertig!";
      playBeep();
      vibrate([200, 100, 200]);
    } else {
      displayEl.textContent = `⏱ ${remaining}s`;
    }
  }, 1000);
}

function startIntervalTimer(rounds, work, rest, displayEl) {
  clearActiveTimer();
  let round = 1;
  let phase = "work";
  let remaining = work;
  function tick() {
    const label = phase === "work" ? "Hart" : "Locker";
    displayEl.textContent = `Runde ${round}/${rounds} – ${label} ${remaining}s`;
    if (remaining <= 0) {
      vibrate(phase === "work" ? [150] : [150, 80, 150]);
      playBeep();
      if (phase === "work") {
        phase = "rest";
        remaining = rest;
      } else {
        round++;
        phase = "work";
        remaining = work;
        if (round > rounds) {
          clearInterval(activeTimer);
          activeTimer = null;
          displayEl.textContent = "✅ Intervalle fertig!";
          return;
        }
      }
    } else {
      remaining--;
    }
  }
  activeTimer = setInterval(tick, 1000);
  tick();
}

function clearActiveTimer() {
  if (activeTimer) {
    clearInterval(activeTimer);
    activeTimer = null;
  }
}

// ---------- Rendering ----------
const app = document.getElementById("app");

function render() {
  clearActiveTimer();
  const day = getTodayPlan();
  const deload = isDeloadWeek();
  const doneToday = state.lastCompletedDate === todayStr();

  const header = `
    <div class="header">
      <div class="day-label">${day.label}</div>
      <div class="meta-row">
        <span>Session #${state.sessionCount + 1}</span>
        ${deload ? '<span class="badge deload">🔻 Deload-Woche</span>' : ""}
      </div>
      ${doneToday ? '<div class="done-note">Heute schon als erledigt gespeichert ✅ – du kannst trotzdem nochmal trainieren und erneut abschließen.</div>' : ""}
    </div>
  `;

  const cards = day.exercises.map((ex) => renderExercise(ex, deload)).join("");

  app.innerHTML = `
    ${header}
    <div class="cards">${cards}</div>
    <div class="footer">
      <button id="finishBtn" class="finish-btn">✅ Workout abschließen</button>
    </div>
  `;

  attachHandlers(day);
}

function renderExercise(ex, deload) {
  const weight = displayWeightFor(ex);
  const needsFirstWeight = ex.increment > 0 && weight == null;
  const feedback = state.currentFeedback[ex.id] || "passt";

  let targetLine;
  if (ex.timeBased && ex.finisher) {
    targetLine = `${ex.sets} Runden – ${ex.reps}`;
  } else if (ex.holdSeconds) {
    targetLine = `${ex.sets} x ${ex.holdSeconds} Sek. halten`;
  } else if (needsFirstWeight) {
    targetLine = `${ex.sets} x ${ex.reps} – Startgewicht?`;
  } else if (ex.increment > 0) {
    targetLine = `${ex.sets} x ${ex.reps} @ ${weight} kg`;
  } else {
    targetLine = `${ex.sets} x ${ex.reps}`;
  }

  const weightControls =
    ex.increment > 0 && !needsFirstWeight
      ? `
      <div class="stepper" data-ex="${ex.id}">
        <button class="step-btn" data-delta="-${ex.increment}">−</button>
        <span class="step-val">${weight} kg</span>
        <button class="step-btn" data-delta="${ex.increment}">+</button>
      </div>`
      : "";

  const firstWeightInput = needsFirstWeight
    ? `<input type="number" step="0.5" inputmode="decimal" placeholder="kg heute" class="first-weight" data-ex="${ex.id}" />`
    : "";

  const feedbackControls =
    ex.increment > 0
      ? `
      <div class="feedback-toggle" data-ex="${ex.id}">
        <button class="fb-btn ${feedback === "leicht" ? "active" : ""}" data-fb="leicht">😌 leicht</button>
        <button class="fb-btn ${feedback === "passt" ? "active" : ""}" data-fb="passt">✅ passt</button>
        <button class="fb-btn ${feedback === "schwer" ? "active" : ""}" data-fb="schwer">😤 schwer</button>
      </div>`
      : "";

  const timerButton = ex.holdSeconds
    ? `<button class="timer-btn" data-hold="${ex.holdSeconds}" data-ex="${ex.id}">▶ Timer (${ex.holdSeconds}s)</button><div class="timer-display" id="timer-${ex.id}"></div>`
    : ex.timeBased && ex.finisher
    ? `<button class="timer-btn" data-rounds="${ex.rounds}" data-work="${ex.intervalWork}" data-rest="${ex.intervalRest}" data-ex="${ex.id}">▶ Intervalle starten</button><div class="timer-display" id="timer-${ex.id}"></div>`
    : "";

  return `
    <div class="card" data-ex="${ex.id}">
      <div class="illus">${iconFor(ex.illus)}</div>
      <div class="card-body">
        <div class="ex-name">${ex.name}</div>
        <div class="ex-equip">${ex.equipment}</div>
        <div class="ex-target">${targetLine}</div>
        ${firstWeightInput}
        ${weightControls}
        ${feedbackControls}
        ${timerButton}
      </div>
    </div>
  `;
}

function attachHandlers(day) {
  document.querySelectorAll(".step-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".stepper");
      const exId = wrap.dataset.ex;
      const ex = day.exercises.find((e) => e.id === exId);
      const current = displayWeightFor(ex) ?? 0;
      const delta = parseFloat(btn.dataset.delta);
      const updated = Math.max(0, roundStep(current + delta, ex.increment));
      state.currentWeights[exId] = updated;
      saveState();
      render();
    });
  });

  document.querySelectorAll(".first-weight").forEach((input) => {
    input.addEventListener("change", () => {
      const exId = input.dataset.ex;
      const val = parseFloat(input.value);
      if (!isNaN(val)) {
        state.currentWeights[exId] = val;
        saveState();
        render();
      }
    });
  });

  document.querySelectorAll(".fb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wrap = btn.closest(".feedback-toggle");
      const exId = wrap.dataset.ex;
      state.currentFeedback[exId] = btn.dataset.fb;
      saveState();
      render();
    });
  });

  document.querySelectorAll(".timer-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const exId = btn.dataset.ex;
      const displayEl = document.getElementById(`timer-${exId}`);
      if (btn.dataset.hold) {
        startHoldTimer(parseInt(btn.dataset.hold, 10), displayEl);
      } else {
        startIntervalTimer(
          parseInt(btn.dataset.rounds, 10),
          parseInt(btn.dataset.work, 10),
          parseInt(btn.dataset.rest, 10),
          displayEl
        );
      }
    });
  });

  document.getElementById("finishBtn").addEventListener("click", () => finishWorkout(day));
}

function finishWorkout(day) {
  const deload = isDeloadWeek();
  const date = todayStr();

  day.exercises.forEach((ex) => {
    if (ex.increment <= 0) return;
    const used = state.currentWeights[ex.id] ?? displayWeightFor(ex);
    if (used == null) return;

    if (!state.history[ex.id]) state.history[ex.id] = [];
    const feedback = state.currentFeedback[ex.id] || "passt";
    state.history[ex.id].push({ date, weight: used, feedback, deload });

    if (deload) {
      // Baseline (lastWeights) bleibt unangetastet während Deload-Wochen
      if (state.lastWeights[ex.id] == null) state.lastWeights[ex.id] = used;
    } else {
      state.lastWeights[ex.id] = nextBaseWeight(ex, used, feedback);
    }
  });

  state.sessionCount += 1;
  state.lastCompletedDate = date;
  state.currentWeights = {};
  state.currentFeedback = {};
  saveState();

  const next = getTodayPlan();
  app.innerHTML = `
    <div class="done-screen">
      <div class="done-emoji">💪</div>
      <div class="done-title">Super gemacht!</div>
      <div class="done-sub">Workout gespeichert. Nächstes Mal: ${next.label}${isDeloadWeek() ? " (Deload-Woche 🔻)" : ""}</div>
      <button id="backBtn" class="finish-btn">Zurück zur Übersicht</button>
    </div>
  `;
  document.getElementById("backBtn").addEventListener("click", render);
}

render();
