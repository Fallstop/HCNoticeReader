<script lang="ts">
    import { getTimeTableDay} from "$lib/api";
    import { onMount } from "svelte";


    export let date: Date;

    let timetableDay: string | null = null;

    onMount(async ()=>{
        timetableDay = await getTimeTableDay(date);
    })

</script>
{#if timetableDay}
{timetableDay}
{:else}
Loading...
{/if}