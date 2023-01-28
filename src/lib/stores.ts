import { writable, type Writable } from "svelte/store";
import type { NoticeText } from "./api";
import type { NormalisedDate } from "./date";

export let noticeMap = writable(new Map<NormalisedDate, NoticeText | null>());
export let timetableDayMap = writable(new Map<NormalisedDate, string | null>());

export const mobileWidthTransition = 720;

export let serverTime: Writable<Date | null> = writable(null);