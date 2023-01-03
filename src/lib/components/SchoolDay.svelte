<script lang="ts">
    import { getTimeTableDay} from "$lib/api";
    import { formatDate, type NormalisedDate } from "$lib/date";
    import { timetableDayMap } from "$lib/stores";
    import type { Dayjs } from "dayjs";
    import { onDestroy, onMount } from "svelte";

    export let timetableDay: string | null = null;


    export let date: Date | Dayjs;
    export let fancyLoader: boolean = true;
    export let loaded = false;

    $: loaded = !!timetableDay;

    $: brokenWarning = false;

    let loadingPlaceholder = 0;
    let loadingPlaceholderInterval: ReturnType<typeof setInterval> | null = null;

    function updateTimetableDayData(map: Map<NormalisedDate, string | null>) {
        let noticeData = map.get(formatDate(date));
        timetableDay = noticeData ?? null;
        if (timetableDay && loadingPlaceholderInterval) {
            clearInterval(loadingPlaceholderInterval);
            loadingPlaceholderInterval = null;
        }
    }

    const unsub = timetableDayMap.subscribe(updateTimetableDayData);

    function getNoticeData() {
        $timetableDayMap.set(formatDate(date), null);
        $timetableDayMap = $timetableDayMap;

        console.log("Starting timetable day worker, claiming ", formatDate(date));
        getTimeTableDay(date).then((data)=>{
            console.log("Got timetable day data! ", formatDate(date));
            $timetableDayMap.set(formatDate(date), data);
            $timetableDayMap = $timetableDayMap;
        }).catch((err)=>{
            console.error(err);
            setTimeout(getNoticeData, 1000);
        });
    }

    onMount(async ()=>{
        if (!$timetableDayMap.has(formatDate(date))) {
            getNoticeData();
        }
        updateTimetableDayData($timetableDayMap);
        loadingPlaceholderInterval = setInterval(()=>{
            loadingPlaceholder += 1;
            if (loadingPlaceholder > 10) {
                loadingPlaceholder -= 10;
            }
        }, 25)
    })

    onDestroy(()=>{
        unsub();
    });

</script>
{#if timetableDay}
{timetableDay}
{:else if fancyLoader}
{loadingPlaceholder}
{:else}
Loading...
{/if}