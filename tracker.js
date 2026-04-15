const SPELL_COSTS = {1:1,2:3,3:12,4:20,5:72,6:120,7:460,8:720,9:2600};

const BASE_TYPES = ["Air","Earth","Fire","Water","Light","Umbral","Death","Life","Motion","Enhance","Perceive","Mental"];

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
  Abjurer: { Light: 1, Death: 1, Motion: 3 },
  Acolyte: { Water: 1, Life: 1, Mental: 3 },
  Analyst: { Umbral: 1, Mental: 1, Motion: 3 },
  Arbiter: { Light: 3, Life: 1, Motion: 1 },
  Architect: { Umbral: 1, Perceive: 1, Enhance: 3 },
  Assassin: { Water: 1, Umbral: 1, Death: 3 },
  Biomancer: { Light: 3, Life: 1, Mental: 1 },
  Champion: { Water: 1, Mental: 3, Enhance: 1 },
  Chronomancer: { Death: 3, Perceive: 1, Motion: 1 },
  Cloudcaller: { Air: 1, Water: 1, Perceive: 3 },
  Commander: { Air: 3, Fire: 1, Umbral: 1 },
  Conjurer: { Umbral: 1, Life: 1, Mental: 3 },
  Controller: { Umbral: 3, Perceive: 1, Enhance: 1 },
  Dancer: { Air: 3, Water: 1, Mental: 1 },
  Diviner: { Water: 3, Mental: 1, Enhance: 1 },
  Elementalist: { Air: 1, Fire: 1, Water: 3 },
  Enchanter: { Light: 3, Mental: 1, Motion: 1 },
  Executioner: { Earth: 3, Death: 1, Enhance: 1 },
  Forgemaster: { Earth: 1, Fire: 1, Enhance: 3 },
  Guardian: { Earth: 3, Life: 1, Enhance: 1 },
  Heirophant: { Air: 1, Life: 1, Perceive: 3 },
  Illuminator: { Air: 3, Water: 1, Light: 1 },
  Illusionist: { Fire: 3, Light: 1, Perceive: 1 },
  Juggernaut: { Earth: 3, Fire: 1, Motion: 1 },
  Legionnaire: { Air: 1, Fire: 3, Light: 1 },
  Mender: { Earth: 1, Water: 3, Life: 1 },
  Mesmer: { Umbral: 3, Death: 1, Perceive: 1 },
  Necromancer: { Earth: 1, Death: 1, Life: 1 },
  Paladin: { Light: 1, Life: 3, Motion: 1 },
  Purifier: { Fire: 1, Light: 1, Mental: 3 },
  Pyromancer: { Fire: 1, Umbral: 3, Death: 1 },
  Saboteur: { Earth: 1, Fire: 3, Umbral: 1 },
  Scourge: { Air: 1, Water: 3, Death: 1 },
  Seer: { Light: 1, Death: 3, Mental: 1 },
  Sentinel: { Earth: 1, Mental: 1, Enhance: 3 },
  Shadow: { Umbral: 1, Death: 3, Enhance: 1 },
  Shaper: { Earth: 1, Perceive: 3, Enhance: 1 },
  Shapeshifter: { Earth: 1, Life: 3, Perceive: 1 },
  Shieldbreaker: { Fire: 3, Death: 1, Motion: 1 },
  Soulblade: { Light: 1, Life: 1, Motion: 3 },
  Sovereign: { Umbral: 1, Death: 1, Enhance: 3 },
  Spellsinger: { Air: 1, Light: 3, Perceive: 1 },
  Summoner: { Air: 1, Life: 3, Motion: 1 },
  Swordmaster: { Earth: 3, Fire: 1, Enhance: 1 },
  Transmuter: { Air: 3, Earth: 1, Water: 1 },
  Wavewalker: { Water: 1, Perceive: 3, Motion: 1 },
  Wayfarer: { Air: 1, Mental: 1, Motion: 1 },
  Whisper: { Fire: 1, Umbral: 3, Perceive: 1 }
};

let attunements = {};

function initAtt(name){
  return {
    name,
    maxMana: 100,
    mana: 100,
    spent: 0,
    growth: 0,
    types: BASE_TYPES,
    selectedTypes: []
  };
}
  
let globalTypeQueue = [];

/* ---------------- RANK SYSTEM ---------------- */

