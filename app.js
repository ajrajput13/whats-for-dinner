// ===================================================
//  WHAT'S FOR DINNER? — app.js  (v6.0 — Firebase sync)
//  NEW IN V6:
//  - Cloud-synced via Firebase Firestore
//  - Ratings save automatically and sync across devices in real time
//  - No more manual CSV download/upload
// ===================================================

// ===================================================
//  ★ PASTE YOUR FIREBASE CONFIG HERE ★
//  Get this from: Firebase Console → Project Settings → Your apps
// ===================================================
const firebaseConfig = {
  apiKey: "AIzaSyDR06GGoVyzGI1CdZkBih24uAmCdRmuaAQ",
  authDomain: "whats-for-dinner-10722.firebaseapp.com",
  projectId: "whats-for-dinner-10722",
  storageBucket: "whats-for-dinner-10722.firebasestorage.app",
  messagingSenderId: "294545992845",
  appId: "1:294545992845:web:17e882ff348b7878b906c4"
};

const CUISINE_EMOJI = {
  "american":"🍔","mexican":"🌮","italian":"🍝","indian":"🍛",
  "asian":"🥢","mediterranean":"🫒","pizza":"🍕","japanese":"🍱",
  "chinese":"🥡","thai":"🍜","bakery":"🥐","cafe":"☕",
  "brunch":"🥞","american/brunch":"🥞","default":"🍽️"
};

// ===================================================
//  SEED DATA — used to bootstrap Firestore on first run
//  (after that, all reads/writes go to the cloud)
// ===================================================

