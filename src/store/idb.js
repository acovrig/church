const DB_NAME = 'eventdb';
const DB_VERSION = 1;
let DB;

export default {
    async getDb() {
        return new Promise((resolve, reject) => {
            if(DB) { return resolve(DB); }
            console.log('Opening DB', DB_NAME, DB_VERSION);
            let req = window.indexedDB.open(DB_NAME, DB_VERSION);
            req.onerror = e => {
                console.error('Error opening db', e);
                reject('Error');
            };

            req.onsuccess = e => {
                DB = e.target.result;
                resolve(DB);
            };

            req.onupgradeneeded = e => {
                console.log('Upgrade needed');
                let db = e.target.result;
                db.createObjectStore('events', {autoIncrement: false, keyPath: '_id'});
            };
        });
    },

    async getEvents() {
        let db = await this.getDb();
        return new Promise(resolve => {
            let trans = db.transaction(['events'], 'readonly');
            trans.oncomplete = () => {
                resolve(events);
            };

            let store = trans.objectStore('events');
            let events = [];
            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if(cursor) {
                    events.push(cursor.value);
                    cursor.continue();
                }
            }
        });
    },

    async saveEvent(event) {
        let db = await this.getDb();
        return new Promise(resolve => {
            let trans = db.transaction(['events'], 'readwrite');
            trans.oncomplete = () => {
                resolve();
            };

            let store = trans.objectStore('events');
            store.put(event);
        })
    },

    async saveEvents(events) {
        // events.forEach(event => {
        //     await this.saveEvent(event);
        // });
        // for(const event in events) {
        //     console.log('save event', event);
        //     await this.saveEvent(event);
        // }
        for(let i = 0; i < events.length; i++) {
            await this.saveEvent(events[i]);
        }
    }
}