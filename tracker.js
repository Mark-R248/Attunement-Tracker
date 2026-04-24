const SPELL_COSTS = { 1:1, 2:3, 3:12, 4:20, 5:72, 6:120, 7:460, 8:720, 9:2600 };

const COMPOUNDS = [
  ["Acuity","Motion","Mental"],       ["Adaptation","Life","Motion"],
  ["Alteration","Earth","Perceive"],  ["Banishment","Light","Death"],
  ["Blight","Air","Death"],           ["Blood","Water","Life"],
  ["Bone","Earth","Death"],           ["Breath","Air","Life"],
  ["Chaos","Death","Motion"],         ["Clarity","Water","Mental"],
  ["Coercion","Enhance","Perceive"],  ["Communication","Air","Mental"],
  ["Constellations","Light","Motion"],["Dawn","Fire","Enhance"],
  ["Density","Earth","Enhance"],      ["Destiny","Light","Mental"],
  ["Dreams","Umbral","Perceive"],     ["Enervation","Earth","Umbral"],
  ["Heat","Fire","Motion"],           ["Ice","Water","Enhance"],
  ["Incineration","Fire","Death"],    ["Lies","Fire","Perceive"],
  ["Lightning","Air","Fire"],         ["Madness","Death","Perceive"],
  ["Memory","Enhance","Mental"],      ["Metal","Earth","Fire"],
  ["Peace","Water","Light"],          ["Poison","Water","Umbral"],
  ["Protection","Life","Enhance"],    ["Purity","Fire","Light"],
  ["Rain","Air","Water"],             ["Ruin","Death","Enhance"],
  ["Sand","Earth","Water"],           ["Secrets","Umbral","Mental"],
  ["Shade","Umbral","Life"],          ["Sight","Light","Perceive"],
  ["Sound","Air","Perceive"],         ["Spirit","Light","Life"],
  ["Supremacy","Umbral","Death"],     ["Tides","Water","Motion"],
  ["Time","Motion","Perceive"],       ["Tranquillity","Earth","Mental"],
  ["Transcendence","Life","Mental"],  ["Travel","Air","Motion"],
  ["Vitality","Air","Light"],         ["Void","Umbral","Enhance"],
  ["War","Fire","Umbral"],            ["Wood","Earth","Life"]
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

const TYPE_OPPOSITES = [
  { groupA: ["Air","Light","Motion"],    groupB: ["Earth","Umbral","Enhance"] },
  { groupA: ["Fire","Death","Perceive"], groupB: ["Water","Life","Mental"]    }
];

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
const WHISPER_EMULATE_MIN  = 60;
const WHISPER_TERTIARY_MIN = 12960;

const WHISPER_EMULATE_TIERS = [
  { minMana: 77760, maxCastLevel: 9, cost: 2600 },
  { minMana: 12960, maxCastLevel: 8, cost: 720  },
  { minMana:  2160, maxCastLevel: 6, cost: 120  },
  { minMana:   360, maxCastLevel: 4, cost: 20   },
  { minMana:    60, maxCastLevel: 2, cost: 3    },
];

function getWhisperEmulateTier(maxMana) {
  for (const tier of WHISPER_EMULATE_TIERS) {
    if (maxMana >= tier.minMana) return tier;
  }
  return null;
}

let characters   = {};
let activeCharId = null;
let _nextCharId  = 1;

const UNDO_LIMIT = 50;
let undoStack = [];

function getRankEntry(maxMana) {
  let entry = RANK_THRESHOLDS[0];
  for (const row of RANK_THRESHOLDS) {
    if (maxMana >= row[0]) entry = row;
  }
  return entry;
}

function getRank(maxMana)         { return getRankEntry(maxMana)[1]; }
function getGrowthRate(maxMana)   { return getRankEntry(maxMana)[2]; }
function isTopazOrHigher(maxMana) { return maxMana >= 2160; }

function getMaxSpellLevel(maxMana) {
  if (maxMana < 60)    return 2;
  if (maxMana < 360)   return 4;
  if (maxMana < 2160)  return 6;
  if (maxMana < 12960) return 8;
  return 9;
}

function whisperCanEmulate(att) {
  return att.name === "Whisper" && att.maxMana >= WHISPER_EMULATE_MIN;
}

function getWhisperEmulatedDisplayTypes(att) {
  if (!att.emulationTarget) return new Set();
  const targetEntry = ATTUNEMENTS[att.emulationTarget];
  if (!targetEntry) return new Set();
  const withTertiary = att.maxMana >= WHISPER_TERTIARY_MIN;
  const set = new Set();
  for (const [t, v] of Object.entries(targetEntry)) {
    if (v === 1)                 set.add(t);
    if (v === 3 && withTertiary) set.add(t);
  }
  return set;
}

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
  const set   = new Set();
  for (const [t, v] of Object.entries(entry)) {
    if (v === 1)             set.add(t);
    if (v === 3 && unlocked) set.add(t);
  }
  return set;
}