const SEED_ITEMS = [
  {category:"familiar_restaurant", name:"Parlor", cuisine:"American/Mexican", meal_type:"dinner", protein:"any", carbs:"any", distance_miles:"22", notes:"Multiple restaurants & bar", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Chick-fil-A", cuisine:"American/Fast Food", meal_type:"lunch-dinner", protein:"chicken", carbs:"bread/bun", distance_miles:"5", notes:"Classic fave", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Taco Bell", cuisine:"Mexican/Fast Food", meal_type:"dinner", protein:"any", carbs:"tortilla", distance_miles:"6", notes:"Late night go-to", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Cava", cuisine:"Mediterranean", meal_type:"lunch-dinner", protein:"vegetarian", carbs:"pita/rice", distance_miles:"7", notes:"Build your own bowl", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Domino's", cuisine:"Pizza", meal_type:"dinner", protein:"any", carbs:"pizza dough", distance_miles:"4", notes:"Delivery friendly", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"North Italia", cuisine:"Italian", meal_type:"dinner", protein:"any", carbs:"pasta", distance_miles:"10", notes:"Nicer sit-down Italian", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Korma Sutra", cuisine:"Indian", meal_type:"lunch-dinner", protein:"any", carbs:"rice/naan", distance_miles:"12", notes:"Great Indian food", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Panda Express", cuisine:"Chinese/Fast Food", meal_type:"lunch-dinner", protein:"any", carbs:"rice", distance_miles:"5", notes:"Quick Chinese", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Chipotle", cuisine:"Mexican", meal_type:"lunch-dinner", protein:"any", carbs:"tortilla/rice", distance_miles:"6", notes:"Build your own", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Wise Guy", cuisine:"Pizza/Italian", meal_type:"dinner", protein:"any", carbs:"pizza dough/pasta", distance_miles:"9", notes:"Local pizza", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Extra Virgin", cuisine:"American/International", meal_type:"dinner", protein:"any", carbs:"any", distance_miles:"11", notes:"Upscale date night", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Chili's", cuisine:"American", meal_type:"lunch-dinner", protein:"any", carbs:"any", distance_miles:"7", notes:"Casual American", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"KC Craft Ramen", cuisine:"Asian", meal_type:"dinner", protein:"any", carbs:"any", distance_miles:"14", notes:"Local Ramen spot", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Cactus Grill", cuisine:"Mexican", meal_type:"dinner", protein:"any", carbs:"tortilla/rice", distance_miles:"8", notes:"Local Mexican", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Jose Peppers", cuisine:"Mexican", meal_type:"dinner", protein:"any", carbs:"tortilla/rice", distance_miles:"9", notes:"Tex-Mex vibes", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"30 Hop", cuisine:"American/Bar", meal_type:"dinner", protein:"beef/vegeterian", carbs:"bread/bun", distance_miles:"10", notes:"50% off Mondays", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Panera Bread", cuisine:"American/Cafe", meal_type:"breakfast-lunch", protein:"any", carbs:"bread/bagel", distance_miles:"6", notes:"Soup and sandwiches", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"McAlister's Deli", cuisine:"American/Deli", meal_type:"lunch-dinner", protein:"any", carbs:"bread", distance_miles:"21", notes:"Deli classics", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Texas Roadhouse", cuisine:"American/Steakhouse", meal_type:"dinner", protein:"beef", carbs:"bread/bun", distance_miles:"8", notes:"Steak night", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Unforked", cuisine:"American", meal_type:"lunch-dinner", protein:"beef/vegeterian", carbs:"bread/bun", distance_miles:"9", notes:"Fresh and local", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"MOD Pizza", cuisine:"Pizza", meal_type:"lunch-dinner", protein:"any", carbs:"pizza dough", distance_miles:"6", notes:"Build your own pizza", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Cheddar's", cuisine:"American", meal_type:"lunch-dinner", protein:"any", carbs:"any", distance_miles:"8", notes:"Comfort food", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Cheesecake Factory", cuisine:"American", meal_type:"lunch-dinner", protein:"any", carbs:"any", distance_miles:"12", notes:"Massive menu", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Olive Garden", cuisine:"Italian", meal_type:"dinner", protein:"any", carbs:"pasta", distance_miles:"8", notes:"Family Italian", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Peanut", cuisine:"American/Bar", meal_type:"dinner", protein:"any", carbs:"any", distance_miles:"13", notes:"Fun bar atmosphere", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Burrito King", cuisine:"Mexican", meal_type:"lunch-dinner", protein:"any", carbs:"tortilla", distance_miles:"46", notes:"Lawrence burrito spot", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"AMC Prairiefire Dine-In", cuisine:"American/Theater", meal_type:"lunch-dinner", protein:"any", carbs:"any", distance_miles:"10", notes:"Movies + food", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"FirstWatch", cuisine:"American/Brunch", meal_type:"breakfast-lunch", protein:"any", carbs:"any", distance_miles:"8", notes:"Best breakfast spot", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Homegrown", cuisine:"American/Brunch", meal_type:"breakfast-lunch", protein:"any", carbs:"any", distance_miles:"9", notes:"Local brunch gem", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Snooze", cuisine:"American/Brunch", meal_type:"breakfast-lunch", protein:"any", carbs:"any", distance_miles:"11", notes:"Fun brunch vibes", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Another Broken Egg", cuisine:"American/Brunch", meal_type:"breakfast-lunch", protein:"any", carbs:"any", distance_miles:"10", notes:"Southern brunch", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"The Rooster", cuisine:"American/Brunch", meal_type:"breakfast-lunch", protein:"any", carbs:"any", distance_miles:"8", notes:"Cozy breakfast", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_restaurant", name:"Taylor's Donuts", cuisine:"Bakery/Cafe", meal_type:"breakfast", protein:"any", carbs:"pastry", distance_miles:"46", notes:"Best donuts in Lawrence", tried:"yes", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Motti Mehal", cuisine:"Indian", meal_type:"dinner", protein:"any", carbs:"rice/naan", distance_miles:"15", notes:"On the list!", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Burger Stand", cuisine:"American/Burgers", meal_type:"lunch-dinner", protein:"beef/vegeterian", carbs:"bread/bun", distance_miles:"45", notes:"Best burgers in Lawrence", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Papa Kenos Pizzeria", cuisine:"Pizza/Italian", meal_type:"lunch-dinner", protein:"any", carbs:"pizza dough", distance_miles:"45", notes:"Lawrence pizza spot", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Limestone Pizza", cuisine:"American/Pizza", meal_type:"dinner", protein:"any", carbs:"pasta/pizza dough", distance_miles:"45", notes:"Lawrence \u2014 date night", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Chai Cafe", cuisine:"Indian/Cafe", meal_type:"breakfast-lunch-dinner", protein:"any", carbs:"any", distance_miles:"12", notes:"Chai and bites", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Raj Express", cuisine:"Indian", meal_type:"lunch-dinner", protein:"any", carbs:"rice/naan", distance_miles:"11", notes:"Quick Indian", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Artego Pizza", cuisine:"Pizza", meal_type:"lunch-dinner", protein:"any", carbs:"pizza dough", distance_miles:"8", notes:"Local pizza", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Zero Zero", cuisine:"Italian/Pasta", meal_type:"dinner", protein:"any", carbs:"pasta", distance_miles:"10", notes:"Homemade Pasta", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Bravo!", cuisine:"Italian", meal_type:"dinner", protein:"any", carbs:"pasta", distance_miles:"9", notes:"Italian sit-down", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Swagat", cuisine:"Indian", meal_type:"dinner", protein:"any", carbs:"rice/naan", distance_miles:"13", notes:"Authentic Indian", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Blue Sushi", cuisine:"Japanese/Sushi", meal_type:"dinner", protein:"fish", carbs:"rice", distance_miles:"10", notes:"Sushi night", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"YaYas Euro Bistro", cuisine:"Mediterranean/Greek", meal_type:"dinner", protein:"any", carbs:"any", distance_miles:"11", notes:"Mediterranean flavors", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Mi Ranchitos", cuisine:"Mexican", meal_type:"lunch-dinner", protein:"any", carbs:"tortilla/rice", distance_miles:"7", notes:"Local Mexican", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Culver's", cuisine:"American/Fast Food", meal_type:"lunch-dinner", protein:"beef/vegeterian", carbs:"bread/bun", distance_miles:"6", notes:"Butter burgers!", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Coach's Bar & Grill", cuisine:"American/Bar", meal_type:"dinner", protein:"any", carbs:"any", distance_miles:"9", notes:"Sports bar vibes", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Sickies Garage", cuisine:"American/Burgers", meal_type:"lunch-dinner", protein:"any", carbs:"any", distance_miles:"8", notes:"Crazy burger menu", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Torchy's Tacos", cuisine:"Mexican/Tacos", meal_type:"lunch-dinner", protein:"any", carbs:"tortilla", distance_miles:"8", notes:"Fancy tacos", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Chicken & Pickle", cuisine:"American", meal_type:"lunch-dinner", protein:"chicken", carbs:"any", distance_miles:"10", notes:"Pickleball + food!", tried:"no", rating:"", rating_note:""},
  {category:"new_restaurant", name:"Vottero", cuisine:"Itailan/French", meal_type:"breakfast-lunch", protein:"any", carbs:"any", distance_miles:"0", notes:"Ooh La La", tried:"no", rating:"", rating_note:""},
  {category:"familiar_home", name:"Spaghetti Bolognese", cuisine:"Italian", meal_type:"dinner", protein:"beef", carbs:"pasta", distance_miles:"0", notes:"Classic weeknight pasta", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_home", name:"Chicken Tacos", cuisine:"Mexican", meal_type:"dinner", protein:"chicken", carbs:"tortilla", distance_miles:"0", notes:"Easy taco night", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_home", name:"Grilled Salmon", cuisine:"American", meal_type:"dinner", protein:"fish", carbs:"any", distance_miles:"0", notes:"Healthy option", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_home", name:"Homemade Pizza", cuisine:"Italian", meal_type:"dinner", protein:"any", carbs:"pizza dough", distance_miles:"0", notes:"DIY pizza night", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_home", name:"Stir Fry", cuisine:"Asian", meal_type:"dinner", protein:"any", carbs:"rice", distance_miles:"0", notes:"Quick and easy", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_home", name:"Burgers on the Grill", cuisine:"American", meal_type:"dinner", protein:"beef", carbs:"bread/bun", distance_miles:"0", notes:"Backyard classic", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_home", name:"Pancakes & Bacon", cuisine:"American", meal_type:"breakfast", protein:"pork", carbs:"any", distance_miles:"0", notes:"Weekend breakfast", tried:"yes", rating:"", rating_note:""},
  {category:"familiar_home", name:"Scrambled Eggs & Toast", cuisine:"American", meal_type:"breakfast", protein:"egg", carbs:"bread", distance_miles:"0", notes:"Simple morning", tried:"yes", rating:"", rating_note:""},
  {category:"new_home", name:"Butter Chicken", cuisine:"Indian", meal_type:"dinner", protein:"chicken", carbs:"rice/naan", distance_miles:"0", notes:"Want to try making this!", tried:"no", rating:"", rating_note:""},
  {category:"new_home", name:"Homemade Ramen", cuisine:"Japanese", meal_type:"dinner", protein:"any", carbs:"noodles", distance_miles:"0", notes:"Weekend project", tried:"no", rating:"", rating_note:""},
  {category:"new_home", name:"Sheet Pan Fajitas", cuisine:"Mexican", meal_type:"dinner", protein:"chicken", carbs:"tortilla", distance_miles:"0", notes:"Easy and colorful", tried:"no", rating:"", rating_note:""},
  {category:"new_home", name:"Shakshuka", cuisine:"Mediterranean", meal_type:"breakfast-dinner", protein:"egg", carbs:"bread", distance_miles:"0", notes:"Eggs in tomato sauce", tried:"no", rating:"", rating_note:""},
  {category:"new_home", name:"Beef Birria Tacos", cuisine:"Mexican", meal_type:"dinner", protein:"beef", carbs:"tortilla", distance_miles:"0", notes:"Dipping tacos!", tried:"no", rating:"", rating_note:""},
  {category:"new_home", name:"Thai Green Curry", cuisine:"Thai", meal_type:"dinner", protein:"any", carbs:"rice", distance_miles:"0", notes:"Fragrant and rich", tried:"no", rating:"", rating_note:""},
];


// ---- STATE -----------------------------------------
let allItems       = [];
let csvHeader      = [];
let csvRaw         = [];
let currentMode    = "";
let activeFilters  = { meal:"any", cuisine:"any", protein:"any", carbs:"any", distance:"any" };
let moodState      = { hunger:"normal", adventure:"mixed", distance:"medium", time:"dinner" };
let wheelItems     = [];
let wheelAngle     = 0;
let isSpinning     = false;
let currentResults = [];
let pendingRatings = {};
let lastWinnerName = null;   // V5: track last spin winner for veto
let vetoedNames    = new Set(); // V5: names vetoed this spin session

// V7: custom filter options added by the user (cuisine/meal/protein/carbs)
let customOptions  = { cuisine: [], meal: [], protein: [], carbs: [] };

// V7: built-in option lists for each filter group (shared between filter screen + edit form)
const BUILT_IN_OPTIONS = {
  cuisine: [
    { val: 'American',      label: '🍔 American' },
    { val: 'Mexican',       label: '🌮 Mexican' },
    { val: 'Italian',       label: '🍝 Italian' },
    { val: 'Indian',        label: '🍛 Indian' },
    { val: 'Asian',         label: '🥢 Asian' },
    { val: 'Mediterranean', label: '🫒 Mediterranean' },
    { val: 'Pizza',         label: '🍕 Pizza' },
    { val: 'Japanese',      label: '🍱 Japanese' },
    { val: 'Chinese',       label: '🥡 Chinese' },
    { val: 'Thai',          label: '🍜 Thai' },
    { val: 'Brunch',        label: '🥞 Brunch' },
    { val: 'Bakery',        label: '🥐 Bakery' },
    { val: 'Cafe',          label: '☕ Cafe' },
    { val: 'Fast Food',     label: '🍟 Fast Food' },
  ],
  meal: [
    { val: 'any',             label: 'Any time' },
    { val: 'breakfast',       label: 'Breakfast' },
    { val: 'lunch',           label: 'Lunch' },
    { val: 'dinner',          label: 'Dinner' },
    { val: 'breakfast-lunch', label: 'Brunch' },
    { val: 'lunch-dinner',    label: 'Lunch or Dinner' },
  ],
  protein: [
    { val: 'any',         label: 'Any' },
    { val: 'chicken',     label: '🐔 Chicken' },
    { val: 'beef',        label: '🥩 Beef' },
    { val: 'fish',        label: '🐟 Fish/Seafood' },
    { val: 'pork',        label: '🐖 Pork' },
    { val: 'egg',         label: '🥚 Egg' },
    { val: 'vegetarian',  label: '🌱 Vegetarian' },
  ],
  carbs: [
    { val: 'any',          label: 'Any' },
    { val: 'pasta',        label: '🍝 Pasta' },
    { val: 'rice',         label: '🍚 Rice' },
    { val: 'tortilla',     label: '🌮 Tortilla' },
    { val: 'pizza dough',  label: '🍕 Pizza Dough' },
    { val: 'bread',        label: '🍞 Bread' },
    { val: 'naan',         label: '🫓 Naan' },
    { val: 'low-carb',     label: '🥬 Low Carb' },
  ],
};

// Merge built-in + custom options for a group
function getAllOptions(group) {
  const builtIn = BUILT_IN_OPTIONS[group] || [];
  const builtInVals = new Set(builtIn.map(o => o.val.toLowerCase()));
  const customs = (customOptions[group] || [])
    .filter(c => c && !builtInVals.has(String(c).toLowerCase()))
    .map(c => ({ val: c, label: c, custom: true }));
  return [...builtIn, ...customs];
}

// Render pills for the Filter screen (used by Find Filters mode)
function renderFilterScreenPills() {
  ['meal','cuisine','protein','carbs'].forEach(group => {
    const container = document.getElementById('filter-' + group);
    if (!container) return;
    const opts = getAllOptions(group);
    const current = activeFilters[group] || 'any';
    let html = `<button class="pill${current==='any'?' active':''}" data-filter="${group}" data-val="any">Any</button>`;
    opts.forEach(o => {
      if (o.val === 'any') return; // already added
      const active = current === o.val ? ' active' : '';
      html += `<button class="pill${active}" data-filter="${group}" data-val="${escapeAttr(o.val)}">${escapeHtml(o.label)}</button>`;
    });
    container.innerHTML = html;
  });
  // Wire up the pill click behavior (delegated below) — pills inherit from existing CSS+JS
}

// Render pills for the Edit form
function renderEditFormPills() {
  ['cuisine','meal','protein','carbs'].forEach(group => {
    const container = document.getElementById('ef-' + group);
    if (!container) return;
    const opts = getAllOptions(group);
    let html = '';
    opts.forEach(o => {
      if (o.custom) {
        // Custom options get an × button to allow deletion
        html += `<span class="edit-pill-wrap">`
              + `<button type="button" class="edit-pill" data-val="${escapeAttr(o.val)}">${escapeHtml(o.label)}</button>`
              + `<button type="button" class="edit-pill-del" title="Delete this custom option" data-del-group="${escapeAttr(group)}" data-del-val="${escapeAttr(o.val)}">✕</button>`
              + `</span>`;
      } else {
        html += `<button type="button" class="edit-pill" data-val="${escapeAttr(o.val)}">${escapeHtml(o.label)}</button>`;
      }
    });
    // Add the "+ Add new" pill at the end (uses data attr too, not onclick)
    html += `<button type="button" class="edit-pill edit-pill-add" data-add-group="${escapeAttr(group)}">+ Add new</button>`;
    container.innerHTML = html;
  });
}

// Count how many items currently use a given option value in a given filter group
function countItemsUsing(group, val) {
  const fieldMap = { cuisine: 'cuisine', meal: 'meal_type', protein: 'protein', carbs: 'carbs' };
  const field = fieldMap[group];
  if (!field) return 0;
  const valLower = String(val).toLowerCase();
  let count = 0;
  allItems.forEach(item => {
    const fieldVal = (item[field] || '').toLowerCase();
    if (!fieldVal) return;
    // Fields use slash-delimited multi-values (e.g. "chicken/beef")
    const parts = fieldVal.split('/').map(p => p.trim());
    if (parts.includes(valLower)) count++;
  });
  return count;
}

// Delete a custom option (called from × button on custom pills)
function deleteCustomOption(group, val) {
  const usage = countItemsUsing(group, val);
  if (usage > 0) {
    showToast(`Can't delete "${val}" — ${usage} item${usage === 1 ? '' : 's'} still use${usage === 1 ? 's' : ''} it. Edit those first.`);
    return;
  }
  if (!confirm(`Delete custom option "${val}" from ${group}?`)) return;

  // Snapshot current form selections (since we'll re-render)
  const snapshot = {};
  ['cuisine','meal','protein','carbs'].forEach(g => {
    snapshot[g] = Array.from(document.querySelectorAll(`#ef-${g} .edit-pill.active`))
      .map(p => p.dataset.val);
  });

  // Remove from customOptions
  customOptions[group] = (customOptions[group] || []).filter(o =>
    String(o).toLowerCase() !== String(val).toLowerCase()
  );
  saveItemsNow();

  // Re-render the pills (this wipes active classes)
  renderEditFormPills();
  renderFilterScreenPills();

  // Restore previous selections (the deleted one is naturally gone now)
  Object.keys(snapshot).forEach(g => {
    snapshot[g].forEach(v => {
      const pill = document.querySelector(`#ef-${g} .edit-pill[data-val="${CSS.escape(v)}"]`);
      if (pill) pill.classList.add('active');
    });
  });

  showToast(`Deleted "${val}"`);
}

// Re-render every dynamic option group everywhere
function renderAllOptionPills() {
  renderFilterScreenPills();
  // Note: we intentionally don't re-render the edit form pills here,
  // because that would wipe a user's in-progress selections if the
  // form is currently open. The form re-renders its own pills on open.
  // The global pill click delegate (in this file below) handles .pill clicks automatically.
}

// Helper: HTML attribute-safe escape
function escapeAttr(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// "+ Add new" prompt for a filter group
function promptAddOption(group) {
  const labels = { cuisine: 'cuisine', meal: 'meal type', protein: 'protein', carbs: 'carb' };
  const name = prompt(`Add a new ${labels[group] || group}:`, '');
  if (name === null) return; // cancelled
  const clean = name.trim();
  if (!clean) return;
  if (clean.length > 30) {
    showToast('Too long — keep it under 30 characters.');
    return;
  }
  // Check if it already exists (case-insensitive) in built-in or custom
  const existing = getAllOptions(group).find(o => o.val.toLowerCase() === clean.toLowerCase());
  if (existing) {
    showToast(`"${clean}" already exists.`);
    // Auto-select the existing one
    const pill = document.querySelector(`#ef-${group} .edit-pill[data-val="${CSS.escape(existing.val)}"]`);
    if (pill) {
      if (group === 'meal') {
        document.querySelectorAll(`#ef-${group} .edit-pill`).forEach(p => p.classList.remove('active'));
      }
      pill.classList.add('active');
    }
    return;
  }

  // Snapshot current form selections across ALL dynamic pill groups
  // so we can restore them after re-rendering the pills
  const snapshot = {};
  ['cuisine','meal','protein','carbs'].forEach(g => {
    const ids = Array.from(document.querySelectorAll(`#ef-${g} .edit-pill.active`))
      .map(p => p.dataset.val);
    snapshot[g] = ids;
  });

  // Add to customOptions and save
  if (!customOptions[group]) customOptions[group] = [];
  customOptions[group].push(clean);
  saveItemsNow();

  // Re-render pills (this wipes active classes — that's why we snapshotted)
  renderEditFormPills();

  // Restore the snapshot AND select the newly added pill
  Object.keys(snapshot).forEach(g => {
    snapshot[g].forEach(val => {
      const pill = document.querySelector(`#ef-${g} .edit-pill[data-val="${CSS.escape(val)}"]`);
      if (pill) pill.classList.add('active');
    });
  });
  // Now select the new one
  const newPill = document.querySelector(`#ef-${group} .edit-pill[data-val="${CSS.escape(clean)}"]`);
  if (newPill) {
    if (group === 'meal') {
      // Single-select: clear others first
      document.querySelectorAll(`#ef-${group} .edit-pill`).forEach(p => p.classList.remove('active'));
    }
    newPill.classList.add('active');
  }
  showToast(`Added "${clean}" ✓`);
}

// ---- INIT ------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initFirebase();
});