function getRank(maxMana){
  if(maxMana < 60) return "Pearl";
  if(maxMana < 360) return "Garnet";
  if(maxMana < 2160) return "Amber";
  if(maxMana < 12960) return "Topaz";
  if(maxMana < 77760) return "Emerald";
  if(maxMana < 466560) return "Sapphire";
  return "Amethyst";
}

function isTopazOrHigher(maxMana){
  return maxMana >= 2160;
}

/* ---------------- GROWTH ---------------- */

function getGrowthRate(maxMana){
  if(maxMana < 60) return 100;
  if(maxMana < 360) return 200;
  if(maxMana < 2160) return 400;
  if(maxMana < 12960) return 800;
  if(maxMana < 77760) return 1600;
  if(maxMana < 466560) return 3200;
  return 3200
}
  
const MAX_MANA_CAP = 500000;

/* ---------------- UNLOCK LOGIC ---------------- */
  
function getMaxSpellLevel(maxMana){
  if(maxMana < 60) return 2;      // Pearl
  if(maxMana < 360) return 4;     // Garnet
  if(maxMana < 2160) return 6;    // Amber
  if(maxMana < 77760) return 8;   // Topaz
  return 9;                       // Emerald+
}

function getUnlockedTypes(att, unlocked){
  const set = new Set();

  att.types.forEach(t => {
    const value = ATTUNEMENTS[att.name][t];

    if(value === 1){
  set.add(t);
}
if(unlocked && value === 3){
  set.add(t);
}
  });

  return set;
}
  
function getTypePresenceMap(){
  const map = new Map();

  Object.values(attunements).forEach(att => {
    att.selectedTypes.forEach(t => {
      map.set(t, (map.get(t) || 0) + 1);
    });
  });

  return map;
}

/* ---------------- CORE ---------------- */

function populateDropdown(){
  const sel = document.getElementById("attunementSelect");
  sel.innerHTML = "";
  Object.keys(ATTUNEMENTS).forEach(n=>{
    const o = document.createElement("option");
    o.value = n;
    o.textContent = n;
    sel.appendChild(o);
  });
}

function addAttunement(){
  const name = document.getElementById("attunementSelect").value;
  if(!name || attunements[name]) return;

  const startMana = parseInt(document.getElementById("startManaInput").value) || 100;

  attunements[name] = {
    ...initAtt(name),
    maxMana: startMana,
    mana: startMana
  };

  render();
}
  
  function getConflicts(selectedType) {
  const conflicts = new Set();

  for (const pair of TYPE_OPPOSITES) {
    if (pair.groupA.includes(selectedType)) {
      pair.groupB.forEach(t => conflicts.add(t));
    }
    if (pair.groupB.includes(selectedType)) {
      pair.groupA.forEach(t => conflicts.add(t));
    }
  }

  return conflicts;
}
  
  const TYPE_OPPOSITES = [
  {
    groupA: ["Air", "Light", "Motion"],
    groupB: ["Earth", "Umbral", "Enhance"]
  },
  {
    groupA: ["Fire", "Death", "Perceive"],
    groupB: ["Water", "Life", "Mental"]
  }
];

