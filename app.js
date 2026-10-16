/* ============================================================
   Project Organizer — App
   ============================================================ */

// --- Supabase ---
const SUPABASE_URL = 'https://gvzvoskzaejpoinmcgxz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2enZvc2t6YWVqcG9pbm1jZ3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5NzE0NjAsImV4cCI6MjEwMDU0NzQ2MH0.uVkGf9QRdeewEJFpG6y-MtPDpmiO8RTBnovzyosFuC0';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = (sel) => document.querySelector(sel);
const app = () => document.getElementById('app');

// ============================================================
// TABLE CONFIGURATIONS
// ============================================================
// Field types: text, textarea, select, fk, number
// fk fields: { type:'fk', fkTable, fkLabel } — loads options from related table
// display: array of either plain strings (field keys) or objects { key, label }
//   - plain string: shows the raw value
//   - { key, label }: shows "Label: value"

const NOVEL_TABLES = {
    novel_characters: {
        label: 'Characters', singularLabel: 'Character', icon: '👤',
        display: ['name','main_side','status'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'main_side', label:'Main / Side', type:'select', options:['Main','Side','Minor','Antagonist'] },
            { key:'personality', label:'Personality', type:'textarea' },
            { key:'appearance', label:'Appearance', type:'textarea' },
            { key:'motivation', label:'Motivation', type:'textarea' },
            { key:'role_in_story', label:'Role in Story', type:'textarea' },
            { key:'why_interesting', label:'Why Interesting', type:'textarea' },
            { key:'aliases', label:'Aliases', type:'text' },
            { key:'faction_id', label:'Faction', type:'fk', fkTable:'novel_cultural_factions', fkLabel:'name' },
            { key:'race_id', label:'Race', type:'fk', fkTable:'novel_races', fkLabel:'name' },
            { key:'backstory', label:'Backstory', type:'textarea' },
            { key:'arc_summary', label:'Arc Summary', type:'textarea' },
            { key:'relationships', label:'Relationships', type:'textarea' },
            { key:'first_appearance_id', label:'First Appearance', type:'fk', fkTable:'novel_chapters', fkLabel:'title' },
            { key:'status', label:'Status', type:'select', options:['Alive','Dead','Unknown','Other'] },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    novel_races: {
        label: 'Races', singularLabel: 'Race', icon: '🧬',
        display: ['name'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'description', label:'Description', type:'textarea' },
        ]
    },
    novel_cultural_factions: {
        label: 'Factions', singularLabel: 'Faction', icon: '⚔️',
        display: ['name','type'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'type', label:'Type', type:'text' },
            { key:'description', label:'Description', type:'textarea' },
            { key:'values_beliefs', label:'Values & Beliefs', type:'textarea' },
            { key:'power_structure', label:'Power Structure', type:'textarea' },
            { key:'allies_enemies', label:'Allies & Enemies', type:'textarea' },
            { key:'role_in_story', label:'Role in Story', type:'textarea' },
            { key:'home_location_id', label:'Home Location', type:'fk', fkTable:'novel_world_details', fkLabel:'name' },
        ]
    },
    novel_world_details: {
        label: 'World Details', singularLabel: 'World Detail', icon: '🌍',
        display: ['name','type'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'type', label:'Type', type:'text' },
            { key:'culture', label:'Culture', type:'textarea' },
            { key:'description', label:'Description', type:'textarea' },
            { key:'history', label:'History', type:'textarea' },
            { key:'notable_features', label:'Notable Features', type:'textarea' },
            { key:'faction_id', label:'Controlling Faction', type:'fk', fkTable:'novel_cultural_factions', fkLabel:'name' },
            { key:'related_locations', label:'Related Locations', type:'textarea' },
            { key:'appears_in_chapters', label:'Appears in Chapters', type:'textarea' },
        ]
    },
    novel_magic_systems: {
        label: 'Magic Systems', singularLabel: 'Magic System', icon: '✨',
        display: ['name'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'source', label:'Source', type:'textarea' },
            { key:'who_can_use_it', label:'Who Can Use It', type:'textarea' },
            { key:'cost_fuel', label:'Cost / Fuel', type:'textarea' },
            { key:'limitations', label:'Limitations', type:'textarea' },
            { key:'risks_consequences', label:'Risks & Consequences', type:'textarea' },
            { key:'how_learned', label:'How Learned', type:'textarea' },
            { key:'cultural_perception', label:'Cultural Perception', type:'textarea' },
            { key:'role_in_conflict', label:'Role in Conflict', type:'textarea' },
            { key:'history', label:'History', type:'textarea' },
            { key:'narrative_purpose', label:'Narrative Purpose', type:'textarea' },
            { key:'thematic_ties', label:'Thematic Ties', type:'textarea' },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    novel_abilities: {
        label: 'Abilities', singularLabel: 'Ability', icon: '⚡',
        display: ['name','category','rarity'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'magic_system_id', label:'Magic System', type:'fk', fkTable:'novel_magic_systems', fkLabel:'name' },
            { key:'category', label:'Category', type:'text' },
            { key:'description', label:'Description', type:'textarea' },
            { key:'visual_sensory', label:'Visual / Sensory', type:'textarea' },
            { key:'cost', label:'Cost', type:'text' },
            { key:'limitations', label:'Limitations', type:'textarea' },
            { key:'scaling', label:'Scaling', type:'textarea' },
            { key:'used_by', label:'Used By', type:'text' },
            { key:'first_appearance_id', label:'First Appearance', type:'fk', fkTable:'novel_chapters', fkLabel:'title' },
            { key:'plot_significance', label:'Plot Significance', type:'textarea' },
            { key:'rarity', label:'Rarity', type:'select', options:['Common','Uncommon','Rare','Legendary','Unique'] },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    novel_naming_conventions: {
        label: 'Naming Conventions', singularLabel: 'Naming Convention', icon: '📝',
        display: ['culture_region'],
        fields: [
            { key:'culture_region', label:'Culture / Region', type:'text' },
            { key:'rules', label:'Rules', type:'textarea' },
            { key:'examples', label:'Examples', type:'textarea' },
            { key:'meaning_system', label:'Meaning System', type:'textarea' },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    novel_chapters: {
        label: 'Chapters', singularLabel: 'Chapter', icon: '📖',
        display: ['chapter_number','title','status'],
        fields: [
            { key:'chapter_number', label:'Chapter Number', type:'number' },
            { key:'title', label:'Title', type:'text' },
            { key:'summary', label:'Summary', type:'textarea' },
            { key:'purpose', label:'Purpose', type:'textarea' },
            { key:'why_interesting', label:'Why Interesting', type:'textarea' },
            { key:'location_id', label:'Location', type:'fk', fkTable:'novel_world_details', fkLabel:'name' },
            { key:'pov_character_id', label:'POV Character', type:'fk', fkTable:'novel_characters', fkLabel:'name' },
            { key:'timeline_position', label:'Timeline Position', type:'text' },
            { key:'status', label:'Status', type:'select', options:['Outline','Draft','Revised','Final'] },
            { key:'plot_threads', label:'Plot Threads', type:'textarea' },
        ],
        junctions: [
            { label:'Main Characters', table:'novel_chapter_main_characters', fkSelf:'chapter_id', fkOther:'character_id', otherTable:'novel_characters', otherLabel:'name' },
            { label:'Side Characters', table:'novel_chapter_side_characters', fkSelf:'chapter_id', fkOther:'character_id', otherTable:'novel_characters', otherLabel:'name' },
        ]
    },
    novel_plot_threads: {
        label: 'Plot Threads', singularLabel: 'Plot Thread', icon: '🧵',
        display: ['name','type','status'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'description', label:'Description', type:'textarea' },
            { key:'type', label:'Type', type:'select', options:['Main','Sub','Background','Mystery','Character Arc'] },
            { key:'status', label:'Status', type:'select', options:['Active','Resolved','Dormant','Abandoned'] },
            { key:'introduced_id', label:'Introduced In', type:'fk', fkTable:'novel_chapters', fkLabel:'title' },
            { key:'resolved_id', label:'Resolved In', type:'fk', fkTable:'novel_chapters', fkLabel:'title' },
            { key:'characters_involved', label:'Characters Involved', type:'textarea' },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
};

const SS_TABLES = {
    ss_characters: {
        label: 'Characters', singularLabel: 'Character', icon: '👤',
        display: ['name','default_role'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'personality', label:'Personality', type:'textarea' },
            { key:'motivation', label:'Motivation', type:'textarea' },
            { key:'why_interesting', label:'Why Interesting', type:'textarea' },
            { key:'appearance', label:'Appearance', type:'textarea' },
            { key:'backstory', label:'Backstory', type:'textarea' },
            { key:'aliases', label:'Aliases', type:'text' },
            { key:'traits', label:'Traits', type:'text' },
            { key:'default_role', label:'Default Role', type:'text' },
            { key:'category_id', label:'Category', type:'fk', fkTable:'ss_categories', fkLabel:'name' },
            { key:'voice_mannerisms', label:'Voice & Mannerisms', type:'textarea' },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    ss_categories: {
        label: 'Categories', singularLabel: 'Category', icon: '📂',
        display: ['name','continuity_type'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'description', label:'Description', type:'textarea' },
            { key:'setting', label:'Setting', type:'textarea' },
            { key:'atmosphere_tone', label:'Atmosphere & Tone', type:'textarea' },
            { key:'background_history', label:'Background History', type:'textarea' },
            { key:'common_elements', label:'Common Elements', type:'textarea' },
            { key:'continuity_type', label:'Continuity Type', type:'text' },
            { key:'continuity_notes', label:'Continuity Notes', type:'textarea' },
            { key:'stage_side_characters', label:'Stage Side Characters', type:'textarea' },
            { key:'stage_locations', label:'Stage Locations', type:'textarea' },
            { key:'default_themes_rules', label:'Default Themes / Rules', type:'textarea' },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    ss_themes_rules: {
        label: 'Themes & Rules', singularLabel: 'Theme / Rule', icon: '📐',
        display: ['name','type'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'type', label:'Type', type:'select', options:['Theme','Rule'] },
            { key:'description', label:'Description', type:'textarea' },
            { key:'pattern', label:'Pattern', type:'textarea' },
            { key:'applies_to_categories', label:'Applies To Categories', type:'textarea' },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    ss_stories: {
        label: 'Stories', singularLabel: 'Story', icon: '📄',
        display: ['name', {key:'char_type', label:'Character'}, {key:'loc_type', label:'Location'}],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'char_type', label:'Character Type', type:'text' },
            { key:'loc_type', label:'Location Type', type:'text' },
            { key:'category_id', label:'Category', type:'fk', fkTable:'ss_categories', fkLabel:'name' },
            { key:'status', label:'Status', type:'select', options:['Idea','Outline','Draft','Revised','Final','Published'] },
            { key:'genre', label:'Genre', type:'text' },
            { key:'plot_synopsis', label:'Plot Synopsis', type:'textarea' },
            { key:'standalone', label:'Standalone', type:'select', options:['Yes','No'] },
            { key:'notes', label:'Notes', type:'textarea' },
        ],
        junctions: [
            { label:'Cast', table:'ss_story_cast', fkSelf:'story_id', fkOther:'character_id', otherTable:'ss_characters', otherLabel:'name' },
            { label:'Themes & Rules', table:'ss_story_themes_rules', fkSelf:'story_id', fkOther:'theme_rule_id', otherTable:'ss_themes_rules', otherLabel:'name' },
        ]
    },
};

// ============================================================
// HOME TABLE CONFIGURATIONS
// ============================================================

const HOME_SIMPLE_TABLES = {
    home_areas: {
        label: 'Areas', singularLabel: 'Area', icon: '📍',
        display: ['name'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
        ]
    }
};

const HOME_PROJECT_FIELDS = [
    { key:'name', label:'Name', type:'text', required:true },
    { key:'area_id', label:'Area', type:'fk', fkTable:'home_areas', fkLabel:'name' },
    { key:'type', label:'Type', type:'select', options:['Contractor','Handyman','LT DIY','ST DIY','DIY'] },
    { key:'estimated_cost', label:'Estimated Cost', type:'text' },
    { key:'cost_notes', label:'Cost Notes', type:'textarea' },
    { key:'status', label:'Status', type:'select', options:['Not Started','Planning','Researching','Scheduled','In Progress','On Hold','Complete'] },
    { key:'target_date', label:'Target Date', type:'text' },
    { key:'assigned_to', label:'Assigned To', type:'select', options:['Philip','Phoebe','Both'] },
    { key:'notes', label:'Notes', type:'textarea' },
];

const HOME_MEASUREMENT_FIELDS = [
    { key:'area_id', label:'Area', type:'fk', fkTable:'home_areas', fkLabel:'name' },
    { key:'specific_location', label:'Specific Location', type:'text', required:true },
    { key:'height', label:'Height', type:'text' },
    { key:'width', label:'Width', type:'text' },
    { key:'depth', label:'Depth', type:'text' },
    { key:'notes', label:'Notes', type:'textarea' },
];

const ART_MEASUREMENT_FIELDS = [
    { key:'name', label:'Name', type:'text', required:true },
    { key:'type', label:'Type', type:'select', options:['Frame','Rug','Wall Art','Mirror','Tapestry','Sculpture','Print','Photograph','Clock','Shelf','Other'] },
    { key:'area_id', label:'Area', type:'fk', fkTable:'home_areas', fkLabel:'name' },
    { key:'height', label:'Height', type:'text' },
    { key:'width', label:'Width', type:'text' },
    { key:'depth', label:'Depth', type:'text' },
    { key:'notes', label:'Notes', type:'textarea' },
];

// ============================================================
// ENTERTAINMENT TABLE CONFIGURATIONS
// ============================================================

const ENT_SIMPLE_TABLES = {
    ent_regions: {
        label: 'Regions', singularLabel: 'Region', icon: '🗺️',
        display: ['name','type'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'type', label:'Type', type:'select', options:['Local','Vacation'], required:true },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    ent_neighborhoods: {
        label: 'Areas', singularLabel: 'Area', icon: '📍',
        display: ['name'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'region_id', label:'Region', type:'fk', fkTable:'ent_regions', fkLabel:'name' },
        ]
    },
};

const ENT_PLACE_FIELDS = [
    { key:'name', label:'Name', type:'text', required:true },
    { key:'neighborhood_id', label:'Area', type:'fk', fkTable:'ent_neighborhoods', fkLabel:'name' },
    { key:'address', label:'Address', type:'text' },
    { key:'type', label:'Type', type:'select', options:['Restaurant','Bar','Bar/Cafe','Cocktail Bar','Dance Club','Brewery/Taproom','Wine Bar','Cafe','Bakery','Ice Cream','Food Hall','Live Music Venue','Breakfast'] },
    { key:'food_cost', label:'Food Cost', type:'text' },
    { key:'drink_cost', label:'Drink Cost', type:'text' },
    { key:'ice_type', label:'Type of Ice', type:'select', options:['Small','Moderate Sized','Single Large'] },
    { key:'happy_hour', label:'Happy Hour', type:'text' },
    { key:'gluten_free', label:'Gluten Free', type:'text' },
    { key:'rating', label:'Rating', type:'text' },
    { key:'status', label:'Status', type:'select', options:['Want to Try','Never Been','Not Interested','Been There: Was OK','Been There: Would Go Back','Favorite','Might be Closed','Closed'] },
    { key:'url', label:'Website', type:'text' },
    { key:'notes', label:'Notes', type:'textarea' },
];

// ============================================================
// STATE
// ============================================================

let currentUser = null;
let fkCache = {};  // tableName -> [{id, label}]

// Unsaved form drafts are stored locally in the browser. This protects work
// if iPadOS/Safari actually reloads or discards the page while another app or
// tab is open. Drafts are scoped to the signed-in user and current route.
const FORM_DRAFT_KEY = 'project-organizer-form-draft-v1';

function getFormDraft() {
    try {
        const raw = localStorage.getItem(FORM_DRAFT_KEY);
        if (!raw) return null;
        const draft = JSON.parse(raw);
        if (!draft || draft.userId !== (currentUser?.id || null)) return null;
        return draft;
    } catch (e) {
        return null;
    }
}

function getRouteFormDraft() {
    const draft = getFormDraft();
    if (!draft) return null;
    return draft.hash === location.hash ? draft : null;
}

function sameDraftMeta(a, b) {
    if (!a || !b || a.kind !== b.kind) return false;
    const keys = ['tableName', 'seriesId', 'isNovel', 'editId', 'regionType'];
    return keys.every(key => (a[key] ?? null) === (b[key] ?? null));
}

function clearFormDraft(meta = null) {
    try {
        if (!meta) {
            localStorage.removeItem(FORM_DRAFT_KEY);
            return;
        }
        const draft = getFormDraft();
        if (draft && sameDraftMeta(draft.meta, meta)) {
            localStorage.removeItem(FORM_DRAFT_KEY);
        }
    } catch (e) {}
}

function bindFormDraft(meta, rootSelector = '#form-slot') {
    const root = $(rootSelector);
    if (!root) return;

    const existingDraft = getRouteFormDraft();
    if (existingDraft && sameDraftMeta(existingDraft.meta, meta)) {
        Object.entries(existingDraft.fields || {}).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el && root.contains(el)) el.value = value ?? '';
        });
    }

    const persist = () => {
        const fields = {};
        root.querySelectorAll('input[id], textarea[id], select[id]').forEach(el => {
            fields[el.id] = el.value;
        });
        try {
            localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify({
                userId: currentUser?.id || null,
                hash: location.hash,
                meta,
                fields,
                updatedAt: new Date().toISOString(),
            }));
        } catch (e) {}
    };

    root.querySelectorAll('input[id], textarea[id], select[id]').forEach(el => {
        el.addEventListener('input', persist);
        el.addEventListener('change', persist);
    });

    // Save immediately so even an untouched open Add/Edit form can be restored.
    persist();
}

// ============================================================
// ROUTER
// ============================================================

function getRoute() {
    const hash = location.hash.slice(1) || '';
    const parts = hash.split('/').filter(Boolean);
    return { path: parts, raw: hash };
}

function navigate(hash) { location.hash = hash; }

async function handleRoute() {
    if (!currentUser) { renderLogin(); return; }
    const { path } = getRoute();
    if (path.length === 0) { renderHome(); return; }
    switch (path[0]) {
        case 'writing':       renderWritingHub(); break;
        case 'novels':        renderNovelSeries(); break;
        case 'novel':
            if (path.length >= 3) renderTableView(path[1], path[2], NOVEL_TABLES, true);
            else renderNovelWorkspace(path[1]);
            break;
        case 'short-stories':
            if (path.length >= 2) renderTableView(null, path[1], SS_TABLES, false);
            else renderSSWorkspace();
            break;
        case 'home': renderHomeWorkspace(); break;
        case 'entertainment':
            if (path[1] === 'places') renderPlacesWorkspace();
            else renderEntertainmentHub();
            break;
        default: renderHome();
    }
}

window.addEventListener('hashchange', handleRoute);

// ============================================================
// AUTH
// ============================================================

async function init() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) { currentUser = session.user; }

    // IMPORTANT: Supabase can emit SIGNED_IN again when an already-authenticated
    // browser tab regains focus. Do not redraw the entire app unless the actual
    // signed-in user changes. Redrawing here was closing partially completed
    // Add/Edit forms on iPad when returning from another tab or app.
    sb.auth.onAuthStateChange((event, session) => {
        const previousUserId = currentUser?.id || null;
        const nextUser = session?.user || null;
        currentUser = nextUser;

        if (event === 'SIGNED_OUT') {
            clearFormDraft();
            fkCache = {};
            handleRoute();
            return;
        }

        if (nextUser && nextUser.id !== previousUserId) {
            if (previousUserId) clearFormDraft();
            handleRoute();
        }
    });

    handleRoute();
}