// ===================================================
//  V5 — DARK MODE
// ===================================================
function initDarkMode() {
  const saved = localStorage.getItem("wfd-dark-mode");
  if (saved === "dark") {
    document.body.dataset.theme = "dark";
    document.getElementById("dark-toggle").textContent = "☀️";
  }
}

function toggleDark() {
  const isDark = document.body.dataset.theme === "dark";
  if (isDark) {
    delete document.body.dataset.theme;
    localStorage.setItem("wfd-dark-mode", "light");
    document.getElementById("dark-toggle").textContent = "🌙";
  } else {
    document.body.dataset.theme = "dark";
    localStorage.setItem("wfd-dark-mode", "dark");
    document.getElementById("dark-toggle").textContent = "☀️";
  }
}

// ===================================================
//  DATA LOADING
// ===================================================
// ===================================================
//  STORAGE (Firebase Firestore)
// ===================================================
let db = null;
let saveTimer = null;
let csvHeaderOrder = ['category','name','cuisine','meal_type','protein','carbs','distance_miles','notes','tried','rating','rating_note'];

async function initFirebase() {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

    // Try to enable offline persistence (so the app works without signal)
    try {
      await db.enablePersistence({ synchronizeTabs: true });
    } catch (e) {
      console.warn('Offline persistence unavailable:', e.code);
    }

    // Subscribe to real-time updates — every save from any device flows through here
    db.collection('whats_for_dinner').doc('shared').onSnapshot((snap) => {
      if (snap.exists) {
        const data = snap.data();
        allItems = Array.isArray(data.items) ? data.items : [];
        csvHeader = data.csvHeader || csvHeaderOrder;
        customOptions = data.customOptions || { cuisine: [], meal: [], protein: [], carbs: [] };
      } else {
        // First run anywhere — bootstrap Firestore with the seed data
        allItems = JSON.parse(JSON.stringify(SEED_ITEMS));
        csvHeader = csvHeaderOrder;
        customOptions = { cuisine: [], meal: [], protein: [], carbs: [] };
        saveItemsNow();
      }
      // Re-render whatever screen is visible
      try { refreshCurrentScreen(); } catch (e) { console.error('Render error:', e); }
      // Re-render filter screens and edit form options if they exist
      try { renderAllOptionPills(); } catch (e) {}
    }, (err) => {
      console.error('Sync error:', err);
      setSyncStatus('error', 'sync error');
    });
  } catch (e) {
    console.error('Firebase init failed:', e);
    setSyncStatus('error', 'not connected');
    // Fallback: load seed locally so the app is still usable
    allItems = JSON.parse(JSON.stringify(SEED_ITEMS));
    csvHeader = csvHeaderOrder;
    customOptions = { cuisine: [], meal: [], protein: [], carbs: [] };
    try { refreshCurrentScreen(); } catch (err) {}
    try { renderAllOptionPills(); } catch (err) {}
  }
}

// Debounced save — batches rapid edits (e.g. typing a note) into one Firestore write
function saveItems() {
  setSyncStatus('saving', 'saving…');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveItemsNow, 350);
}

// Immediate save (no debounce)
async function saveItemsNow() {
  if (!db) return;
  setSyncStatus('saving', 'saving…');
  try {
    await db.collection('whats_for_dinner').doc('shared').set({
      items: allItems,
      csvHeader: csvHeader,
      customOptions: customOptions
    });
    setSyncStatus('saved', '✓ synced');
  } catch (e) {
    console.error('Save error:', e);
    setSyncStatus('error', '⚠ save failed');
  }
}

