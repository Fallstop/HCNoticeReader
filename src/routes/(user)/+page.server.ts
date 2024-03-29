import { invalidate } from "$app/navigation";
import { getLunchtimeActivity, getNoticeText, getTimeTableDay } from "$lib/api";
import { formatDate } from "$lib/date";
import type { LoadEvent } from "@sveltejs/kit";


export async function load({fetch, params, depends}: LoadEvent) {
    
    const now = new Date(new Date().toLocaleString('en', {timeZone: 'pacific/auckland'}));
    let noticeText = await getNoticeText(now, fetch);
    let timetableDay = await getTimeTableDay(now, fetch);
    let lunchtimeActivity = await getLunchtimeActivity(now, fetch);



    return {
        date: formatDate(now),
        noticeText,
        timetableDay,
        lunchtimeActivity,
        serverTime: now
    };
}