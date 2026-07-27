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

const NOVEL_TABLES = {
    novel_characters: {
        label: 'Characters', icon: '👤',
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
        label: 'Races', icon: '🧬',
        display: ['name'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
            { key:'description', label:'Description', type:'textarea' },
        ]
    },
    novel_cultural_factions: {
        label: 'Factions', icon: '⚔️',
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
        label: 'World Details', icon: '🌍',
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
        label: 'Magic Systems', icon: '✨',
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
        label: 'Abilities', icon: '⚡',
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
        label: 'Naming Conventions', icon: '📝',
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
        label: 'Chapters', icon: '📖',
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
        label: 'Plot Threads', icon: '🧵',
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
        label: 'Characters', icon: '👤',
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
            { key:'voice_mannerisms', label:'Voice & Mannerisms', type:'textarea' },
            { key:'notes', label:'Notes', type:'textarea' },
        ]
    },
    ss_categories: {
        label: 'Categories', icon: '📂',
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
        label: 'Themes & Rules', icon: '📐',
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
        label: 'Stories', icon: '📄',
        display: ['name','status','genre'],
        fields: [
            { key:'name', label:'Name', type:'text', required:true },
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
// STATE
// ============================================================
let currentUser = null;
let fkCache = {};  // tableName -> [{id, label}]

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
            else renderNovelWorkspace(path[1]); break;
        case 'short-stories':
            if (path.length >= 2) renderTableView(null, path[1], SS_TABLES, false);
            else renderSSWorkspace(); break;
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
    sb.auth.onAuthStateChange((_event, session) => {
        currentUser = session?.user || null;
        handleRoute();
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
    // get names for each linked id
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

function confirm(title, msg) {
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
        btn.disabled = true; btn.textContent = 'Signing in...';
        try {
            await login(email, pw);
        } catch (e) {
            const errEl = $('#login-error');
            errEl.style.display = 'block';
            errEl.textContent = e.message || 'Login failed';
            btn.disabled = false; btn.textContent = 'Sign In';
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

        // Keep topbar + breadcrumbs, replace page content
        const topHTML = topbar() + breadcrumb([{label:'Home',href:'#'},{label:'Writing',href:'#writing'},{label:'Novels'}]);
        app().innerHTML = topHTML + content;

        $('#add-series-btn').onclick = () => {
            const slot = $('#series-form-slot');
            if (slot.innerHTML) { slot.innerHTML = ''; return; }
            slot.innerHTML = `
                <div class="form-panel" style="margin-top:1rem;">
                    <h3>New Series</h3>
                    <div class="form-group"><label>Name</label><input type="text" id="ns-name"></div>
                    <div class="form-group"><label>Description</label><textarea id="ns-desc"></textarea></div>
                    <div class="form-actions">
                        <button class="btn btn-secondary btn-sm" onclick="$('#series-form-slot').innerHTML=''">Cancel</button>
                        <button class="btn btn-primary btn-sm" id="ns-save">Save</button>
                    </div>
                </div>`;
            $('#ns-save').onclick = async () => {
                const name = $('#ns-name').value.trim();
                if (!name) { toast('Name is required','error'); return; }
                try {
                    await insertRow('novel_series', { name, description: $('#ns-desc').value.trim() || null });
                    toast('Series created');
                    clearFkCache();
                    renderNovelSeries();
                } catch (e) { toast(e.message, 'error'); }
            };
        };
    } catch (e) { toast(e.message, 'error'); }
}

// ============================================================
// RENDER: NOVEL WORKSPACE (tabs for one series)
// ============================================================
async function renderNovelWorkspace(seriesId) {
    const tableKeys = Object.keys(NOVEL_TABLES);
    const firstTable = tableKeys[0];

    // fetch series name
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

    // Tab click handler
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
    const firstTable = tableKeys[0];

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
        let html = `<div class="page-header">
            <h2>${config.icon} ${config.label}</h2>
            <button class="btn btn-primary btn-sm" id="add-entry-btn">+ Add ${config.label.replace(/s$/, '')}</button>
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
                const displayVals = config.display
                    .map(k => row[k])
                    .filter(Boolean)
                    .map(v => esc(v));
                const meta = displayVals.slice(1).join(' · ');
                html += `<div class="entry-card" data-id="${row.id}">
                    <div>
                        <div class="entry-name">${displayVals[0] || '(untitled)'}</div>
                        ${meta ? `<div class="entry-meta">${meta}</div>` : ''}
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
                const yes = await confirm('Delete Entry', 'This will permanently delete this entry. Are you sure?');
                if (!yes) return;
                try {
                    await deleteRow(tableName, id);
                    toast('Deleted');
                    clearFkCache();
                    loadTableList(seriesId, tableName, tableConfigs, isNovel);
                } catch (err) { toast(err.message, 'error'); }
            };
        });

    } catch (e) { container.innerHTML = `<p style="color:var(--danger)">${esc(e.message)}</p>`; }
}

// ============================================================
// GENERIC: FORM (Add / Edit)
// ============================================================
async function showForm(seriesId, tableName, tableConfigs, isNovel, editId) {
    const config = tableConfigs[tableName];
    const slot = $('#form-slot');
    slot.innerHTML = `<div class="form-panel"><div class="loading-screen" style="height:auto;min-height:80px;"><div class="loading-spinner"></div></div></div>`;

    let existing = null;
    if (editId) {
        try { existing = await fetchRow(tableName, editId); } catch (e) {
            toast(e.message, 'error'); slot.innerHTML = ''; return;
        }
    }

    // Preload FK options
    const fkLoads = {};
    for (const f of config.fields) {
        if (f.type === 'fk') {
            fkLoads[f.key] = await loadFkOptions(f.fkTable, f.fkLabel, seriesId);
        }
    }

    const title = editId ? `Edit ${config.label.replace(/s$/, '')}` : `New ${config.label.replace(/s$/, '')}`;
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
    slot.scrollIntoView({ behavior: 'smooth', block: 'start' });

    $('#form-cancel').onclick = () => { slot.innerHTML = ''; };
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
        // Fetch current links
        const { data: links } = await sb.from(j.table).select('*').eq(j.fkSelf, parentId);
        const linkedIds = (links || []).map(l => l[j.fkOther]);

        // Fetch names for linked items
        let linkedItems = [];
        if (linkedIds.length > 0) {
            const { data } = await sb.from(j.otherTable).select('id, ' + j.otherLabel).in('id', linkedIds);
            linkedItems = data || [];
        }

        // Fetch all available items for the dropdown
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

    // Remove tag handlers
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

    // Add handlers
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
    // For direct deep links, render the workspace and auto-select the tab
    if (isNovel && seriesId) {
        renderNovelWorkspace(seriesId);
    } else {
        renderSSWorkspace();
    }
}

// ============================================================
// INIT
// ============================================================
init();