/* ATTUNEMENT GROWTH */
function cast(attName, level){

  const caster = attunements[attName];
  if (!caster) return;

  const cost = SPELL_COSTS[level];

  const selectedGlobal = getSelectedTypesGlobal();
  const spellTypes = [...selectedGlobal];

  if (spellTypes.length === 0) return;
  
  const isCompound = spellTypes.length > 1;

// ------------------------------------
// STEP 1 — find contributors
// ------------------------------------

const contributors = new Set();

// caster must ALWAYS be included if valid
{
  const unlocked =
    isTopazOrHigher(caster.maxMana);

  const casterTypes =
    getUnlockedTypes(caster, unlocked);

  const casterCanCast =
    [...casterTypes].some(t =>
      spellTypes.includes(t)
    );

  if (!casterCanCast) return;

  contributors.add(caster);
}

// ONLY share contributors in compound mode
if (spellTypes.length > 1) {

  Object.values(attunements).forEach(att => {

    if (att === caster) return;

    const sharesSelected =
      att.selectedTypes.some(t =>
        spellTypes.includes(t)
      );

    if (sharesSelected){
      contributors.add(att);
    }

  });
}

const contributorList =
  Array.from(contributors);

const costPerContributor =
  cost / contributorList.length;
  
  // prevent negative mana BEFORE anything happens
for (const att of contributors) {
  if (att.mana < Math.ceil(costPerContributor)) {
    return; // abort cast entirely
  }
}

  // ------------------------------------
  // STEP 2 — build type pools
  // ------------------------------------

  const typePool = new Map();

for (const att of contributors){

  const unlocked =
    isTopazOrHigher(att.maxMana);

  const unlockedTypes =
    getUnlockedTypes(att, unlocked);

  const sharedTypes =
    spellTypes.filter(t =>
      unlockedTypes.has(t)
    );

  if (sharedTypes.length === 0) continue;

  const perType =
    costPerContributor /
    sharedTypes.length;

  for (const t of sharedTypes){

    typePool.set(
      t,
      (typePool.get(t) || 0) + perType
    );

  }

}

  // ------------------------------------
  // STEP 3 — apply mana cost
  // ------------------------------------

  for (const att of contributors){

    const loss =
      Math.ceil(costPerContributor);

    att.mana -= loss;
    att.spent += loss;

  }

// ------------------------------------
// STEP 4 — apply growth to unlocked types
// ------------------------------------

for (const att of Object.values(attunements)){

  let totalGrowth = 0;

  const unlocked =
    isTopazOrHigher(att.maxMana);

  const unlockedTypes =
    getUnlockedTypes(att, unlocked);

  // Check spell types directly
  for (const t of spellTypes){

    if (!unlockedTypes.has(t)) continue;

    const pool = typePool.get(t);

    if (pool){
      totalGrowth += pool;
    }

  }

  if (totalGrowth === 0) continue;

  const gain =
    totalGrowth /
    getGrowthRate(att.maxMana);

  att.growth += gain;

  while (att.growth >= 1){

    att.growth -= 1;

    att.maxMana += 1;
    att.mana += 1;

    if (att.maxMana >= MAX_MANA_CAP){

      att.maxMana = MAX_MANA_CAP;

      att.mana =
        Math.min(att.mana, MAX_MANA_CAP);

      att.growth = 0;
      break;

    }

  }

}

  render();

}

/* ---------------- UI ---------------- */

function toggleType(att, type){
  
  // if a compound is active, clear it first
if(att.selectedTypes.length === 2){
  att.selectedTypes = [];
  globalTypeQueue =
    globalTypeQueue.filter(obj => obj.att !== att.name);
}

  const alreadySelected =
    att.selectedTypes.includes(type);

  if(alreadySelected){

    // remove locally
    att.selectedTypes =
      att.selectedTypes.filter(t => t !== type);

    // remove from global queue
    globalTypeQueue =
      globalTypeQueue.filter(obj =>
        !(obj.att === att.name && obj.type === type)
      );

  }
  else{

// prevent duplicate type selection anywhere globally
const alreadyUsed = globalTypeQueue.some(obj => obj.type === type);

if (alreadyUsed) return; // block duplicate selection entirely

// add new selection
// get conflicting types
const conflicts = getConflicts(type);

// remove conflicting types from ALL attunements
Object.values(attunements).forEach(a => {
  a.selectedTypes = a.selectedTypes.filter(t => !conflicts.has(t));
});

// clean global queue of conflicts
globalTypeQueue = globalTypeQueue.filter(obj => !conflicts.has(obj.type));

// add new selection
att.selectedTypes.push(type);

globalTypeQueue.push({
  att: att.name,
  type: type
});

    // enforce max 2 globally
    if(globalTypeQueue.length > 2){

      const removed = globalTypeQueue.shift();

      const removedAtt =
        attunements[removed.att];

      if(removedAtt){
        removedAtt.selectedTypes =
          removedAtt.selectedTypes
            .filter(t => t !== removed.type);
      }

    }

  }

  render();
}

/* COMPOUND SELECTION */
function selectCompound(att, a, b){

  // clear everything for this attunement
  att.selectedTypes = [];

  // remove from global queue all entries belonging to this att
  globalTypeQueue =
    globalTypeQueue.filter(obj => obj.att !== att.name);

  // add new selection
  att.selectedTypes.push(a, b);

  globalTypeQueue.push(
    { att: att.name, type: a },
    { att: att.name, type: b }
  );

  // enforce max 2 global selections
  while(globalTypeQueue.length > 2){

    const removed = globalTypeQueue.shift();

    const removedAtt = attunements[removed.att];
    if(removedAtt){
      removedAtt.selectedTypes =
        removedAtt.selectedTypes.filter(t => t !== removed.type);
    }
  }

  render();
}
  
