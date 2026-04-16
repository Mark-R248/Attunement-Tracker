<style>
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  margin: 0;
  color: #222;
}

h1 {
  text-align: center;
  margin-bottom: 15px;
}

#topBar {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

select, button {
  padding: 8px;
  font-weight: bold;
}

#cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 0 10px;
}

@media (min-width: 768px) {
  #cards { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1400px) {
  #cards { grid-template-columns: repeat(3, 1fr); }
}

.card {
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 15px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e6e6e6;
}

.bar {
  height: 10px;
  background: #e2e2e2;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}

.barFill {
  height: 100%;
  background: #6b6b6b;
  transition: width 0.35s ease;
}

.manaRow {
  font-size: 12px;
  margin-top: 6px;
  opacity: 0.85;
}

.cardBody {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 12px;
  margin-top: 10px;
}

.spellGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  align-content: start;
}

.spellGrid button {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  aspect-ratio: 1 / 1;
  font-size: 14px;
  font-weight: bold;
  border: 1px solid #cfcfcf;
  background: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.spellGrid button:hover { background: #eeeeee; transform: translateY(-1px); }
.spellGrid button:active { background: #e2e2e2; transform: translateY(0px); }

.typePanel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.typeHeader {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  text-align: center;
  opacity: 0.6;
  margin-bottom: 6px;
}

.typeCol {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.typeTag {
  background: #eeeeee;
  border: 1px solid #d6d6d6;
  border-radius: 7px;
  padding: 7px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.typeTag:hover { background: #e6e6e6; }
.typeTag.active { background: #dcdcdc; box-shadow: inset 0 0 8px rgba(255,0,0,0.9); }
.typeTag.conflict { box-shadow: inset 0 0 10px rgba(255, 80, 80, 0.9); border-color: #ff6666; }

.compoundBtn {
  font-size: 10px;
  padding: 4px 6px;
  border: 1px solid #333;
  border-radius: 6px;
  opacity: 0.6;
  cursor: pointer;
}

.compoundBtn.glow { box-shadow: 0 0 6px #aaa; opacity: 0.9; }
.compoundBtn.active { background: #6b6b6b; color: white; opacity: 1; }

.card.matchingType {
  box-shadow: 0 0 10px rgba(100,150,255,0.45);
  border-color: #7fa8ff;
}

#compoundSection {
  margin-top: 20px;
  padding: 10px 10px 20px;
  border-top: 2px solid #d0d0d0;
}

.compoundHeader {
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

#compoundGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.compoundCard {
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 6px;
  text-align: center;
  font-size: 11px;
  background: #f9f9f9;
  cursor: default;
}

.compoundCard.active {
  background: #6b6b6b;
  color: white;
}

.compoundTypes {
  font-size: 10px;
  opacity: 0.7;
  margin-top: 2px;
}

.capacityControls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.capacityControls button {
  font-size: 10px;
  padding: 2px 6px;
  border: 1px solid #aaa;
  border-radius: 6px;
  cursor: pointer;
}

.capacityControls span {
  font-size: 11px;
  opacity: 0.8;
  margin: 0 4px;
}
</style>
</head>
<body>

<h1>Magic Attunement Tracker</h1>

<div id="topBar">
  <select id="attunementSelect"></select>
  <input id="startManaInput" type="number" min="1" value="20" style="width:80px" />
  <button onclick="addAttunement()">Add</button>
  <button onclick="refillHalf()">Half Refill</button>
  <button onclick="refillFull()">Full Refill</button>
</div>

<div id="cards"></div>

<div id="compoundSection">
  <div class="compoundHeader">Available Compound Magic</div>
  <div id="compoundGrid"></div>
</div>

<script>
/* ============================================================
   DATA
   ============================================================ */

const SPELL_COSTS = { 1:1, 2:3, 3:12, 4:20, 5:72, 6:120, 7:460, 8:720, 9:2600 };

const BASE_TYPES = [
  "Air","Earth","Fire","Water","Light","Umbral",
  "Death","Life","Motion","Enhance","Perceive","Mental"
];

// Each entry: [name, typeA, typeB]
const COMPOUNDS = [
  ["Acuity","Motion","Mental"],
  ["Adaptation","Life","Motion"],
  ["Alteration","Earth","Perceive"],
  ["Banishment","Light","Death"],
  ["Blight","Air","Death"],
  ["Blood","Water","Life"],
  ["Bone","Earth","Death"],
  ["Breath","Air","Life"],
  ["Chaos","Death","Motion"],
  ["Clarity","Water","Mental"],
  ["Coercion","Enhance","Perceive"],
  ["Communication","Air","Mental"],
  ["Constellations","Light","Motion"],
  ["Dawn","Fire","Enhance"],
  ["Density","Earth","Enhance"],
  ["Destiny","Light","Mental"],
  ["Dreams","Umbral","Perceive"],
  ["Enervation","Earth","Umbral"],
  ["Heat","Fire","Motion"],
  ["Ice","Water","Enhance"],
  ["Incineration","Fire","Death"],
  ["Lies","Fire","Perceive"],
  ["Lightning","Air","Fire"],
  ["Madness","Death","Perceive"],
  ["Memory","Enhance","Mental"],
  ["Metal","Earth","Fire"],
  ["Peace","Water","Light"],
  ["Poison","Water","Umbral"],
  ["Protection","Life","Enhance"],
  ["Purity","Fire","Light"],
  ["Rain","Air","Water"],
  ["Ruin","Death","Enhance"],
  ["Sand","Earth","Water"],
  ["Secrets","Umbral","Mental"],
  ["Shade","Umbral","Life"],
  ["Sight","Light","Perceive"],
  ["Sound","Air","Perceive"],
  ["Spirit","Light","Life"],
  ["Supremacy","Umbral","Death"],
  ["Tides","Water","Motion"],
  ["Time","Motion","Perceive"],
  ["Tranquillity","Earth","Mental"],
  ["Transcendence","Life","Mental"],
  ["Travel","Air","Motion"],
  ["Vitality","Air","Light"],
  ["Void","Umbral","Enhance"],
  ["War","Fire","Umbral"],
  ["Wood","Earth","Life"]
];

const ATTUNEMENTS = {
  Abjurer:      { Light:1, Death:1, Motion:3 },
  Acolyte:      { Water:1, Life:1, Mental:3 },
  Analyst:      { Umbral:1, Mental:1, Motion:3 },
  Arbiter:      { Light:3, Life:1, Motion:1 },
  Architect:    { Umbral:1, Perceive:1, Enhance:3 },
  Assassin:     { Water:1, Umbral:1, Death:3 },
  Biomancer:    { Light:3, Life:1, Mental:1 },
  Champion:     { Water:1, Mental:3, Enhance:1 },
  Chronomancer: { Death:3, Perceive:1, Motion:1 },
  Cloudcaller:  { Air:1, Water:1, Perceive:3 },
  Commander:    { Air:3, Fire:1, Umbral:1 },
  Conjurer:     { Umbral:1, Life:1, Mental:3 },
  Controller:   { Umbral:3, Perceive:1, Enhance:1 },
  Dancer:       { Air:3, Water:1, Mental:1 },
  Diviner:      { Water:3, Mental:1, Enhance:1 },
  Elementalist: { Air:1, Fire:1, Water:3 },
  Enchanter:    { Light:3, Mental:1, Motion:1 },
  Executioner:  { Earth:3, Death:1, Enhance:1 },
  Forgemaster:  { Earth:1, Fire:1, Enhance:3 },
  Guardian:     { Earth:3, Life:1, Enhance:1 },
  Heirophant:   { Air:1, Life:1, Perceive:3 },
  Illuminator:  { Air:3, Water:1, Light:1 },
  Illusionist:  { Fire:3, Light:1, Perceive:1 },
  Juggernaut:   { Earth:3, Fire:1, Motion:1 },
  Legionnaire:  { Air:1, Fire:3, Light:1 },
  Mender:       { Earth:1, Water:3, Life:1 },
  Mesmer:       { Umbral:3, Death:1, Perceive:1 },
  Necromancer:  { Earth:1, Death:1, Life:1 },
  Paladin:      { Light:1, Life:3, Motion:1 },
  Purifier:     { Fire:1, Light:1, Mental:3 },
  Pyromancer:   { Fire:1, Umbral:3, Death:1 },
  Saboteur:     { Earth:1, Fire:3, Umbral:1 },
  Scourge:      { Air:1, Water:3, Death:1 },
  Seer:         { Light:1, Death:3, Mental:1 },
  Sentinel:     { Earth:1, Mental:1, Enhance:3 },
  Shadow:       { Umbral:1, Death:3, Enhance:1 },
  Shaper:       { Earth:1, Perceive:3, Enhance:1 },
  Shapeshifter: { Earth:1, Life:3, Perceive:1 },
  Shieldbreaker:{ Fire:3, Death:1, Motion:1 },
  Soulblade:    { Light:1, Life:1, Motion:3 },
  Sovereign:    { Umbral:1, Death:1, Enhance:3 },
  Spellsinger:  { Air:1, Light:3, Perceive:1 },
  Summoner:     { Air:1, Life:3, Motion:1 },
  Swordmaster:  { Earth:3, Fire:1, Enhance:1 },
  Transmuter:   { Air:3, Earth:1, Water:1 },
  Wavewalker:   { Water:1, Perceive:3, Motion:1 },
  Wayfarer:     { Air:1, Mental:1, Motion:1 },
  Whisper:      { Fire:1, Umbral:3, Perceive:1 }
};

// Conflicting type pairs — selecting one side blocks the other
const TYPE_OPPOSITES = [
  { groupA: ["Air","Light","Motion"],    groupB: ["Earth","Umbral","Enhance"] },
  { groupA: ["Fire","Death","Perceive"], groupB: ["Water","Life","Mental"]    }
];

// Rank thresholds: [minMana, rankName, growthRate]
const RANK_THRESHOLDS = [
  [0,      "Pearl",    60],
  [60,     "Garnet",   120],
  [360,    "Amber",    240],
  [2160,   "Topaz",    480],
  [12960,  "Emerald",  960],
  [77760,  "Sapphire", 3840],
  [466560, "Amethyst", 30720],
];

const MAX_MANA_CAP = 500000;

/* ============================================================
   STATE
   ============================================================ */

let attunements = {};
let globalTypeQueue = [];  // [{ att: name, type }], max length 2
let pendingDelete = null;

/* ============================================================
   RANK & GROWTH HELPERS
   ============================================================ */

function getRankEntry(maxMana) {
  let entry = RANK_THRESHOLDS[0];
  for (const row of RANK_THRESHOLDS) {
    if (maxMana >= row[0]) entry = row;
  }
  return entry;
}

function getRank(maxMana)       { return getRankEntry(maxMana)[1]; }
function getGrowthRate(maxMana) { return getRankEntry(maxMana)[2]; }
function isTopazOrHigher(maxMana) { return maxMana >= 2160; }

function getMaxSpellLevel(maxMana) {
  if (maxMana < 60)    return 2;   // Pearl
  if (maxMana < 360)   return 4;   // Garnet
  if (maxMana < 2160)  return 6;   // Amber
  if (maxMana < 12960) return 8;   // Topaz
  return 9;                        // Emerald+
}

/* ============================================================
   TYPE HELPERS
   ============================================================ */

function getConflicts(type) {
  const conflicts = new Set();
  for (const pair of TYPE_OPPOSITES) {
    if (pair.groupA.includes(type)) pair.groupB.forEach(t => conflicts.add(t));
    if (pair.groupB.includes(type)) pair.groupA.forEach(t => conflicts.add(t));
  }
  return conflicts;
}

function getUnlockedTypes(att, unlocked) {
  const entry = ATTUNEMENTS[att.name];
  const set = new Set();
  for (const [t, value] of Object.entries(entry)) {
    if (value === 1)               set.add(t);
    if (value === 3 && unlocked)   set.add(t);
  }
  return set;
}

function getSelectedTypesGlobal() {
  const set = new Set();
  for (const att of Object.values(attunements)) {
    att.selectedTypes.forEach(t => set.add(t));
  }
  return set;
}

function getTypePresenceMap() {
  const map = new Map();
  for (const att of Object.values(attunements)) {
    att.selectedTypes.forEach(t => map.set(t, (map.get(t) || 0) + 1));
  }
  return map;
}

function getAvailableTypesGlobal() {
  const set = new Set();
  for (const att of Object.values(attunements)) {
    const entry = ATTUNEMENTS[att.name];
    const unlocked = isTopazOrHigher(att.maxMana);
    for (const [t, value] of Object.entries(entry)) {
      if (value === 1)             set.add(t);
      if (value === 3 && unlocked) set.add(t);
    }
  }
  return set;
}

/* ============================================================
   ATTUNEMENT INIT
   ============================================================ */

function initAtt(name, startMana) {
  return {
    name,
    maxMana: startMana,
    mana: startMana,
    spent: 0,
    growth: 0,
    selectedTypes: []
  };
}

/* ============================================================
   ADD / DELETE
   ============================================================ */

function addAttunement() {
  const name = document.getElementById("attunementSelect").value;
  if (!name || attunements[name]) return;

  const raw = parseInt(document.getElementById("startManaInput").value, 10);
  const startMana = Math.max(1, isNaN(raw) ? 100 : raw);

  attunements[name] = initAtt(name, startMana);
  render();
}

function confirmDelete(attName, btn) {
  if (pendingDelete === attName) {
    delete attunements[attName];
    globalTypeQueue = globalTypeQueue.filter(obj => obj.att !== attName);
    pendingDelete = null;
    render();
    return;
  }

  // Reset any other confirm buttons
  document.querySelectorAll("button").forEach(b => {
    if (b.textContent === "Confirm?") b.textContent = "Delete";
  });

  pendingDelete = attName;
  btn.textContent = "Confirm?";

  setTimeout(() => {
    if (pendingDelete === attName) {
      btn.textContent = "Delete";
      pendingDelete = null;
    }
  }, 4000);
}

/* ============================================================
   REFILL
   ============================================================ */

function refillFull() {
  for (const att of Object.values(attunements)) {
    att.mana  = att.maxMana;
    att.spent = 0;
  }
  render();
}

function refillHalf() {
  for (const att of Object.values(attunements)) {
    const restore = Math.min(att.spent, att.maxMana * 0.5);
    att.mana  = Math.min(att.maxMana, att.mana + restore);
    att.spent -= restore;
  }
  render();
}

/* ============================================================
   CAST
   ============================================================ */

function cast(attName, level) {
  const caster = attunements[attName];
  if (!caster) return;

  const cost       = SPELL_COSTS[level];
  const spellTypes = [...getSelectedTypesGlobal()];
  if (spellTypes.length === 0) return;

  /* --- Step 1: find contributors --- */
  const contributors = new Set();

  // Caster eligibility check
  {
    const unlocked      = isTopazOrHigher(caster.maxMana);
    const casterTypes   = getUnlockedTypes(caster, unlocked);
    const casterCanCast = spellTypes.length === 1
      ? casterTypes.has(spellTypes[0])
      : caster.selectedTypes.some(t => spellTypes.includes(t));

    if (!casterCanCast) return;
    contributors.add(caster);
  }

  // Additional contributors only in compound (multi-type) mode
  if (spellTypes.length > 1) {
    for (const att of Object.values(attunements)) {
      if (att === caster) continue;
      if (att.selectedTypes.some(t => spellTypes.includes(t))) {
        contributors.add(att);
      }
    }
  }

  const contributorList    = Array.from(contributors);
  const costPerContributor = cost / contributorList.length;

  // Abort if any contributor can't afford their share
  for (const att of contributorList) {
    if (att.mana < Math.ceil(costPerContributor)) return;
  }

  /* --- Step 2: build type cost pool --- */
  const typePool = new Map();
  for (const t of spellTypes) {
    typePool.set(t, cost / spellTypes.length);
  }

  /* --- Step 3: deduct mana --- */
  for (const att of contributorList) {
    const loss = Math.ceil(costPerContributor);
    att.mana  -= loss;
    att.spent += loss;
  }

  /* --- Step 4: apply growth --- */
  for (const att of Object.values(attunements)) {
    const unlocked        = isTopazOrHigher(att.maxMana);
    const attUnlockedTypes = getUnlockedTypes(att, unlocked);

    let totalGrowth = 0;
    for (const t of spellTypes) {
      if (!attUnlockedTypes.has(t)) continue;
      const pool = typePool.get(t);
      if (pool) totalGrowth += pool;
    }
    if (totalGrowth === 0) continue;

    att.growth += totalGrowth / getGrowthRate(att.maxMana);

    while (att.growth >= 1) {
      att.growth  -= 1;
      att.maxMana += 1;
      att.mana    += 1;

      if (att.maxMana >= MAX_MANA_CAP) {
        att.maxMana = MAX_MANA_CAP;
        att.mana    = Math.min(att.mana, MAX_MANA_CAP);
        att.growth  = 0;
        break;
      }
    }
  }

  render();
}

/* ============================================================
   TYPE SELECTION
   ============================================================ */

function toggleType(att, type) {
  // Clear a compound selection before allowing single-type picking
  if (att.selectedTypes.length === 2) {
    att.selectedTypes = [];
    globalTypeQueue   = globalTypeQueue.filter(obj => obj.att !== att.name);
  }

  const alreadySelected = att.selectedTypes.includes(type);

  if (alreadySelected) {
    att.selectedTypes = att.selectedTypes.filter(t => t !== type);
    globalTypeQueue   = globalTypeQueue.filter(
      obj => !(obj.att === att.name && obj.type === type)
    );
  } else {
    // Block if this type is already selected globally
    if (globalTypeQueue.some(obj => obj.type === type)) return;

    // Remove conflicting types from all attunements and the queue
    const conflicts = getConflicts(type);
    for (const a of Object.values(attunements)) {
      a.selectedTypes = a.selectedTypes.filter(t => !conflicts.has(t));
    }
    globalTypeQueue = globalTypeQueue.filter(obj => !conflicts.has(obj.type));

    att.selectedTypes.push(type);
    globalTypeQueue.push({ att: att.name, type });

    // Enforce global max of 2 selections
    if (globalTypeQueue.length > 2) {
      const removed    = globalTypeQueue.shift();
      const removedAtt = attunements[removed.att];
      if (removedAtt) {
        removedAtt.selectedTypes = removedAtt.selectedTypes.filter(
          t => t !== removed.type
        );
      }
    }
  }

  render();
}

function selectCompound(att, typeA, typeB) {
  // Clear this attunement's current selections
  att.selectedTypes = [];
  globalTypeQueue   = globalTypeQueue.filter(obj => obj.att !== att.name);

  att.selectedTypes.push(typeA, typeB);
  globalTypeQueue.push({ att: att.name, type: typeA }, { att: att.name, type: typeB });

  // Enforce global max of 2
  while (globalTypeQueue.length > 2) {
    const removed    = globalTypeQueue.shift();
    const removedAtt = attunements[removed.att];
    if (removedAtt) {
      removedAtt.selectedTypes = removedAtt.selectedTypes.filter(
        t => t !== removed.type
      );
    }
  }

  render();
}

/* ============================================================
   RENDER HELPERS
   ============================================================ */

function renderSpellGrid(att, selectedGlobal) {
  const spellGrid       = document.createElement("div");
  spellGrid.className   = "spellGrid";

  const spellTypes      = [...selectedGlobal];
  const maxLevel        = getMaxSpellLevel(att.maxMana);
  const unlocked        = isTopazOrHigher(att.maxMana);
  const attUnlockedTypes = getUnlockedTypes(att, unlocked);

  for (let l = 1; l <= 9; l++) {
    const btn = document.createElement("button");
    btn.innerHTML = `<div>${l}</div><div style="font-size:10px">(${SPELL_COSTS[l]})</div>`;

    const typeMatch = spellTypes.length === 1
      ? attUnlockedTypes.has(spellTypes[0])
      : spellTypes.length > 1
        ? att.selectedTypes.some(t => spellTypes.includes(t))
        : false;

    if (typeMatch && l <= maxLevel) {
      btn.onclick = () => cast(att.name, l);
    } else {
      btn.disabled      = true;
      btn.style.opacity = "0.3";
      btn.style.cursor  = "not-allowed";
    }

    spellGrid.appendChild(btn);
  }

  return spellGrid;
}

function renderTypePanel(att, selectedGlobal) {
  const entry    = ATTUNEMENTS[att.name];
  const unlocked = isTopazOrHigher(att.maxMana);
  const attUnlockedTypes = getUnlockedTypes(att, unlocked);

  // Compute conflicts from this attunement's current selection
  const activeConflicts = new Set();
  for (const sel of att.selectedTypes) {
    getConflicts(sel).forEach(c => activeConflicts.add(c));
  }

  /* -- Base types column -- */
  const baseCol    = document.createElement("div");
  baseCol.className = "typeCol";

  const baseHeader = document.createElement("div");
  baseHeader.className   = "typeHeader";
  baseHeader.textContent = "Base";
  baseCol.appendChild(baseHeader);

  for (const [t, value] of Object.entries(entry)) {
    if (!unlocked && value !== 1) continue;
    if (unlocked  && value !== 1 && value !== 3) continue;

    const div       = document.createElement("div");
    div.className   = "typeTag";
    div.textContent = t;

    if (att.selectedTypes.includes(t)) div.classList.add("active");
    if (activeConflicts.has(t))        div.classList.add("conflict");

    div.onclick = () => toggleType(att, t);
    baseCol.appendChild(div);
  }

  /* -- Compound types column -- */
  const compCol    = document.createElement("div");
  compCol.className = "typeCol";

  const compHeader = document.createElement("div");
  compHeader.className   = "typeHeader";
  compHeader.textContent = "Compound";
  compCol.appendChild(compHeader);

  for (const [name, a, b] of COMPOUNDS) {
    if (!attUnlockedTypes.has(a) || !attUnlockedTypes.has(b)) continue;

    const div       = document.createElement("div");
    div.className   = "compoundBtn";
    div.textContent = name;

    if (att.selectedTypes.includes(a) && att.selectedTypes.includes(b)) {
      div.classList.add("active");
    }

    div.onclick = () => selectCompound(att, a, b);
    compCol.appendChild(div);
  }

  const typePanel    = document.createElement("div");
  typePanel.className = "typePanel";
  typePanel.appendChild(baseCol);
  typePanel.appendChild(compCol);
  return typePanel;
}

function renderCard(att, selectedGlobal) {
  const entry   = ATTUNEMENTS[att.name];
  const unlocked = isTopazOrHigher(att.maxMana);
  const rank    = getRank(att.maxMana);

  const el      = document.createElement("div");
  el.className  = "card";

  // Highlight if any of this attunement's types are in the global selection
  if (Object.keys(entry).some(t => selectedGlobal.has(t))) {
    el.classList.add("matchingType");
  }

  /* -- Header -- */
  const header    = document.createElement("div");
  header.className = "cardHeader";

  const left       = document.createElement("div");
  left.textContent = att.name;

  const right    = document.createElement("div");
  right.className = "capacityControls";

  const rankLabel       = document.createElement("span");
  rankLabel.textContent = rank;

  const input         = document.createElement("input");
  input.type          = "text";
  input.placeholder   = "+/- amount";
  input.style.width   = "90px";
  input.style.fontSize = "11px";

  const applyBtn       = document.createElement("button");
  applyBtn.textContent = "Apply";

  function applyCapacityChange() {
    let val = input.value.trim();
    if (!val) return;
    if (!val.startsWith("+") && !val.startsWith("-")) val = "+" + val;
    const num = parseInt(val, 10);
    if (isNaN(num)) return;

    att.maxMana = Math.max(1, Math.min(MAX_MANA_CAP, att.maxMana + num));
    att.mana    = Math.min(att.mana, att.maxMana);
    input.value = "";
    render();
  }

  applyBtn.onclick = applyCapacityChange;
  input.addEventListener("keydown", e => { if (e.key === "Enter") applyCapacityChange(); });

  const deleteBtn         = document.createElement("button");
  deleteBtn.textContent   = "Delete";
  deleteBtn.style.marginLeft = "6px";
  deleteBtn.onclick       = () => confirmDelete(att.name, deleteBtn);

  right.appendChild(rankLabel);
  right.appendChild(input);
  right.appendChild(applyBtn);
  right.appendChild(deleteBtn);
  header.appendChild(left);
  header.appendChild(right);

  /* -- Mana bar -- */
  const bar      = document.createElement("div");
  bar.className  = "bar";
  const fill     = document.createElement("div");
  fill.className = "barFill";
  fill.style.width = `${(att.mana / att.maxMana) * 100}%`;
  bar.appendChild(fill);

  const manaRow       = document.createElement("div");
  manaRow.className   = "manaRow";
  manaRow.textContent = `${att.mana}/${att.maxMana} (+${Math.min(att.growth, 0.999).toFixed(2)})`;

  /* -- Body -- */
  const body      = document.createElement("div");
  body.className  = "cardBody";
  body.appendChild(renderSpellGrid(att, selectedGlobal));
  body.appendChild(renderTypePanel(att, selectedGlobal));

  el.appendChild(header);
  el.appendChild(bar);
  el.appendChild(manaRow);
  el.appendChild(body);
  return el;
}

function renderCompoundGrid(selectedGlobal) {
  const grid = document.getElementById("compoundGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const available    = getAvailableTypesGlobal();
  const typePresence = getTypePresenceMap();

  for (const [name, a, b] of COMPOUNDS) {
    if (!available.has(a) || !available.has(b)) continue;

    const hasA = typePresence.get(a) || 0;
    const hasB = typePresence.get(b) || 0;

    const div       = document.createElement("div");
    div.className   = "compoundCard";
    div.textContent = name;

    const isSelected = Object.values(attunements).some(
      att => att.selectedTypes.includes(a) && att.selectedTypes.includes(b)
    );

    if (hasA > 0 && hasB > 0) {
      div.classList.add("active");
    } else if (hasA > 0 || hasB > 0) {
      div.classList.add("glow");
    }

    div.style.cursor = "default";

    grid.appendChild(div);
  }
}

/* ============================================================
   RENDER (top-level)
   ============================================================ */

function render() {
  const wrap          = document.getElementById("cards");
  wrap.innerHTML      = "";

  const selectedGlobal = getSelectedTypesGlobal();

  for (const att of Object.values(attunements)) {
    wrap.appendChild(renderCard(att, selectedGlobal));
  }

  renderCompoundGrid(selectedGlobal);
}

/* ============================================================
   DROPDOWN
   ============================================================ */

function populateDropdown() {
  const sel = document.getElementById("attunementSelect");
  sel.innerHTML = "";
  for (const name of Object.keys(ATTUNEMENTS)) {
    const opt       = document.createElement("option");
    opt.value       = name;
    opt.textContent = name;
    sel.appendChild(opt);
  }
}

/* ============================================================
   INIT
   ============================================================ */

populateDropdown();
render();
</script>
</body>
