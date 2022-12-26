<script lang="ts">
    import { getNoticeText } from "$lib/api";
    import { onMount } from "svelte";


    export let date: Date;

    let noticeText: string | null = null;
    $: brokenWarning = false;

    onMount(async ()=>{
        let data = await getNoticeText(date);
        noticeText = data.html;
        brokenWarning = data.isBroken;
    })
</script>
{#if noticeText === null}
Loading...
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