function getSelectableTypes(att) {
  if (att.name === "Whisper" && whisperCanEmulate(att) && att.emulationTarget) {
    return getWhisperEmulatedDisplayTypes(att);
  }
  const unlocked = isTopazOrHigher(att.maxMana);
  return getUnlockedTypes(att, unlocked);
}

function getSelectedTypesForChar(char) {
  const set = new Set();
  for (const att of Object.values(char.attunements)) {
    att.selectedTypes.forEach(t => set.add(t));
  }
  return set;
}

function getTypePresenceMapForChar(char) {
  const map = new Map();
  for (const att of Object.values(char.attunements)) {
    att.selectedTypes.forEach(t => map.set(t, (map.get(t) || 0) + 1));
  }
  return map;
}

function getAvailableTypesForChar(char) {
  const set = new Set();
  for (const att of Object.values(char.attunements)) {
    getSelectableTypes(att).forEach(t => set.add(t));
  }
  return set;
}

function createCharacter(name) {
  const id = "char_" + (_nextCharId++);
  characters[id] = {
    id,
    name:        name || "Character " + (_nextCharId - 1),
    attunements: {},
    typeQueue:   [],
    notes:       "",
  };
  return id;
}

function addCharacter() {
  const id = createCharacter();
  activeCharId = id;
  renderAll();
}

function removeCharacter(id) {
  delete characters[id];
  if (activeCharId === id) activeCharId = Object.keys(characters)[0] || null;
  renderAll();
}

function setActiveChar(id) {
  activeCharId = id;
  renderAll();
}

function renameCharacter(id, name) {
  if (characters[id]) characters[id].name = name;
  const tab = document.querySelector(`.charTab[data-id="${id}"] .tabName`);
  if (tab) tab.textContent = name;
}

function initAtt(name, startMana) {
  return {
    name,
    maxMana:         startMana,
    mana:            startMana,
    spent:           0,
    growth:          0,
    selectedTypes:   [],
    emulationTarget: null
  };
}

function addAttunement(charId) {
  const char = characters[charId];
  if (!char) return;
  const sel = document.getElementById("attSel_" + charId);
  const mIn = document.getElementById("attMana_" + charId);
  if (!sel || !mIn) return;
  const name = sel.value;
  if (!name || char.attunements[name]) return;
  const raw       = parseInt(mIn.value, 10);
  const startMana = Math.max(1, isNaN(raw) ? 20 : raw);
  char.attunements[name] = initAtt(name, startMana);
  renderCharPanel();
}

function deleteAttunement(charId, attName) {
  const char = characters[charId];
  if (!char) return;
  delete char.attunements[attName];
  char.typeQueue = char.typeQueue.filter(obj => obj.att !== attName);
  renderCharPanel();
}

function saveUndo() {
  undoStack.push(JSON.parse(JSON.stringify(characters)));
  if (undoStack.length > UNDO_LIMIT) undoStack.shift();
}

function undo() {
  if (undoStack.length === 0) { showToast("Nothing to undo."); return; }
  characters = undoStack.pop();
  renderAll();
  showToast(`Undone. (${undoStack.length} left)`);
}

