import { writable, type Writable } from "svelte/store";
import type { LunchtimeActivityIndex, NoticeText } from "./api";
import type { NormalisedDate } from "./date";

export let noticeMap = writable(new Map<NormalisedDate, NoticeText | null>());
export let lunchtimeActivityMap = writable(new Map<NormalisedDate, LunchtimeActivityIndex | null>());
export let timetableDayMap = writable(new Map<NormalisedDate, string | null>());

export const mobileWidthTransition = 720;

export let serverTime: Writable<Date | null> = writable(null);