async function login(email, password) {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
}

async function logout() {
    await sb.auth.signOut();
    currentUser = null;
    fkCache = {};
    navigate('');
}

// ============================================================
// DATA HELPERS
// ============================================================

async function fetchRows(table, seriesId) {
    let q = sb.from(table).select('*').order('created_at', { ascending: false });
    if (seriesId) q = q.eq('series_id', seriesId);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
}

async function fetchRow(table, id) {
    const { data, error } = await sb.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}

async function insertRow(table, row) {
    const { data, error } = await sb.from(table).insert(row).select().single();
    if (error) throw error;
    return data;
}

async function updateRow(table, id, updates) {
    updates.updated_at = new Date().toISOString();
    const { data, error } = await sb.from(table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
}

async function deleteRow(table, id) {
    const { error } = await sb.from(table).delete().eq('id', id);
    if (error) throw error;
}

// Junction helpers
async function fetchJunctions(junctionTable, selfKey, selfId, otherTable, otherLabel) {
    const { data, error } = await sb.from(junctionTable).select('*').eq(selfKey, selfId);
    if (error) throw error;
    const otherIds = (data || []).map(r => Object.values(r).find((v, i) => Object.keys(r)[i] !== 'id' && Object.keys(r)[i] !== selfKey));
    if (otherIds.length === 0) return [];
    const { data: others } = await sb.from(otherTable).select('id, ' + otherLabel).in('id', otherIds);
    return others || [];
}

async function addJunction(junctionTable, selfKey, selfId, otherKey, otherId) {
    const row = { [selfKey]: selfId, [otherKey]: otherId };
    const { error } = await sb.from(junctionTable).insert(row);
    if (error) throw error;
}

async function removeJunction(junctionTable, selfKey, selfId, otherKey, otherId) {
    const { error } = await sb.from(junctionTable).delete().eq(selfKey, selfId).eq(otherKey, otherId);
    if (error) throw error;
}

// FK options loader (with cache)
async function loadFkOptions(table, labelField, seriesId) {
    const cacheKey = table + (seriesId || '');
    if (fkCache[cacheKey]) return fkCache[cacheKey];
    let q = sb.from(table).select('id, ' + labelField).order(labelField);
    if (seriesId && !table.startsWith('ss_')) q = q.eq('series_id', seriesId);
    const { data } = await q;
    const opts = (data || []).map(r => ({ value: r.id, label: r[labelField] || '(untitled)' }));
    fkCache[cacheKey] = opts;
    return opts;
}

function clearFkCache() { fkCache = {}; }

// ============================================================
// UI HELPERS
// ============================================================

function toast(msg, type = 'success') {
    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function confirmDialog(title, msg) {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.innerHTML = `
            <div class="dialog">
                <h3>${esc(title)}</h3>
                <p>${esc(msg)}</p>
                <div class="form-actions">
                    <button class="btn btn-secondary" data-action="cancel">Cancel</button>
                    <button class="btn btn-danger" data-action="confirm">Delete</button>
                </div>
            </div>`;
        overlay.querySelector('[data-action="cancel"]').onclick = () => { overlay.remove(); resolve(false); };
        overlay.querySelector('[data-action="confirm"]').onclick = () => { overlay.remove(); resolve(true); };
        document.body.appendChild(overlay);
    });
}

function esc(str) {
    if (str == null) return '';
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
}

function topbar() {
    return `<div class="topbar">
        <span class="topbar-title">Project Organizer</span>
        <div class="topbar-nav">
            <button class="btn btn-secondary btn-sm" onclick="navigate('#')">Home</button>
            <button class="btn btn-secondary btn-sm" onclick="logout()">Log Out</button>
        </div>
    </div>`;
}

function breadcrumb(crumbs) {
    const items = crumbs.map((c, i) => {
        if (i < crumbs.length - 1) return `<a href="${c.href}">${esc(c.label)}</a>`;
        return `<span>${esc(c.label)}</span>`;
    });
    return `<div class="breadcrumbs">${items.join('<span class="sep">›</span>')}</div>`;
}

// ============================================================
// RENDER: LOGIN
// ============================================================

function renderLogin() {
    app().innerHTML = `
    <div class="login-container">
        <div class="login-card">
            <h1>Project Organizer</h1>
            <p class="subtitle">Sign in to manage your projects</p>
            <div id="login-form">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="login-email" autocomplete="email">
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="login-password" autocomplete="current-password">
                </div>
                <div id="login-error" style="color:var(--danger);font-size:0.82rem;margin-bottom:0.8rem;display:none;"></div>
                <button class="btn btn-primary btn-block" id="login-btn">Sign In</button>
            </div>
        </div>
    </div>`;

    const btn = $('#login-btn');
    const doLogin = async () => {
        const email = $('#login-email').value.trim();
        const pw = $('#login-password').value;
        if (!email || !pw) return;
        btn.disabled = true;
        btn.textContent = 'Signing in...';
        try {
            await login(email, pw);
        } catch (e) {
            const errEl = $('#login-error');
            errEl.style.display = 'block';
            errEl.textContent = e.message || 'Login failed';
            btn.disabled = false;
            btn.textContent = 'Sign In';
        }
    };
    btn.onclick = doLogin;
    $('#login-password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
    $('#login-email').addEventListener('keydown', e => { if (e.key === 'Enter') $('#login-password').focus(); });
}

// ============================================================
// RENDER: HOME
// ============================================================

function renderHome() {
    app().innerHTML = topbar() + `
    <div class="page">
        <div class="page-header"><h2>What are you working on?</h2></div>
        <div class="choice-grid">
            <div class="choice-card" onclick="navigate('#writing')">
                <div class="icon">✍️</div>
                <h3>Writing</h3>
                <p>Novels, short stories, world-building</p>
            </div>
            <div class="choice-card" onclick="navigate('#home')">
                <div class="icon">🏠</div>
                <h3>Home</h3>
                <p>Projects, measurements, improvements</p>
            </div>
            <div class="choice-card" onclick="navigate('#entertainment')">
                <div class="icon">🎭</div>
                <h3>Entertainment</h3>
                <p>Local spots, vacation finds, reviews</p>
            </div>
            <div class="choice-card disabled">
                <div class="icon">🎮</div>
                <h3>Game Development</h3>
                <p>Coming soon</p>
            </div>
        </div>
    </div>`;
}

// ============================================================
// RENDER: WRITING HUB
// ============================================================

function renderWritingHub() {
    app().innerHTML = topbar()
        + breadcrumb([{label:'Home',href:'#'},{label:'Writing'}])
        + `<div class="page">
        <div class="page-header"><h2>Writing Projects</h2></div>
        <div class="choice-grid">
            <div class="choice-card" onclick="navigate('#novels')">
                <div class="icon">📚</div>
                <h3>Novels</h3>
                <p>Series, characters, world-building, chapters</p>
            </div>
            <div class="choice-card" onclick="navigate('#short-stories')">
                <div class="icon">📝</div>
                <h3>Short Stories</h3>
                <p>Characters, categories, themes, stories</p>
            </div>
        </div>
    </div>`;
}

// ============================================================
// RENDER: NOVEL SERIES LIST
// ============================================================

async function renderNovelSeries() {
    app().innerHTML = topbar()
        + breadcrumb([{label:'Home',href:'#'},{label:'Writing',href:'#writing'},{label:'Novels'}])
        + `<div class="page"><div class="loading-screen" style="height:auto;min-height:200px;">
            <div class="loading-spinner"></div></div></div>`;

    try {
        const series = await fetchRows('novel_series', null);
        let content = `<div class="page">
            <div class="page-header">
                <h2>Novel Series</h2>
                <button class="btn btn-primary btn-sm" id="add-series-btn">+ New Series</button>
            </div>`;

        if (series.length === 0) {
            content += `<div class="empty-state">
                <div class="icon">📚</div>
                <p>No series yet. Create one to get started.</p>
            </div>`;
        } else {
            content += `<div class="series-list">`;
            for (const s of series) {
                content += `<div class="series-card" onclick="navigate('#novel/${s.id}')">
                    <h3>${esc(s.name)}</h3>
                    <p>${esc(s.description) || 'No description'}</p>
                </div>`;
            }
            content += `</div>`;
        }

        content += `<div id="series-form-slot"></div></div>`;
        const topHTML = topbar() + breadcrumb([{label:'Home',href:'#'},{label:'Writing',href:'#writing'},{label:'Novels'}]);
        app().innerHTML = topHTML + content;

        $('#add-series-btn').onclick = () => {
            const slot = $('#series-form-slot');
            const draftMeta = { kind:'novel-series' };
            if (slot.innerHTML) {
                clearFormDraft(draftMeta);
                slot.innerHTML = '';
                return;
            }
            slot.innerHTML = `
                <div class="form-panel" style="margin-top:1rem;">
                    <h3>New Series</h3>
                    <div class="form-group"><label>Name</label><input type="text" id="ns-name"></div>
                    <div class="form-group"><label>Description</label><textarea id="ns-desc"></textarea></div>
                    <div class="form-actions">
                        <button class="btn btn-secondary btn-sm" id="ns-cancel">Cancel</button>
                        <button class="btn btn-primary btn-sm" id="ns-save">Save</button>
                    </div>
                </div>`;

            bindFormDraft(draftMeta, '#series-form-slot');
            $('#ns-cancel').onclick = () => {
                clearFormDraft(draftMeta);
                slot.innerHTML = '';
            };

            $('#ns-save').onclick = async () => {
                const name = $('#ns-name').value.trim();
                if (!name) { toast('Name is required','error'); return; }
                try {
                    await insertRow('novel_series', { name, description: $('#ns-desc').value.trim() || null });
                    toast('Series created');
                    clearFormDraft(draftMeta);
                    clearFkCache();
                    renderNovelSeries();
                } catch (e) { toast(e.message, 'error'); }
            };
        };

        const savedDraft = getRouteFormDraft();
        if (savedDraft?.meta?.kind === 'novel-series') {
            $('#add-series-btn').click();
        }
    } catch (e) { toast(e.message, 'error'); }
}

// ============================================================
// RENDER: NOVEL WORKSPACE (tabs for one series)
// ============================================================

async function renderNovelWorkspace(seriesId) {
    const tableKeys = Object.keys(NOVEL_TABLES);
    const savedDraft = getRouteFormDraft();
    const draftTable = savedDraft?.meta?.kind === 'generic'
        && savedDraft.meta.isNovel
        && (savedDraft.meta.seriesId ?? null) === (seriesId ?? null)
        && NOVEL_TABLES[savedDraft.meta.tableName]
        ? savedDraft.meta.tableName
        : null;
    const firstTable = draftTable || tableKeys[0];

    let seriesName = 'Series';
    try {
        const s = await fetchRow('novel_series', seriesId);
        seriesName = s.name;
    } catch (e) {}

    app().innerHTML = topbar()
        + breadcrumb([
            {label:'Home',href:'#'},
            {label:'Writing',href:'#writing'},
            {label:'Novels',href:'#novels'},
            {label:seriesName}
        ])
        + `<div class="tab-bar" id="novel-tabs">${tableKeys.map(k =>
            `<button class="tab${k===firstTable?' active':''}" data-table="${k}">${NOVEL_TABLES[k].icon} ${NOVEL_TABLES[k].label}</button>`
        ).join('')}</div>
        <div id="table-content" class="page">
            <div class="loading-screen" style="height:auto;min-height:200px;"><div class="loading-spinner"></div></div>
        </div>`;

    document.querySelectorAll('#novel-tabs .tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('#novel-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadTableList(seriesId, tab.dataset.table, NOVEL_TABLES, true);
        };
    });

    loadTableList(seriesId, firstTable, NOVEL_TABLES, true);
}

// ============================================================
// RENDER: SHORT STORY WORKSPACE
// ============================================================

function renderSSWorkspace() {
    const tableKeys = Object.keys(SS_TABLES);
    const savedDraft = getRouteFormDraft();
    const draftTable = savedDraft?.meta?.kind === 'generic'
        && !savedDraft.meta.isNovel
        && SS_TABLES[savedDraft.meta.tableName]
        ? savedDraft.meta.tableName
        : null;
    const firstTable = draftTable || tableKeys[0];

    app().innerHTML = topbar()
        + breadcrumb([{label:'Home',href:'#'},{label:'Writing',href:'#writing'},{label:'Short Stories'}])
        + `<div class="tab-bar" id="ss-tabs">${tableKeys.map(k =>
            `<button class="tab${k===firstTable?' active':''}" data-table="${k}">${SS_TABLES[k].icon} ${SS_TABLES[k].label}</button>`
        ).join('')}</div>
        <div id="table-content" class="page">
            <div class="loading-screen" style="height:auto;min-height:200px;"><div class="loading-spinner"></div></div>
        </div>`;

    document.querySelectorAll('#ss-tabs .tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('#ss-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            loadTableList(null, tab.dataset.table, SS_TABLES, false);
        };
    });

    loadTableList(null, firstTable, SS_TABLES, false);
}

// ============================================================
// GENERIC: TABLE LIST VIEW
// ============================================================