function setWhisperEmulation(charId, target) {
  const char = characters[charId];
  if (!char || !char.attunements["Whisper"]) return;
  const whisper = char.attunements["Whisper"];

  if (!target) {
    saveUndo();
    whisper.selectedTypes   = [];
    char.typeQueue          = char.typeQueue.filter(obj => obj.att !== "Whisper");
    whisper.emulationTarget = null;
    renderAll();
    return;
  }

  const tier = getWhisperEmulateTier(whisper.maxMana);
  if (!tier) return;

  if (whisper.mana < tier.cost) {
    showToast(`Not enough mana! Emulation costs ${tier.cost}.`);
    renderAll();
    return;
  }

  saveUndo();
  whisper.mana  -= tier.cost;
  whisper.spent += tier.cost;

  const emulateGrowthPool = new Map([
    ["Fire",     tier.cost * 0.5],
    ["Perceive", tier.cost * 0.5],
  ]);

  for (const att of Object.values(char.attunements)) {
    const unlocked         = isTopazOrHigher(att.maxMana);
    const attUnlockedTypes = getUnlockedTypes(att, unlocked);
    let totalGrowth = 0;
    for (const [realType, amount] of emulateGrowthPool) {
      if (attUnlockedTypes.has(realType)) totalGrowth += amount;
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

  whisper.selectedTypes   = [];
  char.typeQueue          = char.typeQueue.filter(obj => obj.att !== "Whisper");
  whisper.emulationTarget = target;
  renderAll();
}

function refillFull(charId) {
  const char = characters[charId];
  if (!char) return;
  for (const att of Object.values(char.attunements)) {
    att.mana  = att.maxMana;
    att.spent = 0;
  }
  renderCharPanel();
}

function cast(charId, attName, level) {
  const char   = characters[charId];
  if (!char) return;
  const caster = char.attunements[attName];
  if (!caster) return;

  const cost       = SPELL_COSTS[level];
  const spellTypes = [...getSelectedTypesForChar(char)];
  if (spellTypes.length === 0) return;

  const contributors = new Set();
  {
    const casterSelectable = getSelectableTypes(caster);
    const casterCanCast    = spellTypes.length === 1
      ? casterSelectable.has(spellTypes[0])
      : caster.selectedTypes.some(t => spellTypes.includes(t));
    if (!casterCanCast) return;
    contributors.add(caster);
  }

  if (spellTypes.length > 1) {
    for (const att of Object.values(char.attunements)) {
      if (att === caster) continue;
      if (att.selectedTypes.some(t => spellTypes.includes(t))) contributors.add(att);
    }
  }

  const contributorList    = Array.from(contributors);
  const costPerContributor = cost / contributorList.length;

  for (const att of contributorList) {
    if (att.mana < Math.ceil(costPerContributor)) return;
  }

  saveUndo();

  const growthPool = new Map();
  for (const att of Object.values(char.attunements)) {
    const isEmulatingWhisper = att.name === "Whisper" && att.emulationTarget;
    for (const displayedType of att.selectedTypes) {
      if (!spellTypes.includes(displayedType)) continue;
      const share = cost / spellTypes.length;
      if (isEmulatingWhisper) {
        growthPool.set("Fire",     (growthPool.get("Fire")     || 0) + share * 0.5);
        growthPool.set("Perceive", (growthPool.get("Perceive") || 0) + share * 0.5);
      } else {
        growthPool.set(displayedType, (growthPool.get(displayedType) || 0) + share);
      }
    }
  }

  for (const att of contributorList) {
    const loss  = Math.ceil(costPerContributor);
    att.mana   -= loss;
    att.spent  += loss;
  }

  for (const att of Object.values(char.attunements)) {
    const unlocked         = isTopazOrHigher(att.maxMana);
    const attUnlockedTypes = getUnlockedTypes(att, unlocked);
    let totalGrowth = 0;
    for (const [realType, amount] of growthPool) {
      if (attUnlockedTypes.has(realType)) totalGrowth += amount;
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

  renderAll();
}

function toggleType(charId, att, type) {
  const char = characters[charId];
  if (!char) return;

  const alreadySelected = att.selectedTypes.includes(type);
  if (alreadySelected) {
    att.selectedTypes = att.selectedTypes.filter(t => t !== type);
    char.typeQueue    = char.typeQueue.filter(obj => !(obj.att === att.name && obj.type === type));
    renderCharPanel();
    return;
  }

  if (char.typeQueue.some(obj => obj.type === type && obj.att !== att.name)) return;

  const conflicts = getConflicts(type);
  for (const a of Object.values(char.attunements)) {
    a.selectedTypes = a.selectedTypes.filter(t => !conflicts.has(t));
  }
  char.typeQueue = char.typeQueue.filter(obj => !conflicts.has(obj.type));

  att.selectedTypes.push(type);
  char.typeQueue.push({ att: att.name, type });

  if (char.typeQueue.length > 2) {
    const removed    = char.typeQueue.shift();
    const removedAtt = char.attunements[removed.att];
    if (removedAtt) {
      removedAtt.selectedTypes = removedAtt.selectedTypes.filter(t => t !== removed.type);
    }
  }

  renderCharPanel();
}

function selectCompound(charId, att, typeA, typeB) {
  const char = characters[charId];
  if (!char) return;
  for (const a of Object.values(char.attunements)) { a.selectedTypes = []; }
  char.typeQueue    = [];
  att.selectedTypes = [typeA, typeB];
  char.typeQueue    = [{ att: att.name, type: typeA }, { att: att.name, type: typeB }];
  renderCharPanel();
}

function renderWhisperEmulateRow(charId, att) {
  const row     = document.createElement("div");
  row.className = "whisperEmulateRow";

  if (!whisperCanEmulate(att)) {
    const note       = document.createElement("span");
    note.className   = "emulateNote";
    note.textContent = "Emulation unlocks at Garnet rank.";
    row.appendChild(note);
    return row;
  }

  const tier = getWhisperEmulateTier(att.maxMana);

  const label       = document.createElement("label");
  label.textContent = "Emulating:";

  const costNote       = document.createElement("span");
  costNote.className   = "emulateNote";
  costNote.textContent = `Cost: ${tier.cost} mana`;

  const sel = document.createElement("select");
  const noneOpt       = document.createElement("option");
  noneOpt.value       = "";
  noneOpt.textContent = "— None (free) —";
  sel.appendChild(noneOpt);

  for (const name of Object.keys(ATTUNEMENTS)) {
    if (name === "Whisper") continue;
    const opt       = document.createElement("option");
    opt.value       = name;
    opt.textContent = name;
    if (att.emulationTarget === name) opt.selected = true;
    sel.appendChild(opt);
  }

  sel.onchange = () => setWhisperEmulation(charId, sel.value || null);

  row.appendChild(label);
  row.appendChild(sel);
  row.appendChild(costNote);
  return row;
}

function renderSpellGrid(charId, att, selectedGlobal) {
  const grid       = document.createElement("div");
  grid.className   = "spellGrid";
  const spellTypes = [...selectedGlobal];
  const selectable = getSelectableTypes(att);

  const isEmulatingWhisper = att.name === "Whisper" && att.emulationTarget && whisperCanEmulate(att);
  const tier     = isEmulatingWhisper ? getWhisperEmulateTier(att.maxMana) : null;
  const maxLevel = isEmulatingWhisper && tier ? tier.maxCastLevel : getMaxSpellLevel(att.maxMana);

  for (let l = 1; l <= 9; l++) {
    const btn = document.createElement("button");
    btn.innerHTML = `<div>${l}</div><div style="font-size:10px">(${SPELL_COSTS[l]})</div>`;

    const typeMatch = spellTypes.length === 1
      ? selectable.has(spellTypes[0])
      : spellTypes.length > 1
        ? att.selectedTypes.some(t => spellTypes.includes(t))
        : false;

    if (typeMatch && l <= maxLevel) {
      btn.onclick = () => cast(charId, att.name, l);
    } else {
      btn.disabled      = true;
      btn.style.opacity = "0.25";
      btn.style.cursor  = "not-allowed";
    }
    grid.appendChild(btn);
  }
  return grid;
}

function renderTypePanel(charId, att) {
  const selectable  = getSelectableTypes(att);
  const isEmulating = att.name === "Whisper" && att.emulationTarget && whisperCanEmulate(att);

  const activeConflicts = new Set();
  for (const sel of att.selectedTypes) getConflicts(sel).forEach(c => activeConflicts.add(c));

  const baseCol     = document.createElement("div");
  baseCol.className = "typeCol";
  const baseHdr     = document.createElement("div");
  baseHdr.className = "typeHeader";
  baseHdr.textContent = isEmulating ? "Emulated" : "Base";
  baseCol.appendChild(baseHdr);

  for (const t of selectable) {
    const div       = document.createElement("div");
    div.className   = "typeTag";
    div.textContent = t;
    if (att.selectedTypes.includes(t)) div.classList.add("active");
    if (activeConflicts.has(t))        div.classList.add("conflict");
    div.onclick = () => toggleType(charId, att, t);
    baseCol.appendChild(div);
  }

  if (isEmulating && selectable.size === 0) {
    const note           = document.createElement("div");
    note.style.fontSize  = "11px";
    note.style.color     = "#666";
    note.style.fontStyle = "italic";
    note.textContent     = "No types available.";
    baseCol.appendChild(note);
  }

  const compCol       = document.createElement("div");
  compCol.className   = "typeCol";
  const compHdr       = document.createElement("div");
  compHdr.className   = "typeHeader";
  compHdr.textContent = "Compound";
  compCol.appendChild(compHdr);

  for (const [name, a, b] of COMPOUNDS) {
    if (!selectable.has(a) || !selectable.has(b)) continue;
    const div      = document.createElement("div");
    div.className  = "compoundBtn";

    const nameLine       = document.createElement("div");
    nameLine.textContent = name;

    const subLine       = document.createElement("div");
    subLine.className   = "compoundSubTypes";
    subLine.textContent = `${a} + ${b}`;

    div.appendChild(nameLine);
    div.appendChild(subLine);

    if (att.selectedTypes.includes(a) && att.selectedTypes.includes(b)) div.classList.add("active");
    div.onclick = () => selectCompound(charId, att, a, b);
    compCol.appendChild(div);
  }

  const panel     = document.createElement("div");
  panel.className = "typePanel";
  panel.appendChild(baseCol);
  panel.appendChild(compCol);
  return panel;
}

function renderAttCard(charId, att, selectedGlobal) {
  const rank      = getRank(att.maxMana);
  const el        = document.createElement("div");
  el.className    = "card";

  const isWhisper = att.name === "Whisper";
  if (isWhisper && att.emulationTarget) el.classList.add("whisperCard", "emulating");

  const selectable = getSelectableTypes(att);
  if ([...selectable].some(t => selectedGlobal.has(t))) el.classList.add("matchingType");

  /* Header row 1: name — rank */
  const header     = document.createElement("div");
  header.className = "cardHeader";

  const row1     = document.createElement("div");
  row1.className = "cardHeaderRow1";

  const nameEl         = document.createElement("span");
  nameEl.className     = `cardAttName rank-${rank}`;
  nameEl.textContent   = att.name;

  const dashEl         = document.createElement("span");
  dashEl.className     = "cardAttDash";
  dashEl.textContent   = " – ";

  const rankEl         = document.createElement("span");
  rankEl.className     = `cardAttRank rank-${rank}`;
  rankEl.textContent   = rank;

  row1.appendChild(nameEl);
  row1.appendChild(dashEl);
  row1.appendChild(rankEl);

  const delBtn        = document.createElement("button");
  delBtn.textContent  = "Delete";
  delBtn.className    = "deleteBtn";
  delBtn.style.marginLeft = "auto";

  let pendingDel = false;
  delBtn.onclick = () => {
    if (pendingDel) {
      deleteAttunement(charId, att.name);
    } else {
      pendingDel = true;
      delBtn.textContent = "Confirm?";
      setTimeout(() => { if (pendingDel) { pendingDel = false; delBtn.textContent = "Delete"; } }, 4000);
    }
  };

  row1.appendChild(delBtn);

  /* Header row 2: capacity input | mana adjust input | delete */
  const row2     = document.createElement("div");
  row2.className = "cardHeaderRow2";

  function makeInputGroup(labelText, placeholder, onApply) {
    const group     = document.createElement("div");
    group.className = "cardCapacityGroup";

    const lbl       = document.createElement("div");
    lbl.className   = "cardCapacityLabel";
    lbl.textContent = labelText;

    const inputRow     = document.createElement("div");
    inputRow.className = "cardCapacityInputRow";

    const input         = document.createElement("input");
    input.type          = "text";
    input.placeholder   = placeholder;

    const btn           = document.createElement("button");
    btn.textContent     = "Apply";

    btn.onclick = () => onApply(input);
    input.addEventListener("keydown", e => { if (e.key === "Enter") onApply(input); });

    inputRow.appendChild(input);
    inputRow.appendChild(btn);
    group.appendChild(lbl);
    group.appendChild(inputRow);
    return group;
  }

  const capGroup = makeInputGroup("Capacity", "+/- cap", (input) => {
    let val = input.value.trim();
    if (!val) return;
    if (!val.startsWith("+") && !val.startsWith("-")) val = "+" + val;
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    const newMax = Math.max(1, Math.min(MAX_MANA_CAP, att.maxMana + num));
    const delta  = newMax - att.maxMana;
    att.maxMana  = newMax;
    att.mana     = delta > 0 ? Math.min(att.maxMana, att.mana + delta) : Math.min(att.mana, att.maxMana);
    input.value  = "";
    renderCharPanel();
  });

  const manaGroup = makeInputGroup("Mana", "+/- mana", (input) => {
    let val = input.value.trim();
    if (!val) return;
    if (!val.startsWith("+") && !val.startsWith("-")) val = "+" + val;
    const num = parseInt(val, 10);
    if (isNaN(num)) return;
    att.mana   = Math.max(0, Math.min(att.maxMana, att.mana + num));
    input.value = "";
    renderCharPanel();
  });

  row2.appendChild(capGroup);
  row2.appendChild(manaGroup);

  header.appendChild(row1);
  header.appendChild(row2);

  /* Mana bar */
  const pct     = att.mana / att.maxMana;
  const bar     = document.createElement("div");
  bar.className = "bar";
  const fill    = document.createElement("div");
  fill.className = "barFill" + (pct < 0.25 ? " low" : pct < 0.5 ? " mid" : "");
  fill.style.width = `${pct * 100}%`;
  bar.appendChild(fill);

  const manaRow       = document.createElement("div");
  manaRow.className   = "manaRow";
  manaRow.textContent = `${att.mana}/${att.maxMana} (+${Math.min(att.growth, 0.999).toFixed(2)})`;

  const body     = document.createElement("div");
  body.className = "cardBody";
  body.appendChild(renderSpellGrid(charId, att, selectedGlobal));
  body.appendChild(renderTypePanel(charId, att));

  el.appendChild(header);
  el.appendChild(bar);
  el.appendChild(manaRow);
  if (isWhisper) el.appendChild(renderWhisperEmulateRow(charId, att));
  el.appendChild(body);

  return el;
}

function renderCompoundGrid(char) {
  const grid = document.getElementById("compoundGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const available    = getAvailableTypesForChar(char);
  const typePresence = getTypePresenceMapForChar(char);

  for (const [name, a, b] of COMPOUNDS) {
    if (!available.has(a) || !available.has(b)) continue;

    const hasA = typePresence.get(a) || 0;
    const hasB = typePresence.get(b) || 0;

    const div      = document.createElement("div");
    div.className  = "compoundCard";

    const nameLine      = document.createElement("div");
    nameLine.textContent = name;

    const subLine       = document.createElement("div");
    subLine.className   = "compoundSubTypes";
    subLine.textContent = `${a} + ${b}`;

    div.appendChild(nameLine);
    div.appendChild(subLine);

    if (hasA > 0 && hasB > 0)      div.classList.add("active");
    else if (hasA > 0 || hasB > 0) div.classList.add("glow");

    grid.appendChild(div);
  }
}

function autoResizeTextarea(ta) {
  ta.style.height = "auto";
  ta.style.height = ta.scrollHeight + "px";
}

function renderCharPanel() {
  const panel = document.getElementById("charPanel");
  panel.innerHTML = "";

  if (!activeCharId || !characters[activeCharId]) {
    const msg           = document.createElement("div");
    msg.style.textAlign = "center";
    msg.style.padding   = "40px";
    msg.style.color     = "#666";
    msg.style.fontSize  = "15px";
    msg.innerHTML       = 'No characters yet. Click <strong>+ Add Character</strong> to get started.';
    panel.appendChild(msg);
    return;
  }

  const char = characters[activeCharId];

  const headerRow     = document.createElement("div");
  headerRow.className = "charPanelHeader";

  const nameInput       = document.createElement("input");
  nameInput.className   = "charNameInput";
  nameInput.value       = char.name;
  nameInput.placeholder = "Character name";
  nameInput.oninput     = () => renameCharacter(char.id, nameInput.value);

  const attAddRow     = document.createElement("div");
  attAddRow.className = "attAddRow";

  const attSel  = document.createElement("select");
  attSel.id     = "attSel_" + char.id;
  for (const name of Object.keys(ATTUNEMENTS)) {
    const opt       = document.createElement("option");
    opt.value       = name;
    opt.textContent = name;
    if (char.attunements[name]) opt.disabled = true;
    attSel.appendChild(opt);
  }

  const manaInput       = document.createElement("input");
  manaInput.type        = "number";
  manaInput.min         = "1";
  manaInput.value       = "20";
  manaInput.id          = "attMana_" + char.id;
  manaInput.style.width = "70px";
  manaInput.addEventListener("keydown", e => { if (e.key === "Enter") addAttunement(char.id); });

  const addBtn          = document.createElement("button");
  addBtn.textContent    = "Add";
  addBtn.onclick        = () => addAttunement(char.id);

  const fullBtn         = document.createElement("button");
  fullBtn.textContent   = "Full Refill";
  fullBtn.onclick       = () => refillFull(char.id);

  attAddRow.appendChild(attSel);
  attAddRow.appendChild(manaInput);
  attAddRow.appendChild(addBtn);
  attAddRow.appendChild(fullBtn);

  headerRow.appendChild(nameInput);
  headerRow.appendChild(attAddRow);
  panel.appendChild(headerRow);

  const cardsWrap      = document.createElement("div");
  cardsWrap.id         = "cards";
  const selectedGlobal = getSelectedTypesForChar(char);

  if (Object.keys(char.attunements).length === 0) {
    const empty         = document.createElement("div");
    empty.style.color   = "#666";
    empty.style.fontSize = "14px";
    empty.style.padding  = "20px 0";
    empty.textContent    = "No attunements added yet.";
    cardsWrap.appendChild(empty);
  } else {
    for (const att of Object.values(char.attunements)) {
      cardsWrap.appendChild(renderAttCard(char.id, att, selectedGlobal));
    }
  }

  panel.appendChild(cardsWrap);

  if (Object.keys(char.attunements).length > 0) {
    const compSection   = document.createElement("div");
    compSection.id      = "compoundSection";
    const compHdr       = document.createElement("div");
    compHdr.className   = "compoundHeader";
    compHdr.textContent = "Available Compound Magic";
    const compGrid      = document.createElement("div");
    compGrid.id         = "compoundGrid";
    compSection.appendChild(compHdr);
    compSection.appendChild(compGrid);
    panel.appendChild(compSection);
    renderCompoundGrid(char);
  }

  const notesSection     = document.createElement("div");
  notesSection.className = "notesSection";

  const notesHdr         = document.createElement("div");
  notesHdr.className     = "notesHeader";
  notesHdr.textContent   = "Notes";

  const notesArea         = document.createElement("textarea");
  notesArea.className     = "notesTextarea";
  notesArea.placeholder   = "Session notes, spell plans, reminders...";
  notesArea.value         = char.notes || "";
  notesArea.oninput       = () => {
    char.notes = notesArea.value;
    autoResizeTextarea(notesArea);
  };

  notesSection.appendChild(notesHdr);
  notesSection.appendChild(notesArea);
  panel.appendChild(notesSection);

  requestAnimationFrame(() => autoResizeTextarea(notesArea));
}

function renderTabs() {
  const bar     = document.getElementById("charTabBar");
  bar.innerHTML = "";

  for (const char of Object.values(characters)) {
    const tab      = document.createElement("div");
    tab.className  = "charTab" + (char.id === activeCharId ? " active" : "");
    tab.dataset.id = char.id;

    let holdTimer = null;
    let isEditing = false;
    tab.onclick = () => { if (!isEditing) setActiveChar(char.id); };

    const nameInput            = document.createElement("input");
    nameInput.className        = "tabName";
    nameInput.value            = char.name || "Character";
    nameInput.style.border     = "none";
    nameInput.style.background = "transparent";
    nameInput.style.fontWeight = "bold";
    nameInput.style.fontSize   = "13px";
    nameInput.style.width      = "120px";
    nameInput.style.outline    = "none";
    nameInput.style.color      = "inherit";
    nameInput.readOnly         = true;

    nameInput.addEventListener("mousedown", e => {
      e.stopPropagation();
      holdTimer = setTimeout(() => {
        isEditing = true;
        nameInput.readOnly = false;
        nameInput.focus();
        nameInput.select();
      }, 500);
    });
    nameInput.addEventListener("mouseup",    () => clearTimeout(holdTimer));
    nameInput.addEventListener("mouseleave", () => clearTimeout(holdTimer));
    nameInput.addEventListener("blur", () => {
      nameInput.readOnly = true;
      isEditing = false;
      renameCharacter(char.id, nameInput.value);
    });
    nameInput.addEventListener("keydown", e => { if (e.key === "Enter") nameInput.blur(); });

    const closeSpan       = document.createElement("span");
    closeSpan.className   = "tabClose";
    closeSpan.textContent = "✕";

    let pendingDelete = false;
    closeSpan.onclick = e => {
      e.stopPropagation();
      if (pendingDelete) {
        removeCharacter(char.id);
      } else {
        pendingDelete = true;
        closeSpan.textContent = "Confirm?";
        closeSpan.style.color = "#aaa";
        setTimeout(() => {
          if (pendingDelete) {
            pendingDelete = false;
            closeSpan.textContent = "✕";
            closeSpan.style.color = "";
          }
        }, 4000);
      }
    };

    tab.appendChild(nameInput);
    tab.appendChild(closeSpan);
    bar.appendChild(tab);
  }

  const addBtn       = document.createElement("button");
  addBtn.id          = "addCharBtn";
  addBtn.textContent = "+ Add Character";
  addBtn.onclick     = addCharacter;
  bar.appendChild(addBtn);
}

function renderAll() {
  renderTabs();
  renderCharPanel();
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) undoBtn.style.opacity = undoStack.length > 0 ? "1" : "0.4";
}

function exportSave() {
  const data = {
    version:     1,
    _nextCharId,
    activeCharId,
    characters:  JSON.parse(JSON.stringify(characters))
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "magic-tracker-save.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Saved!");
}

function importSave(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader  = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.characters || !data.version) throw new Error("Invalid save file.");
      characters   = data.characters;
      activeCharId = data.activeCharId;
      _nextCharId  = data._nextCharId || 1;
      if (!characters[activeCharId]) activeCharId = Object.keys(characters)[0] || null;
      for (const char of Object.values(characters)) {
        if (char.notes === undefined) char.notes = "";
      }
      renderAll();
      showToast("Loaded!");
    } catch (err) {
      showToast("Failed to load: " + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function showToast(msg) {
  const t       = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

renderAll();
