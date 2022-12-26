<script lang="ts">
    import { getNoticeText } from "$lib/api";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import NoticeContentLoader from "./NoticeContentLoader.svelte";



    export let date: Date;

    let noticeText: string | null = null;
    $: brokenWarning = false;

    onMount(async ()=>{
        let data = await getNoticeText(date);
        noticeText = data.html;
        brokenWarning = data.isBroken;
    })

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
    }
</style>