async function loadTableList(seriesId, tableName, tableConfigs, isNovel) {
    const container = $('#table-content');
    const config = tableConfigs[tableName];
    container.innerHTML = `<div class="loading-screen" style="height:auto;min-height:150px;"><div class="loading-spinner"></div></div>`;

    try {
        const rows = await fetchRows(tableName, isNovel ? seriesId : null);

        // For the short-story Characters list, resolve the character's primary
        // category so the category name can be shown instead of its raw ID.
        const characterCategoryMap = {};
        if (tableName === 'ss_characters' && rows.length > 0) {
            const categoryIds = [...new Set(rows.map(row => row.category_id).filter(Boolean))];

            if (categoryIds.length > 0) {
                const { data: categories, error: categoryError } = await sb
                    .from('ss_categories')
                    .select('id, name')
                    .in('id', categoryIds);
                if (categoryError) throw categoryError;

                (categories || []).forEach(category => {
                    characterCategoryMap[category.id] = category.name || '(untitled)';
                });
            }
        }

        // For the short-story Stories list, load all assigned cast members in
        // bulk so their names can be shown at a glance without opening each story.
        const storyCastMap = {};
        if (tableName === 'ss_stories' && rows.length > 0) {
            const storyIds = rows.map(r => r.id);
            const { data: castLinks, error: castError } = await sb
                .from('ss_story_cast')
                .select('story_id, character_id')
                .in('story_id', storyIds);
            if (castError) throw castError;

            const characterIds = [...new Set((castLinks || []).map(link => link.character_id).filter(Boolean))];
            const characterMap = {};

            if (characterIds.length > 0) {
                const { data: characters, error: characterError } = await sb
                    .from('ss_characters')
                    .select('id, name')
                    .in('id', characterIds);
                if (characterError) throw characterError;
                (characters || []).forEach(character => {
                    characterMap[character.id] = character.name || '(untitled)';
                });
            }

            (castLinks || []).forEach(link => {
                const characterName = characterMap[link.character_id];
                if (!characterName) return;
                if (!storyCastMap[link.story_id]) storyCastMap[link.story_id] = [];
                if (!storyCastMap[link.story_id].includes(characterName)) {
                    storyCastMap[link.story_id].push(characterName);
                }
            });

            Object.values(storyCastMap).forEach(names => {
                names.sort((a, b) => a.localeCompare(b));
            });
        }

        let html = `<div class="page-header">
            <h2>${config.icon} ${config.label}</h2>
            <button class="btn btn-primary btn-sm" id="add-entry-btn">+ Add ${config.singularLabel || config.label}</button>
        </div>
        <div id="form-slot"></div>`;

        if (rows.length === 0) {
            html += `<div class="empty-state">
                <div class="icon">${config.icon}</div>
                <p>No ${config.label.toLowerCase()} yet.</p>
            </div>`;
        } else {
            html += `<div class="entry-list">`;
            for (const row of rows) {
                // Build display: first item is the name, rest go to meta line.
                // Short-story Characters get highlighted Role/Category tags
                // rather than the normal plain metadata line.
                const firstKey = typeof config.display[0] === 'string'
                    ? config.display[0]
                    : config.display[0].key;

                const nameVal = esc(row[firstKey]) || '(untitled)';
                const isShortStoryCharacter = tableName === 'ss_characters';

                const metaParts = config.display.slice(1)
                    .map(d => {
                        if (typeof d === 'string') {
                            return row[d] ? esc(row[d]) : null;
                        }
                        // Object with { key, label } — show "Label: value"
                        return row[d.key] ? `${esc(d.label)}: ${esc(row[d.key])}` : null;
                    })
                    .filter(Boolean);

                const meta = isShortStoryCharacter ? '' : metaParts.join(' · ');
                const characterRole = isShortStoryCharacter ? row.default_role : null;
                const characterCategory = isShortStoryCharacter && row.category_id
                    ? characterCategoryMap[row.category_id]
                    : null;
                const castNames = tableName === 'ss_stories' ? (storyCastMap[row.id] || []) : null;

                html += `<div class="entry-card" data-id="${row.id}">
                    <div>
                        <div class="entry-name">${nameVal}</div>
                        ${meta ? `<div class="entry-meta">${meta}</div>` : ''}
                        ${isShortStoryCharacter && (characterRole || characterCategory) ? `
                            <div class="entry-meta ss-character-tags">
                                ${characterRole ? `<span class="ss-meta-tag">Role: ${esc(characterRole)}</span>` : ''}
                                ${characterCategory ? `<span class="ss-meta-tag">Category: ${esc(characterCategory)}</span>` : ''}
                            </div>` : ''}
                        ${castNames ? `
                            <div class="entry-meta">
                                ${castNames.length
                                    ? `<span class="ss-cast-tag">Cast: ${castNames.map(name => esc(name)).join(', ')}</span>`
                                    : 'Cast: —'}
                            </div>` : ''}
                    </div>
                    <div class="entry-actions">
                        <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
                        <button class="btn btn-danger btn-sm del-btn">Delete</button>
                    </div>
                </div>`;
            }
            html += `</div>`;
        }

        container.innerHTML = html;

        // Add button
        $('#add-entry-btn').onclick = () => {
            showForm(seriesId, tableName, tableConfigs, isNovel, null);
        };

        // Edit buttons
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = btn.closest('.entry-card').dataset.id;
                showForm(seriesId, tableName, tableConfigs, isNovel, id);
            };
        });

        // Delete buttons
        container.querySelectorAll('.del-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const id = btn.closest('.entry-card').dataset.id;
                const yes = await confirmDialog('Delete Entry', 'This will permanently delete this entry. Are you sure?');
                if (!yes) return;
                try {
                    await deleteRow(tableName, id);
                    toast('Deleted');
                    clearFkCache();
                    loadTableList(seriesId, tableName, tableConfigs, isNovel);
                } catch (err) { toast(err.message, 'error'); }
            };
        });

        // If iPadOS/Safari actually reloaded the page, reopen the form that was
        // active on this route and restore its locally saved field values.
        const savedDraft = getRouteFormDraft();
        if (savedDraft?.meta?.kind === 'generic'
            && savedDraft.meta.tableName === tableName
            && (savedDraft.meta.seriesId ?? null) === (seriesId ?? null)
            && !!savedDraft.meta.isNovel === !!isNovel) {
            showForm(seriesId, tableName, tableConfigs, isNovel, savedDraft.meta.editId ?? null);
        }
    } catch (e) {
        container.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
    }
}

// ============================================================
// GENERIC: FORM (Add / Edit)
// ============================================================

async function showForm(seriesId, tableName, tableConfigs, isNovel, editId) {
    const config = tableConfigs[tableName];
    const slot = $('#form-slot');
    const draftMeta = {
        kind: 'generic',
        tableName,
        seriesId: seriesId ?? null,
        isNovel: !!isNovel,
        editId: editId ?? null,
    };
    slot.innerHTML = `<div class="form-panel"><div class="loading-screen" style="height:auto;min-height:80px;"><div class="loading-spinner"></div></div></div>`;

    let existing = null;
    if (editId) {
        try {
            existing = await fetchRow(tableName, editId);
        } catch (e) {
            toast(e.message, 'error');
            slot.innerHTML = '';
            return;
        }
    }

    // Preload FK options
    const fkLoads = {};
    for (const f of config.fields) {
        if (f.type === 'fk') {
            fkLoads[f.key] = await loadFkOptions(f.fkTable, f.fkLabel, seriesId);
        }
    }

    const title = editId ? `Edit ${config.singularLabel || config.label}` : `New ${config.singularLabel || config.label}`;
    let html = `<div class="form-panel"><h3>${title}</h3>`;

    for (const f of config.fields) {
        const val = existing ? (existing[f.key] ?? '') : '';
        html += `<div class="form-group"><label>${esc(f.label)}${f.required ? ' *' : ''}</label>`;
        if (f.type === 'textarea') {
            html += `<textarea id="field-${f.key}">${esc(val)}</textarea>`;
        } else if (f.type === 'select') {
            html += `<select id="field-${f.key}">
                <option value="">— Select —</option>
                ${f.options.map(o => `<option value="${esc(o)}"${val===o?' selected':''}>${esc(o)}</option>`).join('')}
            </select>`;
        } else if (f.type === 'fk') {
            const opts = fkLoads[f.key] || [];
            html += `<select id="field-${f.key}">
                <option value="">— None —</option>
                ${opts.map(o => `<option value="${o.value}"${val===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}
            </select>`;
        } else if (f.type === 'number') {
            html += `<input type="number" id="field-${f.key}" value="${esc(val)}">`;
        } else {
            html += `<input type="text" id="field-${f.key}" value="${esc(val)}">`;
        }
        html += `</div>`;
    }

    html += `<div class="form-actions">
        <button class="btn btn-secondary btn-sm" id="form-cancel">Cancel</button>
        <button class="btn btn-primary btn-sm" id="form-save">${editId ? 'Update' : 'Create'}</button>
    </div></div>`;

    // Junction sections (only for edit)
    if (editId && config.junctions) {
        html += `<div id="junction-slot"></div>`;
    }

    slot.innerHTML = html;
    bindFormDraft(draftMeta);
    slot.scrollIntoView({ behavior: 'smooth', block: 'start' });

    $('#form-cancel').onclick = () => {
        clearFormDraft(draftMeta);
        slot.innerHTML = '';
    };
    $('#form-save').onclick = async () => {
        const row = {};
        for (const f of config.fields) {
            let v = $(`#field-${f.key}`)?.value ?? '';
            if (f.type === 'number') v = v ? parseInt(v, 10) : null;
            else if (f.type === 'fk') v = v || null;
            else if (f.type === 'select') v = v || null;
            else v = v.trim() || null;
            if (f.required && !v) { toast(`${f.label} is required`, 'error'); return; }
            row[f.key] = v;
        }
        if (isNovel && seriesId) row.series_id = seriesId;

        try {
            if (editId) {
                await updateRow(tableName, editId, row);
                toast('Updated');
            } else {
                await insertRow(tableName, row);
                toast('Created');
            }
            clearFormDraft(draftMeta);
            clearFkCache();
            slot.innerHTML = '';
            loadTableList(seriesId, tableName, tableConfigs, isNovel);
        } catch (e) { toast(e.message, 'error'); }
    };

    // Load junction sections if editing
    if (editId && config.junctions) {
        loadJunctions(seriesId, editId, config.junctions);
    }
}

// ============================================================
// GENERIC: JUNCTION MANAGEMENT
// ============================================================

async function loadJunctions(seriesId, parentId, junctions) {
    const slot = $('#junction-slot');
    if (!slot) return;
    let html = '';

    for (const j of junctions) {
        const { data: links } = await sb.from(j.table).select('*').eq(j.fkSelf, parentId);
        const linkedIds = (links || []).map(l => l[j.fkOther]);

        let linkedItems = [];
        if (linkedIds.length > 0) {
            const { data } = await sb.from(j.otherTable).select('id, ' + j.otherLabel).in('id', linkedIds);
            linkedItems = data || [];
        }

        const allOpts = await loadFkOptions(j.otherTable, j.otherLabel, seriesId);
        const available = allOpts.filter(o => !linkedIds.includes(o.value));

        html += `<div class="junction-section" data-junction="${j.table}">
            <h4>${j.label}</h4>
            <div class="junction-tags">
                ${linkedItems.map(item => `
                    <span class="junction-tag">
                        ${esc(item[j.otherLabel])}
                        <span class="remove-tag" data-jt="${j.table}" data-self="${j.fkSelf}" data-pid="${parentId}" data-other="${j.fkOther}" data-oid="${item.id}">&times;</span>
                    </span>`).join('')}
                ${linkedItems.length === 0 ? '<span style="color:var(--text-muted);font-size:0.82rem;">None linked</span>' : ''}
            </div>
            ${available.length > 0 ? `
            <div class="junction-add">
                <select class="junction-select" data-jt="${j.table}">
                    <option value="">Add ${j.label}...</option>
                    ${available.map(o => `<option value="${o.value}">${esc(o.label)}</option>`).join('')}
                </select>
                <button class="btn btn-secondary btn-sm junction-add-btn" data-jt="${j.table}" data-self="${j.fkSelf}" data-pid="${parentId}" data-other="${j.fkOther}">Add</button>
            </div>` : ''}
        </div>`;
    }

    slot.innerHTML = html;

    slot.querySelectorAll('.remove-tag').forEach(tag => {
        tag.onclick = async () => {
            try {
                await removeJunction(tag.dataset.jt, tag.dataset.self, tag.dataset.pid, tag.dataset.other, tag.dataset.oid);
                toast('Removed');
                clearFkCache();
                loadJunctions(seriesId, parentId, junctions);
            } catch (e) { toast(e.message, 'error'); }
        };
    });

    slot.querySelectorAll('.junction-add-btn').forEach(btn => {
        btn.onclick = async () => {
            const sel = slot.querySelector(`.junction-select[data-jt="${btn.dataset.jt}"]`);
            if (!sel.value) return;
            try {
                await addJunction(btn.dataset.jt, btn.dataset.self, btn.dataset.pid, btn.dataset.other, sel.value);
                toast('Added');
                clearFkCache();
                loadJunctions(seriesId, parentId, junctions);
            } catch (e) { toast(e.message, 'error'); }
        };
    });
}

// ============================================================
// UNUSED ROUTE HANDLER (placeholder for direct table deep-links)
// ============================================================

function renderTableView(seriesId, tableName, tableConfigs, isNovel) {
    if (isNovel && seriesId) {
        renderNovelWorkspace(seriesId);
    } else {
        renderSSWorkspace();
    }
}

// ============================================================
// HOME SECTION — HELPERS
// ============================================================

function getStatusClass(status) {
    switch (status) {
        case 'Complete': return 'status-complete';
        case 'In Progress': return 'status-active';
        case 'Scheduled': return 'status-scheduled';
        case 'Planning':
        case 'Researching': return 'status-planning';
        case 'On Hold': return 'status-hold';
        default: return 'status-default';
    }
}

function getPlaceStatusClass(status) {
    switch (status) {
        case 'Want to Try': return 'place-status-want-to-try';
        case 'Never Been': return 'place-status-never-been';
        case 'Not Interested': return 'place-status-not-interested';
        case 'Been There: Was OK': return 'place-status-was-ok';
        case 'Been There: Would Go Back': return 'place-status-would-go-back';
        case 'Favorite': return 'place-status-favorite';
        case 'Might be Closed': return 'place-status-might-be-closed';
        case 'Closed': return 'place-status-closed';
        default: return 'place-status-default';
    }
}

// ============================================================
// RENDER: HOME WORKSPACE
// ============================================================

function renderHomeWorkspace() {
    const tabs = [
        { key:'projects', icon:'🏗️', label:'Projects' },
        { key:'measurements', icon:'📏', label:'House Measurements' },
        { key:'art-measurements', icon:'🖼️', label:'Art Measurements' },
        { key:'areas', icon:'📍', label:'Areas' },
    ];
    const savedDraft = getRouteFormDraft();
    let initialTab = 'projects';
    if (savedDraft?.meta?.kind === 'home-measurement') initialTab = 'measurements';
    else if (savedDraft?.meta?.kind === 'art-measurement') initialTab = 'art-measurements';
    else if (savedDraft?.meta?.kind === 'generic' && savedDraft.meta.tableName === 'home_areas') initialTab = 'areas';

    app().innerHTML = topbar()
        + breadcrumb([{label:'Home',href:'#'},{label:'Home'}])
        + `<div class="tab-bar" id="home-tabs">${tabs.map(t =>
            `<button class="tab${t.key===initialTab?' active':''}" data-tab="${t.key}">${t.icon} ${t.label}</button>`
        ).join('')}</div>
        <div id="table-content" class="page">
            <div class="loading-screen" style="height:auto;min-height:200px;"><div class="loading-spinner"></div></div>
        </div>`;

    document.querySelectorAll('#home-tabs .tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('#home-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const key = tab.dataset.tab;
            if (key === 'projects') loadHomeProjects();
            else if (key === 'measurements') loadHomeMeasurements();
            else if (key === 'art-measurements') loadArtMeasurements();
            else loadTableList(null, 'home_areas', HOME_SIMPLE_TABLES, false);
        };
    });

    if (initialTab === 'projects') loadHomeProjects();
    else if (initialTab === 'measurements') loadHomeMeasurements();
    else if (initialTab === 'art-measurements') loadArtMeasurements();
    else loadTableList(null, 'home_areas', HOME_SIMPLE_TABLES, false);
}

// ============================================================
// HOME: PROJECT LIST
// ============================================================

async function loadHomeProjects() {
    const container = $('#table-content');
    container.innerHTML = `<div class="loading-screen" style="height:auto;min-height:150px;"><div class="loading-spinner"></div></div>`;

    try {
        const { data: projects, error: pErr } = await sb.from('home_projects').select('*').order('name');
        if (pErr) throw pErr;

        const { data: areas } = await sb.from('home_areas').select('id, name').order('name');
        const areaMap = {};
        (areas || []).forEach(a => { areaMap[a.id] = a.name; });

        let html = `<div class="page-header">
            <h2>🏗️ Projects</h2>
            <button class="btn btn-primary btn-sm" id="add-project-btn">+ Add Project</button>
        </div>
        <div class="home-filters">
            <select id="filter-status">
                <option value="">All Statuses</option>
                ${['Not Started','Planning','Researching','Scheduled','In Progress','On Hold','Complete'].map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
            <select id="filter-area">
                <option value="">All Areas</option>
                ${(areas||[]).map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('')}
            </select>
            <select id="filter-type">
                <option value="">All Types</option>
                ${['Contractor','Handyman','LT DIY','ST DIY','DIY'].map(t => `<option value="${t}">${t}</option>`).join('')}
            </select>
        </div>
        <div id="form-slot"></div>`;

        if (!projects || projects.length === 0) {
            html += `<div class="empty-state"><div class="icon">🏗️</div><p>No projects yet.</p></div>`;
        } else {
            html += `<div class="entry-list" id="project-list">`;
            for (const p of projects) {
                const areaName = p.area_id ? (areaMap[p.area_id] || 'Unknown') : 'Unassigned';
                const statusClass = getStatusClass(p.status);
                html += `<div class="entry-card" data-id="${p.id}" data-status="${esc(p.status||'')}" data-area="${p.area_id||''}" data-type="${esc(p.type||'')}">
                    <div>
                        <div class="entry-name">${esc(p.name)}</div>
                        <div class="entry-meta">
                            <span class="status-badge ${statusClass}">${esc(p.status)}</span>
                            ${p.type ? ' · ' + esc(p.type) : ''}
                            · ${esc(areaName)}
                            ${p.estimated_cost ? ' · ' + esc(p.estimated_cost) : ''}
                            ${p.assigned_to ? ' · ' + esc(p.assigned_to) : ''}
                        </div>
                    </div>
                    <div class="entry-actions">
                        <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
                        <button class="btn btn-danger btn-sm del-btn">Delete</button>
                    </div>
                </div>`;
            }
            html += `</div>`;
        }

        container.innerHTML = html;

        const applyFilters = () => {
            const sv = $('#filter-status')?.value || '';
            const av = $('#filter-area')?.value || '';
            const tv = $('#filter-type')?.value || '';
            container.querySelectorAll('#project-list .entry-card').forEach(card => {
                const ok = (!sv || card.dataset.status === sv)
                        && (!av || card.dataset.area === av)
                        && (!tv || card.dataset.type === tv);
                card.style.display = ok ? '' : 'none';
            });
        };

        ['#filter-status','#filter-area','#filter-type'].forEach(s => {
            if ($(s)) $(s).onchange = applyFilters;
        });

        $('#add-project-btn').onclick = () => showHomeProjectForm(null);
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); showHomeProjectForm(btn.closest('.entry-card').dataset.id); };
        });
        container.querySelectorAll('.del-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const yes = await confirmDialog('Delete Project', 'This will permanently delete this project and all its steps and notes. Are you sure?');
                if (!yes) return;
                try {
                    await deleteRow('home_projects', btn.closest('.entry-card').dataset.id);
                    toast('Deleted');
                    loadHomeProjects();
                } catch (err) { toast(err.message, 'error'); }
            };
        });
        const savedDraft = getRouteFormDraft();
        if (savedDraft?.meta?.kind === 'home-project') {
            showHomeProjectForm(savedDraft.meta.editId ?? null);
        }
    } catch (e) {
        container.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
    }
}

