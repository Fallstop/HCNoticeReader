<script lang="ts">
    import { copyElementToClipboard, copyTextToClipboard } from "$lib/clipboardCopy";
    import type { Dayjs } from "dayjs";
    import type { Writable } from "svelte/store";
    import SchoolDay from "./SchoolDay.svelte";
    import SchoolNotice from "./SchoolNotice.svelte";
    export let selectedDate: Writable<Dayjs>;
    import GraphPaper from "$lib/patterns/GraphPaper.svg?url";
    import { fade, fly, scale, slide } from "svelte/transition";
    

    let timetableDay: string;
    let noticeElement: HTMLElement;

    let copyPopoverOpen = false;
    let copyPopoverTimer: NodeJS.Timeout | null = null;
    const copyPopoverMS = 2000;

    function copyAll() {
        copyPopoverOpen = true;
        copyElementToClipboard(noticeElement);
        if (copyPopoverTimer) {clearTimeout(copyPopoverTimer)};
        copyPopoverTimer = setTimeout(()=>{copyPopoverOpen=false},copyPopoverMS);
    }
</script>

<!-- Popup is only used on mobile. -->

<h2>Day: <SchoolDay date={$selectedDate} bind:timetableDay /></h2>
<!-- use:Ripple={{color: '#32E875', opacity: 0.5, clearingDuration: "1.5s"}}  -->
<button on:click={copyAll} class:copied={copyPopoverOpen}>
    {#if copyPopoverOpen }
        <div class="copied-message" in:fade out:scale={{duration: 300, start: 1.3}}>Copied!</div>
    {/if}
    <span class="copy-message">Copy All</span>
</button>

<div class="notice" bind:this={noticeElement} style:background-image="url({GraphPaper})">
    <SchoolNotice date={$selectedDate} {timetableDay} styleMode="light"/>
</div>

<style lang="scss">
    @use "../scss/variables.scss" as *;

    h2 {
        font-size: 2rem;
        margin: 0;
    }
    button {
        border: none;
        background: none;
        padding: 0.25rem 1rem;
        margin: 0.5em 0;
        border-radius: 5px;
        color: $color-text;
        font-size: 1rem;
        text-decoration: none;
        border: $mid-tone solid 1px;
        position: relative;
        cursor: pointer;
        &.copied {
            border-radius: 5px;
            .copy-message {
                opacity: 0;
            }

        }
    .copied-message {
            background-color: #32E87577;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 0.25rem 1rem;
            box-sizing: border-box;
            &::before {
                background-color: #32E87577;
                position: absolute;
                $glow-size: 4px;
                top: -$glow-size;
                left: -$glow-size;
                width: calc(100% + $glow-size * 2);
                height: calc(100% + $glow-size * 2);
                filter: blur($glow-size);
                content: "";
            }
        }
    }

    .copy-popover {
        background: #000d;
        padding: 0.5rem;
        border-radius: 1rem;
    }

    .notice {
        padding: 0.5em;
        background: #eee;
        color: black;
        margin: 0.5em 0;
        border-radius: 10px;
        background-color: #ffffff;
        
    }
</style>
