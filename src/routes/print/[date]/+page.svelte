<script lang="ts">
    import SchoolNotice from "$lib/components/SchoolNotice.svelte";
    import dayjs from "dayjs";

    import { page } from '$app/stores';
    import SchoolDay from "$lib/components/SchoolDay.svelte";

    import "@fontsource/fira-sans"; 

    let targetDate = new Date($page.params.date);

    let schoolDayLoaded: boolean;
    let noticeLoaded: boolean;

    function print(ready: boolean) {
        console.log("Printing", schoolDayLoaded, noticeLoaded)
        if (ready) {
            setTimeout(() => {
                window.print();
            }, 250);
        }
    }

    $: print(schoolDayLoaded && noticeLoaded);

    let timetableDay: string;
</script>
<div class="container">
    <div class="date-info-container">
        <span>
            {dayjs(targetDate).format("dddd")}<br/>
            {dayjs(targetDate).format("DD/MM/YYYY")}
        </span>
        <span>
            Timetable Day: <SchoolDay date={targetDate} fancyLoader={false} bind:loaded={schoolDayLoaded} bind:timetableDay/>
        </span>
        <img src="/images/HCLogoLong.png" alt="Huanui College Logo"/>
    </div>
    <div class="notice-wrapper">
        <SchoolNotice date={targetDate} styleMode="light" bind:loaded={noticeLoaded} {timetableDay}/>
    </div>
    <footer class="footer-text">
        <p>You can find daily notices and the timetable day online at <b>hcnotices.jmw.nz</b></p>
    </footer>
</div>


<style lang="scss">

    .container {
        flex: 1;
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        box-sizing: border-box;
        font-family: 'Fira Sans';

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
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: 100%;
            font-size: 1.5rem;
            font-weight: 600;
            padding: 0.2rem;
            margin: 1rem 0;
            border-bottom: #333 solid 2px;
            align-items: center;
            img {
                object-fit: contain;
                box-sizing: border-box;
                height: 70%;
            }
            * {
                height: min-content;
            }
            :nth-child(2) {
                text-align: center;
            }
            :nth-child(3) {
                justify-self: right;
            }
        }
        .footer-text {
            flex: 0 0 auto;
            color: #555;
            border-top: #bdbdbd solid 0.1rem;
            @media print {
                position: static; /* <-- Key line */
                bottom: 0;
                left: 0;
                width: 100%;
            }
        }
    }
    :global(body) {
        background-color: #fff;
        margin: 0;
    }
    

</style>