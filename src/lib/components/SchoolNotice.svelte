<script lang="ts">
    import { getNoticeText, type NoticeText } from "$lib/api";
    import { formatDate, type NormalisedDate } from "$lib/date";
    import { noticeMap } from "$lib/stores";
    import type { Dayjs } from "dayjs";
    import dayjs from "dayjs";
    import { onMount, onDestroy } from "svelte";
    import NoticeContentLoader from "./NoticeContentLoader.svelte";

    export let noticeText: string | null = null;

    export let date: Date | Dayjs;
    export let styleMode: "light" | "dark" = "dark";
    export let loaded = false;
    export let timetableDay: string;
    export let refreshCache = true;
    export let dateChangerAvailable = false;

    $: loaded = noticeText !== null;

    $: brokenWarning = false;

    function updateNoticeData(map: Map<NormalisedDate, NoticeText | null>) {
        let noticeData = map.get(formatDate(date));
        noticeText = noticeData?.html ?? null;
        brokenWarning = noticeData?.isBroken ?? false;
    }

    const unsub = noticeMap.subscribe(updateNoticeData);

    function getNoticeData() {
        if (!refreshCache && $noticeMap.has(formatDate(date)) && $noticeMap.get(formatDate(date)) != null) {
            $noticeMap = $noticeMap;
            return;
        }
        $noticeMap.set(formatDate(date), null);
        $noticeMap = $noticeMap;

        console.log("Starting notice worker, claiming ", formatDate(date));
        getNoticeText(date)
            .then((data) => {
                console.log("Got notice data! ", formatDate(date), data);
                $noticeMap.set(formatDate(date), data);
                $noticeMap = $noticeMap;
            })
            .catch((err) => {
                console.error(err);
                setTimeout(getNoticeData, 1000);
            });
    }

    onMount(async () => {
        if (!$noticeMap.has(formatDate(date))) {
            getNoticeData();
        }
        updateNoticeData($noticeMap);
    });

    onDestroy(() => {
        unsub();
    });

    $: outerContainerWidth = 0;
    $: outerContainerHeight = 0;

    // State Selection
    enum CurrentState {
        Loading,
        Error,
        LoadedNotice,
        LoadedNoNotice,
        LoadedNotSchoolDay,
        PartialLoaded
    }
    let currentState: CurrentState = CurrentState.Loading;
    $: {
        if (noticeText === null || timetableDay === null) {
            currentState = CurrentState.Loading;
        } else if (noticeText) {
            currentState = CurrentState.LoadedNotice;
        } else if (timetableDay === "N/A") {
            currentState = CurrentState.LoadedNotSchoolDay;
        } else if (typeof timetableDay === "string") {
            currentState = CurrentState.LoadedNoNotice;
        } else {
            currentState = CurrentState.PartialLoaded;
        }
    }
</script>

<div
    class="outer-container"
    bind:clientHeight={outerContainerHeight}
    bind:clientWidth={outerContainerWidth}
    class:fullFlex={currentState === CurrentState.LoadedNoNotice ||
        currentState === CurrentState.LoadedNotSchoolDay}
>
    {#if currentState === CurrentState.Loading}
        <NoticeContentLoader
            width={outerContainerWidth}
            height={outerContainerHeight}
            {styleMode}
        />
    {:else if currentState === CurrentState.LoadedNotice}
        {#if brokenWarning}
            <div class="warning-wrapper">
                <div class="warning">
                    <h3>Warning:</h3>
                    <p>
                        This notice's formatting is missing, so the
                        auto-formatting has had it's best guess at what the notice is
                        supposed to look like.
                    </p>
                </div>
            </div>
        {/if}

        <div class={`notice ${styleMode}`}>
            {@html noticeText}
        </div>
    {:else if currentState === CurrentState.LoadedNoNotice || currentState === CurrentState.LoadedNotSchoolDay}
        {#if currentState === CurrentState.LoadedNoNotice}
            <h2>That is a school day.</h2>
        {:else if currentState === CurrentState.LoadedNotSchoolDay}
            <h2>Not a school day.</h2>
        {/if}
        <h3>No notices available on {dayjs(date).format("dddd")}.</h3>
        {#if dateChangerAvailable}
            <p>Click on the "<span class="nobr">{formatDate(date)}</span>" button to select another day.</p>
        {/if}
    {/if}
</div>

<style lang="scss">
    @use "../../lib/scss/variables.scss" as *;
    .outer-container {
        width: 100%;
        .notice {
            padding-bottom: 1em;
            word-wrap: break-word;
            &.light :global(hr) {
                background-image: linear-gradient(to right, #ccc, #333, #ccc);
            }
            &.dark :global(hr) {
                background-image: linear-gradient(
                    to right,
                    #868686,
                    #858585,
                    #868686
                );
            }
            :global(hr) {
                border: 0;
                height: 1px;
                background: #555;
                margin: 0.75em 0;

                @media print {
                    // HR's are are automatically hidden in print mode, so we need to force visibility
                    display: block;
                    height: 1px;
                    background: transparent;
                    width: 100%;
                    border: none;
                    border-top: solid 1px #aaa;
                }
            }
            :global(p) {
                display: inline;
            }
            :global(p::after) {
                content: "\A"; white-space: pre; 
            }

            &.dark :global(a) {
                color: #00a8ff;
                &:hover {
                    opacity: 0.8;
                }
            }
            &.light :global(a) {
                color: #1b1b1b;
                &:hover {
                    opacity: 0.8;
                }
            }
        }
        .warning-wrapper {
            border-radius: 10px;
            position: relative;
            color: #ffffff;
            margin: 0.5em 0;
            $rainbow-thickness: 2px;
            z-index: 0;
            .warning {
                border-radius: 15px;
                position: relative;
                z-index: 2;
                background: $text-area-bg;
                padding: 1em;
                @media print {
                    background: #fff;
                }
                p,
                h3 {
                    margin: 0;
                }
            }
            @media screen {
                &::before {
                    content: "";
                    z-index: 1;
                    position: absolute;
                    width: calc(100% + $rainbow-thickness * 2);
                    height: calc(100% + $rainbow-thickness * 2);
                    top: -$rainbow-thickness;
                    left: -$rainbow-thickness;
                    border-radius: 15px;
                    background: $pastel-gradient;
                    background-size: 300%;
                    animation: border 20s linear infinite;
                }

                @keyframes border {
                    0%,
                    100% {
                        background-position: 0 0;
                    }

                    50% {
                        background-position: 300%;
                    }
                }
            }
            @media print {
                color: black;
                border: solid 0.2rem #aaa;
            }
        }



        &.fullFlex {
            text-align: center;
            h2 {
                font-size: 5em;
                margin: 1em 0 0 0;
                @media screen and (max-width: $mobile-transition) {
                    font-size: 2em;
                    margin: 0.5em 0 0 0;
                }
            }
            h3 {
                font-size: 1.5em;
            }
        }
    }
</style>