// Sync-status indicator in the header
let syncTimer = null;
function setSyncStatus(kind, text) {
  const el = document.getElementById('sync-status');
  if (!el) return;
  clearTimeout(syncTimer);
  el.className = 'sync-status visible ' + kind;
  el.textContent = text;
  if (kind === 'saved') {
    syncTimer = setTimeout(() => el.classList.remove('visible'), 1800);
  } else if (kind === 'error') {
    syncTimer = setTimeout(() => el.classList.remove('visible'), 4000);
  }
}

// Re-render whatever screen is currently active
function refreshCurrentScreen() {
  const active = document.querySelector('.screen.active');
  if (!active) return;
  if (active.id === 'screen-results') {
    if (currentMode) renderResults();
  } else if (active.id === 'screen-surprise') {
    // Surprise screen content is rendered once when navigated to
  } else if (active.id === 'screen-configure') {
    renderConfigureList();
  }
}

// Flush any pending debounced save before the page unloads
window.addEventListener('beforeunload', () => {
  if (saveTimer) { clearTimeout(saveTimer); saveItemsNow(); }
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && saveTimer) {
    clearTimeout(saveTimer); saveItemsNow();
  }
});

// ===================================================
//  RATINGS
// ===================================================
function getRatingFromItem(item) {
  // pendingRatings is now legacy — ratings live on the item itself
  const stars = parseInt(item.rating);
  if (!isNaN(stars) && stars > 0) {
    return { stars, note: item.rating_note || "" };
  }
  return null;
}

function stageRating(name, stars, note) {
  // V6: ratings save directly to Firestore (no more "pending" + manual download)
  const item = allItems.find(i => i.name === name);
  if (item) {
    item.rating = String(stars);
    item.rating_note = note || "";
    saveItems(); // debounced save to cloud
  }
  // Keep the legacy banner suppressed
}

function showSaveBanners() {
  // V6: Firebase auto-syncs ratings, so this banner is no longer shown.
  // (Function kept as a no-op so existing call sites don't error.)
}

function downloadUpdatedCSV() {
  const headerLine = csvHeader.join(",");

  const newLines = allItems.map(item => {
    const vals = csvHeader.map(h => {
      const key = h.toLowerCase().replace(/\s+/g,"_");
      let v = item[key] || "";
      if (v.includes(",") || v.includes('"')) v = '"' + v.replace(/"/g,'""') + '"';
      return v;
    });
    return vals.join(",");
  });

  const csvContent = [headerLine, ...newLines].join("\n");
  const blob       = new Blob([csvContent], { type:"text/csv" });
  const url        = URL.createObjectURL(blob);
  const a          = document.createElement("a");
  a.href           = url;
  a.download       = "food_data.csv";
  a.click();
  URL.revokeObjectURL(url);

  document.querySelectorAll(".save-banner").forEach(b => {
    b.innerHTML = '<p class="save-banner-msg" style="color:var(--sage)">✅ Downloaded! Update your data source with this file, then refresh.</p>';
  });
}

// ===================================================
//  NAVIGATION
// ===================================================
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo({ top:0, behavior:"smooth" });
}
function goHome() {
  activeFilters = { meal:"any", cuisine:"any", protein:"any", carbs:"any", distance:"any" };
  moodState     = { hunger:"normal", adventure:"mixed", distance:"medium", time:"dinner" };
  currentMode   = "";
  // Clear search on home
  const si = document.getElementById("search-input");
  if (si) si.value = "";
  showScreen("screen-home");
}
function goToFilters() { showScreen("screen-filter"); }
function goToMood()    { showScreen("screen-mood"); }

// ===================================================
//  MODE SELECTION
// ===================================================
function selectMode(mode) {
  currentMode = mode;
  renderFilterScreenPills(); // ensure pills exist with current custom options
  resetPills();
  const map = {
    familiar_restaurant:{ title:"Where should we eat tonight?",  sub:"Filter your favorites, or try the Mood Filter 🍴" },
    new_restaurant:     { title:"Let's try somewhere new!",      sub:"Filter your list, or try the Mood Filter ✨" },
    familiar_home:      { title:"What should we cook?",          sub:"Browse your go-to recipes 🥘" },
    new_home:           { title:"Time for a kitchen adventure!", sub:"Browse recipes you want to try 📖" },
  };
  const t = map[mode];
  document.getElementById("filter-title").textContent    = t.title;
  document.getElementById("filter-subtitle").textContent = t.sub;
  document.getElementById("filter-distance-group").style.display =
    mode.includes("restaurant") ? "block" : "none";
  const moodToggle = document.getElementById("btn-mood-toggle");
  if (moodToggle) moodToggle.style.display = mode.includes("restaurant") ? "inline-block" : "none";
  showScreen("screen-filter");
}

// ===================================================
//  PILLS
// ===================================================
function resetPills() {
  activeFilters = { meal:"any", cuisine:"any", protein:"any", carbs:"any", distance:"any" };
  document.querySelectorAll(".pill").forEach(p =>
    p.classList.toggle("active", p.dataset.val === "any")
  );
}

document.addEventListener("click", e => {
  if (e.target.classList.contains("pill")) {
    const f = e.target.dataset.filter, v = e.target.dataset.val;
    document.querySelectorAll(".pill[data-filter='" + f + "']").forEach(p => p.classList.remove("active"));
    e.target.classList.add("active");
    activeFilters[f] = v;
  }
  if (e.target.closest(".mood-btn")) {
    const btn = e.target.closest(".mood-btn");
    const m = btn.dataset.mood, v = btn.dataset.val;
    document.querySelectorAll(".mood-btn[data-mood='" + m + "']").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    moodState[m] = v;
  }
});

// ===================================================
//  FILTERING
// ===================================================
function findOptions() {
  let results = filterItems(allItems.filter(i => i.category === currentMode), activeFilters);
  if (results.length === 0) { showScreen("screen-noresults"); return; }
  currentResults = results;
  renderResults(results, false);
  showScreen("screen-results");
}

function tokenize(val) {
  return (val || "").toLowerCase().split("/").map(s => s.trim()).filter(Boolean);
}

function filterItems(items, filters) {
  let r = [...items];

  if (filters.meal !== "any") {
    r = r.filter(i => {
      const meals = i.meal_type.toLowerCase().split("-").map(m => m.trim());
      return meals.includes(filters.meal);
    });
  }

  if (filters.cuisine !== "any") {
    const want = filters.cuisine.toLowerCase();
    r = r.filter(i => {
      const cuisines = tokenize(i.cuisine);
      return cuisines.some(c => c.includes(want));
    });
  }

  if (filters.protein !== "any") {
    const want = filters.protein.toLowerCase();
    r = r.filter(i => {
      const tokens = tokenize(i.protein);
      if (tokens.length === 1 && tokens[0] === "any") return false;
      if (want === "vegetarian") {
        return tokens.some(t => t === "vegetarian" || t === "vegeterian");
      }
      return tokens.some(t => t.includes(want));
    });
  }

  if (filters.carbs !== "any") {
    const want = filters.carbs.toLowerCase();
    r = r.filter(i => {
      const tokens = tokenize(i.carbs);
      if (tokens.length === 1 && tokens[0] === "any") return false;
      return tokens.some(t => t.includes(want));
    });
  }

  if (filters.distance !== "any") {
    const max = parseFloat(filters.distance);
    r = r.filter(i => {
      const d = parseFloat(i.distance_miles);
      return !isNaN(d) && d <= max;
    });
  }

  return r;
}

// ===================================================
//  MOOD FILTER
// ===================================================
function applyMoodFilters() {
  const adventure  = moodState.adventure;
  const categories = {
    cozy:  ["familiar_restaurant","familiar_home"],
    mixed: ["familiar_restaurant","new_restaurant","familiar_home","new_home"],
    wild:  ["new_restaurant","new_home"]
  }[adventure];

  const maxDist = { close:"10", medium:"20", far:"any" }[moodState.distance];
  const meal    = moodState.time;

  let pool = allItems.filter(i => categories.includes(i.category));
  pool = pool.filter(i => {
    const meals = i.meal_type.toLowerCase().split("-").map(m => m.trim());
    return meals.includes(meal);
  });

  if (maxDist !== "any") {
    const max = parseFloat(maxDist);
    pool = pool.filter(i => {
      if (!i.category.includes("restaurant")) return true;
      const d = parseFloat(i.distance_miles);
      return !isNaN(d) && d <= max;
    });
  }

  if (pool.length === 0) { showScreen("screen-noresults"); return; }

  const catCounts = {};
  pool.forEach(i => catCounts[i.category] = (catCounts[i.category]||0)+1);
  currentMode = Object.keys(catCounts).sort((a,b) => catCounts[b]-catCounts[a])[0];

  currentResults = pool;
  renderResults(pool, true);
  showScreen("screen-results");
}

// ===================================================
//  SURPRISE ME
// ===================================================
function surpriseMe() {
  if (allItems.length === 0) return;
  const pick = allItems[Math.floor(Math.random() * allItems.length)];
  currentMode = pick.category;
  renderSurpriseCard(pick);
  showScreen("screen-surprise");
  const sb = document.getElementById("save-banner-surprise");
  if (sb) {
    if (Object.keys(pendingRatings).length > 0) sb.classList.remove("hidden");
    else sb.classList.add("hidden");
  }
}

