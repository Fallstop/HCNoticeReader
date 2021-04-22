<script lang="ts">
    import Datepicker from "svelte-calendar";

    const API_ROUTE = "https://hctools.jmw.nz/api/";
    const formatDate = (date) => date.toISOString().split("T")[0];

    let noticeText = "";
    let isSchoolDay;
    let noticeDate = new Date("2021-04-9");

    function getNoticeText(noticeDate) {
        isSchoolDay = undefined;
        fetch(
            new Request(API_ROUTE + "getdailynotice/" + formatDate(noticeDate))
        )
            .then((response) => response.json())
            .then((data) => {
                isSchoolDay = data["isSchoolDay"];
                noticeText = data["noticeText"];
                console.log(noticeText);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
        return noticeText || "";
    }
    async function getTimeTableDay(noticeDate) {
        const resonse = await fetch(
            new Request(API_ROUTE + "gettimetableday/" + formatDate(noticeDate))
        );
        const data = await resonse.json();
        console.log(data);
        if (data["isSchoolDay"]) {
            return data["currentDay"];
        } else {
            return "N/A";
        }
    }

    $: noticeText = getNoticeText(noticeDate);
</script>

<main>
    <div class="container">
        <div class="header">
            <div class="dayInfo">
                Time table day: {#await getTimeTableDay(noticeDate) then day}{day}{/await}
            </div>
            <div class="datePickerWrapper">
                <Datepicker bind:selected={noticeDate}>
                    <button class="dateTimeChooserButton">
                        {formatDate(noticeDate)}
                    </button>
                    
                </Datepicker>
            </div>
        </div>
        {#if isSchoolDay}
            <div class="noticeText">
                {@html noticeText}
            </div>
        {:else if isSchoolDay === false}
            <h2>No notices available on {formatDate(noticeDate)}.</h2>
        {:else}
            <h2>Loading animation here or some shit...</h2>
        {/if}
    </div>
</main>

<style lang="scss">
    @import "vars.scss";
    .container {
        min-height: 50vh;
        display: flex;
        flex-direction: column;
        // border-radius: 5px;

        .header {
            flex-grow: none;
            display: flex;
            
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;

            height: 4em;
            border-bottom: 1px solid $grey300;
            * {
                height: 100%;
                line-height: 1.5em;
                font-size: 1.5rem;
                font-weight: bold;
            }

            .dayInfo {
                align-self: flex-start;
                padding:1rem;
                height: calc(100% - 2rem);
            }
            .datePickerWrapper {
                align-self: flex-end;
                
                .dateTimeChooserButton {
                    height: 100%;
                    padding: 0.5rem;
                    font-size: 1.3rem;
                    line-height: initial;
                    margin: 0.8rem;
                    background-color: rgb(157, 191, 255)
                    
                }
            }
        }
        .noticeText {
            flex-grow: flex;
            text-align: left;
            padding: 1em;
        }
    }
    @media (max-width: 640px) {
        .container .header {
            flex-grow: grow;
            flex-direction: column;
            height: unset;
            & > * {
                align-self: flex-start !important;
                
            }
            .dayInfo {
                font-size: 1.2rem;
                padding: 0.5rem;
                padding-bottom: 0;
            }
            .dateTimeChooserButton {
                margin-left: 0 !important;
                margin-right: 0 !important;
                width: 100vw
            } 
        } 
    }
</style>
