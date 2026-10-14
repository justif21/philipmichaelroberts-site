/* ============================================================================
   PHILIPMICHAELROBERTS-SITE / VACATION & PLACES EXPANSION
   P4 — Vacation / Places data layer (GitHub file 1)
   Version 1.0 — 2026-10-14

   INSTALLATION (THIS STAGE ONLY)
     1. In GitHub repo justif21/philipmichaelroberts-site, on main, add a
        NEW file named: ent-vacations-data.js
     2. Copy ALL the contents of this .txt into the new .js file and commit.
     3. DO NOT replace app.js or edit index.html yet. The next website step
        will load this file and connect it to navigation/forms.
     4. Merely adding this file has no effect on the existing live website.

   IMPORTANT
     - This is JavaScript, not SQL. The Supabase migration is already applied.
     - Does not contain credentials or initialize a second Supabase client.
     - The existing app.js owns the authenticated Supabase client named sb.
     - Later usage from app.js (after index.html includes this file):
           const vacationData = window.EntVacationData.create(sb);
           const trips = await vacationData.listVacations();
     - Backend RLS / database constraints remain the final authority.
     - Normal deletion and cascading FK behavior follow the approved SQL.
     - Region is a DEFAULT FILTER, not a database-level restriction.
   ============================================================================ */