function renderSurpriseCard(item) {
  const card    = document.getElementById("surprise-card");
  const emoji   = getEmoji(item.cuisine);
  const rating  = getRatingFromItem(item);
  const catLabel = {
    familiar_restaurant:"🍴 Go-to restaurant",
    new_restaurant:     "✨ New place to try",
    familiar_home:      "🥘 Recipe we know",
    new_home:           "📖 Recipe to try"
  }[item.category] || "";

  const prevRatingHtml = rating
    ? '<div class="surprise-prev-rating">Previously rated: ' +
      '★'.repeat(rating.stars) + '☆'.repeat(5 - rating.stars) +
      (rating.note ? ' — <em>' + escHTML(rating.note) + '</em>' : '') +
      '</div>'
    : '';

  card.innerHTML =
    '<div class="surprise-cat-label">' + catLabel + '</div>' +
    '<div class="surprise-emoji">'     + emoji    + '</div>' +
    '<div class="surprise-name">'      + escHTML(item.name) + '</div>' +
    '<div class="surprise-meta">'      + escHTML(item.cuisine) + ' · ' + capitalize(item.meal_type) + '</div>' +
    (item.notes ? '<div class="surprise-note">' + escHTML(item.notes) + '</div>' : '') +
    prevRatingHtml +
    '<div class="rating-section">'     + buildStarsHTML(item) + '</div>';
}

// ===================================================
//  RENDER RESULTS
// ===================================================
function renderResults(results, fromMood) {
  // Reset veto state for fresh results
  vetoedNames.clear();
  lastWinnerName = null;
  document.getElementById("veto-btn").classList.add("hidden");
  document.getElementById("spin-result").classList.add("hidden");

  wheelItems = results.map(r => r.name);
  wheelAngle = 0;
  drawWheel(wheelItems, 0);

  document.getElementById("results-title").textContent =
    fromMood ? getMoodResultTitle() : getResultsTitle();
  document.getElementById("results-count").textContent =
    results.length + " option" + (results.length !== 1 ? "s" : "") + " found — scroll or spin the wheel!";

  // Clear search
  const si = document.getElementById("search-input");
  if (si) si.value = "";

  const grid = document.getElementById("results-grid");
  grid.innerHTML = "";

  results.forEach(item => {
    const card     = document.createElement("div");
    card.className = "result-card";
    card.dataset.name = item.name.toLowerCase();
    const emoji    = getEmoji(item.cuisine);
    const notesHtml = item.notes
      ? '<div class="result-card-notes">' + escHTML(item.notes) + '</div>' : "";

    const recipeBtnHtml = item.category === "new_home"
      ? '<div class="card-actions"><button class="card-btn" onclick="fetchRecipe(\'' + escQ(item.name) + '\',this)">📖 Find Recipe</button></div>'
      : "";

    card.innerHTML =
      '<span class="result-card-emoji">' + emoji + '</span>' +
      '<div class="result-card-name">'   + escHTML(item.name) + '</div>' +
      '<div class="result-card-meta">'   + escHTML(item.cuisine) + ' · ' + capitalize(item.meal_type) + '</div>' +
      notesHtml +
      '<span class="result-card-tag">'   + formatTag(item.protein) + ' · ' + formatTag(item.carbs) + '</span>' +
      recipeBtnHtml +
      '<div class="card-extra-info" id="extra-' + slugify(item.name) + '"></div>' +
      '<div class="rating-section">'     + buildStarsHTML(item) + '</div>';

    grid.appendChild(card);
  });

  document.getElementById("spin-btn").disabled = false;

  const sb = document.getElementById("save-banner");
  if (sb) {
    if (Object.keys(pendingRatings).length > 0) sb.classList.remove("hidden");
    else sb.classList.add("hidden");
  }

  // Show/hide H2H button (need at least 2 results)
  const h2hBtn = document.getElementById("btn-h2h");
  if (h2hBtn) h2hBtn.style.display = results.length >= 2 ? "inline-flex" : "none";
}

// ===================================================
//  V5 — SEARCH BAR
// ===================================================
function filterSearch() {
  const q = document.getElementById("search-input").value.toLowerCase().trim();
  document.querySelectorAll("#results-grid .result-card").forEach(card => {
    const name = (card.dataset.name || "");
    card.style.display = (!q || name.includes(q)) ? "" : "none";
  });
}

// ===================================================
//  RESULT TITLES
// ===================================================
function getMoodResultTitle() {
  const adv = moodState.adventure, time = moodState.time;
  if (adv === "wild")        return "Let's be adventurous! 🚀";
  if (adv === "cozy")        return "Keeping it cozy tonight 🧸";
  if (time === "breakfast")  return "Good morning! 🌅";
  return "Here's what feels right tonight ✨";
}
function getResultsTitle() {
  return ({
    familiar_restaurant:"Your favorite spots 🍴",
    new_restaurant:     "Time for an adventure! ✨",
    familiar_home:      "A recipe you know & love 🥘",
    new_home:           "Tonight's kitchen experiment 📖",
  })[currentMode] || "Here's what we found!";
}

// ===================================================
//  RATINGS HTML
// ===================================================
function buildStarsHTML(item) {
  const rating  = getRatingFromItem(item);
  const current = rating?.stars || 0;
  const note    = rating?.note  || "";
  const slug    = slugify(item.name);
  const name    = escQ(item.name);

  let starsHTML = '<div class="star-row" data-name="' + escQ(item.name) + '">';
  for (let i = 1; i <= 5; i++) {
    starsHTML +=
      '<span class="star ' + (i <= current ? "filled" : "") + '" ' +
      'onclick="handleStarClick(\'' + name + '\',' + i + ',this)" ' +
      'onmouseenter="starHover(\'' + name + '\',' + i + ')" ' +
      'onmouseleave="starUnhover(\'' + name + '\')">★</span>';
  }
  starsHTML += '</div>';

  const noteDisplay = current > 0 ? "flex" : "none";
  starsHTML +=
    '<div class="note-row" id="note-row-' + slug + '" style="display:' + noteDisplay + '">' +
      '<input class="note-input" id="note-input-' + slug + '" type="text" ' +
        'placeholder="Add a note… (e.g. get the birria!)" maxlength="120" ' +
        'value="' + escHTML(note) + '" />' +
      '<button class="note-save" onclick="saveNote(\'' + name + '\')">Save ✓</button>' +
    '</div>' +
    '<div class="note-saved-msg hidden" id="note-saved-' + slug + '">✓ Saved!</div>';

  return starsHTML;
}

function starHover(name, n) {
  document.querySelectorAll('.star-row[data-name="' + name + '"] .star')
    .forEach((s,i) => s.classList.toggle("hover", i < n));
}
function starUnhover(name) {
  document.querySelectorAll('.star-row[data-name="' + name + '"] .star')
    .forEach(s => s.classList.remove("hover"));
}
function handleStarClick(name, stars, el) {
  const row = el.closest(".star-row");
  row.querySelectorAll(".star").forEach((s,i) => {
    s.classList.toggle("filled", i < stars);
    s.classList.remove("hover");
  });
  row.classList.add("rated");
  const noteRow = document.getElementById("note-row-" + slugify(name));
  if (noteRow) noteRow.style.display = "flex";
  const existing = getRatingFromItem(allItems.find(i => i.name === name) || {});
  stageRating(name, stars, existing?.note || "");
}

function saveNote(name) {
  const inp  = document.getElementById("note-input-" + slugify(name));
  const note = inp ? inp.value.trim() : "";
  const item = allItems.find(i => i.name === name);
  const existing = getRatingFromItem(item || {});
  const stars = existing?.stars || 1;
  stageRating(name, stars, note);
  const msg = document.getElementById("note-saved-" + slugify(name));
  if (msg) {
    msg.classList.remove("hidden");
    setTimeout(() => msg.classList.add("hidden"), 2000);
  }
}

// ===================================================
//  RECIPE FINDER (Claude API)
// ===================================================
async function fetchRecipe(name, btn) {
  const infoDiv = document.getElementById("extra-" + slugify(name));
  btn.disabled = true; btn.textContent = "Searching…";
  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        model:"claude-sonnet-4-20250514", max_tokens:400,
        system:"Respond ONLY with a valid JSON object (no markdown, no code fences) with exactly these fields: summary (2 sentences), time (e.g. '45 mins'), difficulty ('Easy', 'Medium', or 'Hard'), tip (one short tip under 20 words).",
        messages:[{role:"user", content:"Home cooking info for: " + name}]
      })
    });
    const raw    = await resp.json();
    const text   = (raw.content||[]).map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
    const recipe = JSON.parse(text);
    const url    = "https://www.google.com/search?q=" + encodeURIComponent(name + " recipe");
    infoDiv.innerHTML =
      '<div class="recipe-info">' +
        '<p class="recipe-summary">' + escHTML(recipe.summary) + '</p>' +
        '<div class="recipe-meta"><span>⏱️ ' + escHTML(recipe.time) + '</span><span>📊 ' + escHTML(recipe.difficulty) + '</span></div>' +
        '<p class="recipe-tip">💡 <em>' + escHTML(recipe.tip) + '</em></p>' +
        '<a class="card-btn recipe-link" href="' + url + '" target="_blank">🔍 Find Full Recipes Online</a>' +
      '</div>';
  } catch(e) {
    const url = "https://www.google.com/search?q=" + encodeURIComponent(name + " recipe");
    infoDiv.innerHTML = '<div class="place-info"><a class="card-btn" href="' + url + '" target="_blank">🔍 Search Recipes Online</a></div>';
  }
  btn.disabled = false; btn.textContent = "📖 Find Recipe";
}