// ============================================================
// HOME: PROJECT FORM (Add / Edit) + STEPS + NOTES
// ============================================================

async function showHomeProjectForm(editId) {
    const slot = $('#form-slot');
    const draftMeta = { kind:'home-project', editId: editId ?? null };
    slot.innerHTML = `<div class="form-panel"><div class="loading-screen" style="height:auto;min-height:80px;"><div class="loading-spinner"></div></div></div>`;

    let existing = null;
    if (editId) {
        try {
            existing = await fetchRow('home_projects', editId);
        } catch (e) {
            toast(e.message, 'error');
            slot.innerHTML = '';
            return;
        }
    }

    const areaOpts = await loadFkOptions('home_areas', 'name', null);
    const title = editId ? 'Edit Project' : 'New Project';
    let html = `<div class="form-panel"><h3>${title}</h3>`;

    for (const f of HOME_PROJECT_FIELDS) {
        const val = existing ? (existing[f.key] ?? '') : '';
        html += `<div class="form-group"><label>${esc(f.label)}${f.required ? ' *' : ''}</label>`;
        if (f.type === 'textarea') {
            html += `<textarea id="field-${f.key}">${esc(val)}</textarea>`;
        } else if (f.type === 'select') {
            html += `<select id="field-${f.key}"><option value="">— Select —</option>
                ${f.options.map(o => `<option value="${esc(o)}"${val===o?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
        } else if (f.type === 'fk') {
            html += `<select id="field-${f.key}"><option value="">— None —</option>
                ${areaOpts.map(o => `<option value="${o.value}"${val===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select>`;
        } else {
            html += `<input type="text" id="field-${f.key}" value="${esc(val)}">`;
        }
        html += `</div>`;
    }

    html += `<div class="form-actions">
        <button class="btn btn-secondary btn-sm" id="form-cancel">Cancel</button>
        <button class="btn btn-primary btn-sm" id="form-save">${editId ? 'Update' : 'Create'}</button>
    </div></div>`;

    if (editId) html += `<div id="steps-slot"></div><div id="notes-slot"></div>`;

    slot.innerHTML = html;
    bindFormDraft(draftMeta);
    slot.scrollIntoView({ behavior: 'smooth', block: 'start' });

    $('#form-cancel').onclick = () => { clearFormDraft(draftMeta); slot.innerHTML = ''; };
    $('#form-save').onclick = async () => {
        const row = {};
        for (const f of HOME_PROJECT_FIELDS) {
            let v = $(`#field-${f.key}`)?.value ?? '';
            if (f.type === 'fk' || f.type === 'select') v = v || null;
            else v = v.trim() || null;
            if (f.required && !v) { toast(`${f.label} is required`, 'error'); return; }
            row[f.key] = v;
        }
        try {
            if (editId) { await updateRow('home_projects', editId, row); toast('Updated'); }
            else { await insertRow('home_projects', row); toast('Created'); }
            clearFormDraft(draftMeta);
            clearFkCache();
            slot.innerHTML = '';
            loadHomeProjects();
        } catch (e) { toast(e.message, 'error'); }
    };

    if (editId) {
        loadProjectSteps(editId);
        loadProjectNotes(editId);
    }
}

// ============================================================
// HOME: PROJECT STEPS
// ============================================================

async function loadProjectSteps(projectId) {
    const slot = $('#steps-slot');
    if (!slot) return;

    try {
        const { data: steps, error } = await sb.from('home_project_steps')
            .select('*').eq('project_id', projectId).order('sort_order');
        if (error) throw error;

        let html = `<div class="sub-section"><h4>Steps</h4><div class="steps-list">`;
        if (steps && steps.length > 0) {
            for (const s of steps) {
                const statusClass = s.status === 'Complete' ? 'step-complete'
                    : s.status === 'In Progress' ? 'step-active'
                    : s.status === 'Skipped' ? 'step-skipped'
                    : 'step-pending';
                html += `<div class="step-card ${statusClass}" data-step-id="${s.id}">
                    <div class="step-info">
                        <span class="step-order">${s.sort_order != null ? s.sort_order : ''}</span>
                        <span class="step-desc">${esc(s.description)}</span>
                    </div>
                    <div class="step-controls">
                        <select class="step-status-select" data-step-id="${s.id}">
                            ${['Pending','In Progress','Complete','Skipped'].map(st =>
                                `<option value="${st}"${s.status===st?' selected':''}>${st}</option>`
                            ).join('')}
                        </select>
                        <input type="date" class="step-date-input" data-step-id="${s.id}" value="${s.date || ''}">
                        <button class="btn btn-danger btn-sm step-del" data-step-id="${s.id}">&times;</button>
                    </div>
                </div>`;
            }
        } else {
            html += `<p style="color:var(--text-muted);font-size:0.82rem;">No steps yet.</p>`;
        }

        html += `</div>
            <div class="step-add-form">
                <input type="text" id="new-step-desc" placeholder="New step description...">
                <input type="number" id="new-step-order" placeholder="#" style="width:60px;" value="${steps ? steps.length + 1 : 1}">
                <button class="btn btn-secondary btn-sm" id="add-step-btn">Add Step</button>
            </div></div>`;

        slot.innerHTML = html;

        slot.querySelectorAll('.step-status-select').forEach(sel => {
            sel.onchange = async () => {
                try {
                    const { error } = await sb.from('home_project_steps').update({ status: sel.value }).eq('id', sel.dataset.stepId);
                    if (error) throw error;
                    toast('Step updated');
                    loadProjectSteps(projectId);
                } catch (e) { toast(e.message, 'error'); }
            };
        });

        slot.querySelectorAll('.step-date-input').forEach(inp => {
            inp.onchange = async () => {
                try {
                    const { error } = await sb.from('home_project_steps').update({ date: inp.value || null }).eq('id', inp.dataset.stepId);
                    if (error) throw error;
                    toast('Date updated');
                } catch (e) { toast(e.message, 'error'); }
            };
        });

        slot.querySelectorAll('.step-del').forEach(btn => {
            btn.onclick = async () => {
                try {
                    const { error } = await sb.from('home_project_steps').delete().eq('id', btn.dataset.stepId);
                    if (error) throw error;
                    toast('Step removed');
                    loadProjectSteps(projectId);
                } catch (e) { toast(e.message, 'error'); }
            };
        });

        $('#add-step-btn').onclick = async () => {
            const desc = $('#new-step-desc').value.trim();
            if (!desc) { toast('Description required', 'error'); return; }
            const order = parseInt($('#new-step-order').value, 10) || (steps ? steps.length + 1 : 1);
            try {
                const { error } = await sb.from('home_project_steps')
                    .insert({ project_id: projectId, description: desc, sort_order: order });
                if (error) throw error;
                toast('Step added');
                loadProjectSteps(projectId);
            } catch (e) { toast(e.message, 'error'); }
        };
    } catch (e) {
        slot.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
    }
}

// ============================================================
// HOME: PROJECT NOTES
// ============================================================

async function loadProjectNotes(projectId) {
    const slot = $('#notes-slot');
    if (!slot) return;

    try {
        const { data: notes, error } = await sb.from('home_project_notes')
            .select('*').eq('project_id', projectId).order('date', { ascending: false });
        if (error) throw error;

        let html = `<div class="sub-section"><h4>Notes Log</h4>
            <div class="note-add-form">
                <textarea id="new-note-content" placeholder="Add a note..."></textarea>
                <button class="btn btn-secondary btn-sm" id="add-note-btn">Add Note</button>
            </div>
            <div class="notes-list">`;

        if (notes && notes.length > 0) {
            for (const n of notes) {
                const dateStr = n.date ? new Date(n.date).toLocaleDateString() : '';
                html += `<div class="note-card" data-note-id="${n.id}">
                    <div class="note-content">${esc(n.content)}</div>
                    <div class="note-footer">
                        <span class="note-date">${dateStr}</span>
                        <div class="note-actions">
                            <button class="btn btn-secondary btn-sm note-edit" data-note-id="${n.id}">Edit</button>
                            <button class="btn btn-danger btn-sm note-del" data-note-id="${n.id}">&times;</button>
                        </div>
                    </div>
                </div>`;
            }
        } else {
            html += `<p style="color:var(--text-muted);font-size:0.82rem;">No notes yet.</p>`;
        }

        html += `</div></div>`;
        slot.innerHTML = html;

        $('#add-note-btn').onclick = async () => {
            const content = $('#new-note-content').value.trim();
            if (!content) { toast('Note content required', 'error'); return; }
            try {
                const { error } = await sb.from('home_project_notes')
                    .insert({ project_id: projectId, content });
                if (error) throw error;
                toast('Note added');
                loadProjectNotes(projectId);
            } catch (e) { toast(e.message, 'error'); }
        };

        slot.querySelectorAll('.note-edit').forEach(btn => {
            btn.onclick = () => {
                const card = btn.closest('.note-card');
                const contentEl = card.querySelector('.note-content');
                const current = contentEl.textContent;
                contentEl.innerHTML = `<textarea class="note-edit-area">${esc(current)}</textarea>
                    <div style="margin-top:0.4rem;">
                        <button class="btn btn-primary btn-sm note-save" data-note-id="${btn.dataset.noteId}">Save</button>
                        <button class="btn btn-secondary btn-sm note-cancel">Cancel</button>
                    </div>`;

                card.querySelector('.note-cancel').onclick = () => loadProjectNotes(projectId);
                card.querySelector('.note-save').onclick = async () => {
                    const newContent = card.querySelector('.note-edit-area').value.trim();
                    if (!newContent) { toast('Content required', 'error'); return; }
                    try {
                        const { error } = await sb.from('home_project_notes')
                            .update({ content: newContent, updated_at: new Date().toISOString() })
                            .eq('id', btn.dataset.noteId);
                        if (error) throw error;
                        toast('Note updated');
                        loadProjectNotes(projectId);
                    } catch (e) { toast(e.message, 'error'); }
                };
            };
        });

        slot.querySelectorAll('.note-del').forEach(btn => {
            btn.onclick = async () => {
                try {
                    const { error } = await sb.from('home_project_notes').delete().eq('id', btn.dataset.noteId);
                    if (error) throw error;
                    toast('Note removed');
                    loadProjectNotes(projectId);
                } catch (e) { toast(e.message, 'error'); }
            };
        });
    } catch (e) {
        slot.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
    }
}

// ============================================================
// HOME: MEASUREMENT LIST
// ============================================================

async function loadHomeMeasurements() {
    const container = $('#table-content');
    container.innerHTML = `<div class="loading-screen" style="height:auto;min-height:150px;"><div class="loading-spinner"></div></div>`;

    try {
        const { data: measurements, error: mErr } = await sb.from('home_measurements')
            .select('*').order('specific_location');
        if (mErr) throw mErr;

        const { data: areas } = await sb.from('home_areas').select('id, name').order('name');
        const areaMap = {};
        (areas || []).forEach(a => { areaMap[a.id] = a.name; });

        let html = `<div class="page-header">
            <h2>📏 House Measurements</h2>
            <button class="btn btn-primary btn-sm" id="add-measurement-btn">+ Add Measurement</button>
        </div>
        <div class="home-filters">
            <select id="filter-m-area">
                <option value="">All Areas</option>
                ${(areas||[]).map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('')}
            </select>
        </div>
        <div id="form-slot"></div>`;

        if (!measurements || measurements.length === 0) {
            html += `<div class="empty-state"><div class="icon">📏</div><p>No measurements yet.</p></div>`;
        } else {
            html += `<div class="entry-list" id="measurement-list">`;
            for (const m of measurements) {
                const areaName = m.area_id ? (areaMap[m.area_id] || 'Unknown') : 'Unassigned';
                const dims = [
                    m.height ? 'H: ' + esc(m.height) : null,
                    m.width ? 'W: ' + esc(m.width) : null,
                    m.depth ? 'D: ' + esc(m.depth) : null,
                ].filter(Boolean).join(' · ');

                html += `<div class="entry-card" data-id="${m.id}" data-area="${m.area_id||''}">
                    <div>
                        <div class="entry-name">${esc(m.specific_location)}</div>
                        <div class="entry-meta">${esc(areaName)}${dims ? ' · ' + dims : ''}${m.notes ? ' · ' + esc(m.notes) : ''}</div>
                    </div>
                    <div class="entry-actions">
                        <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
                        <button class="btn btn-danger btn-sm del-btn">Delete</button>
                    </div>
                </div>`;
            }
            html += `</div>`;
        }

        container.innerHTML = html;

        if ($('#filter-m-area')) {
            $('#filter-m-area').onchange = () => {
                const val = $('#filter-m-area').value;
                container.querySelectorAll('#measurement-list .entry-card').forEach(card => {
                    card.style.display = (!val || card.dataset.area === val) ? '' : 'none';
                });
            };
        }

        $('#add-measurement-btn').onclick = () => showHomeMeasurementForm(null);
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); showHomeMeasurementForm(btn.closest('.entry-card').dataset.id); };
        });
        container.querySelectorAll('.del-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const yes = await confirmDialog('Delete Measurement', 'Delete this measurement?');
                if (!yes) return;
                try {
                    await deleteRow('home_measurements', btn.closest('.entry-card').dataset.id);
                    toast('Deleted');
                    loadHomeMeasurements();
                } catch (err) { toast(err.message, 'error'); }
            };
        });
        const savedDraft = getRouteFormDraft();
        if (savedDraft?.meta?.kind === 'home-measurement') {
            showHomeMeasurementForm(savedDraft.meta.editId ?? null);
        }
    } catch (e) {
        container.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
    }
}

// ============================================================
// HOME: MEASUREMENT FORM
// ============================================================

