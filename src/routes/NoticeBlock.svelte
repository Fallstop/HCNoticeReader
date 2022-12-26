<script lang="ts">
    import SchoolDay from '$lib/components/SchoolDay.svelte';
    import SchoolNotice from '$lib/components/SchoolNotice.svelte';
    import dayjs from 'dayjs';
	import { Datepicker, themes } from 'svelte-calendar';
	const { dark: theme } = themes;

    const defaultDate = dayjs();

    let datepickerStore: Datepicker["store"];

    $: selectedDate = $datepickerStore?.selected || defaultDate; 

</script>

<div class="container">
    <header>
        <button on:click={()=>{datepickerStore.add(-1, 'day')}}>Previous</button>
        <Datepicker theme={theme} bind:store={datepickerStore} let:key let:send let:receive>
            <button in:receive|local={{ key }} out:send|local={{ key }}>
                {dayjs(selectedDate).format('YYYY-MM-DD')}
            </button>
        </Datepicker>
        <button on:click={()=>{datepickerStore.add(1, 'day')}}>Next</button>
    </header>
    <div class="data-container">
        {#key selectedDate}
            <h2 class="school-day">
                <SchoolDay date={selectedDate} />
            </h2>
            <SchoolNotice date={selectedDate} />
        {/key}
    </div>
</div>

<style lang="scss">
    @use "../lib/scss/variables.scss" as *;
    .container {
        min-height: 50vh;
        width: 100%;
        border: $mid-tone solid 6px;
        border-radius: 10px;
        border-style: dashed;

        display: flex;
        flex-flow: column;
        height: 100%;

        header {
            flex: 0 1 auto;

            display: grid;
            grid: 1fr / 1fr 1fr 1fr;
            grid-auto-flow: row;

            padding: 1rem;
            border-bottom: $mid-tone solid 2px;
            text-align: center;
            * {
                font-size: 1.5rem;
            }

            button {
                border: none;
                background: none;
                padding: 0.5rem;
                border-radius: 5px;
                color: $color-text;
                cursor: pointer;
                &:hover {
                    background: $mid-tone;
                }
            }
        }

        .data-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            flex: 1 1 auto;
            .school-day {
                font-size: 2rem;
            }
        }
    }
</style>
