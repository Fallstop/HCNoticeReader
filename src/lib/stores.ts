import { writable, type Writable } from "svelte/store";
import type { LunchtimeActivityIndex, NoticeText } from "./api";
import type { NormalisedDate } from "./date";

export let noticeMap = writable(new Map<NormalisedDate, NoticeText | null>());
export let lunchtimeActivityMap = writable(new Map<NormalisedDate, LunchtimeActivityIndex | null>());
export let timetableDayMap = writable(new Map<NormalisedDate, string | null>());

export const mobileWidthTransition = 720;

export let serverTime: Writable<Date | null> = writable(null);


let LOCAL_STORAGE_VERSION = 1;

/** Makes a store persistent in local storage
 * @param  {[Writable]} store Writable store to be made persistent
 * @param  {[string]} key Key to be used in Local Storage
 */
function useLocalStorage<T>(store: Writable<T>, key: string) {
	let localStorageKey = `hcnotices_v${LOCAL_STORAGE_VERSION}_${key}`;
	if (typeof localStorage !== 'undefined') {
		const json = localStorage.getItem(localStorageKey);
		if (json) {
			store.set(JSON.parse(json));
		}

		store.subscribe((current) => {
			localStorage.setItem(localStorageKey, JSON.stringify(current));
		});
	}
}

export let adminToken: Writable<string | null> = writable(null);
useLocalStorage(adminToken, 'adminToken');