async function showHomeMeasurementForm(editId) {
    const slot = $('#form-slot');
    const draftMeta = { kind:'home-measurement', editId: editId ?? null };
    slot.innerHTML = `<div class="form-panel"><div class="loading-screen" style="height:auto;min-height:80px;"><div class="loading-spinner"></div></div></div>`;

    let existing = null;
    if (editId) {
        try {
            existing = await fetchRow('home_measurements', editId);
        } catch (e) {
            toast(e.message, 'error');
            slot.innerHTML = '';
            return;
        }
    }

    const areaOpts = await loadFkOptions('home_areas', 'name', null);
    const title = editId ? 'Edit Measurement' : 'New Measurement';
    let html = `<div class="form-panel"><h3>${title}</h3>`;

    for (const f of HOME_MEASUREMENT_FIELDS) {
        const val = existing ? (existing[f.key] ?? '') : '';
        html += `<div class="form-group"><label>${esc(f.label)}${f.required ? ' *' : ''}</label>`;
        if (f.type === 'textarea') {
            html += `<textarea id="field-${f.key}">${esc(val)}</textarea>`;
        } else if (f.type === 'fk') {
            html += `<select id="field-${f.key}"><option value="">— None —</option>
                ${areaOpts.map(o => `<option value="${o.value}"${val===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select>`;
        } else {
            html += `<input type="text" id="field-${f.key}" value="${esc(val)}">`;
        }
        html += `</div>`;
    }

    html += `<div class="form-actions">
        <button class="btn btn-secondary btn-sm" id="form-cancel">Cancel</button>
        <button class="btn btn-primary btn-sm" id="form-save">${editId ? 'Update' : 'Create'}</button>
    </div></div>`;

    slot.innerHTML = html;
    bindFormDraft(draftMeta);
    slot.scrollIntoView({ behavior: 'smooth', block: 'start' });

    $('#form-cancel').onclick = () => { clearFormDraft(draftMeta); slot.innerHTML = ''; };
    $('#form-save').onclick = async () => {
        const row = {};
        for (const f of HOME_MEASUREMENT_FIELDS) {
            let v = $(`#field-${f.key}`)?.value ?? '';
            if (f.type === 'fk') v = v || null;
            else v = v.trim() || null;
            if (f.required && !v) { toast(`${f.label} is required`, 'error'); return; }
            row[f.key] = v;
        }
        try {
            if (editId) { await updateRow('home_measurements', editId, row); toast('Updated'); }
            else { await insertRow('home_measurements', row); toast('Created'); }
            clearFormDraft(draftMeta);
            clearFkCache();
            slot.innerHTML = '';
            loadHomeMeasurements();
        } catch (e) { toast(e.message, 'error'); }
    };
}

// ============================================================
// HOME: ART MEASUREMENT LIST
// ============================================================

async function loadArtMeasurements() {
    const container = $('#table-content');
    container.innerHTML = `<div class="loading-screen" style="height:auto;min-height:150px;"><div class="loading-spinner"></div></div>`;

    try {
        const { data: measurements, error: mErr } = await sb.from('art_measurements')
            .select('*').order('name');
        if (mErr) throw mErr;

        const { data: areas } = await sb.from('home_areas').select('id, name').order('name');
        const areaMap = {};
        (areas || []).forEach(a => { areaMap[a.id] = a.name; });

        let html = `<div class="page-header">
            <h2>🖼️ Art Measurements</h2>
            <button class="btn btn-primary btn-sm" id="add-art-btn">+ Add Art Measurement</button>
        </div>
        <div class="home-filters">
            <select id="filter-art-area">
                <option value="">All Areas</option>
                ${(areas||[]).map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('')}
            </select>
            <select id="filter-art-type">
                <option value="">All Types</option>
                ${ART_MEASUREMENT_FIELDS.find(f => f.key === 'type').options.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
        </div>
        <div id="form-slot"></div>`;

        if (!measurements || measurements.length === 0) {
            html += `<div class="empty-state"><div class="icon">🖼️</div><p>No art measurements yet.</p></div>`;
        } else {
            html += `<div class="entry-list" id="art-list">`;
            for (const m of measurements) {
                const areaName = m.area_id ? (areaMap[m.area_id] || 'Unknown') : '';
                const dims = [
                    m.height ? 'H: ' + esc(m.height) : null,
                    m.width ? 'W: ' + esc(m.width) : null,
                    m.depth ? 'D: ' + esc(m.depth) : null,
                ].filter(Boolean).join(' · ');

                html += `<div class="entry-card" data-id="${m.id}" data-area="${m.area_id||''}" data-type="${esc(m.type||'')}">
                    <div>
                        <div class="entry-name">${esc(m.name)}</div>
                        <div class="entry-meta">
                            ${m.type ? esc(m.type) : ''}
                            ${areaName ? ' · ' + esc(areaName) : ''}
                            ${dims ? ' · ' + dims : ''}
                        </div>
                        ${m.notes ? `<div class="entry-meta">${esc(m.notes)}</div>` : ''}
                    </div>
                    <div class="entry-actions">
                        <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
                        <button class="btn btn-danger btn-sm del-btn">Delete</button>
                    </div>
                </div>`;
            }
            html += `</div>`;
        }

        container.innerHTML = html;

        const applyFilters = () => {
            const av = $('#filter-art-area')?.value || '';
            const tv = $('#filter-art-type')?.value || '';
            container.querySelectorAll('#art-list .entry-card').forEach(card => {
                const ok = (!av || card.dataset.area === av)
                        && (!tv || card.dataset.type === tv);
                card.style.display = ok ? '' : 'none';
            });
        };

        ['#filter-art-area','#filter-art-type'].forEach(s => {
            if ($(s)) $(s).onchange = applyFilters;
        });

        $('#add-art-btn').onclick = () => showArtMeasurementForm(null);
        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => { e.stopPropagation(); showArtMeasurementForm(btn.closest('.entry-card').dataset.id); };
        });
        container.querySelectorAll('.del-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const yes = await confirmDialog('Delete Art Measurement', 'Delete this measurement?');
                if (!yes) return;
                try {
                    await deleteRow('art_measurements', btn.closest('.entry-card').dataset.id);
                    toast('Deleted');
                    loadArtMeasurements();
                } catch (err) { toast(err.message, 'error'); }
            };
        });
        const savedDraft = getRouteFormDraft();
        if (savedDraft?.meta?.kind === 'art-measurement') {
            showArtMeasurementForm(savedDraft.meta.editId ?? null);
        }
    } catch (e) {
        container.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
    }
}

// ============================================================
// HOME: ART MEASUREMENT FORM
// ============================================================

async function showArtMeasurementForm(editId) {
    const slot = $('#form-slot');
    const draftMeta = { kind:'art-measurement', editId: editId ?? null };
    slot.innerHTML = `<div class="form-panel"><div class="loading-screen" style="height:auto;min-height:80px;"><div class="loading-spinner"></div></div></div>`;

    let existing = null;
    if (editId) {
        try {
            existing = await fetchRow('art_measurements', editId);
        } catch (e) {
            toast(e.message, 'error');
            slot.innerHTML = '';
            return;
        }
    }

    const areaOpts = await loadFkOptions('home_areas', 'name', null);
    const title = editId ? 'Edit Art Measurement' : 'New Art Measurement';
    let html = `<div class="form-panel"><h3>${title}</h3>`;

    for (const f of ART_MEASUREMENT_FIELDS) {
        const val = existing ? (existing[f.key] ?? '') : '';
        html += `<div class="form-group"><label>${esc(f.label)}${f.required ? ' *' : ''}</label>`;
        if (f.type === 'textarea') {
            html += `<textarea id="field-${f.key}">${esc(val)}</textarea>`;
        } else if (f.type === 'select') {
            html += `<select id="field-${f.key}"><option value="">— Select —</option>
                ${f.options.map(o => `<option value="${esc(o)}"${val===o?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
        } else if (f.type === 'fk') {
            html += `<select id="field-${f.key}"><option value="">— None —</option>
                ${areaOpts.map(o => `<option value="${o.value}"${val===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select>`;
        } else {
            html += `<input type="text" id="field-${f.key}" value="${esc(val)}">`;
        }
        html += `</div>`;
    }

    html += `<div class="form-actions">
        <button class="btn btn-secondary btn-sm" id="form-cancel">Cancel</button>
        <button class="btn btn-primary btn-sm" id="form-save">${editId ? 'Update' : 'Create'}</button>
    </div></div>`;

    slot.innerHTML = html;
    bindFormDraft(draftMeta);
    slot.scrollIntoView({ behavior: 'smooth', block: 'start' });

    $('#form-cancel').onclick = () => { clearFormDraft(draftMeta); slot.innerHTML = ''; };
    $('#form-save').onclick = async () => {
        const row = {};
        for (const f of ART_MEASUREMENT_FIELDS) {
            let v = $(`#field-${f.key}`)?.value ?? '';
            if (f.type === 'fk' || f.type === 'select') v = v || null;
            else v = v.trim() || null;
            if (f.required && !v) { toast(`${f.label} is required`, 'error'); return; }
            row[f.key] = v;
        }
        try {
            if (editId) { await updateRow('art_measurements', editId, row); toast('Updated'); }
            else { await insertRow('art_measurements', row); toast('Created'); }
            clearFormDraft(draftMeta);
            clearFkCache();
            slot.innerHTML = '';
            loadArtMeasurements();
        } catch (e) { toast(e.message, 'error'); }
    };
}

// ============================================================
// RENDER: ENTERTAINMENT HUB
// ============================================================

function renderEntertainmentHub() {
    app().innerHTML = topbar()
        + breadcrumb([{label:'Home',href:'#'},{label:'Entertainment'}])
        + `<div class="page">
        <div class="page-header"><h2>Entertainment</h2></div>
        <div class="choice-grid">
            <div class="choice-card" onclick="navigate('#entertainment/places')">
                <div class="icon">📍</div>
                <h3>Places</h3>
                <p>Restaurants, bars, cafes, local spots & vacation finds</p>
            </div>
        </div>
    </div>`;
}

// ============================================================
// RENDER: PLACES WORKSPACE
// ============================================================

function renderPlacesWorkspace() {
    const tabs = [
        { key:'local', icon:'🏠', label:'Local' },
        { key:'vacation', icon:'✈️', label:'Vacation' },
        { key:'regions', icon:'🗺️', label:'Regions' },
        { key:'areas', icon:'📍', label:'Areas' },
    ];
    const savedDraft = getRouteFormDraft();
    let initialTab = 'local';
    if (savedDraft?.meta?.kind === 'place') {
        initialTab = savedDraft.meta.regionType === 'Vacation' ? 'vacation' : 'local';
    } else if (savedDraft?.meta?.kind === 'generic' && savedDraft.meta.tableName === 'ent_regions') {
        initialTab = 'regions';
    } else if (savedDraft?.meta?.kind === 'generic' && savedDraft.meta.tableName === 'ent_neighborhoods') {
        initialTab = 'areas';
    }

    app().innerHTML = topbar()
        + breadcrumb([{label:'Home',href:'#'},{label:'Entertainment',href:'#entertainment'},{label:'Places'}])
        + `<div class="tab-bar" id="ent-tabs">${tabs.map(t =>
            `<button class="tab${t.key===initialTab?' active':''}" data-tab="${t.key}">${t.icon} ${t.label}</button>`
        ).join('')}</div>
        <div id="table-content" class="page">
            <div class="loading-screen" style="height:auto;min-height:200px;"><div class="loading-spinner"></div></div>
        </div>`;

    document.querySelectorAll('#ent-tabs .tab').forEach(tab => {
        tab.onclick = () => {
            document.querySelectorAll('#ent-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const key = tab.dataset.tab;
            if (key === 'local') loadPlacesList('Local');
            else if (key === 'vacation') loadPlacesList('Vacation');
            else if (key === 'regions') loadTableList(null, 'ent_regions', ENT_SIMPLE_TABLES, false);
            else loadTableList(null, 'ent_neighborhoods', ENT_SIMPLE_TABLES, false);
        };
    });

    loadPlacesList('Local');
}

// ============================================================
// ENTERTAINMENT: PLACES LIST (filtered by region type)
// ============================================================

async function loadPlacesList(regionType) {
    const container = $('#table-content');
    container.innerHTML = `<div class="loading-screen" style="height:auto;min-height:150px;"><div class="loading-spinner"></div></div>`;

    try {
        // Load regions of this type
        const { data: regions, error: rErr } = await sb.from('ent_regions')
            .select('id, name').eq('type', regionType).order('name');
        if (rErr) throw rErr;
        const regionIds = (regions || []).map(r => r.id);

        // Load neighborhoods in those regions
        let neighborhoods = [];
        if (regionIds.length > 0) {
            const { data: nbData, error: nErr } = await sb.from('ent_neighborhoods')
                .select('id, name, region_id').in('region_id', regionIds).order('name');
            if (nErr) throw nErr;
            neighborhoods = nbData || [];
        }

        const neighborhoodIds = neighborhoods.map(n => n.id);
        const neighborhoodMap = {};
        neighborhoods.forEach(n => { neighborhoodMap[n.id] = n.name; });

        // Load places in those neighborhoods
        let places = [];
        if (neighborhoodIds.length > 0) {
            const { data: pData, error: pErr } = await sb.from('ent_places')
                .select('*').in('neighborhood_id', neighborhoodIds).order('name');
            if (pErr) throw pErr;
            places = pData || [];
        }

        const typeLabel = regionType === 'Local' ? 'Local Places' : 'Vacation Places';
        let html = `<div class="page-header">
            <h2>${regionType === 'Local' ? '🏠' : '✈️'} ${typeLabel}</h2>
            <button class="btn btn-primary btn-sm" id="add-place-btn">+ Add Place</button>
        </div>
        <div class="home-filters">
            <select id="filter-place-area">
                <option value="">All Areas</option>
                ${neighborhoods.map(n => `<option value="${n.id}">${esc(n.name)}</option>`).join('')}
            </select>
            <select id="filter-place-type">
                <option value="">All Types</option>
                ${ENT_PLACE_FIELDS.find(f => f.key === 'type').options.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
            <select id="filter-place-status">
                <option value="">All Statuses</option>
                ${ENT_PLACE_FIELDS.find(f => f.key === 'status').options.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
        </div>
        <div id="form-slot"></div>`;

        if (places.length === 0) {
            html += `<div class="empty-state">
                <div class="icon">${regionType === 'Local' ? '🏠' : '✈️'}</div>
                <p>No ${typeLabel.toLowerCase()} yet.${regionIds.length === 0 ? ' Create a region first in the Regions tab.' : neighborhoodIds.length === 0 ? ' Create an area first in the Areas tab.' : ''}</p>
            </div>`;
        } else {
            html += `<div class="entry-list" id="places-list">`;
            for (const p of places) {
                const areaName = p.neighborhood_id ? (neighborhoodMap[p.neighborhood_id] || '') : '';
                const costParts = [
                    p.food_cost ? 'Food: ' + esc(p.food_cost) : null,
                    p.drink_cost ? 'Drinks: ' + esc(p.drink_cost) : null,
                    p.happy_hour ? 'HH: ' + esc(p.happy_hour) : null,
                ].filter(Boolean).join(' · ');

                const statusClass = getPlaceStatusClass(p.status);

                html += `<div class="entry-card" data-id="${p.id}" data-area="${p.neighborhood_id||''}" data-type="${esc(p.type||'')}" data-status="${esc(p.status||'')}">
                    <div>
                        <div class="entry-name">${esc(p.name)}</div>
                        <div class="entry-meta">
                            ${p.status ? `<span class="status-badge ${statusClass}">${esc(p.status)}</span>` : ''}
                            ${p.type ? ' · ' + esc(p.type) : ''}
                            ${areaName ? ' · ' + esc(areaName) : ''}
                        </div>
                        ${costParts ? `<div class="entry-meta">${costParts}</div>` : ''}
                        ${p.gluten_free ? `<div class="entry-meta">GF: ${esc(p.gluten_free)}</div>` : ''}
                    </div>
                    <div class="entry-actions">
                        <button class="btn btn-secondary btn-sm edit-btn">Edit</button>
                        <button class="btn btn-danger btn-sm del-btn">Delete</button>
                    </div>
                </div>`;
            }
            html += `</div>`;
        }

        container.innerHTML = html;

        const applyFilters = () => {
            const av = $('#filter-place-area')?.value || '';
            const tv = $('#filter-place-type')?.value || '';
            const sv = $('#filter-place-status')?.value || '';
            container.querySelectorAll('#places-list .entry-card').forEach(card => {
                const ok = (!av || card.dataset.area === av)
                        && (!tv || card.dataset.type === tv)
                        && (!sv || card.dataset.status === sv);
                card.style.display = ok ? '' : 'none';
            });
        };

        ['#filter-place-area','#filter-place-type','#filter-place-status'].forEach(s => {
            if ($(s)) $(s).onchange = applyFilters;
        });

        if ($('#add-place-btn')) {
            $('#add-place-btn').onclick = () => showPlaceForm(regionType, null);
        }

        container.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                showPlaceForm(regionType, btn.closest('.entry-card').dataset.id);
            };
        });

        container.querySelectorAll('.del-btn').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const yes = await confirmDialog('Delete Place', 'This will permanently delete this place. Are you sure?');
                if (!yes) return;
                try {
                    await deleteRow('ent_places', btn.closest('.entry-card').dataset.id);
                    toast('Deleted');
                    loadPlacesList(regionType);
                } catch (err) { toast(err.message, 'error'); }
            };
        });
        const savedDraft = getRouteFormDraft();
        if (savedDraft?.meta?.kind === 'place' && savedDraft.meta.regionType === regionType) {
            showPlaceForm(regionType, savedDraft.meta.editId ?? null);
        }
    } catch (e) {
        container.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`;
    }
}

// ============================================================
// ENTERTAINMENT: PLACE FORM (Add / Edit)
// ============================================================

async function showPlaceForm(regionType, editId) {
    const slot = $('#form-slot');
    const draftMeta = { kind:'place', regionType, editId: editId ?? null };
    slot.innerHTML = `<div class="form-panel"><div class="loading-screen" style="height:auto;min-height:80px;"><div class="loading-spinner"></div></div></div>`;

    let existing = null;
    if (editId) {
        try {
            existing = await fetchRow('ent_places', editId);
        } catch (e) {
            toast(e.message, 'error');
            slot.innerHTML = '';
            return;
        }
    }

    // Load neighborhoods scoped to this region type
    const { data: regions } = await sb.from('ent_regions')
        .select('id').eq('type', regionType);
    const regionIds = (regions || []).map(r => r.id);
    let areaOpts = [];
    if (regionIds.length > 0) {
        const { data: nbData } = await sb.from('ent_neighborhoods')
            .select('id, name').in('region_id', regionIds).order('name');
        areaOpts = (nbData || []).map(n => ({ value: n.id, label: n.name }));
    }

    const title = editId ? 'Edit Place' : 'New Place';
    let html = `<div class="form-panel"><h3>${title}</h3>`;

    for (const f of ENT_PLACE_FIELDS) {
        const val = existing ? (existing[f.key] ?? '') : '';
        html += `<div class="form-group"><label>${esc(f.label)}${f.required ? ' *' : ''}</label>`;
        if (f.type === 'textarea') {
            html += `<textarea id="field-${f.key}">${esc(val)}</textarea>`;
        } else if (f.type === 'select') {
            html += `<select id="field-${f.key}"><option value="">— Select —</option>
                ${f.options.map(o => `<option value="${esc(o)}"${val===o?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
        } else if (f.key === 'neighborhood_id') {
            // Use scoped area options instead of generic FK loader
            html += `<select id="field-${f.key}"><option value="">— None —</option>
                ${areaOpts.map(o => `<option value="${o.value}"${val===o.value?' selected':''}>${esc(o.label)}</option>`).join('')}</select>`;
        } else {
            html += `<input type="text" id="field-${f.key}" value="${esc(val)}">`;
        }
        html += `</div>`;
    }

    html += `<div class="form-actions">
        <button class="btn btn-secondary btn-sm" id="form-cancel">Cancel</button>
        <button class="btn btn-primary btn-sm" id="form-save">${editId ? 'Update' : 'Create'}</button>
    </div></div>`;

    slot.innerHTML = html;
    bindFormDraft(draftMeta);
    slot.scrollIntoView({ behavior: 'smooth', block: 'start' });

    $('#form-cancel').onclick = () => { clearFormDraft(draftMeta); slot.innerHTML = ''; };
    $('#form-save').onclick = async () => {
        const row = {};
        for (const f of ENT_PLACE_FIELDS) {
            let v = $(`#field-${f.key}`)?.value ?? '';
            if (f.type === 'fk' || f.type === 'select' || f.key === 'neighborhood_id') v = v || null;
            else v = v.trim() || null;
            if (f.required && !v) { toast(`${f.label} is required`, 'error'); return; }
            row[f.key] = v;
        }
        try {
            if (editId) { await updateRow('ent_places', editId, row); toast('Updated'); }
            else { await insertRow('ent_places', row); toast('Created'); }
            clearFormDraft(draftMeta);
            clearFkCache();
            slot.innerHTML = '';
            loadPlacesList(regionType);
        } catch (e) { toast(e.message, 'error'); }
    };
}

