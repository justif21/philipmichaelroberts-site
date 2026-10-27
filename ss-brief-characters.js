/* ========================================================================
   PHILIPMICHAELROBERTS SITE - SHORT STORIES / BRIEF CHARACTERS
   File to create in GitHub: ss-brief-characters.js
   Requires existing app.js and the two Supabase tables created 2026-10-27.

   Loaded AFTER app.js. The original writing, vacation, and home systems are
   not replaced. This small integration layer adds a new Short Stories tab,
   extends the Stories cast list, and extends Edit Story junction controls.
   ======================================================================== */

(function () {
    'use strict';

    const CHARACTER_TABLE = 'ss_brief_characters';
    const APPEARANCE_TABLE = 'ss_brief_character_appearances';
    const STORY_TABLE = 'ss_stories';
    const briefState = { view: 'character', storyId: '', search: '' };
    const originalLoadTableList = loadTableList;
    const originalLoadJunctions = loadJunctions;

    // The existing Short Stories workspace creates its tabs from SS_TABLES.
    // Insert Brief Characters immediately after Characters while preserving
    // the original configurations and their order.
    const originalConfigs = Object.entries(SS_TABLES);
    for (const key of Object.keys(SS_TABLES)) delete SS_TABLES[key];
    for (const [key, value] of originalConfigs) {
        SS_TABLES[key] = value;
        if (key === 'ss_characters') {
            SS_TABLES[CHARACTER_TABLE] = {
                label: 'Brief Characters',
                singularLabel: 'Brief Character',
                icon: '\uD83D\uDC65',
                display: ['name']
            };
        }
    }

    // Rename the existing Cast header so both character sections are distinct.
    const storyCastConfig = SS_TABLES.ss_stories?.junctions?.find(j => j.table === 'ss_story_cast');
    if (storyCastConfig) storyCastConfig.label = 'Developed Characters';

    // Styles are scoped to this feature; no existing CSS needs replacing.
    const style = document.createElement('style');
    style.textContent = `
        .ss-brief-controls { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin:0 0 14px; }
        .ss-brief-controls button { white-space:nowrap; }
        .ss-brief-controls .form-group { margin:0; flex:1 1 230px; }
        .ss-brief-controls select, .ss-brief-controls input { width:100%; }
        .ss-brief-mode { display:flex; gap:8px; margin-bottom:16px; }
        .ss-brief-mode .active { background:var(--accent, #476da5); color:white; }
        .ss-brief-small { color:var(--text-muted, #7b8190); font-size:.84rem; line-height:1.5; }
        .ss-brief-purpose { white-space:pre-wrap; margin-top:6px; }
        .ss-brief-appearance { padding:12px 0; border-bottom:1px solid var(--border, #ddd); }
        .ss-brief-appearance:last-child { border-bottom:0; }
        .ss-brief-item { margin:8px 0; }
        .ss-brief-card-title { display:flex; align-items:center; flex-wrap:wrap; gap:8px; }
        .ss-brief-pill { border:1px solid var(--border, #999); border-radius:999px; padding:2px 8px; font-size:.72rem; }
        .ss-brief-actions { display:flex; flex-wrap:wrap; gap:7px; margin-top:8px; }
        .ss-brief-form-area { margin:16px 0 22px; }
        .ss-brief-form-area select, .ss-brief-form-area input, .ss-brief-form-area textarea { width:100%; box-sizing:border-box; }
        .ss-brief-inline-edit { margin-top:10px; padding:12px; border:1px solid var(--border, #ddd); border-radius:8px; }
        .ss-brief-section { padding-top:14px; border-top:1px solid var(--border, #ddd); margin-top:20px; }
        .ss-brief-summary { margin-top:8px; }
    `;
    document.head.appendChild(style);

    function escapeValue(value) { return esc(value == null ? '' : String(value)); }
    function attributeValue(value) { return escapeValue(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
    function errorText(error) { return error && error.message ? error.message : String(error); }
    function emptyAsNull(value) {
        const text = String(value == null ? '' : value).trim();
        return text || null;
    }
    function getBriefPage() {
        const container = document.querySelector('#table-content');
        const active = document.querySelector('#ss-tabs .tab.active');
        return container && active && active.dataset.table === CHARACTER_TABLE ? container : null;
    }
    function attrId(id) { return attributeValue(id); }
    function timestamp() { return new Date().toISOString(); }
    function isStoryJunction(junctions) {
        return junctions.some(j => j.table === 'ss_story_cast');
    }
    function optionHtml(rows, valueKey, labelKey, selectedId) {
        return rows.map(row => `<option value="${attrId(row[valueKey])}"${row[valueKey] === selectedId ? ' selected' : ''}>${escapeValue(row[labelKey])}</option>`).join('');
    }

    async function queryTable(table, fields, orderField = null) {
        let q = sb.from(table).select(fields);
        if (orderField) q = q.order(orderField);
        const { data, error } = await q;
        if (error) throw error;
        return data || [];
    }

    async function readBriefData() {
        const [characters, stories, appearances] = await Promise.all([
            queryTable(CHARACTER_TABLE, 'id,name,brief_description,physical_description,notes,created_at', 'name'),
            queryTable(STORY_TABLE, 'id,name', 'name'),
            queryTable(APPEARANCE_TABLE, 'id,character_id,story_id,purpose_in_story,importance')
        ]);
        const storyById = new Map(stories.map(s => [s.id, s]));
        const characterById = new Map(characters.map(c => [c.id, c]));
        return { characters, stories, appearances, storyById, characterById };
    }

    // The list is a separate view; it deliberately does not change the
    // generic add/edit behavior used for established Short Stories records.
    async function loadBriefList() {
        const container = getBriefPage();
        if (!container) return;
        container.innerHTML = '<div class="loading-screen" style="height:auto;min-height:120px;"><div class="loading-spinner"></div></div>';
        try {
            const data = await readBriefData();
            if (!getBriefPage() || getBriefPage() !== container) return;

            if (briefState.view === 'story' && !briefState.storyId && data.stories.length) {
                briefState.storyId = data.stories[0].id;
            }
            if (briefState.storyId && !data.storyById.has(briefState.storyId)) {
                briefState.storyId = data.stories.length ? data.stories[0].id : '';
            }

            container.innerHTML = `
                <div class="page-header"><h2>Brief Characters</h2>
                    <button class="btn btn-primary btn-sm" id="brief-add">+ Add Brief Character</button>
                </div>
                <div class="ss-brief-mode">
                    <button type="button" id="brief-mode-character" class="btn btn-secondary btn-sm${briefState.view === 'character' ? ' active' : ''}">By Character</button>
                    <button type="button" id="brief-mode-story" class="btn btn-secondary btn-sm${briefState.view === 'story' ? ' active' : ''}">By Story</button>
                </div>
                <div id="form-slot" class="ss-brief-form-area"></div>
                <div id="brief-content"></div>`;

            document.getElementById('brief-mode-character').onclick = () => {
                briefState.view = 'character'; briefState.search = ''; loadBriefList();
            };
            document.getElementById('brief-mode-story').onclick = () => {
                briefState.view = 'story'; loadBriefList();
            };
            document.getElementById('brief-add').onclick = () => {
                showBriefForm(null, briefState.view === 'story' ? briefState.storyId : '');
            };

            if (briefState.view === 'character') renderByCharacter(data);
            else await renderByStory(data);

            // Restore a form after a real iPad/Safari page reload.
            const draft = getRouteFormDraft();
            if (draft && draft.meta && draft.meta.kind === 'generic'
                && draft.meta.tableName === CHARACTER_TABLE) {
                await showBriefForm(draft.meta.editId || null, draft.fields?.['brief-story-id'] || '');
            }
        } catch (error) {
            if (getBriefPage() === container) {
                container.innerHTML = `<p style="color:var(--danger)">${escapeValue(errorText(error))}</p>`;
            }
        }
    }

    function renderByCharacter(data) {
        const root = document.getElementById('brief-content');
        if (!root) return;
        const appearancesByChar = new Map();
        for (const row of data.appearances) {
            if (!appearancesByChar.has(row.character_id)) appearancesByChar.set(row.character_id, []);
            appearancesByChar.get(row.character_id).push(row);
        }
        root.innerHTML = `
            <div class="ss-brief-controls">
                <div class="form-group"><label for="brief-search">Search characters</label>
                    <input id="brief-search" type="text" placeholder="Name, description, story..." value="${attributeValue(briefState.search)}"></div>
            </div>
            <div class="entry-list" id="brief-character-list">${data.characters.map(c => {
                const appearances = appearancesByChar.get(c.id) || [];
                const storyText = appearances.map(a => {
                    const s = data.storyById.get(a.story_id);
                    return s ? `${s.name} (${a.importance})` : '';
                }).filter(Boolean).join(', ');
                return `<div class="entry-card" data-brief-id="${attrId(c.id)}" data-brief-search="${attributeValue([c.name,c.brief_description,c.physical_description,storyText].join(' ').toLowerCase())}">
                    <div>
                        <div class="entry-name">${escapeValue(c.name)}</div>
                        ${c.brief_description ? `<div class="entry-meta">${escapeValue(c.brief_description)}</div>` : ''}
                        ${c.physical_description ? `<div class="ss-brief-small">Appearance: ${escapeValue(c.physical_description)}</div>` : ''}
                        <div class="ss-brief-small ss-brief-summary">Stories: ${storyText ? escapeValue(storyText) : 'None assigned'}</div>
                    </div>
                    <div class="entry-actions">
                        <button type="button" class="btn btn-secondary btn-sm brief-edit">Edit</button>
                        <button type="button" class="btn btn-danger btn-sm brief-delete">Delete</button>
                    </div>
                </div>`;
            }).join('') || '<div class="empty-state"><p>No brief characters yet. Use Add Brief Character to begin.</p></div>'}</div>`;

        root.querySelectorAll('.brief-edit').forEach(button => {
            button.onclick = () => showBriefForm(button.closest('[data-brief-id]').dataset.briefId, '');
        });
        root.querySelectorAll('.brief-delete').forEach(button => {
            button.onclick = async () => {
                const id = button.closest('[data-brief-id]').dataset.briefId;
                const character = data.characterById.get(id);
                const ok = await confirmDialog('Delete Brief Character',
                    `Delete ${character?.name || 'this character'} and remove all of their story appearances? This cannot be undone.`);
                if (!ok) return;
                try {
                    const { error } = await sb.from(CHARACTER_TABLE).delete().eq('id', id);
                    if (error) throw error;
                    toast('Brief character deleted');
                    await loadBriefList();
                } catch (e) { toast(errorText(e), 'error'); }
            };
        });
        const searchInput = document.getElementById('brief-search');
        const applySearch = () => {
            briefState.search = searchInput.value;
            const needle = briefState.search.trim().toLowerCase();
            root.querySelectorAll('[data-brief-id]').forEach(card => {
                card.style.display = (card.dataset.briefSearch || '').includes(needle) ? '' : 'none';
            });
        };
        searchInput.addEventListener('input', applySearch);
        applySearch();
    }

    async function renderByStory(data) {
        const root = document.getElementById('brief-content');
        if (!root) return;
        const selectedStoryId = briefState.storyId;
        root.innerHTML = `
            <div class="ss-brief-controls"><div class="form-group">
                <label for="brief-filter-story">Story</label>
                <select id="brief-filter-story">
                    <option value="">-- Select a story --</option>
                    ${optionHtml(data.stories, 'id', 'name', selectedStoryId)}
                </select></div>
            </div>
            <div id="brief-story-details"></div>`;
        document.getElementById('brief-filter-story').onchange = (event) => {
            briefState.storyId = event.target.value;
            loadBriefList();
        };
        if (!selectedStoryId) {
            document.getElementById('brief-story-details').innerHTML = '<p>Select a story, or create a story in the Stories tab first.</p>';
            return;
        }

        const storyApps = data.appearances.filter(a => a.story_id === selectedStoryId)
            .sort((a,b) => (data.characterById.get(a.character_id)?.name || '').localeCompare(data.characterById.get(b.character_id)?.name || ''));
        const developedNames = await fetchDevelopedCharacterNames(selectedStoryId);
        if (!getBriefPage() || briefState.storyId !== selectedStoryId) return;
        const details = document.getElementById('brief-story-details');
        if (!details) return;
        details.innerHTML = `
            <div class="ss-brief-section"><h3>Developed Characters (${developedNames.length})</h3>
                <div class="ss-brief-small">Managed through Edit Story in the Stories tab.</div>
                <div class="ss-brief-summary">${developedNames.length ? developedNames.map(escapeValue).join(', ') : 'None assigned'}</div>
            </div>
            <div class="ss-brief-section"><h3>Brief Characters (${storyApps.length})</h3>
                <div class="ss-brief-small">Create a new character or link one already in the catalogue.</div>
                <div class="ss-brief-actions"><button type="button" class="btn btn-primary btn-sm" id="brief-add-to-story">+ New Brief Character</button></div>
                <div id="brief-story-appearances">${storyApps.map(a => {
                    const c = data.characterById.get(a.character_id);
                    if (!c) return '';
                    return `<div class="ss-brief-appearance" data-appearance-id="${attrId(a.id)}" data-character-id="${attrId(c.id)}">
                        <div class="ss-brief-card-title"><strong>${escapeValue(c.name)}</strong><span class="ss-brief-pill">${escapeValue(a.importance)}</span></div>
                        ${c.brief_description ? `<div class="ss-brief-small">${escapeValue(c.brief_description)}</div>` : ''}
                        ${a.purpose_in_story ? `<div class="ss-brief-small ss-brief-purpose">Purpose: ${escapeValue(a.purpose_in_story)}</div>` : ''}
                        <div class="ss-brief-actions">
                            <button type="button" class="btn btn-secondary btn-sm brief-story-edit">Edit</button>
                            <button type="button" class="btn btn-secondary btn-sm brief-story-unlink">Remove from Story</button>
                        </div>
                    </div>`;
                }).join('') || '<p class="ss-brief-small">No brief characters assigned yet.</p>'}</div>
                <div id="brief-story-link"></div>
            </div>`;
        document.getElementById('brief-add-to-story').onclick = () => showBriefForm(null, selectedStoryId);
        details.querySelectorAll('.brief-story-edit').forEach(btn => {
            btn.onclick = () => showBriefForm(btn.closest('[data-character-id]').dataset.characterId, selectedStoryId);
        });
        details.querySelectorAll('.brief-story-unlink').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.closest('[data-appearance-id]').dataset.appearanceId;
                await removeAppearance(id, () => loadBriefList());
            };
        });
        await renderLinkExisting(document.getElementById('brief-story-link'), selectedStoryId, data, () => loadBriefList(), 'brief-story');
    }

    async function fetchDevelopedCharacterNames(storyId) {
        const { data: cast, error } = await sb.from('ss_story_cast').select('character_id').eq('story_id', storyId);
        if (error) throw error;
        const ids = [...new Set((cast || []).map(r => r.character_id))];
        if (!ids.length) return [];
        const { data: chars, error: charError } = await sb.from('ss_characters').select('id,name').in('id', ids);
        if (charError) throw charError;
        return (chars || []).map(c => c.name).sort((a,b)=>a.localeCompare(b));
    }

    async function showBriefForm(editId, preferredStoryId) {
        const page = getBriefPage();
        const slot = page?.querySelector('#form-slot');
        if (!slot) return;
        slot.innerHTML = '<div class="form-panel"><p>Loading character...</p></div>';
        try {
            const stories = await queryTable(STORY_TABLE, 'id,name', 'name');
            let character = null;
            let appearances = [];
            if (editId) {
                const { data, error } = await sb.from(CHARACTER_TABLE).select('*').eq('id', editId).single();
                if (error) throw error;
                character = data;
                const r = await sb.from(APPEARANCE_TABLE)
                    .select('id,story_id,importance,purpose_in_story').eq('character_id', editId);
                if (r.error) throw r.error;
                appearances = r.data || [];
            }
            if (!slot.isConnected || getBriefPage() !== page) return;
            let storyId = preferredStoryId || (editId ? appearances[0]?.story_id : '') || '';
            if (storyId && !stories.some(s => s.id === storyId)) storyId = '';
            const appearance = appearances.find(a => a.story_id === storyId);
            slot.innerHTML = `
                <div class="form-panel"><h3>${editId ? 'Edit' : 'New'} Brief Character</h3>
                    <div class="form-group"><label for="brief-name">Character Name *</label>
                        <input id="brief-name" type="text" value="${attributeValue(character?.name)}"></div>
                    <div class="form-group"><label for="brief-description">Brief Description</label>
                        <textarea id="brief-description" rows="2">${escapeValue(character?.brief_description)}</textarea></div>
                    <div class="form-group"><label for="brief-physical">Physical Description</label>
                        <textarea id="brief-physical" rows="2">${escapeValue(character?.physical_description)}</textarea></div>
                    <div class="form-group"><label for="brief-notes">Notes (optional)</label>
                        <textarea id="brief-notes" rows="2">${escapeValue(character?.notes)}</textarea></div>
                    <h4>Appearance in Story</h4>
                    <p class="ss-brief-small">${editId ? 'Choose a story to add or edit its appearance. Leave Story blank to change only the shared profile.' : 'Select the story where this character appears.'}</p>
                    <div class="form-group"><label for="brief-story-id">Story${editId ? '' : ' *'}</label>
                        <select id="brief-story-id"><option value="">-- ${editId ? 'No story change' : 'Select story'} --</option>
                            ${optionHtml(stories, 'id', 'name', storyId)}
                        </select></div>
                    <div class="form-group"><label for="brief-importance">Importance</label>
                        <select id="brief-importance">
                            ${['Main','Side','Minor'].map(value => `<option value="${value}"${(appearance?.importance || 'Minor') === value ? ' selected' : ''}>${value}</option>`).join('')}
                        </select></div>
                    <div class="form-group"><label for="brief-purpose">Purpose in Story</label>
                        <textarea id="brief-purpose" rows="2">${escapeValue(appearance?.purpose_in_story)}</textarea></div>
                    <div class="form-actions">
                        <button type="button" id="brief-cancel" class="btn btn-secondary btn-sm">Cancel</button>
                        <button type="button" id="brief-save" class="btn btn-primary btn-sm">${editId ? 'Update' : 'Create'}</button>
                    </div>
                </div>`;
            const draftMeta = {kind:'generic',tableName:CHARACTER_TABLE,seriesId:null,isNovel:false,editId:editId || null};
            bindFormDraft(draftMeta);

            const storySelect = slot.querySelector('#brief-story-id');
            storySelect.onchange = () => {
                const match = appearances.find(a => a.story_id === storySelect.value);
                slot.querySelector('#brief-importance').value = match?.importance || 'Minor';
                slot.querySelector('#brief-purpose').value = match?.purpose_in_story || '';
                // Existing draft persistence listens for change on all fields.
                slot.querySelector('#brief-purpose').dispatchEvent(new Event('change', {bubbles:true}));
            };
            slot.querySelector('#brief-cancel').onclick = () => {
                clearFormDraft(draftMeta); slot.innerHTML = '';
            };
            slot.querySelector('#brief-save').onclick = async () => {
                const button = slot.querySelector('#brief-save');
                const name = emptyAsNull(slot.querySelector('#brief-name').value);
                const selectedStoryId = storySelect.value;
                if (!name) { toast('Character Name is required', 'error'); return; }
                if (!editId && !selectedStoryId) { toast('Story is required for a new brief character', 'error'); return; }
                const fields = {
                    name,
                    brief_description: emptyAsNull(slot.querySelector('#brief-description').value),
                    physical_description: emptyAsNull(slot.querySelector('#brief-physical').value),
                    notes: emptyAsNull(slot.querySelector('#brief-notes').value),
                    updated_at: timestamp()
                };
                const link = {
                    story_id: selectedStoryId,
                    importance: slot.querySelector('#brief-importance').value,
                    purpose_in_story: emptyAsNull(slot.querySelector('#brief-purpose').value),
                    updated_at: timestamp()
                };
                button.disabled = true;
                let newId = null;
                let profileSaved = false;
                try {
                    let id = editId;
                    if (editId) {
                        const result = await sb.from(CHARACTER_TABLE).update(fields).eq('id', editId).select('id').single();
                        if (result.error) throw result.error;
                    } else {
                        const result = await sb.from(CHARACTER_TABLE).insert(fields).select('id').single();
                        if (result.error) throw result.error;
                        id = result.data.id;
                        newId = id;
                    }
                    profileSaved = true;
                    if (selectedStoryId) {
                        const existingLink = appearances.find(a => a.story_id === selectedStoryId);
                        const result = existingLink
                            ? await sb.from(APPEARANCE_TABLE).update(link).eq('id', existingLink.id)
                            : await sb.from(APPEARANCE_TABLE).insert({...link, character_id:id});
                        if (result.error) throw result.error;
                    }
                    clearFormDraft(draftMeta);
                    toast(editId ? 'Brief character updated' : 'Brief character created');
                    await loadBriefList();
                } catch (e) {
                    if (newId) {
                        // Roll back a newly created profile if the story link
                        // failed; avoid a misleading orphan character record.
                        const rollback = await sb.from(CHARACTER_TABLE).delete().eq('id', newId);
                        if (rollback.error) toast('Story link failed and new character could not be rolled back', 'error');
                    }
                    toast((profileSaved && editId ? 'Profile saved, but appearance failed: ' : '') + errorText(e), 'error');
                    button.disabled = false;
                }
            };
            slot.scrollIntoView({behavior:'smooth',block:'start'});
        } catch (e) {
            slot.innerHTML = `<p style="color:var(--danger)">${escapeValue(errorText(e))}</p>`;
        }
    }

    async function removeAppearance(appearanceId, refresh) {
        const yes = await confirmDialog('Remove from Story',
            'Remove this brief character from this story? The character profile and other story appearances will remain.');
        if (!yes) return;
        try {
            const { error } = await sb.from(APPEARANCE_TABLE).delete().eq('id', appearanceId);
            if (error) throw error;
            toast('Appearance removed');
            await refresh();
        } catch (error) { toast(errorText(error), 'error'); }
    }

    // Shared link-existing form, used both by By Story and Edit Story.
    // The page creates new characters through its main Brief Characters form.
    async function renderLinkExisting(root, storyId, data, refresh, prefix) {
        if (!root || !root.isConnected) return;
        const linkedIds = new Set(data.appearances.filter(a => a.story_id === storyId).map(a => a.character_id));
        const available = data.characters.filter(c => !linkedIds.has(c.id));
        root.innerHTML = `<div class="ss-brief-section"><h4>Link an Existing Brief Character</h4>
            ${available.length ? `<div class="form-group"><label for="${prefix}-existing">Character</label>
                <select id="${prefix}-existing"><option value="">-- Select --</option>${optionHtml(available, 'id', 'name', '')}</select></div>
                <div class="form-group"><label for="${prefix}-importance">Importance</label>
                    <select id="${prefix}-importance"><option>Main</option><option>Side</option><option selected>Minor</option></select></div>
                <div class="form-group"><label for="${prefix}-purpose">Purpose in Story</label>
                    <textarea id="${prefix}-purpose" rows="2"></textarea></div>
                <button type="button" class="btn btn-secondary btn-sm" id="${prefix}-add">Add to Story</button>`
                : '<p class="ss-brief-small">Every brief character is already linked to this story, or there are no brief characters yet.</p>'}
        </div>`;
        const addButton = root.querySelector(`#${prefix}-add`);
        if (!addButton) return;
        addButton.onclick = async () => {
            const characterId = root.querySelector(`#${prefix}-existing`).value;
            if (!characterId) { toast('Select a brief character', 'error'); return; }
            addButton.disabled = true;
            const values = {
                story_id: storyId,
                character_id: characterId,
                importance: root.querySelector(`#${prefix}-importance`).value,
                purpose_in_story: emptyAsNull(root.querySelector(`#${prefix}-purpose`).value)
            };
            try {
                const { error } = await sb.from(APPEARANCE_TABLE).insert(values);
                if (error) throw error;
                toast('Brief character linked');
                await refresh();
            } catch (e) { toast(errorText(e), 'error'); addButton.disabled = false; }
        };
    }

    // Existing story editing already loads Cast and Themes via loadJunctions.
    // Add a second, independent section; never replace the developed cast.
    async function renderEditStoryBriefCharacters(storyId) {
        const slot = document.querySelector('#junction-slot');
        if (!slot || !slot.isConnected) return;
        let root = slot.querySelector('#ss-brief-junction');
        if (!root) {
            root = document.createElement('div');
            root.id = 'ss-brief-junction';
            // Keep the brief selector immediately after Developed Characters,
            // rather than below the unrelated Themes & Rules section.
            const castSection = slot.querySelector('[data-junction="ss_story_cast"]');
            if (castSection) castSection.insertAdjacentElement('afterend', root);
            else slot.appendChild(root);
        }
        root.innerHTML = '<div class="junction-section"><h4>Brief Characters</h4><p class="ss-brief-small">Loading...</p></div>';
        try {
            const data = await readBriefData();
            if (!root.isConnected || root.closest('#junction-slot') !== slot) return;
            const links = data.appearances.filter(a => a.story_id === storyId)
                .sort((a,b) => (data.characterById.get(a.character_id)?.name || '').localeCompare(data.characterById.get(b.character_id)?.name || ''));
            root.innerHTML = `<div class="junction-section"><h4>Brief Characters</h4>
                <p class="ss-brief-small">Separate from Developed Cast above. Changes here affect this story only.</p>
                <div id="ss-brief-story-assigned">${links.map(a => {
                    const c = data.characterById.get(a.character_id);
                    if (!c) return '';
                    return `<div class="ss-brief-appearance" data-brief-link-id="${attrId(a.id)}">
                        <div class="ss-brief-card-title"><strong>${escapeValue(c.name)}</strong>
                            <span class="ss-brief-pill">${escapeValue(a.importance)}</span></div>
                        ${a.purpose_in_story ? `<div class="ss-brief-small ss-brief-purpose">Purpose: ${escapeValue(a.purpose_in_story)}</div>` : ''}
                        <div class="ss-brief-actions">
                            <button type="button" class="btn btn-secondary btn-sm ss-brief-edit-appearance">Edit Appearance</button>
                            <button type="button" class="btn btn-secondary btn-sm ss-brief-remove-appearance">Remove from Story</button>
                        </div><div class="ss-brief-edit-slot"></div>
                    </div>`;
                }).join('') || '<p class="ss-brief-small">No brief characters assigned.</p>'}</div>
                <div id="ss-brief-story-link"></div>
            </div>`;
            root.querySelectorAll('.ss-brief-remove-appearance').forEach(button => {
                button.onclick = () => {
                    const id = button.closest('[data-brief-link-id]').dataset.briefLinkId;
                    removeAppearance(id, () => renderEditStoryBriefCharacters(storyId));
                };
            });
            root.querySelectorAll('.ss-brief-edit-appearance').forEach(button => {
                button.onclick = () => {
                    const card = button.closest('[data-brief-link-id]');
                    const a = links.find(x => x.id === card.dataset.briefLinkId);
                    const target = card.querySelector('.ss-brief-edit-slot');
                    if (!a || !target) return;
                    target.innerHTML = `<div class="ss-brief-inline-edit">
                        <div class="form-group"><label>Importance</label>
                            <select class="ss-brief-edit-importance">${['Main','Side','Minor'].map(v=>`<option${a.importance === v ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
                        <div class="form-group"><label>Purpose in Story</label>
                            <textarea class="ss-brief-edit-purpose" rows="2">${escapeValue(a.purpose_in_story)}</textarea></div>
                        <div class="ss-brief-actions"><button type="button" class="btn btn-primary btn-sm ss-brief-appearance-save">Save Appearance</button>
                            <button type="button" class="btn btn-secondary btn-sm ss-brief-appearance-cancel">Cancel</button></div>
                    </div>`;
                    target.querySelector('.ss-brief-appearance-cancel').onclick = () => { target.innerHTML = ''; };
                    target.querySelector('.ss-brief-appearance-save').onclick = async () => {
                        const saveButton = target.querySelector('.ss-brief-appearance-save');
                        saveButton.disabled = true;
                        try {
                            const { error } = await sb.from(APPEARANCE_TABLE).update({
                                importance: target.querySelector('.ss-brief-edit-importance').value,
                                purpose_in_story: emptyAsNull(target.querySelector('.ss-brief-edit-purpose').value),
                                updated_at: timestamp()
                            }).eq('id', a.id);
                            if (error) throw error;
                            toast('Appearance updated');
                            await renderEditStoryBriefCharacters(storyId);
                        } catch (e) { toast(errorText(e), 'error'); saveButton.disabled = false; }
                    };
                };
            });
            const linkRoot = root.querySelector('#ss-brief-story-link');
            await renderLinkExisting(linkRoot, storyId, data, () => renderEditStoryBriefCharacters(storyId), 'ss-brief-edit');
        } catch (e) {
            if (root.isConnected) root.innerHTML = `<div class="junction-section"><h4>Brief Characters</h4><p style="color:var(--danger)">${escapeValue(errorText(e))}</p></div>`;
        }
    }

    // Stories list enhancement: retain the existing cast lookup and add a
    // second line of brief characters. Does not change story records.
    async function enhanceStoriesList() {
        const container = getBriefPage() ? null : document.querySelector('#table-content');
        const active = document.querySelector('#ss-tabs .tab.active');
        if (!container || !active || active.dataset.table !== STORY_TABLE) return;
        const cards = [...container.querySelectorAll('.entry-card[data-id]')];
        if (!cards.length) return;
        const storyIds = cards.map(c => c.dataset.id);
        try {
            const { data: links, error: linkError } = await sb.from(APPEARANCE_TABLE)
                .select('story_id,character_id').in('story_id',storyIds);
            if (linkError) throw linkError;
            const ids = [...new Set((links || []).map(l=>l.character_id))];
            let characters = [];
            if (ids.length) {
                const query = await sb.from(CHARACTER_TABLE).select('id,name').in('id',ids);
                if (query.error) throw query.error;
                characters = query.data || [];
            }
            if (!container.isConnected || active.dataset.table !== STORY_TABLE) return;
            const names = new Map(characters.map(c=>[c.id,c.name]));
            const briefCastMap = new Map();
            for (const link of links || []) {
                const name = names.get(link.character_id);
                if (!name) continue;
                if (!briefCastMap.has(link.story_id)) briefCastMap.set(link.story_id, []);
                if (!briefCastMap.get(link.story_id).includes(name)) briefCastMap.get(link.story_id).push(name);
            }
            for (const card of cards) {
                if (!card.isConnected) continue;
                const body = card.firstElementChild;
                if (!body) continue;
                for (const line of body.querySelectorAll('.entry-meta')) {
                    const taggedCast = line.querySelector('.ss-cast-tag');
                    if (taggedCast) {
                        taggedCast.textContent = taggedCast.textContent.replace(/^Cast:/, 'Developed:');
                    } else if (line.textContent.trim().startsWith('Cast:')) {
                        line.textContent = line.textContent.replace(/^Cast:/, 'Developed:');
                    }
                }
                body.querySelectorAll('.ss-brief-cast-line').forEach(e=>e.remove());
                const list = (briefCastMap.get(card.dataset.id) || []).sort((a,b)=>a.localeCompare(b));
                const div = document.createElement('div');
                div.className = 'entry-meta ss-brief-cast-line';
                div.textContent = 'Brief: ' + (list.length ? list.join(', ') : '\u2014');
                body.appendChild(div);
            }
        } catch (e) {
            toast('Could not load brief cast: '+errorText(e), 'error');
        }
    }

    loadTableList = async function (seriesId, tableName, tableConfigs, isNovel) {
        if (!isNovel && tableName === CHARACTER_TABLE && tableConfigs === SS_TABLES) {
            return loadBriefList();
        }
        await originalLoadTableList(seriesId, tableName, tableConfigs, isNovel);
        if (!isNovel && tableName === STORY_TABLE && tableConfigs === SS_TABLES) {
            await enhanceStoriesList();
        }
    };

    loadJunctions = async function (seriesId, parentId, junctions) {
        await originalLoadJunctions(seriesId, parentId, junctions);
        if (isStoryJunction(junctions)) {
            await renderEditStoryBriefCharacters(parentId);
        }
    };

    // If authentication rendered the workspace while this script was still
    // downloading, redraw the Short Stories route to add the new tab.
    if (typeof currentUser !== 'undefined' && currentUser
        && typeof getRoute === 'function' && getRoute().path[0] === 'short-stories') {
        handleRoute();
    }
})();
