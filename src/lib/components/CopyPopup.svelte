<script lang="ts">
    import { copyElementToClipboard, copyTextToClipboard } from "$lib/clipboardCopy";
    import CopyAllSymbol from "$lib/icons/CopyAllSymbol.svelte";
    import type { Dayjs } from "dayjs";
    import { tweened } from "svelte/motion";
    import type { Writable } from "svelte/store";
    import SchoolDay from "./SchoolDay.svelte";
    import SchoolNotice from "./SchoolNotice.svelte";
    export let selectedDate: Writable<Dayjs>;
    import Ripple from 'svelte-ripple';
    import GraphPaper from "$lib/patterns/GraphPaper.svg?url";
    
    let copySuccessOpacity = tweened(0, {duration: 200});

    function copyAll() {
        console.log(noticeElement)
        copyElementToClipboard(noticeElement);
        copySuccessOpacity.set(1, {duration: 0});
        copySuccessOpacity.set(0)
    }

    let timetableDay: string;
    let noticeElement: HTMLElement;
</script>

<h2>Day: <SchoolDay date={$selectedDate} bind:timetableDay /></h2>
<button use:Ripple={{color: '#32E875', opacity: 0.5, clearingDuration: "1.5s"}} on:click={copyAll}> Copy All </button>
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
        transition: background-color 150ms ease-in-out;
        font-size: 1rem;
        text-decoration: none;
        border: $mid-tone solid 1px;

        cursor: pointer;
        &:hover {
            // background: $mid-tone;
        }
        &:active {
            // background: $dark-tone;
        }
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