/* REST FUNCTIONS */
function refillFull(){
  Object.values(attunements).forEach(a=>{
    a.mana = a.maxMana;
    a.spent = 0;
  });
  render();
}

function refillHalf(){
  Object.values(attunements).forEach(a=>{
    const restore = Math.min(a.spent, a.maxMana * 0.5);
    a.mana = Math.min(a.maxMana, a.mana + restore);
    a.spent -= restore;
  });
  render();
}

/* TERTIARY MAGIC */
function getTertiaryType(attName){
  const entry = ATTUNEMENTS[attName];
  if(!entry) return null;

  return Object.keys(entry).find(t => entry[t] === 3) || null;
}

/* ADDITIONAL COMPOUND MAGIC */
function getAvailableTypesGlobal(){

  const set = new Set();

  Object.values(attunements).forEach(att=>{

    const entry = ATTUNEMENTS[att.name];

    const unlocked =
      isTopazOrHigher(att.maxMana);

    Object.keys(entry).forEach(t=>{

      const value = entry[t];

      // primary always counts
      if(value === 1){
        set.add(t);
      }

      // tertiary only counts if unlocked
      if(value === 3 && unlocked){
        set.add(t);
      }

    });

  });

  return set;
}
  
function renderCompoundGrid(){

  const grid = document.getElementById("compoundGrid");
  if(!grid) return;

  grid.innerHTML = "";

  const available = getAvailableTypesGlobal();
  const selectedGlobal = getSelectedTypesGlobal();

  COMPOUNDS.forEach(([name,a,b]) => {

    // only show if both types exist globally
    if(!available.has(a) || !available.has(b)) return;

    const div = document.createElement("div");
    div.className = "compoundBtn";
    div.textContent = name;
    
    const typeMap = getTypePresenceMap();

const hasA = typeMap.get(a) || 0;
const hasB = typeMap.get(b) || 0;

const isFull = hasA > 0 && hasB > 0;
const isPartial = hasA > 0 || hasB > 0;

    const isSelected =
  Object.values(attunements).some(att =>
    att.selectedTypes.includes(a) &&
    att.selectedTypes.includes(b)
  );

if (isFull) {
  div.classList.add("active");
} 
else if (isPartial) {
  div.classList.add("glow");
}

    // optional: select first attunement that can use it
    div.onclick = () => {

      const target = Object.values(attunements)[0];
      if(!target) return;

      selectCompound(target, a, b);
    };

    grid.appendChild(div);
  });

}

/* MAGIC SELECTED */
  function getSelectedTypesGlobal(){
  const set = new Set();

  Object.values(attunements).forEach(att=>{
    att.selectedTypes.forEach(t=>{
      set.add(t);
    });
  });

  return set;
}

/* ---------------- RENDER ---------------- */