/* ============================================================================
   Vacation & Places Expansion — GitHub Script 2 (app.js integration)
   Version: 1.0 | 2026-10-14

   INSTALL INSTRUCTIONS (IMPORTANT):
   In the EXISTING GitHub app.js file, find the final standalone line:
       init();
   Paste this entire JavaScript block DIRECTLY ABOVE that line.
   Retain the original init(); line. Do not erase earlier app.js code.

   REQUIRES: ent-vacations-data.js to load BEFORE app.js in index.html.
   Until index.html is updated in the next step, the new Entertainment screens
   will show an installation reminder rather than using the new database layer.
   This script does not modify Writing, Home, or other existing website modules.
   ============================================================================ */

const entUi = {
    api: null,
    placeMode: 'local',
    placeRegion: '',
    placeArea: '',
    placeCategory: '',
    placeType: '',
    placeStatus: ''
};

function entApi() {
    if (!window.EntVacationData) {
        throw new Error('The vacation data layer has not loaded. The next GitHub step updates index.html to load ent-vacations-data.js before app.js.');
    }
    if (!entUi.api) entUi.api = window.EntVacationData.create(sb);
    return entUi.api;
}
function entError(err) {
    const message = err && err.message ? err.message : String(err);
    toast(message, 'error');
    return `<div class="empty-state"><p>${esc(message)}</p></div>`;
}
function entPage(title, subtitle, body) {
    app().innerHTML = topbar() + breadcrumb([
        { label:'Home', href:'#' },
        { label:'Entertainment', href:'#entertainment' },
        { label:title }
    ]) + `<div class="page"><div class="page-header"><h2>${esc(title)}</h2></div>
    ${subtitle ? `<p class="entry-meta">${esc(subtitle)}</p>` : ''}${body}</div>`;
}
function entLoading(title) {
    entPage(title, '', `<div class="loading-screen" style="height:auto;min-height:120px;"><div class="loading-spinner"></div></div>`);
}
function entButton(label, extra = '') {
    return `<button type="button" class="btn btn-secondary btn-sm" ${extra}>${esc(label)}</button>`;
}
function entOptions(rows, selected, emptyLabel) {
    return `<option value="">${esc(emptyLabel || '— None —')}</option>` + rows.map(x =>
        `<option value="${esc(x.value)}"${String(x.value)===String(selected??'')?' selected':''}>${esc(x.label)}</option>`
    ).join('');
}
function entInput(def, value, choices) {
    const id = 'ent-f-' + def.key;
    const safeValue = value == null ? '' : String(value);
    const required = def.required ? ' required' : '';
    let control;
    if (def.type === 'select') {
        control = `<select id="${id}"${required}>${entOptions(choices || def.options || [],safeValue,def.placeholder||'— Select —')}</select>`;
    } else if (def.type === 'textarea') {
        control = `<textarea id="${id}"${required}>${esc(safeValue)}</textarea>`;
    } else if (def.type === 'checkbox') {
        control = `<input type="checkbox" id="${id}"${value===true?' checked':''}>`;
    } else {
        const type = def.type || 'text';
        const list = def.list ? ` list="ent-list-${def.key}"` : '';
        const dataList = def.list ? `<datalist id="ent-list-${def.key}">${def.list.map(x=>`<option value="${esc(x)}"></option>`).join('')}</datalist>` : '';
        control = `<input type="${esc(type)}" id="${id}" value="${esc(safeValue)}"${list}${required} placeholder="${esc(def.placeholder||'')}">${dataList}`;
    }
    return `<div class="form-group"${def.foodOnly?' data-ent-food="1"':''}>
        <label for="${id}">${esc(def.label)}${def.required?' *':''}</label>${control}</div>`;
}
function entRead(fields) {
    const result = {};
    for (const field of fields) {
        const el = document.getElementById('ent-f-' + field.key);
        if (!el) continue;
        result[field.key] = field.type === 'checkbox' ? el.checked : (el.value.trim() || null);
        if (field.required && !result[field.key]) throw new Error(field.label + ' is required.');
    }
    return result;
}
async function entForm({ table, seriesId = null, id = null, row = {}, fields, save, afterSave, choices = {}, heading = '', decorate = null }) {
    const slot = $('#form-slot');
    if (!slot) return;
    const meta = { kind:'generic', tableName:table, seriesId, editId:id };
    slot.innerHTML = `<div class="form-panel"><h3>${esc(heading|| (id?'Edit':'Add'))}</h3>
       ${fields.map(f=>entInput(f,row?.[f.key],choices[f.key])).join('')}
       <div class="form-actions"><button type="button" class="btn btn-secondary btn-sm" id="ent-cancel">Cancel</button>
       <button type="button" class="btn btn-primary btn-sm" id="ent-save">${id?'Update':'Create'}</button></div></div>`;
    if (decorate) await decorate(slot.querySelector('.form-panel'));
    if (table === 'ent_places') {
        const cat = $('#ent-f-category');
        const type = $('#ent-f-type');
        const foodTypes = new Set(['Restaurant','Bar','Bar/Cafe','Cocktail Bar','Dance Club','Brewery/Taproom','Wine Bar','Cafe','Bakery','Ice Cream','Food Hall','Breakfast']);
        const toggle = () => slot.querySelectorAll('[data-ent-food]').forEach(el => {
            el.style.display = (cat?.value === 'Food & Drink' || (!cat?.value && foodTypes.has(type?.value))) ? '' : 'none';
        });
        cat?.addEventListener('change',toggle); type?.addEventListener('input',toggle);
        bindFormDraft(meta);
        toggle();
    } else {
        bindFormDraft(meta);
    }
    $('#ent-cancel').onclick = () => { clearFormDraft(meta); slot.innerHTML = ''; };
    $('#ent-save').onclick = async () => {
        const button = $('#ent-save');
        button.disabled = true;
        try {
            const values = entRead(fields);
            const result = await save(values);
            clearFormDraft(meta);
            toast(id ? 'Updated' : 'Created');
            await afterSave(result);
        } catch (err) { toast(err.message, 'error'); button.disabled = false; }
    };
    slot.scrollIntoView({ block:'nearest',behavior:'smooth' });
}
function entStatus(value) {
    return value ? `<span class="status-badge">${esc(value)}</span>` : '';
}
function entDetailLine(label, value) {
    return value ? `<span class="entry-meta"><strong>${esc(label)}:</strong> ${esc(value)}</span>` : '';
}
function entPickerOptions(rows) { return rows.map(x=>({value:x.id,label:x.name || '(Unnamed)'})); }
function entDateText(value) { return value ? String(value).slice(0,10) : 'No date'; }
function entSafeHref(value) {
    try {
        const url=new URL(String(value));
        return ['https:','http:'].includes(url.protocol)?url.href:null;
    } catch (_) { return null; }
}
function entTimeText(iso,zone) {
    if (!iso) return '';
    try {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: zone || 'UTC', dateStyle:'medium', timeStyle:'short'
        }).format(new Date(iso)) + (zone ? ' ('+zone+')' : ' (UTC)');
    } catch (_) { return String(iso); }
}
function entTimeInput(iso,zone) {
    if (!iso) return '';
    try { return entApi().isoToLocalInput(iso,zone||'UTC'); }
    catch (_) { return ''; }
}
function entZones() {
    return ['America/Chicago','America/New_York','America/Denver','America/Los_Angeles',
        'America/Phoenix','America/Anchorage','Pacific/Honolulu','Europe/London',
        'Europe/Paris','Europe/Rome','Europe/Amsterdam','Europe/Zurich','UTC'];
}
const entChoice = (values) => values.map(v=>({ value:v,label:v }));

// The original router already dispatches /entertainment/places to
// renderPlacesWorkspace() and other /entertainment routes to
// renderEntertainmentHub(). Replacing those TWO functions is sufficient:
// there is no need to replace the router or its hashchange listener.
renderEntertainmentHub = function () {
    const path = getRoute().path;
    if (path[1] === 'vacations') {
        if (path[2]) return entVacationDetail(path[2],path[3]||'overview');
        return entVacationList();
    }
    if (path[1] === 'events') return entEventList();
    if (path[1] === 'regions') return entRegionList();
    if (path[1] === 'areas') return entAreaList();
    entPage('Entertainment','',`<div class="choice-grid">
        <div class="choice-card" onclick="navigate('#entertainment/places')"><div class="icon">🏠</div><h3>Local Places</h3><p>Kansas City by default</p></div>
        <div class="choice-card" onclick="navigate('#entertainment/places/all')"><div class="icon">📍</div><h3>All Places</h3><p>All regions and categories</p></div>
        <div class="choice-card" onclick="navigate('#entertainment/vacations')"><div class="icon">✈️</div><h3>Vacations</h3><p>Trips, bookings, and visit history</p></div>
        <div class="choice-card" onclick="navigate('#entertainment/events')"><div class="icon">🎭</div><h3>Events</h3><p>Concerts, performances, and festivals</p></div>
        <div class="choice-card" onclick="navigate('#entertainment/regions')"><div class="icon">🗺️</div><h3>Regions</h3></div>
        <div class="choice-card" onclick="navigate('#entertainment/areas')"><div class="icon">📌</div><h3>Areas</h3></div>
    </div>`);
};

renderPlacesWorkspace = function () { entPlaceList(); };

async function entPlaceList() {
    const mode = getRoute().path[2] === 'all' ? 'all' : 'local';
    entLoading(mode === 'local' ? 'Local Places' : 'All Places');
    try {
        const api = entApi();
        const [{regions,areas,places},kc] = await Promise.all([api.directory(),api.findKansasCityRegion()]);
        if (mode !== entUi.placeMode) {
            entUi.placeArea=''; entUi.placeCategory='';
            entUi.placeType=''; entUi.placeStatus='';
            entUi.placeRegion='';
        }
        entUi.placeMode=mode;
        if (mode === 'local') entUi.placeRegion = kc?.id || '__missing_kc__';
        else if (entUi.placeRegion === '__missing_kc__') entUi.placeRegion = '';
        const aMap = new Map(areas.map(a=>[a.id,a]));
        const rMap = new Map(regions.map(r=>[r.id,r]));
        const allCategory = api.PLACE_CATEGORY || ['Food & Drink','Lodging','Attractions','Entertainment','Shopping'];
        const areaChoices = [{value:'',label:'All Areas'},...entPickerOptions(areas)];
        const types = [...new Set(places.map(p=>p.type).filter(Boolean))].sort();
        const statuses = [...new Set([...places.map(p=>p.status).filter(Boolean),...['Want to Try','Never Been','Not Interested','Been There: Was OK','Been There: Would Go Back','Favorite','Might be Closed','Closed']])].sort();
        const safeCat = entUi.placeCategory;
        const content = `<div class="form-actions">
            ${entButton('Local Places','id="ent-local"')}${entButton('All Places','id="ent-all"')}
            <button type="button" class="btn btn-primary btn-sm" id="ent-place-add">+ Add Place</button>
            <button type="button" class="btn btn-secondary btn-sm" id="ent-region-open">Regions / Areas</button></div>
            <div class="home-filters" style="margin-top:12px;">
            <select id="ent-filter-region">${entOptions(entPickerOptions(regions),entUi.placeRegion,'All Regions')}</select>
            <select id="ent-filter-area">${entOptions(areaChoices.slice(1),entUi.placeArea,'All Areas')}</select>
            <select id="ent-filter-category">${entOptions(entChoice(allCategory),safeCat,'All Categories')}</select>
            <select id="ent-filter-type">${entOptions(entChoice(types),entUi.placeType,'All Types')}</select>
            <select id="ent-filter-status">${entOptions(entChoice(statuses),entUi.placeStatus,'All Statuses')}</select></div>
            ${mode==='local'&&!kc?'<p class="entry-meta">No Kansas City Region was found by name. Select All Places to browse the directory.</p>':''}
            <div id="form-slot"></div><div id="ent-place-results" class="entry-list"></div>`;
        entPage(mode === 'local' ? 'Local Places' : 'All Places','One shared directory; regions are browsing filters only.',content);
        const dropdowns = ['region','area','category','type','status'];
        const render = () => {
            const regionId = mode==='local'&&!kc ? '__missing_kc__' : $('#ent-filter-region').value;
            const areaId = $('#ent-filter-area').value;
            const category = $('#ent-filter-category').value;
            const type = $('#ent-filter-type').value;
            const status = $('#ent-filter-status').value;
            const matched = places.filter(p=> {
                const area = aMap.get(p.neighborhood_id);
                const region = area ? rMap.get(area.region_id) : null;
                if (regionId && regionId !== region?.id) return false;
                if (areaId && areaId !== p.neighborhood_id) return false;
                if (category && category !== p.category) return false;
                if (type && type !== p.type) return false;
                if (status && status !== p.status) return false;
                return true;
            });
            $('#ent-place-results').innerHTML = matched.length ? matched.map(p=> {
                const area = aMap.get(p.neighborhood_id);
                const region = area ? rMap.get(area.region_id) : null;
                return `<div class="entry-card" data-place="${esc(p.id)}"><div>
                   <div class="entry-name">${esc(p.name)}</div>
                   <div class="entry-meta">${entStatus(p.status)} ${esc([p.category,p.type,area?.name,region?.name].filter(Boolean).join(' · '))}</div>
                   ${entDetailLine('Address',p.address)} ${entDetailLine('Description',p.description)}
                   ${entDetailLine('Notes',p.notes)}
                   ${entSafeHref(p.url)?`<div class="entry-meta"><a href="${esc(entSafeHref(p.url))}" target="_blank" rel="noopener noreferrer">Website</a></div>`:''}
                   </div><div class="entry-actions">${entButton('Edit','data-ent-edit="'+esc(p.id)+'"')}
                   ${entButton('Delete','data-ent-del="'+esc(p.id)+'"')}</div></div>`;
            }).join('') : '<div class="empty-state"><p>No Places match these filters.</p></div>';
            $('#ent-place-results').querySelectorAll('[data-ent-edit]').forEach(btn=>btn.onclick=()=>openPlace(btn.dataset.entEdit));
            $('#ent-place-results').querySelectorAll('[data-ent-del]').forEach(btn=>btn.onclick=async()=>{
                const record = places.find(p=>p.id===btn.dataset.entDel);
                if (!await confirmDialog('Delete Place',`Delete ${record?.name||'this Place'}? Any vacation associations and selected lodging references to it will also be deleted.`)) return;
                try { await api.deletePlace(btn.dataset.entDel); toast('Deleted'); entPlaceList(); } catch(e){ entError(e); }
            });
        };
        for (const key of dropdowns) $('#ent-filter-'+key).onchange = () => {
            entUi.placeRegion = $('#ent-filter-region').value;
            entUi.placeArea = $('#ent-filter-area').value;
            entUi.placeCategory = $('#ent-filter-category').value;
            entUi.placeType = $('#ent-filter-type').value;
            entUi.placeStatus = $('#ent-filter-status').value;
            // Clear Area only if moving to an unrelated Region.
            if (key === 'region' && entUi.placeArea) {
                if (aMap.get(entUi.placeArea)?.region_id !== entUi.placeRegion) {
                    entUi.placeArea=''; $('#ent-filter-area').value='';
                }
            }
            render();
        };
        $('#ent-local').onclick=()=>navigate('#entertainment/places');
        $('#ent-all').onclick=()=>navigate('#entertainment/places/all');
        $('#ent-place-add').onclick=()=>openPlace(null);
        $('#ent-region-open').onclick=()=>navigate('#entertainment/regions');
        const openPlace = async id => {
            const row = id ? places.find(p=>p.id===id) : {};
            const fields = [
                {key:'name',label:'Name',required:true},
                {key:'neighborhood_id',label:'Area',type:'select'},
                {key:'category',label:'Category',type:'select',options:entChoice(allCategory)},
                {key:'type',label:'Specific Type',list:[...new Set([...types,...['Restaurant','Bar','Bar/Cafe','Cocktail Bar','Brewery/Taproom','Wine Bar','Cafe','Bakery','Ice Cream','Food Hall','Live Music Venue','Breakfast','Hotel','Museum','Park','Theater']])]},
                {key:'address',label:'Address'},
                {key:'description',label:'Description',type:'textarea'},
                {key:'price_range',label:'Price Range'},
                {key:'booking_url',label:'Booking URL'},
                {key:'status',label:'Status',type:'select',options:entChoice(statuses)},
                {key:'url',label:'Website URL'},
                {key:'food_cost',label:'Food Cost',foodOnly:true},
                {key:'drink_cost',label:'Drink Cost',foodOnly:true},
                {key:'ice_type',label:'Type of Ice',type:'select',foodOnly:true,options:entChoice(['Small','Moderate Sized','Single Large'])},
                {key:'happy_hour',label:'Happy Hour',foodOnly:true},
                {key:'gluten_free',label:'Gluten Free',foodOnly:true},
                {key:'rating',label:'Rating',foodOnly:true},
                {key:'notes',label:'Notes',type:'textarea'}
            ];
            await entForm({table:'ent_places',id,row,fields,
                choices:{neighborhood_id:entPickerOptions(areas)},heading:id?'Edit Place':'Add Place',
                save:values=>api.savePlace(values,id),afterSave:()=>entPlaceList()});
        };
        render();
        const draft = getRouteFormDraft();
        if (draft?.meta?.tableName==='ent_places') openPlace(draft.meta.editId||null);
    } catch(err) { entPage('Places','',entError(err)); }
}

