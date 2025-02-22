// @ts-check
/** @import {Client} from "archipelago.js" */
/** @import {TagData} from "../tags/tagManager"*/

/** @type {Client} */
let client = null;
/** @type {import("../tags/tagManager").TagManager} */
let tagManager = null;

const NOTE_KEY = "_tracker_note";
const TAG_KEY = "_tracker_ap_checklist_tags";
/**
 *
 * @param {string} note
 */
const saveNote = async (note) => {
    if (!client || !client.authenticated) {
        throw new Error(
            "Failed to save note, no connection to Archipelago Server."
        );
    }
    let key = `${NOTE_KEY}_${client.players.self.team}_${client.players.self.slot}`;
    await client.storage
        .prepare(key, { text: "", timestamp: Date.now() })
        .update({ text: note, timestamp: Date.now() })
        .commit();
};

const loadNote = async () => {
    if (!client || !client.authenticated) {
        throw new Error(
            "Failed to load note, no connection to Archipelago Server."
        );
    }
    let key = `${NOTE_KEY}_${client.players.self.team}_${client.players.self.slot}`;
    let value = await client.storage.fetch([key], true);
    return (value[key] ?? { text: "" })["text"];
};

/**
 * 
 * @param {Object.<string, TagData>} tags 
 */
const addTags_remote = async (tags) => {
    if (!client || !client.authenticated) {
        throw new Error(
            "Failed to save tags, no connection to Archipelago Server."
        );
    }
    let key = `${TAG_KEY}_${client.players.self.team}_${client.players.self.slot}`;
    client.storage.prepare(key, {}).update(tags).commit();
};

/**
 *
 * @param {Client} client_
 * @param {import("../tags/tagManager").TagManager} tagManager_
 */
const enableDataSync = (client_, tagManager_) => {
    client = client_;
    client.storage.notify([`${TAG_KEY}_${client.players.self.team}_${client.players.self.slot}`], (key, value, oldValue) => {
        console.log("Key", key);
        console.log("Value", value);
        console.log("Old Value", oldValue);

    })

    // window.client = client;
    // window.__key = `${TAG_KEY}_${client.players.self.team}_${client.players.self.slot}`;
    tagManager = tagManager_;
};

export { saveNote, loadNote, enableDataSync };