// ===================================================
//  HELPERS
// ===================================================
function getEmoji(c) {
  const l = (c||"").toLowerCase();
  for (const [k,v] of Object.entries(CUISINE_EMOJI)) { if (l.includes(k)) return v; }
  return CUISINE_EMOJI.default;
}
function capitalize(s) { return (s||"").replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase()); }
function formatTag(v)  { return (!v||v.toLowerCase()==="any") ? "Any" : capitalize(v); }
function escQ(s)       { return (s||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'"); }
function escHTML(s)    { return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function slugify(s)    { return (s||"").toLowerCase().replace(/[^a-z0-9]/g,"-"); }

// ===================================================
//  SPIN THE WHEEL
// ===================================================
const WHEEL_COLORS = [
  "#6B4F31","#C4623A","#7A9E7E","#C9897A",
  "#9C7A55","#E07B52","#A8C5A0","#E0AAA0",
  "#D4A017","#8B6344","#5A8F5D","#B07060",
];

function drawWheel(names, angle) {
  const canvas = document.getElementById("wheel-canvas");
  if (!canvas) return;
  const ctx    = canvas.getContext("2d");
  const cx     = canvas.width/2, cy = canvas.height/2, r = cx - 8;

  if (names.length === 0) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath(); ctx.arc(cx,cy,r,0,2*Math.PI);
    ctx.fillStyle = "#DDD0B8"; ctx.fill();
    ctx.fillStyle = "#6B4F31"; ctx.font = "bold 14px Lato,sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("No items", cx, cy);
    return;
  }

  const count  = names.length, slice = (2*Math.PI)/count;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(angle); ctx.translate(-cx,-cy);

  names.forEach((name,i) => {
    const s = i*slice, e = s+slice;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,s,e); ctx.closePath();
    ctx.fillStyle = WHEEL_COLORS[i%WHEEL_COLORS.length]; ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(s+slice/2);
    const label = name.length > 13 ? name.slice(0,12)+"…" : name;
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font      = "bold "+(count>10?9:11)+"px 'Lato',sans-serif";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 3;
    ctx.fillText(label, r*0.55, 0); ctx.restore();
  });

  ctx.restore();
  ctx.beginPath(); ctx.arc(cx,cy,18,0,2*Math.PI);
  ctx.fillStyle = "#3D2B1A"; ctx.fill();
  ctx.strokeStyle = "#F0C84A"; ctx.lineWidth = 3; ctx.stroke();
}

function spinWheel() {
  if (isSpinning || wheelItems.length === 0) return;
  isSpinning = true;

  // Build active wheel items (minus vetoed)
  const activeItems = wheelItems.filter(n => !vetoedNames.has(n));
  if (activeItems.length === 0) {
    // All vetoed — reset vetoes and try again
    vetoedNames.clear();
    document.getElementById("veto-btn").classList.add("hidden");
    spinWheel();
    return;
  }

  document.getElementById("spin-btn").disabled = true;
  document.getElementById("spin-result").classList.add("hidden");
  document.getElementById("veto-btn").classList.add("hidden");

  const count       = activeItems.length;
  const slice       = (2*Math.PI)/count;
  const winnerIdx   = Math.floor(Math.random()*count);
  const winnerCentre= winnerIdx*slice + slice/2;
  const raw         = (-Math.PI/2) - winnerCentre;
  const normalised  = ((raw%(2*Math.PI))+(2*Math.PI))%(2*Math.PI);
  const finalAngle  = normalised + (5+Math.floor(Math.random()*3))*2*Math.PI;
  const duration    = 4500, startTime = performance.now();

  // Temporarily redraw wheel with only non-vetoed items
  drawWheel(activeItems, 0);

  function easeOut(t) { return 1-Math.pow(1-t,4); }

  (function animate(now) {
    const progress = Math.min((now-startTime)/duration, 1);
    wheelAngle = finalAngle * easeOut(progress);
    drawWheel(activeItems, wheelAngle);
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      wheelAngle = finalAngle;
      drawWheel(activeItems, wheelAngle);
      isSpinning = false;
      document.getElementById("spin-btn").disabled = false;
      lastWinnerName = activeItems[winnerIdx];
      showSpinResult(lastWinnerName, activeItems.length);
    }
  })(performance.now());
}

function showSpinResult(name, totalActive) {
  const el = document.getElementById("spin-result");
  el.classList.remove("hidden");
  el.innerHTML = "🎉 Tonight's pick:<br><strong>" + escHTML(name) + "</strong>";

  // V5: Show veto button (hide it if only 1 item left after veto)
  const vetoBtn = document.getElementById("veto-btn");
  if (totalActive > 1) {
    vetoBtn.classList.remove("hidden");
    const remaining = totalActive - 1 - vetoedNames.size;
    vetoBtn.textContent = "🚫 Veto — spin again!" +
      (remaining <= 3 && remaining > 0 ? " (" + remaining + " left)" : "");
  } else {
    vetoBtn.classList.add("hidden");
  }
}

// V5: Veto the current pick and re-spin
function vetoAndRespin() {
  if (!lastWinnerName) return;
  vetoedNames.add(lastWinnerName);
  lastWinnerName = null;
  document.getElementById("veto-btn").classList.add("hidden");
  document.getElementById("spin-result").classList.add("hidden");
  spinWheel();
}

// ===================================================
//  V5 — HEAD TO HEAD MODE
// ===================================================
const h2hState = {
  p1Picks: new Set(),
  p2Picks: new Set(),
  phase: "p1"   // "p1" | "p2" | "reveal"
};

function startH2H() {
  h2hState.p1Picks.clear();
  h2hState.p2Picks.clear();
  h2hState.phase = "p1";

  // Show pick phase, hide others
  document.getElementById("h2h-pick-phase").style.display = "block";
  document.getElementById("h2h-handoff-phase").classList.add("hidden");
  document.getElementById("h2h-reveal-phase").classList.add("hidden");

  renderH2HGrid("p1");
  showScreen("screen-h2h");
}

function renderH2HGrid(player) {
  const isP1 = player === "p1";
  const picks = isP1 ? h2hState.p1Picks : h2hState.p2Picks;

  // Update header
  const badge = document.getElementById("h2h-player-badge");
  badge.textContent = isP1 ? "👤 Player 1" : "👤 Player 2";
  badge.className   = "h2h-player-badge" + (isP1 ? "" : " p2");
  document.getElementById("h2h-title").textContent = isP1
    ? "What would you pick?" : "Your turn — what sounds good?";
  document.getElementById("h2h-sub").textContent =
    "Tap everything you'd be happy with tonight!";

  updateH2HCounter(picks.size);

  const grid = document.getElementById("h2h-grid");
  grid.innerHTML = "";

  currentResults.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card h2h-card";
    if (picks.has(item.name)) card.classList.add("h2h-selected");
    card.dataset.itemName = item.name;
    const emoji = getEmoji(item.cuisine);
    card.innerHTML =
      '<span class="result-card-emoji">' + emoji + '</span>' +
      '<div class="result-card-name">'   + escHTML(item.name) + '</div>' +
      '<div class="result-card-meta">'   + escHTML(item.cuisine) + ' · ' + capitalize(item.meal_type) + '</div>' +
      (item.notes ? '<div class="result-card-notes">' + escHTML(item.notes) + '</div>' : '') +
      '<div class="h2h-check">✓</div>';

    card.addEventListener("click", () => toggleH2HPick(card, item.name, player));
    grid.appendChild(card);
  });

  // Update done button
  const doneBtn = document.getElementById("h2h-done-btn");
  const doneLabel = document.getElementById("h2h-done-label");
  doneBtn.disabled = false;
  doneLabel.textContent = isP1 ? "Done! Pass to Player 2 👉" : "Reveal! 🎉";
}

function toggleH2HPick(card, name, player) {
  const picks = player === "p1" ? h2hState.p1Picks : h2hState.p2Picks;

  if (picks.has(name)) {
    picks.delete(name);
    card.classList.remove("h2h-selected");
  } else {
    picks.add(name);
    card.classList.add("h2h-selected");
  }

  updateH2HCounter(picks.size);
}

function updateH2HCounter(count) {
  const counter = document.getElementById("h2h-counter");
  if (count === 0) {
    counter.textContent = "Nothing selected yet";
    counter.classList.remove("has-picks");
  } else {
    counter.textContent = count + " selected";
    counter.classList.add("has-picks");
  }
}

function h2hNext() {
  if (h2hState.phase === "p1") {
    // Move to handoff screen
    h2hState.phase = "p2";
    document.getElementById("h2h-pick-phase").style.display = "none";
    document.getElementById("h2h-handoff-phase").classList.remove("hidden");
    window.scrollTo({ top:0, behavior:"smooth" });
  } else if (h2hState.phase === "p2") {
    // Reveal
    h2hState.phase = "reveal";
    showH2HReveal();
  }
}

function showH2HP2Grid() {
  document.getElementById("h2h-handoff-phase").classList.add("hidden");
  document.getElementById("h2h-pick-phase").style.display = "block";
  renderH2HGrid("p2");
  window.scrollTo({ top:0, behavior:"smooth" });
}