async function entRegionList() {
    entLoading('Regions');
    try {
        const api=entApi(), rows=await api.listRegions();
        const statuses=entChoice(api.INTEREST_STATUS);
        entPage('Regions','Reusable geographic regions and their personal interest statuses.',
            `<div class="form-actions">${entButton('All Places','id="ent-back-places"')}
            <button class="btn btn-primary btn-sm" id="ent-new">+ Add Region</button></div>
            <div id="form-slot"></div><div class="entry-list">${rows.map(r=>`<div class="entry-card"><div>
            <div class="entry-name">${esc(r.name)}</div><div class="entry-meta">${entStatus(r.status)} ${esc(r.type||'')}</div>
            ${entDetailLine('Description',r.description)} ${entDetailLine('Notes',r.notes)}</div>
            <div class="entry-actions">${entButton('Edit','data-edit="'+esc(r.id)+'"')}
            ${entButton('Delete','data-delete="'+esc(r.id)+'"')}</div></div>`).join('')}</div>`);
        $('#ent-back-places').onclick=()=>navigate('#entertainment/places/all');
        const open = async id => {
            const r=rows.find(x=>x.id===id)||{};
            const fields=[{key:'name',label:'Region',required:true},
                {key:'status',label:'Interest Status',type:'select',options:statuses},
                {key:'description',label:'Description',type:'textarea'},
                {key:'notes',label:'Notes',type:'textarea'}];
            return entForm({table:'ent_regions',id,row:r,fields,heading:id?'Edit Region':'Add Region',
                save:values=>api.saveRegion(id?values:{...values,type:'Vacation'},id),afterSave:()=>entRegionList()});
        };
        $('#ent-new').onclick=()=>open(null);
        document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
        document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
            const r=rows.find(x=>x.id===b.dataset.delete);
            if(!await confirmDialog('Delete Region',`Delete ${r?.name||'Region'}? Existing Areas may become unassigned; vacation links to this Region will be removed.`)) return;
            try {await api.deleteRegion(b.dataset.delete); toast('Deleted'); entRegionList();}catch(e){entError(e);}
        });
        const draft=getRouteFormDraft();
        if(draft?.meta?.tableName==='ent_regions') open(draft.meta.editId||null);
    }catch(e){entPage('Regions','',entError(e));}
}

async function entAreaList() {
    entLoading('Areas');
    try {
        const api=entApi(), [rows,regions]=await Promise.all([api.listAreas(),api.listRegions()]);
        const regionMap=new Map(regions.map(r=>[r.id,r.name]));
        entPage('Areas','Areas can be saved and attached to vacations without requiring a Place.',
            `<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-new">+ Add Area</button></div>
            <div id="form-slot"></div><div class="entry-list">${rows.map(r=>`<div class="entry-card"><div>
            <div class="entry-name">${esc(r.name)}</div><div class="entry-meta">${entStatus(r.status)} ${esc(regionMap.get(r.region_id)||'Unassigned')}</div>
            ${entDetailLine('Description',r.description)} ${entDetailLine('Notes',r.notes)}</div>
            <div class="entry-actions">${entButton('Edit','data-edit="'+esc(r.id)+'"')}
            ${entButton('Delete','data-delete="'+esc(r.id)+'"')}</div></div>`).join('')}</div>`);
        const open=async id=>{
            const row=rows.find(x=>x.id===id)||{};
            return entForm({table:'ent_neighborhoods',id,row,heading:id?'Edit Area':'Add Area',
                fields:[{key:'name',label:'Area',required:true},{key:'region_id',label:'Region',type:'select'},
                    {key:'status',label:'Interest Status',type:'select',options:entChoice(api.INTEREST_STATUS)},
                    {key:'description',label:'Description',type:'textarea'},
                    {key:'notes',label:'Notes',type:'textarea'}],
                choices:{region_id:entPickerOptions(regions)},
                save:values=>api.saveArea(values,id),afterSave:()=>entAreaList()});
        };
        $('#ent-new').onclick=()=>open(null);
        document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
        document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
            const item=rows.find(x=>x.id===b.dataset.delete);
            if(!await confirmDialog('Delete Area',`Delete ${item?.name||'Area'}? Places in it may become unassigned; vacation links to this Area will be removed.`)) return;
            try{await api.deleteArea(b.dataset.delete);toast('Deleted');entAreaList();}catch(e){entError(e);}
        });
        const draft=getRouteFormDraft();
        if(draft?.meta?.tableName==='ent_neighborhoods') open(draft.meta.editId||null);
    }catch(e){entPage('Areas','',entError(e));}
}

async function entVacationList() {
    entLoading('Vacations');
    try {
        const api=entApi();
        const [trips,regions]=await Promise.all([api.listVacations(),api.listRegions()]);
        const regionMap=new Map(regions.map(r=>[r.id,r.name]));
        const markup=`<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-new">+ New Vacation</button></div>
            <div id="form-slot"></div><div class="entry-list">${trips.length ? trips.map(t=>`<div class="entry-card"><div>
            <div class="entry-name"><a href="#entertainment/vacations/${esc(t.id)}">${esc(t.name)}</a></div>
            <div class="entry-meta">${entStatus(t.status)} ${esc([t.start_date,t.end_date].filter(Boolean).join(' — '))}</div>
            ${entDetailLine('Primary Region',regionMap.get(t.primary_region_id))}
            ${entDetailLine('Description',t.description)}</div><div class="entry-actions">
            ${entButton('Open','data-open="'+esc(t.id)+'"')}${entButton('Edit','data-edit="'+esc(t.id)+'"')}
            ${entButton('Delete','data-delete="'+esc(t.id)+'"')}</div></div>`).join('') : '<p>No vacations yet. Create one to start planning.</p>'}</div>`;
        entPage('Vacations','Planning, Upcoming, Completed, and Cancelled trips all use the same editable records.',markup);
        const open=async id=>{
            const row=trips.find(t=>t.id===id)||{};
            const fields=[{key:'name',label:'Vacation Name',required:true},
                {key:'primary_region_id',label:'Primary Region',type:'select'},
                {key:'start_date',label:'Start Date',type:'date'},
                {key:'end_date',label:'End Date',type:'date'},
                {key:'status',label:'Status',type:'select',options:entChoice(api.VACATION_STATUS)},
                {key:'description',label:'Description',type:'textarea'},
                {key:'notes',label:'Trip Notes',type:'textarea'}];
            return entForm({table:'ent_vacations',id,row:{status:'Planning',...row},fields,
                choices:{primary_region_id:entPickerOptions(regions)},heading:id?'Edit Vacation':'New Vacation',
                save:values=>api.saveVacation(values,id),afterSave:result=>navigate('#entertainment/vacations/'+result.id)});
        };
        $('#ent-new').onclick=()=>open(null);
        document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>navigate('#entertainment/vacations/'+b.dataset.open));
        document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
        document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
            const row=trips.find(t=>t.id===b.dataset.delete);
            if(!await confirmDialog('Delete Vacation',`Permanently delete ${row?.name||'vacation'} and its associated bookings and activities? Saved master Places and Events will remain.`)) return;
            try{await api.deleteVacation(b.dataset.delete); toast('Vacation deleted'); entVacationList();}catch(e){entError(e);}
        });
        const draft=getRouteFormDraft();
        if(draft?.meta?.tableName==='ent_vacations') open(draft.meta.editId||null);
    }catch(e){entPage('Vacations','',entError(e));}
}

async function entEventList() {
    entLoading('Events');
    try {
        const api=entApi(), [rows,places]=await Promise.all([api.listEvents(),api.listPlaces()]);
        const pMap=new Map(places.map(p=>[p.id,p.name]));
        entPage('Events','A scheduled performance or festival can be associated with a reusable Place and any vacation.',
            `<div class="form-actions"><button class="btn btn-primary btn-sm" id="ent-new">+ Add Event</button></div>
            <div id="form-slot"></div><div class="entry-list">${rows.map(e=>`<div class="entry-card"><div>
            <div class="entry-name">${esc(e.name)}</div><div class="entry-meta">${esc(pMap.get(e.venue_place_id)||'')} ${esc(entTimeText(e.start_datetime,e.event_timezone))}</div>
            ${entDetailLine('Description',e.description)} ${entDetailLine('Notes',e.notes)}</div>
            <div class="entry-actions">${entButton('Edit','data-edit="'+esc(e.id)+'"')}
            ${entButton('Delete','data-delete="'+esc(e.id)+'"')}</div></div>`).join('')}</div>`);
        const open=async id=>{
            const old=rows.find(r=>r.id===id)||{};
            const row={...old,start_datetime:entTimeInput(old.start_datetime,old.event_timezone),
                end_datetime:entTimeInput(old.end_datetime,old.event_timezone)};
            const fields=[{key:'name',label:'Event Name',required:true},
                {key:'venue_place_id',label:'Venue / Place',type:'select'},
                {key:'event_timezone',label:'Venue Timezone (IANA)',list:entZones(),placeholder:'e.g. America/New_York'},
                {key:'start_datetime',label:'Start (venue local time)',type:'datetime-local'},
                {key:'end_datetime',label:'End (venue local time)',type:'datetime-local'},
                {key:'description',label:'Description',type:'textarea'},
                {key:'ticket_url',label:'Ticket URL'},
                {key:'price',label:'Price'},{key:'notes',label:'Notes',type:'textarea'}];
            return entForm({table:'ent_events',id,row,fields,heading:id?'Edit Event':'Add Event',
                choices:{venue_place_id:entPickerOptions(places)},save:values=>api.saveEvent(values,id),
                afterSave:()=>entEventList()});
        };
        $('#ent-new').onclick=()=>open(null);
        document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
        document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
            const e=rows.find(r=>r.id===b.dataset.delete);
            if(!await confirmDialog('Delete Event',`Delete ${e?.name||'Event'} and its vacation activity associations?`))return;
            try{await api.deleteEvent(b.dataset.delete);toast('Deleted');entEventList();}catch(e){entError(e);}
        });
        const draft=getRouteFormDraft();
        if(draft?.meta?.tableName==='ent_events') open(draft.meta.editId||null);
    }catch(e){entPage('Events','',entError(e));}
}

