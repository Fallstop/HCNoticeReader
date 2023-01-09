<script lang="ts">
    import { copyElementToClipboard, copyTextToClipboard } from "$lib/clipboardCopy";
    import Popover from 'svelte-easy-popover';
    import type { Dayjs } from "dayjs";
    import { tweened } from "svelte/motion";
    import type { Writable } from "svelte/store";
    import SchoolDay from "./SchoolDay.svelte";
    import SchoolNotice from "./SchoolNotice.svelte";
    export let selectedDate: Writable<Dayjs>;
    import GraphPaper from "$lib/patterns/GraphPaper.svg?url";
    import { fade, fly } from "svelte/transition";
    

    let timetableDay: string;
    let noticeElement: HTMLElement;

    let copyReferenceElement;
    let copyPopoverOpen = false;
    let copyPopoverTimer: NodeJS.Timeout | null = null;
    const copyPopoverMS = 2000;

    function copyAll() {
        copyElementToClipboard(noticeElement);
        copyPopoverOpen = true;
        if (copyPopoverTimer) {clearTimeout(copyPopoverTimer)};
        copyPopoverTimer = setTimeout(()=>{copyPopoverOpen=false},copyPopoverMS);
    }
</script>

<h2>Day: <SchoolDay date={$selectedDate} bind:timetableDay /></h2>
<!-- use:Ripple={{color: '#32E875', opacity: 0.5, clearingDuration: "1.5s"}}  -->
<button bind:this={copyReferenceElement} on:click={copyAll}> Copy All </button>
<Popover
  referenceElement={copyReferenceElement}
  placement="top"
  spaceAway={5}
  ignoreClickWhileOpeningBuffer={100}
  isOpen={copyPopoverOpen}
>
    <div transition:fly={{y: 5}} class="copy-popover">
        Copied!
    </div>
</Popover>

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

        cursor: pointer;
        &:active {
            background-color: #32E87577;
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