function showH2HReveal() {
  document.getElementById("h2h-pick-phase").style.display = "none";
  document.getElementById("h2h-reveal-phase").classList.remove("hidden");
  window.scrollTo({ top:0, behavior:"smooth" });

  const p1 = h2hState.p1Picks;
  const p2 = h2hState.p2Picks;
  const matches = [...p1].filter(n => p2.has(n));
  const p1Only  = [...p1].filter(n => !p2.has(n));
  const p2Only  = [...p2].filter(n => !p1.has(n));

  const revealTitle  = document.getElementById("h2h-reveal-title");
  const revealSub    = document.getElementById("h2h-reveal-sub");
  const revealContent= document.getElementById("h2h-reveal-content");

  if (matches.length > 0) {
    revealTitle.textContent = "🎉 You agree on " + matches.length + (matches.length === 1 ? " thing!" : " things!");
    revealSub.textContent   = "Great minds think alike. Here's what you both picked:";
  } else if (p1.size === 0 && p2.size === 0) {
    revealTitle.textContent = "🤔 Neither of you picked anything!";
    revealSub.textContent   = "Go back and try again — surely something looks good?";
  } else {
    revealTitle.textContent = "🤷 No overlap... yet!";
    revealSub.textContent   = "You didn't pick the same things, but here's what each of you wants:";
  }

  let html = "";

  // Match section
  if (matches.length > 0) {
    html += '<div class="h2h-reveal-match-section">';
    html += '<div class="h2h-match-label">✨ You Both Want</div>';
    html += '<div class="h2h-match-cards">';
    matches.forEach(name => {
      const item  = allItems.find(i => i.name === name);
      const emoji = item ? getEmoji(item.cuisine) : "🍽️";
      html += '<div class="h2h-match-pill">' + emoji + ' ' + escHTML(name) + '</div>';
    });
    html += '</div></div>';
  } else if (p1.size === 0 && p2.size === 0) {
    html += '<div class="h2h-no-match"><div class="h2h-no-match-emoji">😅</div><p>Go back and pick at least one option each!</p></div>';
  } else {
    html += '<div class="h2h-no-match"><div class="h2h-no-match-emoji">🙈</div><p>No matching picks — looks like you\'ll need to compromise. Check out each other\'s picks below!</p></div>';
  }

  // Individual picks
  if (p1.size > 0 || p2.size > 0) {
    html += '<div class="h2h-players-row">';

    // Player 1
    html += '<div class="h2h-player-col">';
    html += '<div class="h2h-player-col-title">👤 Player 1\'s picks</div>';
    if (p1.size === 0) {
      html += '<p class="h2h-no-picks-msg">No picks made</p>';
    } else {
      html += '<div class="h2h-pick-list">';
      [...p1].forEach(name => {
        const isMatch = p2.has(name);
        const item    = allItems.find(i => i.name === name);
        const emoji   = item ? getEmoji(item.cuisine) : "🍽️";
        html += '<div class="h2h-pick-item' + (isMatch ? ' is-match' : '') + '">' +
          emoji + ' ' + escHTML(name) +
          '</div>';
      });
      html += '</div>';
    }
    html += '</div>';

    // Player 2
    html += '<div class="h2h-player-col">';
    html += '<div class="h2h-player-col-title" style="color:var(--rust)">👤 Player 2\'s picks</div>';
    if (p2.size === 0) {
      html += '<p class="h2h-no-picks-msg">No picks made</p>';
    } else {
      html += '<div class="h2h-pick-list">';
      [...p2].forEach(name => {
        const isMatch = p1.has(name);
        const item    = allItems.find(i => i.name === name);
        const emoji   = item ? getEmoji(item.cuisine) : "🍽️";
        html += '<div class="h2h-pick-item' + (isMatch ? ' is-match' : '') + '">' +
          emoji + ' ' + escHTML(name) +
          '</div>';
      });
      html += '</div>';
    }
    html += '</div>';

    html += '</div>'; // end players-row
  }

  revealContent.innerHTML = html;
}

function cancelH2H() {
  h2hState.p1Picks.clear();
  h2hState.p2Picks.clear();
  h2hState.phase = "p1";
  showScreen("screen-results");
}

// ===================================================
//  TOAST HELPER (for Configure/Edit feedback)
// ===================================================
let _toastTimer = null;
function showToast(msg) {
  let el = document.getElementById('wfd-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'wfd-toast';
    el.style.cssText = `
      position: fixed; bottom: 24px; left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: var(--espresso, #2E2218);
      color: var(--cream, #FAF2E0);
      padding: 12px 22px;
      border-radius: 30px;
      font-family: 'Lato', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 12px 32px rgba(0,0,0,0.25);
      transition: transform 0.3s ease;
      z-index: 9999;
      pointer-events: none;
      max-width: 90vw;
      text-align: center;
    `;
    document.body.appendChild(el);
  }
  el.textContent = msg;
  // Force reflow then animate in
  requestAnimationFrame(() => {
    el.style.transform = 'translateX(-50%) translateY(0)';
  });
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.style.transform = 'translateX(-50%) translateY(80px)';
  }, 2500);
}

// ===================================================
//  CONFIGURE — list, search, filter
// ===================================================
let configureFilter = 'all';
let editingItemName = null; // null = adding new, otherwise editing existing

const CATEGORY_INFO = {
  familiar_restaurant: { emoji: '🍴', label: 'Familiar Restaurant' },
  new_restaurant:      { emoji: '✨', label: 'New Restaurant'      },
  familiar_home:       { emoji: '🥘', label: 'Familiar Recipe'     },
  new_home:            { emoji: '📖', label: 'New Recipe'          },
};

function openConfigure() {
  configureFilter = 'all';
  document.querySelectorAll('.config-chip').forEach(c => c.classList.toggle('active', c.dataset.cat === 'all'));
  const si = document.getElementById('configure-search');
  if (si) si.value = '';
  renderConfigureList();
  showScreen('screen-configure');
}