(function (global) {
    'use strict';

    const TABLE = Object.freeze({
        regions: 'ent_regions',
        areas: 'ent_neighborhoods',
        places: 'ent_places',
        vacations: 'ent_vacations',
        flights: 'ent_vacation_flights',
        lodging: 'ent_vacation_lodging',
        transport: 'ent_vacation_transport',
        events: 'ent_events',
        items: 'ent_vacation_items'
    });
    const VACATION_STATUS = Object.freeze(['Planning', 'Upcoming', 'Completed', 'Cancelled']);
    const BOOKING_STATUS = Object.freeze(['Not Planned', 'Researching', 'Booked', 'Not Needed']);
    const INTEREST_STATUS = Object.freeze(['Want to Visit', 'Visited', 'Favorite', 'Not Interested']);
    const PLACE_CATEGORY = Object.freeze(['Food & Drink', 'Lodging', 'Attractions', 'Entertainment', 'Shopping']);
    const FLIGHT_DIRECTION = Object.freeze(['Outbound', 'Return', 'Other']);
    const TARGET_KEYS = Object.freeze(['region_id', 'area_id', 'place_id', 'event_id']);
    const DATE_FIELDS = new Set(['start_date', 'end_date', 'planned_date', 'visited_date', 'check_in_date', 'check_out_date']);
    const BOOL_FIELDS = new Set(['visited', 'is_primary']);
    const TIME_FIELDS = new Set([
        'departure_datetime', 'arrival_datetime', 'scheduled_datetime',
        'start_datetime', 'end_datetime'
    ]);

    // Strict allow-lists make sure forms cannot accidentally send id, timestamps,
    // foreign keys belonging to another record, or unapproved SQL columns.
    const FIELDS = Object.freeze({
        ent_regions: ['name', 'type', 'description', 'status', 'notes'],
        ent_neighborhoods: ['name', 'region_id', 'description', 'status', 'notes'],
        ent_places: [
            'name', 'neighborhood_id', 'address', 'type', 'category', 'description',
            'price_range', 'booking_url', 'food_cost', 'drink_cost', 'happy_hour',
            'gluten_free', 'ice_type', 'rating', 'status', 'url', 'notes'
        ],
        ent_vacations: ['name', 'primary_region_id', 'start_date', 'end_date', 'status', 'description', 'notes'],
        ent_vacation_flights: [
            'direction', 'airline', 'flight_number', 'departure_airport', 'arrival_airport',
            'departure_datetime', 'arrival_datetime', 'departure_timezone', 'arrival_timezone',
            'booking_status', 'booking_notes', 'notes'
        ],
        ent_vacation_lodging: [
            'place_id', 'lodging_name', 'check_in_date', 'check_out_date',
            'booking_status', 'is_primary', 'booking_notes', 'notes'
        ],
        ent_vacation_transport: [
            'type', 'provider', 'departure_location', 'arrival_location',
            'scheduled_datetime', 'scheduled_timezone', 'booking_status',
            'booking_notes', 'notes'
        ],
        ent_events: [
            'name', 'venue_place_id', 'start_datetime', 'end_datetime', 'event_timezone',
            'description', 'ticket_url', 'price', 'notes'
        ],
        ent_vacation_items: [
            'region_id', 'area_id', 'place_id', 'event_id',
            'planned_date', 'visited', 'visited_date', 'notes'
        ]
    });

    function clean(table, values) {
        if (!FIELDS[table]) throw new Error('Unknown destination/vacation table: ' + table);
        const out = {};
        for (const key of FIELDS[table]) {
            if (!Object.prototype.hasOwnProperty.call(values || {}, key)) continue;
            const value = values[key];
            if (value === undefined) continue;
            if (BOOL_FIELDS.has(key)) {
                out[key] = value === true;
            } else if (typeof value === 'string') {
                out[key] = value.trim() || null;
                if (DATE_FIELDS.has(key) && out[key]) {
                    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(out[key]);
                    const year = match && +match[1], month = match && +match[2], day = match && +match[3];
                    const actual = match ? new Date(Date.UTC(year, month - 1, day)) : null;
                    if (!actual || actual.getUTCFullYear() !== year ||
                        actual.getUTCMonth() !== month - 1 || actual.getUTCDate() !== day) {
                        throw new Error('Invalid calendar date for ' + key + '.');
                    }
                }
            } else {
                out[key] = value == null ? null : value;
            }
        }
        return out;
    }

    function requiredName(value, label) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error((label || 'Name') + ' is required.');
        }
    }
    function enforceChoice(value, options, label) {
        if (value != null && !options.includes(value)) {
            throw new Error('Invalid ' + label + ': ' + value);
        }
    }
    function datesInOrder(row, fromKey, toKey, label) {
        if (row[fromKey] && row[toKey] && row[toKey] < row[fromKey]) {
            throw new Error((label || 'End date/time') + ' cannot precede its start.');
        }
    }
    function ensureVacationId(id) {
        if (!id || typeof id !== 'string') throw new Error('A vacation ID is required.');
    }
    function ensureId(id) {
        if (!id || typeof id !== 'string') throw new Error('A record ID is required.');
    }
    function sortByName(rows) {
        return [...rows].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    }

    // Datetime inputs should be converted from the timezone AT THE AIRPORT/VENUE,
    // not from the timezone of the visitor's iPad. An offset-bearing ISO string
    // is already unambiguous. For datetime-local (no offset) provide an IANA zone.
    function partsInZone(date, timeZone) {
        const fields = new Intl.DateTimeFormat('en-US', {
            timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit',
            day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).formatToParts(date);
        const p = {};
        for (const part of fields) {
            if (part.type !== 'literal') p[part.type] = Number(part.value);
        }
        return p;
    }
    function localDateTimeToIso(localText, timeZone) {
        if (!timeZone) throw new Error('Select an IANA timezone for this date/time.');
        const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(localText || '');
        if (!m) throw new Error('Expected local date/time as YYYY-MM-DDTHH:mm.');
        const y = +m[1], mon = +m[2], d = +m[3], h = +m[4], min = +m[5], sec = +(m[6] || 0);
        const target = Date.UTC(y, mon - 1, d, h, min, sec);
        const naive = new Date(target);
        if (naive.getUTCFullYear() !== y || naive.getUTCMonth() !== mon - 1 ||
            naive.getUTCDate() !== d || naive.getUTCHours() !== h ||
            naive.getUTCMinutes() !== min || naive.getUTCSeconds() !== sec) {
            throw new Error('Invalid local calendar date/time.');
        }
        // Iterate the target local-time offset; correct for DST at the target.
        let utc = target;
        for (let i = 0; i < 4; i++) {
            const p = partsInZone(new Date(utc), timeZone);
            const shownAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
            const offset = shownAsUtc - utc;
            const next = target - offset;
            if (next === utc) break;
            utc = next;
        }
        const check = partsInZone(new Date(utc), timeZone);
        if (check.year !== y || check.month !== mon || check.day !== d ||
            check.hour !== h || check.minute !== min || check.second !== sec) {
            throw new Error('That local time does not exist or is ambiguous due to daylight saving. Use an ISO time with explicit UTC offset.');
        }
        // During the autumn DST rollback, the same wall clock time can occur
        // twice. Refuse to guess which flight/event instant the user meant.
        const sameParts = timestamp => {
            const p = partsInZone(new Date(timestamp), timeZone);
            return p.year === y && p.month === mon && p.day === d &&
                p.hour === h && p.minute === min && p.second === sec;
        };
        if (sameParts(utc - 3600000) || sameParts(utc + 3600000)) {
            throw new Error('This local time occurs twice due to daylight saving. Enter an ISO time with an explicit UTC offset.');
        }
        return new Date(utc).toISOString();
    }
    function isoToLocalInput(iso, timeZone) {
        if (!iso) return '';
        if (!timeZone) throw new Error('A timezone is required to display a local event/flight time.');
        const date = new Date(iso);
        if (isNaN(date.getTime())) throw new Error('Invalid stored date/time.');
        const p = partsInZone(date, timeZone);
        const n = x => String(x).padStart(2, '0');
        return `${p.year}-${n(p.month)}-${n(p.day)}T${n(p.hour)}:${n(p.minute)}`;
    }
    function normalizeTimes(row) {
        const out = { ...row };
        const zoneFor = {
            departure_datetime: 'departure_timezone',
            arrival_datetime: 'arrival_timezone',
            scheduled_datetime: 'scheduled_timezone',
            start_datetime: 'event_timezone',
            end_datetime: 'event_timezone'
        };
        for (const key of TIME_FIELDS) {
            if (!Object.prototype.hasOwnProperty.call(out, key)) continue;
            const val = out[key];
            if (!val) { out[key] = null; continue; }
            if (typeof val !== 'string') throw new Error(key + ' must be a date/time string.');
            if (/([+-]\d{2}:\d{2}|Z)$/i.test(val)) {
                const date = new Date(val);
                if (isNaN(date.getTime())) throw new Error('Invalid ' + key + '.');
                out[key] = date.toISOString();
            } else {
                out[key] = localDateTimeToIso(val, out[zoneFor[key]]);
            }
        }
        return out;
    }
    function orderActivities(items) {
        return [...items].sort((a, b) => {
            if (!a.planned_date && b.planned_date) return 1;
            if (a.planned_date && !b.planned_date) return -1;
            return String(a.planned_date || '').localeCompare(String(b.planned_date || ''));
        });
    }

    function create(client) {
        if (!client || typeof client.from !== 'function') {
            throw new Error('Provide the existing authenticated Supabase JS client.');
        }

        async function many(table, options = {}) {
            const allowed = Object.values(TABLE);
            if (!allowed.includes(table)) throw new Error('Unrecognized table: ' + table);
            const order = options.orderBy || (['ent_vacation_flights', 'ent_vacation_items', 'ent_vacation_transport', 'ent_vacation_lodging'].includes(table) ? 'created_at' : 'name');
            const batchSize = 800; // Avoid Supabase 1000-row default limit.
            const all = [];
            for (let offset = 0; ; offset += batchSize) {
                let query = client.from(table).select('*').order(order, { ascending: options.ascending !== false });
                if (options.vacationId) query = query.eq('vacation_id', options.vacationId);
                if (options.regionId && table === TABLE.areas) query = query.eq('region_id', options.regionId);
                if (options.category && table === TABLE.places) query = query.eq('category', options.category);
                query = query.range(offset, offset + batchSize - 1);
                const { data, error } = await query;
                if (error) throw error;
                const rows = data || [];
                all.push(...rows);
                if (rows.length < batchSize) break;
            }
            return all;
        }
        async function one(table, id) {
            ensureId(id);
            const { data, error } = await client.from(table).select('*').eq('id', id).single();
            if (error) throw error;
            return data;
        }
        async function write(table, values, id = null, extra = {}) {
            const data = normalizeTimes(clean(table, values));
            let query;
            if (id) {
                // Server trigger sets updated_at; never send it from the browser.
                query = client.from(table).update(data).eq('id', id);
                if (extra.vacation_id) query = query.eq('vacation_id', extra.vacation_id);
            } else {
                query = client.from(table).insert({ ...data, ...extra });
            }
            const { data: result, error } = await query.select('*').single();
            if (error) throw error;
            return result;
        }
        async function remove(table, id) {
            ensureId(id);
            const { error } = await client.from(table).delete().eq('id', id);
            if (error) throw error;
            return true;
        }

        async function listRegions() { return many(TABLE.regions, { orderBy: 'name' }); }
        async function listAreas(regionId = null) {
            return many(TABLE.areas, { orderBy: 'name', regionId });
        }
        async function listPlaces() { return many(TABLE.places, { orderBy: 'name' }); }
        async function listEvents() { return many(TABLE.events, { orderBy: 'name' }); }
        async function listVacations() {
            return many(TABLE.vacations, { orderBy: 'start_date', ascending: false });
        }
        async function listFlights(vacationId) {
            ensureVacationId(vacationId);
            return many(TABLE.flights, { vacationId, orderBy: 'departure_datetime' });
        }
        async function listLodging(vacationId) {
            ensureVacationId(vacationId);
            return many(TABLE.lodging, { vacationId, orderBy: 'check_in_date' });
        }
        async function listTransport(vacationId) {
            ensureVacationId(vacationId);
            return many(TABLE.transport, { vacationId, orderBy: 'scheduled_datetime' });
        }
        async function listItems(vacationId) {
            ensureVacationId(vacationId);
            return orderActivities(await many(TABLE.items, { vacationId, orderBy: 'created_at' }));
        }

        // Local is only a convenience Region filter. No hardcoded UUID or
        // Local/Vacation constraint exists; all regions remain selectable.
        async function findKansasCityRegion() {
            const regions = await listRegions();
            return regions.find(r => /^kansas city(?:\s|$)/i.test((r.name || '').trim())) || null;
        }
        async function directory(options = {}) {
            const { regionId = null, category = null, includeUnassigned = false } = options;
            if (category) enforceChoice(category, PLACE_CATEGORY, 'Place category');
            const [regions, areas, places] = await Promise.all([
                listRegions(), listAreas(), listPlaces()
            ]);
            const regionMap = new Map(regions.map(r => [r.id, r]));
            const areaMap = new Map(areas.map(a => [a.id, a]));
            const rows = places.filter(p => {
                if (category && p.category !== category) return false;
                if (!regionId) return true;
                const area = areaMap.get(p.neighborhood_id);
                return area ? area.region_id === regionId : !!includeUnassigned;
            }).map(place => {
                const area = areaMap.get(place.neighborhood_id) || null;
                const region = area ? regionMap.get(area.region_id) || null : null;
                return { ...place, area, region };
            });
            return { regions, areas, places: sortByName(rows) };
        }
        async function regionSuggestions(vacationId, opts = {}) {
            const vacation = await one(TABLE.vacations, vacationId);
            // Passing regionId:null explicitly switches from the trip's preferred
            // region to ALL regions; absence uses the vacation default.
            const regionId = Object.prototype.hasOwnProperty.call(opts, 'regionId')
                ? opts.regionId : vacation.primary_region_id;
            return directory({ regionId: regionId || null,
                category: opts.category || null,
                includeUnassigned: !!opts.includeUnassigned });
        }
        async function activityChoices(vacationId, options = {}) {
            const vacation = await one(TABLE.vacations, vacationId);
            const regionId = Object.prototype.hasOwnProperty.call(options, 'regionId')
                ? options.regionId : vacation.primary_region_id;
            const [regions, areas, places, events] = await Promise.all([
                listRegions(), listAreas(), listPlaces(), listEvents()
            ]);
            const areaMap = new Map(areas.map(x => [x.id, x]));
            const placeMap = new Map(places.map(x => [x.id, x]));
            const areaAllowed = a => !regionId || a.region_id === regionId;
            const placeAllowed = p => {
                if (!regionId) return true;
                const area = areaMap.get(p.neighborhood_id);
                return area ? areaAllowed(area) : !!options.includeUnassigned;
            };
            const eventAllowed = e => {
                if (!regionId) return true;
                const venue = placeMap.get(e.venue_place_id);
                return venue ? placeAllowed(venue) : !!options.includeUnassigned;
            };
            return {
                regionId: regionId || null,
                regions: sortByName(regions),
                areas: sortByName(areas.filter(areaAllowed)),
                places: sortByName(places.filter(placeAllowed)),
                events: sortByName(events.filter(eventAllowed))
            };
        }
        async function lodgingChoices(vacationId, opts = {}) {
            return regionSuggestions(vacationId, { ...opts, category: 'Lodging' });
        }

        async function saveRegion(values, id = null) {
            const row = clean(TABLE.regions, values);
            if (!id || Object.prototype.hasOwnProperty.call(row, 'name')) requiredName(row.name, 'Region name');
            if (row.status) enforceChoice(row.status, INTEREST_STATUS, 'Region status');
            return write(TABLE.regions, row, id);
        }
        async function saveArea(values, id = null) {
            const row = clean(TABLE.areas, values);
            if (!id || Object.prototype.hasOwnProperty.call(row, 'name')) requiredName(row.name, 'Area name');
            if (row.status) enforceChoice(row.status, INTEREST_STATUS, 'Area status');
            return write(TABLE.areas, row, id);
        }
        async function savePlace(values, id = null) {
            const row = clean(TABLE.places, values);
            if (!id || Object.prototype.hasOwnProperty.call(row, 'name')) requiredName(row.name, 'Place name');
            if (row.category) enforceChoice(row.category, PLACE_CATEGORY, 'Place category');
            return write(TABLE.places, row, id);
        }
        async function saveVacation(values, id = null) {
            const row = clean(TABLE.vacations, values);
            if (!id || Object.prototype.hasOwnProperty.call(row, 'name')) requiredName(row.name, 'Vacation name');
            if (row.status) enforceChoice(row.status, VACATION_STATUS, 'Vacation status');
            datesInOrder(row, 'start_date', 'end_date', 'Vacation end date');
            return write(TABLE.vacations, row, id);
        }
        async function saveFlight(vacationId, values, id = null) {
            ensureVacationId(vacationId);
            const row = clean(TABLE.flights, values);
            if (row.direction) enforceChoice(row.direction, FLIGHT_DIRECTION, 'Flight direction');
            if (row.booking_status) enforceChoice(row.booking_status, BOOKING_STATUS, 'Flight booking status');
            return write(TABLE.flights, row, id, { vacation_id: vacationId });
        }
        async function saveLodging(vacationId, values, id = null) {
            ensureVacationId(vacationId);
            const row = clean(TABLE.lodging, values);
            if (!id && !row.place_id && !row.lodging_name) throw new Error('Choose a saved Place or enter a lodging name.');
            if (row.booking_status) enforceChoice(row.booking_status, BOOKING_STATUS, 'Lodging booking status');
            datesInOrder(row, 'check_in_date', 'check_out_date', 'Check-out date');
            // Unique primary index is enforced in SQL. To switch primary between
            // two existing records use setPrimaryLodging() below.
            return write(TABLE.lodging, row, id, { vacation_id: vacationId });
        }
        async function setPrimaryLodging(vacationId, lodgingId) {
            ensureVacationId(vacationId); ensureId(lodgingId);
            const records = await listLodging(vacationId);
            if (!records.some(r => r.id === lodgingId)) throw new Error('Lodging does not belong to this vacation.');
            const current = records.find(r => r.is_primary && r.id !== lodgingId);
            if (current) {
                const { error } = await client.from(TABLE.lodging)
                    .update({ is_primary: false }).eq('id', current.id).eq('vacation_id', vacationId);
                if (error) throw error;
            }
            try {
                const { data, error } = await client.from(TABLE.lodging)
                    .update({ is_primary: true }).eq('id', lodgingId).eq('vacation_id', vacationId)
                    .select('*').single();
                if (error) throw error;
                return data;
            } catch (error) {
                // Best-effort rollback of old primary; this is NOT one SQL
                // transaction. Surface errors for the UI/user to recheck.
                if (current) {
                    const { error: restoreError } = await client.from(TABLE.lodging)
                        .update({ is_primary: true }).eq('id', current.id).eq('vacation_id', vacationId);
                    if (restoreError) throw new Error(error.message + ' (and prior primary could not be restored: ' + restoreError.message + ')');
                }
                throw error;
            }
        }
        async function saveTransport(vacationId, values, id = null) {
            ensureVacationId(vacationId);
            const row = clean(TABLE.transport, values);
            if (row.booking_status) enforceChoice(row.booking_status, BOOKING_STATUS, 'Transport booking status');
            return write(TABLE.transport, row, id, { vacation_id: vacationId });
        }
        async function saveEvent(values, id = null) {
            const row = clean(TABLE.events, values);
            if (!id || Object.prototype.hasOwnProperty.call(row, 'name')) requiredName(row.name, 'Event name');
            return write(TABLE.events, row, id);
        }
        async function saveItem(vacationId, values, id = null) {
            ensureVacationId(vacationId);
            const row = clean(TABLE.items, values);
            const hasTargets = TARGET_KEYS.some(k => Object.prototype.hasOwnProperty.call(row, k));
            if (!id || hasTargets) {
                const count = TARGET_KEYS.filter(k => !!row[k]).length;
                if (count !== 1) throw new Error('Choose exactly one Region, Area, Place, or Event.');
                // Clear other target references on an edit as well.
                for (const key of TARGET_KEYS) if (!row[key]) row[key] = null;
            }
            if (row.visited === false) row.visited_date = null;
            // Unique indexes prevent same destination twice in one vacation.
            return write(TABLE.items, row, id, { vacation_id: vacationId });
        }
        async function setVisited(vacationId, itemId, visited, visitedDate = null) {
            ensureVacationId(vacationId); ensureId(itemId);
            const { data, error } = await client.from(TABLE.items)
                .update({ visited: !!visited, visited_date: visited ? visitedDate || null : null })
                .eq('id', itemId).eq('vacation_id', vacationId)
                .select('*').single();
            if (error) throw error;
            return data;
        }
        async function removeItem(vacationId, itemId) {
            ensureVacationId(vacationId); ensureId(itemId);
            // Only the association is removed; master Place/Area/Region/Event
            // survives. Deleting the reusable master record is a separate action.
            const { error } = await client.from(TABLE.items).delete()
                .eq('id', itemId).eq('vacation_id', vacationId);
            if (error) throw error;
            return true;
        }
        async function vacationBundle(vacationId) {
            ensureVacationId(vacationId);
            const [vacation, flights, lodging, transport, items, regions, areas, places, events] = await Promise.all([
                one(TABLE.vacations, vacationId), listFlights(vacationId),
                listLodging(vacationId), listTransport(vacationId),
                listItems(vacationId), listRegions(), listAreas(), listPlaces(), listEvents()
            ]);
            const dictionaries = {
                region_id: new Map(regions.map(x => [x.id, x])),
                area_id: new Map(areas.map(x => [x.id, x])),
                place_id: new Map(places.map(x => [x.id, x])),
                event_id: new Map(events.map(x => [x.id, x]))
            };
            const activities = items.map(item => {
                const key = TARGET_KEYS.find(k => !!item[k]);
                return { ...item, target_type: key ? key.replace('_id', '') : null,
                    target: key ? dictionaries[key].get(item[key]) || null : null };
            });
            const lodgingById = new Map(places.map(x => [x.id, x]));
            const stays = lodging.map(x => ({ ...x, place: x.place_id ? lodgingById.get(x.place_id) || null : null }));
            return { vacation, flights, lodging: stays, transport, activities };
        }

        return Object.freeze({
            TABLE, VACATION_STATUS, BOOKING_STATUS, INTEREST_STATUS,
            PLACE_CATEGORY, FLIGHT_DIRECTION,
            localDateTimeToIso, isoToLocalInput,
            listRegions, listAreas, listPlaces, listEvents, listVacations,
            listFlights, listLodging, listTransport, listItems,
            findKansasCityRegion, directory, regionSuggestions, activityChoices, lodgingChoices,
            saveRegion, saveArea, savePlace, saveVacation, saveFlight,
            saveLodging, setPrimaryLodging, saveTransport, saveEvent, saveItem,
            setVisited, removeItem, vacationBundle,
            getVacation: id => one(TABLE.vacations, id),
            getEvent: id => one(TABLE.events, id),
            getPlace: id => one(TABLE.places, id),
            deleteRegion: id => remove(TABLE.regions, id),
            deleteArea: id => remove(TABLE.areas, id),
            deletePlace: id => remove(TABLE.places, id),
            deleteVacation: id => remove(TABLE.vacations, id),
            deleteFlight: id => remove(TABLE.flights, id),
            deleteLodging: id => remove(TABLE.lodging, id),
            deleteTransport: id => remove(TABLE.transport, id),
            deleteEvent: id => remove(TABLE.events, id)
        });
    }

    global.EntVacationData = Object.freeze({ create, TABLE,
        VACATION_STATUS, BOOKING_STATUS, INTEREST_STATUS, PLACE_CATEGORY,
        FLIGHT_DIRECTION, localDateTimeToIso, isoToLocalInput });
})(window);