function entVacationLink(id,section) {
    return '#entertainment/vacations/'+encodeURIComponent(id)+(section?'/'+section:'');
}
function entSectionLink(id,section,label,active) {
    return `<a class="btn ${active===section?'btn-primary':'btn-secondary'} btn-sm" href="${entVacationLink(id,section)}">${esc(label)}</a>`;
}
async function entVacationDetail(id,section='overview') {
    const sections=new Set(['overview','flights','lodging','transport','activities','notes']);
    if(!sections.has(section)) section='overview';
    entLoading('Vacation');
    try {
        const api=entApi();
        const [bundle,regions]=await Promise.all([api.vacationBundle(id),api.listRegions()]);
        const trip=bundle.vacation;
        const region=regions.find(r=>r.id===trip.primary_region_id);
        const tabs=[['overview','Overview'],['flights','Flights'],['lodging','Lodging'],
            ['transport','Transport'],['activities','Activities / Visits'],['notes','Notes / History']];
        const nav=`<div class="form-actions" style="display:flex;flex-wrap:wrap;gap:7px;">
            ${tabs.map(([key,label])=>entSectionLink(id,key,label,section)).join('')}</div>`;
        const summary=`<div class="entry-card"><div>
             <div class="entry-name">${esc(trip.name)}</div>
             <div class="entry-meta">${entStatus(trip.status)} ${esc([trip.start_date,trip.end_date].filter(Boolean).join(' — '))}</div>
             ${entDetailLine('Primary Region',region?.name)}
             ${entDetailLine('Description',trip.description)}</div></div>`;
        entPage('Vacation: '+trip.name,'Completed vacations remain fully editable, just like planned trips.',
            `<div class="form-actions">${entButton('All Vacations','id="ent-trips-back"')}</div>
              ${summary}${nav}<div id="form-slot"></div><div id="ent-detail-content"></div>`);
        $('#ent-trips-back').onclick=()=>navigate('#entertainment/vacations');
        const content=$('#ent-detail-content');
        const refresh=()=>entVacationDetail(id,section);
        let restoreEdit=null;
        const draft=getRouteFormDraft();

        if(section==='overview') {
            content.innerHTML=`<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-edit-trip">Edit Vacation</button></div>
                ${entDetailLine('Description',trip.description)} ${entDetailLine('Notes',trip.notes)}`;
            const open=()=>entForm({table:'ent_vacations',id,row:trip,heading:'Edit Vacation',
                fields:[{key:'name',label:'Vacation Name',required:true},
                    {key:'primary_region_id',label:'Primary Region',type:'select'},
                    {key:'start_date',label:'Start Date',type:'date'},{key:'end_date',label:'End Date',type:'date'},
                    {key:'status',label:'Status',type:'select',options:entChoice(api.VACATION_STATUS)},
                    {key:'description',label:'Description',type:'textarea'},
                    {key:'notes',label:'Trip Notes',type:'textarea'}],
                choices:{primary_region_id:entPickerOptions(regions)},
                save:values=>api.saveVacation(values,id),afterSave:refresh});
            $('#ent-edit-trip').onclick=open;
            if(draft?.meta?.tableName==='ent_vacations'&&draft.meta.editId===id) restoreEdit=open;
        }

        if(section==='flights') {
            const rows=bundle.flights;
            content.innerHTML=`<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-add">+ Add Flight Leg</button></div>
                <div class="entry-list">${rows.length?rows.map(f=>`<div class="entry-card"><div>
                    <div class="entry-name">${esc([f.airline,f.flight_number].filter(Boolean).join(' ')||f.direction||'Flight')}</div>
                    <div class="entry-meta">${entStatus(f.booking_status)} ${esc(f.direction||'')}</div>
                    ${entDetailLine('Route',[f.departure_airport,f.arrival_airport].filter(Boolean).join(' → '))}
                    ${entDetailLine('Depart',entTimeText(f.departure_datetime,f.departure_timezone))}
                    ${entDetailLine('Arrive',entTimeText(f.arrival_datetime,f.arrival_timezone))}
                    ${entDetailLine('Booking',f.booking_notes)} ${entDetailLine('Notes',f.notes)}</div>
                    <div class="entry-actions">${entButton('Edit','data-edit="'+esc(f.id)+'"')}${entButton('Delete','data-delete="'+esc(f.id)+'"')}</div></div>`).join(''):'<p>No flights recorded. Trips without flights are valid.</p>'}</div>`;
            const open=childId=>{
                const old=rows.find(f=>f.id===childId)||{};
                const row={booking_status:'Not Planned',direction:'Other',...old,
                    departure_datetime:entTimeInput(old.departure_datetime,old.departure_timezone),
                    arrival_datetime:entTimeInput(old.arrival_datetime,old.arrival_timezone)};
                const fields=[{key:'direction',label:'Direction',type:'select',options:entChoice(api.FLIGHT_DIRECTION)},
                    {key:'airline',label:'Airline'}, {key:'flight_number',label:'Flight Number'},
                    {key:'departure_airport',label:'Departure Airport'},
                    {key:'arrival_airport',label:'Arrival Airport'},
                    {key:'departure_timezone',label:'Departure Timezone (IANA)',list:entZones(),placeholder:'e.g. America/Chicago'},
                    {key:'departure_datetime',label:'Departure (airport local time)',type:'datetime-local'},
                    {key:'arrival_timezone',label:'Arrival Timezone (IANA)',list:entZones(),placeholder:'e.g. America/New_York'},
                    {key:'arrival_datetime',label:'Arrival (airport local time)',type:'datetime-local'},
                    {key:'booking_status',label:'Booking Status',type:'select',options:entChoice(api.BOOKING_STATUS)},
                    {key:'booking_notes',label:'Booking Notes',type:'textarea'},
                    {key:'notes',label:'Notes',type:'textarea'}];
                return entForm({table:'ent_vacation_flights',seriesId:id,id:childId,row,fields,
                    heading:childId?'Edit Flight':'Add Flight',
                    save:values=>api.saveFlight(id,values,childId),afterSave:refresh});
            };
            $('#ent-add').onclick=()=>open(null);
            content.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
            content.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
                if(!await confirmDialog('Delete Flight','Permanently delete this flight segment?')) return;
                try{await api.deleteFlight(b.dataset.delete);toast('Flight deleted');refresh();}catch(e){entError(e);}
            });
            if(draft?.meta?.tableName==='ent_vacation_flights'&&draft.meta.seriesId===id) restoreEdit=()=>open(draft.meta.editId||null);
        }

        if(section==='lodging') {
            const rows=bundle.lodging;
            content.innerHTML=`<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-add">+ Add Lodging</button></div>
              <p class="entry-meta">Select a saved Lodging Place, filtered by the vacation's Region, or type a guest-room/accommodation name. Multiple stays are allowed.</p>
              <div class="entry-list">${rows.length?rows.map(s=>`<div class="entry-card"><div>
                <div class="entry-name">${esc(s.place?.name||s.lodging_name||'Lodging')} ${s.is_primary?'<span class="status-badge">Primary</span>':''}</div>
                <div class="entry-meta">${entStatus(s.booking_status)} ${esc([s.check_in_date,s.check_out_date].filter(Boolean).join(' — '))}</div>
                ${entDetailLine('Address',s.place?.address)} ${entDetailLine('Booking',s.booking_notes)}
                ${entDetailLine('Notes',s.notes)}</div><div class="entry-actions">
                ${entButton('Edit','data-edit="'+esc(s.id)+'"')}${entButton('Delete','data-delete="'+esc(s.id)+'"')}</div></div>`).join(''):'<p>No lodging recorded. You can leave this empty for day trips.</p>'}</div>`;
            const open=async childId=>{
                const old=rows.find(s=>s.id===childId)||{};
                const regionsChoices=entPickerOptions(regions);
                const savedDraft=getRouteFormDraft();
                const initialScope=savedDraft?.meta?.tableName==='ent_vacation_lodging' && savedDraft.meta.seriesId===id
                    ? savedDraft.fields?.['ent-lodging-region']??trip.primary_region_id??'' : trip.primary_region_id||'';
                // Region selector is a directory filter, never a restriction.
                const scope=initialScope||'';
                const opts=await api.lodgingChoices(id,{regionId:scope||null});
                if(old.place_id && old.place && !opts.places.some(p=>p.id===old.place_id))
                    opts.places.push(old.place);
                const fields=[{key:'place_id',label:'Saved Lodging Place',type:'select'},
                    {key:'lodging_name',label:'Guest Room / Other Lodging Name'},
                    {key:'check_in_date',label:'Check-in',type:'date'},
                    {key:'check_out_date',label:'Check-out',type:'date'},
                    {key:'booking_status',label:'Booking Status',type:'select',options:entChoice(api.BOOKING_STATUS)},
                    {key:'is_primary',label:'Primary Accommodation',type:'select',options:entChoice(['true','false'])},
                    {key:'booking_notes',label:'Booking Notes',type:'textarea'},
                    {key:'notes',label:'Notes',type:'textarea'}];
                const row={booking_status:'Not Planned',is_primary:String(!!old.is_primary),...old,
                    is_primary:String(!!old.is_primary)};
                await entForm({table:'ent_vacation_lodging',seriesId:id,id:childId,row,fields,
                    heading:childId?'Edit Lodging':'Add Lodging',
                    choices:{place_id:entPickerOptions(opts.places)},
                    save:async values=>{
                        const wantsPrimary=values.is_primary==='true';
                        // Avoid unique-primary conflict by switching primary AFTER save.
                        values.is_primary=false;
                        if(values.place_id) values.lodging_name=null;
                        const saved=await api.saveLodging(id,values,childId);
                        if(wantsPrimary) await api.setPrimaryLodging(id,saved.id);
                        return saved;
                    },afterSave:refresh,
                    decorate:form=>{
                        const select=document.createElement('div');
                        select.className='form-group';
                        select.innerHTML=`<label for="ent-lodging-region">Filter hotels by Region</label>
                            <select id="ent-lodging-region">${entOptions(regionsChoices,scope,'All Regions')}</select>`;
                        form.insertBefore(select,form.querySelector('.form-group'));
                        const regionSelect=$('#ent-lodging-region');
                        regionSelect.onchange=async()=>{
                            try{
                                const data=await api.lodgingChoices(id,{regionId:regionSelect.value||null});
                                const hotel=$('#ent-f-place_id');
                                const preserve=hotel.value;
                                hotel.innerHTML=entOptions(entPickerOptions(data.places),preserve,'— Guest Room / None —');
                            }catch(e){entError(e);}
                        };
                    }});
            };
            $('#ent-add').onclick=()=>open(null);
            content.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
            content.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
                if(!await confirmDialog('Delete Lodging','Remove this accommodation from the vacation? The master Place remains.')) return;
                try{await api.deleteLodging(b.dataset.delete);toast('Lodging removed');refresh();}catch(e){entError(e);}
            });
            if(draft?.meta?.tableName==='ent_vacation_lodging'&&draft.meta.seriesId===id) restoreEdit=()=>open(draft.meta.editId||null);
        }

        if(section==='transport') {
            const rows=bundle.transport;
            content.innerHTML=`<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-add">+ Add Transportation</button></div>
              <div class="entry-list">${rows.length?rows.map(t=>`<div class="entry-card"><div>
                <div class="entry-name">${esc([t.type,t.provider].filter(Boolean).join(' — ')||'Transportation')}</div>
                <div class="entry-meta">${entStatus(t.booking_status)} ${esc(entTimeText(t.scheduled_datetime,t.scheduled_timezone))}</div>
                ${entDetailLine('Route',[t.departure_location,t.arrival_location].filter(Boolean).join(' → '))}
                ${entDetailLine('Booking',t.booking_notes)} ${entDetailLine('Notes',t.notes)}</div>
                <div class="entry-actions">${entButton('Edit','data-edit="'+esc(t.id)+'"')}${entButton('Delete','data-delete="'+esc(t.id)+'"')}</div></div>`).join(''):'<p>No transportation recorded.</p>'}</div>`;
            const open=childId=>{
                const old=rows.find(t=>t.id===childId)||{};
                const row={booking_status:'Not Planned',...old,
                    scheduled_datetime:entTimeInput(old.scheduled_datetime,old.scheduled_timezone)};
                const fields=[{key:'type',label:'Type',list:['Bus','Train','Taxi','Airport Transfer','Shuttle','Rental Car','Rideshare','Other']},
                    {key:'provider',label:'Provider'},
                    {key:'departure_location',label:'From'},
                    {key:'arrival_location',label:'To'},
                    {key:'scheduled_timezone',label:'Scheduled Timezone (IANA)',list:entZones()},
                    {key:'scheduled_datetime',label:'Scheduled (local time)',type:'datetime-local'},
                    {key:'booking_status',label:'Booking Status',type:'select',options:entChoice(api.BOOKING_STATUS)},
                    {key:'booking_notes',label:'Booking Notes',type:'textarea'},
                    {key:'notes',label:'Notes',type:'textarea'}];
                return entForm({table:'ent_vacation_transport',seriesId:id,id:childId,row,fields,
                    heading:childId?'Edit Transportation':'Add Transportation',
                    save:values=>api.saveTransport(id,values,childId),afterSave:refresh});
            };
            $('#ent-add').onclick=()=>open(null);
            content.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
            content.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
                if(!await confirmDialog('Delete Transport','Permanently remove this transport arrangement?')) return;
                try{await api.deleteTransport(b.dataset.delete);toast('Removed');refresh();}catch(e){entError(e);}
            });
            if(draft?.meta?.tableName==='ent_vacation_transport'&&draft.meta.seriesId===id) restoreEdit=()=>open(draft.meta.editId||null);
        }

        if(section==='activities') {
            const rows=bundle.activities;
            const kindLabel={region:'Region',area:'Area',place:'Place',event:'Event'};
            const ordered=[...rows].sort((a,b)=>{
                if(!a.planned_date&&!b.planned_date)return 0;
                if(!a.planned_date)return 1;
                if(!b.planned_date)return -1;
                return a.planned_date.localeCompare(b.planned_date);
            });
            const contentRows=ordered.map(x=>{
                const type=x.target_type||'place';
                return `<div class="entry-card"><div style="min-width:0;flex:1;">
                    <div class="entry-name">${esc(x.target?.name||'(Deleted destination)')}</div>
                    <div class="entry-meta">${esc(kindLabel[type]||type)} · ${x.planned_date?esc(x.planned_date):'Undated'}
                    ${x.visited?'<span class="status-badge">Visited</span>':''}</div>
                    ${entDetailLine('Description',x.target?.description)}
                    ${entDetailLine('Visit Notes',x.notes)}
                    <div class="form-actions" style="margin-top:8px;display:flex;flex-wrap:wrap;gap:7px;align-items:center;">
                        <label><input type="checkbox" id="ent-visit-${esc(x.id)}" ${x.visited?'checked':''}> Visited</label>
                        <input type="date" id="ent-visited-date-${esc(x.id)}" value="${esc(x.visited_date||'')}" aria-label="Actual visited date">
                        ${entButton('Save Visit','data-visit="'+esc(x.id)+'"')}
                    </div></div><div class="entry-actions">${entButton('Edit','data-edit="'+esc(x.id)+'"')}
                    ${entButton('Remove','data-delete="'+esc(x.id)+'"')}</div></div>`;
            }).join('');
            content.innerHTML=`<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-add">+ Add Destination / Activity</button></div>
                <p class="entry-meta">Planned dates are optional. Each destination can be linked once per vacation. Visited and planned dates are independent.</p>
                <div class="entry-list">${contentRows||'<p>No destinations linked to this vacation yet.</p>'}</div>`;
            const open=async childId=>{
                const old=rows.find(x=>x.id===childId)||{};
                const kind=old.target_type||'place';
                const currentDraft=getRouteFormDraft();
                const draftFields=currentDraft?.meta?.tableName==='ent_vacation_items' && currentDraft.meta.seriesId===id
                    ? currentDraft.fields||{} : {};
                const chosenRegion=draftFields['ent-activity-region']??(childId ? '' : (trip.primary_region_id||''));
                const all=await api.activityChoices(id,{regionId:null});
                const areas=new Map(all.areas.map(a=>[a.id,a]));
                const places=new Map(all.places.map(p=>[p.id,p]));
                const typeMap={region:'region_id',area:'area_id',place:'place_id',event:'event_id'};
                const fields=[{key:'planned_date',label:'Optional Planned Date',type:'date'},
                    {key:'visited',label:'Visited',type:'select',options:entChoice(['true','false'])},
                    {key:'visited_date',label:'Actual Visit Date (optional)',type:'date'},
                    {key:'notes',label:'Trip-specific Notes',type:'textarea'}];
                const row={planned_date:old.planned_date||'',visited:String(!!old.visited),visited_date:old.visited_date||'',notes:old.notes||''};
                await entForm({table:'ent_vacation_items',seriesId:id,id:childId,row,fields,
                    heading:childId?'Edit Destination / Activity':'Add Destination / Activity',
                    save:async values=>{
                        const k=$('#ent-activity-kind').value;
                        const target=$('#ent-activity-target').value;
                        if(!target)throw new Error('Select a destination or event.');
                        values[typeMap[k]]=target;
                        values.visited=values.visited==='true';
                        if(!values.visited)values.visited_date=null;
                        return api.saveItem(id,values,childId);
                    },afterSave:refresh,
                    decorate:form=>{
                        const currentKind=draftFields['ent-activity-kind']||kind;
                        const box=document.createElement('div');
                        box.innerHTML=`<div class="form-group"><label for="ent-activity-region">Region filter (optional)</label>
                            <select id="ent-activity-region">${entOptions(entPickerOptions(all.regions),chosenRegion,'All Regions')}</select></div>
                            <div class="form-group"><label for="ent-activity-kind">Destination Type</label>
                            <select id="ent-activity-kind">${entOptions(entChoice(['region','area','place','event']).map(x=>({...x,label:kindLabel[x.value]})),currentKind,'Choose Type')}</select></div>
                            <div class="form-group"><label for="ent-activity-target">Select Destination</label>
                            <select id="ent-activity-target"></select></div>`;
                        form.insertBefore(box,form.querySelector('.form-group'));
                        const filter=()=>{
                            const reg=$('#ent-activity-region').value;
                            const k=$('#ent-activity-kind').value;
                            let options=[];
                            if(k==='region') options=all.regions;
                            if(k==='area') options=all.areas.filter(a=>!reg||a.region_id===reg);
                            if(k==='place') options=all.places.filter(p=>!reg||areas.get(p.neighborhood_id)?.region_id===reg);
                            if(k==='event') options=all.events.filter(e=>{
                                if(!reg)return true;
                                const p=places.get(e.venue_place_id);
                                return p ? areas.get(p.neighborhood_id)?.region_id===reg : false;
                            });
                            const target=$('#ent-activity-target');
                            const selected=target.value || draftFields['ent-activity-target'] || old[typeMap[k]] || '';
                            target.innerHTML=entOptions(entPickerOptions(options),selected,'— Choose destination —');
                        };
                        $('#ent-activity-region').onchange=filter;
                        $('#ent-activity-kind').onchange=filter;
                        filter();
                    }});
            };
            $('#ent-add').onclick=()=>open(null);
            content.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>open(b.dataset.edit));
            content.querySelectorAll('[data-delete]').forEach(b=>b.onclick=async()=>{
                if(!await confirmDialog('Remove from Vacation','Remove this association and its trip-specific visit notes? The reusable destination or Event is not deleted.'))return;
                try{await api.removeItem(id,b.dataset.delete);toast('Removed from vacation');refresh();}catch(e){entError(e);}
            });
            content.querySelectorAll('[data-visit]').forEach(b=>b.onclick=async()=>{
                const itemId=b.dataset.visit;
                const visited=$('#ent-visit-'+itemId).checked;
                const date=$('#ent-visited-date-'+itemId).value||null;
                try{await api.setVisited(id,itemId,visited,date);toast('Visit updated');refresh();}catch(e){entError(e);}
            });
            if(draft?.meta?.tableName==='ent_vacation_items'&&draft.meta.seriesId===id) restoreEdit=()=>open(draft.meta.editId||null);
        }

        if(section==='notes') {
            const visited=bundle.activities.filter(x=>x.visited);
            content.innerHTML=`<div class="form-actions"><button type="button" class="btn btn-primary btn-sm" id="ent-edit-notes">Edit Notes</button></div>
               <div class="form-panel"><h3>Trip Notes</h3><p style="white-space:pre-wrap;">${esc(trip.notes||'No notes recorded.')}</p></div>
               <h3>Visited Destinations (${visited.length})</h3><div class="entry-list">${visited.map(x=>`<div class="entry-card"><div>
               <div class="entry-name">${esc(x.target?.name||'Unknown destination')}</div>
               <div class="entry-meta">${esc(entDateText(x.visited_date))}</div>
               ${entDetailLine('Notes',x.notes)}</div></div>`).join('')||'<p>No visited destinations marked yet.</p>'}</div>`;
            const open=()=>entForm({table:'ent_vacations',id,row:trip,
                heading:'Edit Trip Notes',fields:[{key:'notes',label:'Trip Notes',type:'textarea'}],
                save:values=>api.saveVacation(values,id),afterSave:refresh});
            $('#ent-edit-notes').onclick=open;
            if(draft?.meta?.tableName==='ent_vacations'&&draft.meta.editId===id) restoreEdit=open;
        }
        if(restoreEdit)await restoreEdit();
    }catch(e){entPage('Vacation','',entError(e));}
}

// END OF VACATION & PLACES EXPANSION ADDITION.
// Keep the original `init();` call immediately AFTER this block.


// ============================================================
// INIT
// ============================================================

init();
