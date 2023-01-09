<script lang="ts">
    import SchoolNotice from "$lib/components/SchoolNotice.svelte";
    import dayjs from "dayjs";

    import { page } from '$app/stores';
    import SchoolDay from "$lib/components/SchoolDay.svelte";

    let targetDate = new Date($page.params.date);

    let schoolDayLoaded: boolean;
    let noticeLoaded: boolean;

    function print(ready: boolean) {
        console.log("Printing", schoolDayLoaded, noticeLoaded)
        if (ready) {
            window.print();
        }
    }

    $: print(schoolDayLoaded && noticeLoaded);

    let timetableDay: string;
</script>
<div class="container">
    <div class="date-info-container">
        <div>
            {dayjs(targetDate).format("YYYY-MM-DD, dddd")}
        </div>
        <div>
            Timetable Day: <SchoolDay date={targetDate} fancyLoader={false} bind:loaded={schoolDayLoaded} bind:timetableDay/>
        </div>
    </div>
    <div class="notice-wrapper">
        <SchoolNotice date={targetDate} styleMode="light" bind:loaded={noticeLoaded} {timetableDay}/>
    </div>
    <footer class="footer-text">
        <p>You can find daily notices and the timetable day online at <b>hcnotices.jmw.nz</b></p>
    </footer>
</div>


<style lang="scss">
    @import '@fontsource/fira-sans';

    .container {
        flex: 1;
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        box-sizing: border-box;
        font-family: 'fira-sans';

        @media print {
            padding: 0;
        }

        @media screen {
            padding: 1em;
        }

        .notice-wrapper {
            flex: 1 1 auto;
            display: flex;
        }
        .date-info-container {
            flex: 0 0 auto;
            display: flex;
            justify-content: space-between;
            font-size: 1.5rem;
            font-weight: 600;
            padding: 0.2rem;
            margin: 1rem 0;
            border-bottom: #333 solid 2px;
        }
        .footer-text {
            flex: 0 0 auto;
            color: #555;
            border-top: #bdbdbd solid 0.1rem;
        }
    }
    :global(body) {
        background-color: #fff;
        margin: 0;
    }
    

</style>