function render(){
  const wrap = document.getElementById("cards");
  wrap.innerHTML = "";

  const selectedGlobal = getSelectedTypesGlobal();

  Object.values(attunements).forEach(att => {

    const el = document.createElement("div");
    el.className = "card";

    const entry = ATTUNEMENTS[att.name];

    // highlight if matching selected types
    const sharesType =
      Object.keys(entry).some(t =>
        selectedGlobal.has(t)
      );

    if(sharesType){
      el.classList.add("matchingType");
    }

    const rank = getRank(att.maxMana);
    const unlocked = isTopazOrHigher(att.maxMana);

    /* ---------------- HEADER ---------------- */

    const header = document.createElement("div");
    header.className = "cardHeader";

    const left = document.createElement("div");
    left.textContent = att.name;

    const right = document.createElement("div");
    right.className = "capacityControls";

    const rankLabel = document.createElement("span");
    rankLabel.textContent = rank;

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "+/- amount";
    input.style.width = "90px";
    input.style.fontSize = "11px";

    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply";

    function applyChange(){
      let val = input.value.trim();
      if(!val) return;

      if(!val.startsWith("+") && !val.startsWith("-")){
        val = "+" + val;
      }

      const num = parseInt(val, 10);
      if(isNaN(num)) return;

      att.maxMana = Math.max(1, Math.min(MAX_MANA_CAP, att.maxMana + num));
      att.mana = Math.min(att.mana, att.maxMana);

      input.value = "";
      render();
    }

    applyBtn.onclick = applyChange;

    input.addEventListener("keydown", (e) => {
      if(e.key === "Enter") applyChange();
    });

    right.appendChild(rankLabel);
    right.appendChild(input);
    right.appendChild(applyBtn);

    header.appendChild(left);
    header.appendChild(right);

    /* ---------------- MANA BAR ---------------- */

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.innerHTML = `
      <div class="barFill"
        style="width:${(att.mana/att.maxMana)*100}%">
      </div>
    `;

const manaRow = document.createElement("div");
manaRow.className = "manaRow";

manaRow.textContent =
  `${att.mana}/${att.maxMana} (+${Math.min(att.growth, 0.999).toFixed(2)})`;

const primaries = Object.keys(entry).filter(t => entry[t] === 1);

    /* ---------------- BODY ---------------- */

    const body = document.createElement("div");
    body.className = "cardBody";

    /* ---------------- SPELL GRID ---------------- */

    const spellGrid = document.createElement("div");
    spellGrid.className = "spellGrid";

const castingEnabled =
  Object.keys(entry).some(t =>
    selectedGlobal.has(t)
  );

    const maxLevel = getMaxSpellLevel(att.maxMana);

for(let l=1;l<=9;l++){
  const btn = document.createElement("button");

  btn.innerHTML =
    `<div>${l}</div><div style="font-size:10px">(${SPELL_COSTS[l]})</div>`;

const unlockedTypes =
  getUnlockedTypes(att, unlocked);

const typeMatch =
  [...unlockedTypes].some(t =>
    selectedGlobal.has(t)
  );

  const levelAllowed = l <= maxLevel;

  if(typeMatch && levelAllowed){
    btn.onclick = () => cast(att.name, l);
  } else {
    btn.disabled = true;
    btn.style.opacity = 0.3;
    btn.style.cursor = "not-allowed";
  }

  spellGrid.appendChild(btn);
}

    /* ---------------- TYPE PANEL ---------------- */

    const baseCol = document.createElement("div");
    baseCol.className = "typeCol";

    const baseHeader = document.createElement("div");
    baseHeader.className = "typeHeader";
    baseHeader.textContent = "Base";
    baseCol.appendChild(baseHeader);

    Object.keys(entry).forEach(t => {
      const value = entry[t];

      if(!unlocked && value !== 1) return;
      if(unlocked && value !== 1 && value !== 3) return;

const div = document.createElement("div");
div.className = "typeTag";

const isSelected = att.selectedTypes.includes(t);
      
const conflicts = new Set();

att.selectedTypes.forEach(t => {
  getConflicts(t).forEach(c => conflicts.add(c));
});

if (conflicts.has(t)) {
  div.classList.add("conflict");
}

if (isSelected) {
  div.classList.add("active");
}

div.textContent = t;
div.onclick = () => toggleType(att, t);

      baseCol.appendChild(div);
    });

    const compCol = document.createElement("div");
    compCol.className = "typeCol";

    const compHeader = document.createElement("div");
    compHeader.className = "typeHeader";
    compHeader.textContent = "Compound";
    compCol.appendChild(compHeader);

    const unlockedTypes = getUnlockedTypes(att, unlocked);

    COMPOUNDS.forEach(([name,a,b]) => {
  if(!unlockedTypes.has(a) || !unlockedTypes.has(b)) return;

  const div = document.createElement("div");
  div.className = "compoundBtn";
  div.textContent = name;

  const isSelected =
    att.selectedTypes.includes(a) &&
    att.selectedTypes.includes(b);

  if(isSelected){
    div.classList.add("active");
  }

  div.onclick = () => selectCompound(att, a, b);

  compCol.appendChild(div);
});

    const typePanel = document.createElement("div");
    typePanel.className = "typePanel";
    typePanel.appendChild(baseCol);
    typePanel.appendChild(compCol);

    /* ---------------- ASSEMBLE CARD ---------------- */

    body.appendChild(spellGrid);
    body.appendChild(typePanel);

    el.appendChild(header);
    el.appendChild(bar);
    el.appendChild(manaRow);
    el.appendChild(body);

    wrap.appendChild(el);
  });

  /* ---------------- GLOBAL COMPOUND GRID ---------------- */
  renderCompoundGrid();
}

/* ---------------- START ---------------- */

populateDropdown();
render();