function setConfigureFilter(cat, el) {
  configureFilter = cat;
  document.querySelectorAll('.config-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderConfigureList();
}

function renderConfigureList() {
  const listEl  = document.getElementById('configure-list');
  const emptyEl = document.getElementById('configure-empty');
  const searchEl = document.getElementById('configure-search');
  const q = (searchEl?.value || '').trim().toLowerCase();

  // Update counts
  const counts = { all: allItems.length };
  Object.keys(CATEGORY_INFO).forEach(k => counts[k] = 0);
  allItems.forEach(i => { if (counts[i.category] !== undefined) counts[i.category]++; });
  Object.keys(counts).forEach(k => {
    const el = document.getElementById('cfg-count-' + k);
    if (el) el.textContent = counts[k];
  });

  // Filter
  let rows = allItems.slice();
  if (configureFilter !== 'all') rows = rows.filter(i => i.category === configureFilter);
  if (q) rows = rows.filter(i => (i.name || '').toLowerCase().includes(q));

  // Sort: alphabetical by name
  rows.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  if (rows.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    return;
  }
  emptyEl.classList.add('hidden');

  listEl.innerHTML = rows.map(item => {
    const info = CATEGORY_INFO[item.category] || { emoji: '🍽️', label: item.category || '' };
    const rating = parseInt(item.rating);
    const ratingStr = (!isNaN(rating) && rating > 0) ? `★ ${rating}` : '';
    const cuisine = item.cuisine || '';
    const isRestaurant = (item.category || '').includes('restaurant');
    const dist = item.distance_miles;
    const distStr = (isRestaurant && dist && dist !== '0') ? `${dist} mi` : '';
    return `
      <div class="config-row" onclick="openEditForm('${escQ(item.name)}')">
        <span class="config-row-emoji">${info.emoji}</span>
        <div class="config-row-body">
          <p class="config-row-name">${escapeHtml(item.name || '(unnamed)')}</p>
          <div class="config-row-meta">
            <span class="config-row-meta-tag">${escapeHtml(info.label)}</span>
            ${cuisine ? `<span class="config-row-meta-tag">${escapeHtml(cuisine)}</span>` : ''}
            ${distStr ? `<span class="config-row-meta-tag">${escapeHtml(distStr)}</span>` : ''}
          </div>
        </div>
        ${ratingStr ? `<span class="config-row-rating">${ratingStr}</span>` : ''}
        <button class="config-row-edit" onclick="event.stopPropagation();openEditForm('${escQ(item.name)}')">✏️ Edit</button>
      </div>
    `;
  }).join('');
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ===================================================
//  ADD / EDIT FORM
// ===================================================
function openAddForm() {
  editingItemName = null;
  document.getElementById('edit-title').textContent = 'Add New';
  document.getElementById('ef-delete').classList.add('hidden');
  renderEditFormPills(); // ensure dynamic pills are present
  resetEditForm();
  // Default to first category if user just wants to add quickly
  showScreen('screen-edit');
  updateEditFormVisibility();
}

function openEditForm(name) {
  const item = allItems.find(i => i.name === name);
  if (!item) {
    showToast('Could not find that item.');
    return;
  }
  editingItemName = item.name;
  document.getElementById('edit-title').textContent = 'Edit: ' + item.name;
  document.getElementById('ef-delete').classList.remove('hidden');

  renderEditFormPills(); // ensure dynamic pills are present
  resetEditForm();
  document.getElementById('ef-name').value     = item.name || '';
  document.getElementById('ef-distance').value = (item.distance_miles && item.distance_miles !== '0') ? item.distance_miles : '';
  document.getElementById('ef-notes').value    = item.notes || '';
  document.getElementById('ef-recipe').value   = item.recipe || '';
  document.getElementById('ef-review').value   = item.rating_note || '';

  // Category (single-select)
  setPillsValue('ef-category', item.category, false);

  // Cuisine (multi-select, slash-delimited)
  setPillsValue('ef-cuisine', item.cuisine, true);

  // Meal type (single-select)
  setPillsValue('ef-meal', item.meal_type, false);

  // Protein (multi)
  setPillsValue('ef-protein', item.protein, true);

  // Carbs (multi)
  setPillsValue('ef-carbs', item.carbs, true);

  // Stars
  const rating = parseInt(item.rating);
  setStars(!isNaN(rating) ? rating : 0);

  updateEditFormVisibility();
  showScreen('screen-edit');
}

function closeEditForm() {
  editingItemName = null;
  showScreen('screen-configure');
}

function resetEditForm() {
  ['ef-name','ef-distance','ef-notes','ef-recipe','ef-review'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('.edit-pill').forEach(p => p.classList.remove('active'));
  setStars(0);
  // Reset duplicate warning
  const warnEl = document.getElementById('ef-name-warn');
  if (warnEl) warnEl.classList.add('hidden');
  const nameEl = document.getElementById('ef-name');
  if (nameEl) nameEl.classList.remove('input-error');
}

function setPillsValue(groupId, value, isMulti) {
  const container = document.getElementById(groupId);
  if (!container) return;
  const pills = container.querySelectorAll('.edit-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (!value) return;
  const values = isMulti
    ? value.split('/').map(v => v.trim().toLowerCase()).filter(Boolean)
    : [value.trim().toLowerCase()];
  pills.forEach(p => {
    if (values.includes((p.dataset.val || '').toLowerCase())) p.classList.add('active');
  });
}

function readPillsValue(groupId, isMulti) {
  const container = document.getElementById(groupId);
  if (!container) return '';
  const active = Array.from(container.querySelectorAll('.edit-pill.active'))
    .filter(p => !p.classList.contains('edit-pill-add'))
    .map(p => p.dataset.val);
  if (!isMulti) return active[0] || '';
  return active.join('/');
}

// Live duplicate-name detection on the edit form
function checkDuplicateName() {
  const input  = document.getElementById('ef-name');
  const warnEl = document.getElementById('ef-name-warn');
  if (!input || !warnEl) return;
  const name = input.value.trim();
  if (!name) {
    warnEl.classList.add('hidden');
    input.classList.remove('input-error');
    return;
  }
  const nameLower = name.toLowerCase();
  const conflict = allItems.find(i =>
    (i.name || '').toLowerCase() === nameLower &&
    i.name !== editingItemName
  );
  if (conflict) {
    const catLabel = (CATEGORY_INFO[conflict.category] || {}).label || conflict.category;
    warnEl.innerHTML = `⚠️ <strong>${escapeHtml(conflict.name)}</strong> already exists in <em>${escapeHtml(catLabel)}</em>. Pick a different name or edit the existing one.`;
    warnEl.classList.remove('hidden');
    input.classList.add('input-error');
  } else {
    warnEl.classList.add('hidden');
    input.classList.remove('input-error');
  }
}

// Trigger an attention-grabbing shake on the warning (called from save attempt)
function shakeDupWarning() {
  const warnEl = document.getElementById('ef-name-warn');
  if (!warnEl) return;
  warnEl.classList.remove('shake');
  // Force reflow so the animation can restart
  void warnEl.offsetWidth;
  warnEl.classList.add('shake');
}

function setStars(n) {
  document.querySelectorAll('#ef-stars .edit-star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.stars) <= n);
  });
  document.getElementById('ef-stars').dataset.value = String(n);
}

function clearEditStars() { setStars(0); }

// Wire up form interactions once on load
function initEditFormListeners() {
  // Star clicks
  document.querySelectorAll('#ef-stars .edit-star').forEach(s => {
    s.addEventListener('click', () => setStars(parseInt(s.dataset.stars)));
  });
  // Single-select pill groups: category, meal
  ['ef-category', 'ef-meal'].forEach(groupId => {
    const c = document.getElementById(groupId);
    if (!c) return;
    c.addEventListener('click', e => {
      // Handle + Add new button (delegated)
      const addBtn = e.target.closest('.edit-pill-add');
      if (addBtn) {
        const group = addBtn.dataset.addGroup;
        if (group) promptAddOption(group);
        return;
      }
      // Handle × delete button (delegated)
      const delBtn = e.target.closest('.edit-pill-del');
      if (delBtn) {
        e.stopPropagation();
        deleteCustomOption(delBtn.dataset.delGroup, delBtn.dataset.delVal);
        return;
      }
      // Regular pill toggle
      const btn = e.target.closest('.edit-pill');
      if (!btn || btn.classList.contains('edit-pill-add')) return;
      c.querySelectorAll('.edit-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      if (groupId === 'ef-category') updateEditFormVisibility();
    });
  });
  // Multi-select pill groups: cuisine, protein, carbs
  ['ef-cuisine', 'ef-protein', 'ef-carbs'].forEach(groupId => {
    const c = document.getElementById(groupId);
    if (!c) return;
    c.addEventListener('click', e => {
      // Handle + Add new button (delegated)
      const addBtn = e.target.closest('.edit-pill-add');
      if (addBtn) {
        const group = addBtn.dataset.addGroup;
        if (group) promptAddOption(group);
        return;
      }
      // Handle × delete button (delegated)
      const delBtn = e.target.closest('.edit-pill-del');
      if (delBtn) {
        e.stopPropagation();
        deleteCustomOption(delBtn.dataset.delGroup, delBtn.dataset.delVal);
        return;
      }
      // Regular pill toggle
      const btn = e.target.closest('.edit-pill');
      if (!btn || btn.classList.contains('edit-pill-add')) return;
      btn.classList.toggle('active');
    });
  });
}

// Toggle which fields show based on selected category (restaurant vs recipe, familiar vs new)
function updateEditFormVisibility() {
  const cat = readPillsValue('ef-category', false);
  const isRestaurant = cat.includes('restaurant');
  const isFamiliar   = cat.startsWith('familiar_');

  // Distance only matters for restaurants
  document.getElementById('ef-distance-field').style.display = isRestaurant ? '' : 'none';
  // Full recipe textarea only matters for home/recipes
  document.getElementById('ef-recipe-field').style.display   = (cat && !isRestaurant) ? '' : 'none';
  // Review (stars + note) only shown when something is tried — i.e. familiar
  document.getElementById('ef-review-field').style.display   = isFamiliar ? '' : 'none';
}

function saveEditForm() {
  const name = document.getElementById('ef-name').value.trim();
  if (!name) {
    showToast('Please give it a name.');
    document.getElementById('ef-name').focus();
    return;
  }
  const category = readPillsValue('ef-category', false);
  if (!category) {
    showToast('Please pick a category.');
    return;
  }

  // Check for duplicate name (case-insensitive) — only when adding new, or when renaming
  const nameLower = name.toLowerCase();
  const conflict = allItems.find(i =>
    (i.name || '').toLowerCase() === nameLower &&
    i.name !== editingItemName
  );
  if (conflict) {
    showToast(`"${name}" already exists in your list.`);
    checkDuplicateName(); // populate the inline warning if not already shown
    shakeDupWarning(); // attention-grabbing shake
    const nameEl = document.getElementById('ef-name');
    if (nameEl) {
      nameEl.focus();
      nameEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    return;
  }

  const isRestaurant = category.includes('restaurant');
  const isFamiliar   = category.startsWith('familiar_');

  const cuisine = readPillsValue('ef-cuisine', true);
  const meal    = readPillsValue('ef-meal', false) || 'any';
  const protein = readPillsValue('ef-protein', true) || 'any';
  const carbs   = readPillsValue('ef-carbs', true) || 'any';

  const distance = isRestaurant
    ? (document.getElementById('ef-distance').value || '0')
    : '0';
  const notes    = document.getElementById('ef-notes').value.trim();
  const recipe   = isRestaurant ? '' : document.getElementById('ef-recipe').value.trim();
  const review   = isFamiliar ? document.getElementById('ef-review').value.trim() : '';
  const stars    = isFamiliar ? parseInt(document.getElementById('ef-stars').dataset.value || '0') : 0;

  const newItem = {
    category,
    name,
    cuisine,
    meal_type: meal,
    protein,
    carbs,
    distance_miles: String(distance),
    notes,
    recipe,
    tried: isFamiliar ? 'yes' : 'no',
    rating: stars > 0 ? String(stars) : '',
    rating_note: review,
  };

  if (editingItemName) {
    // Update existing
    const idx = allItems.findIndex(i => i.name === editingItemName);
    if (idx >= 0) {
      // Preserve any unknown fields from existing record
      allItems[idx] = { ...allItems[idx], ...newItem };
    } else {
      allItems.push(newItem);
    }
    showToast(`Updated ${name} ✓`);
  } else {
    allItems.push(newItem);
    showToast(`Added ${name} ✓`);
  }

  saveItemsNow();
  editingItemName = null;
  showScreen('screen-configure');
  renderConfigureList();
}

function deleteEditForm() {
  if (!editingItemName) return;
  if (!confirm(`Delete "${editingItemName}" forever? This cannot be undone.`)) return;
  allItems = allItems.filter(i => i.name !== editingItemName);
  saveItemsNow();
  showToast(`Deleted ${editingItemName}`);
  editingItemName = null;
  showScreen('screen-configure');
  renderConfigureList();
}

// Initialize edit form listeners once the DOM is ready
document.addEventListener('DOMContentLoaded', initEditFormListeners);
