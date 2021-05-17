<script lang="ts">
    import Datepicker from "svelte-calendar";
    import LoadingAnimation from "./LoadingAnimation.svelte";

    const API_ROUTE = "https://hctools.jmw.nz/api/";
    const formatDate = (date: Date) => date.toLocaleString('sv',{ timeZone: 'Pacific/Auckland' }).split(" ")[0]


    let noticeText = "";
    let isSchoolDay;
    let noticeDate = new Date();

    function getNoticeText(noticeDate) {
        isSchoolDay = undefined;
        fetch(
            new Request(API_ROUTE + "getdailynotice/" + formatDate(noticeDate))
        )
            .then((response) => response.json())
            .then((data) => {
                isSchoolDay = data["isSchoolDay"];
                noticeText = data["noticeText"];
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
        if (data["isSchoolDay"]) {
            return data["currentDay"];
        } else {
            return "N/A";
        }
    }
    function changeDayBackward() {
        noticeDate.setDate(noticeDate.getDate() - 1);
        noticeDate = noticeDate;
    }
    function changeDayForward() {
        noticeDate.setDate(noticeDate.getDate() + 1);
        noticeDate = noticeDate;
    }

    $: noticeText = getNoticeText(noticeDate);
</script>

<main>
    <div class="container">
        <div class="header">
            <div class="dayInfo">
                Time table day: {#await getTimeTableDay(noticeDate) then day}{day}{/await}
            </div>

            <div
                class="
            datePickerWrapper
            {isSchoolDay ===
                false
                    ? 'highlightedDatePicker'
                    : ''}
            "
            >
                <button on:click={changeDayBackward} type="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-chevron-left"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                        />
                    </svg>
                </button>
                <Datepicker
                    bind:selected={noticeDate}
                    style="background: var(--primary-background) !important; color: var(--text-color);"
                >
                    <button class="dateTimeChooserButton" type="button">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-calendar-week"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"
                            />
                            <path
                                d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"
                            />
                        </svg>
                        {formatDate(noticeDate)}
                    </button>
                </Datepicker>
                <button on:click={changeDayForward} type="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-chevron-right"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                        />
                    </svg>
                </button>
            </div>
        </div>
        {#if isSchoolDay}
            <div class="noticeText">
                {@html noticeText}
            </div>
        {:else if isSchoolDay === false}
            <div class="flexWHCenter">
                <h2>No notices available on {formatDate(noticeDate)}.</h2>
                <p>
                    Click on the "{formatDate(noticeDate)}" button to view
                    another date
                </p>
            </div>
        {:else}
            <div class="flexWHCenter">
                <LoadingAnimation />
            </div>
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
            align-items: flex-end;
            justify-content: space-between;

            height: 4em;
            border-bottom: 1px solid var(--grey300);
            transition: all 0.3s ease;
            * {
                height: 100%;
                line-height: 1.5em;
                font-size: 1.5rem;
                font-weight: bold;
            }

            .dayInfo {
                align-self: flex-start;
                padding: 1rem;
                height: calc(100% - 2rem);
            }
            .highlightedDatePicker {
                background: linear-gradient(145deg, var(--primary-background), var(--secondary-background));
                box-shadow: 3px 3px 7px var(--primary-background-darker), -3px -3px 7px var(--primary-background-lighter);

            }

            .datePickerWrapper {
                border-radius: 1em;
                box-sizing: border-box;
                // box-shadow: inset 3px 3px 7px var(--primary-background-lighter),
                // inset -3px -3px 7px var(--primary-background-darker);

                display: flex;
                justify-content: space-evenly;
                align-items: center;

                button {
                    border: none;
                    height: auto;
                    margin: auto 0.5rem;
                    align-self: flex-end;
                    cursor: pointer;
                    padding: 0.5rem;
                    font-size: 1.3rem;
                    line-height: initial;
                    min-width: 1.5rem;
                    background: linear-gradient(145deg, var(--primary), var(--primary-secondary));
                    box-shadow:  2px 2px 4px var(--primary-lighter),
                                -2px -2px 4px var(--primary-darker);
                    transition: all 0.3s ease;
                    &:hover {
                        transform: translate3D(0, -2px, 0);
                    }
                    &:active {
                        background: var(--primary);
                        box-shadow: inset 3px 3px 7px var(--primary-darker),
                                    inset -3px -3px 7px  var(--primary-lighter);
                    }
                }
            }
        }
        .noticeText {
            flex-grow: flex;
            text-align: left;
            padding: 1em;
            font-size: 1.1;
        }
        .flexWHCenter {
            min-height: 50vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
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
            }
            .datePickerWrapper {
                width: 100vw;
                margin-left: 0 !important;
                margin-right: 0 !important;
                button {
                    box-shadow: none;
                    &:active {
                        box-shadow: none;
                    }
                }
            }
        }
    }
</style>
