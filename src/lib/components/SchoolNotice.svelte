<script lang="ts">
    import { getNoticeText, type NoticeText } from "$lib/api";
    import { formatDate, type NormalisedDate } from "$lib/date";
    import { noticeMap } from "$lib/stores";
    import { onMount, onDestroy } from "svelte";
    import NoticeContentLoader from "./NoticeContentLoader.svelte";



    export let date: Date;

    let noticeText: string | null = null;
    $: brokenWarning = false;

    function updateNoticeData(map: Map<NormalisedDate, NoticeText | null>) {
        let noticeData = map.get(formatDate(date));
        noticeText = noticeData?.html ?? null;
        brokenWarning = noticeData?.isBroken ?? false;
    }

    const unsub = noticeMap.subscribe(updateNoticeData);

    function getNoticeData() {
        $noticeMap.set(formatDate(date), null);
        $noticeMap = $noticeMap;

        console.log("Starting worker, claiming ", formatDate(date));
        getNoticeText(date).then((data)=>{
            console.log("Got data! ", formatDate(date), data);
            $noticeMap.set(formatDate(date), data);
            $noticeMap = $noticeMap;
        }).catch((err)=>{
            console.error(err);
            setTimeout(getNoticeData, 1000);
        });
    }

    onMount(async ()=>{
        if (!$noticeMap.has(formatDate(date))) {
            getNoticeData();
        }
        updateNoticeData($noticeMap);
    })

    onDestroy(()=>{
        unsub();
    });

    $: outerContainerWidth = 0;
    $: outerContainerHeight = 0;
</script>
<div class="outer-container" bind:clientHeight={outerContainerHeight} bind:clientWidth={outerContainerWidth}>
    {#if noticeText === null}
    <NoticeContentLoader width={outerContainerWidth} height={outerContainerHeight} />

    {:else}
        {#if noticeText}
            {#if brokenWarning}
            <div class="warning">
                <p>Warning: This notice is broken. It may not be accurate.</p>
            </div>
            {/if}
    
            <div class="notice">
                {@html noticeText}
            </div>
        {:else}
            Nothing here?
        {/if}
    {/if}
    
</div>
<style lang="scss">
    .outer-container {
        width: 100%;
        .notice {
            padding-bottom: 1em;
        }
    }
</style>