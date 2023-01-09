<script lang="ts">
    import { browser, dev } from "$app/environment";
    import SchoolDay from "$lib/components/SchoolDay.svelte";
    import SchoolNotice from "$lib/components/SchoolNotice.svelte";
    import { formatDate } from "$lib/date";
    import ArrowBack from "$lib/icons/ArrowBack.svelte";
    import ArrowForward from "$lib/icons/ArrowForward.svelte";
    import dayjs from "dayjs";
    import { onMount } from "svelte";
    import { Datepicker, themes } from "svelte-calendar";
    import { writable } from "svelte/store";
    import { fly } from "svelte/transition";
    import { tweened } from "svelte/motion";
    import { customFly, horizontalSwipe } from "$lib/swipe";
    import { mobileWidthTransition } from "$lib/stores";

    const { dark: theme } = themes;

    const defaultDate = dayjs(dev ? "2022-05-24" : undefined);

    export let selectedDate = writable(defaultDate);

    let datepickerStore: Datepicker["store"];



    // Fancy transition logic
    enum NoticeDirection {
        Forward,
        Backward,
        Static,
    }

    let directionForward = NoticeDirection.Static;
    let transitionX = 0;
    let pastDate = defaultDate;

    let noticeBlockSize = 0;
    $: animationScale = noticeBlockSize;

    $: {
        switch (+directionForward) {
            case NoticeDirection.Forward:
                transitionX = animationScale;
                break;
            case NoticeDirection.Backward:
                transitionX = -animationScale;
                break;
            case NoticeDirection.Static:
                transitionX = 0;
                break;
        }
        // noticeXGestureOffset.set(transitionX,{duration: 0});
    }

    $: if (+pastDate.toDate() !== +$selectedDate.toDate()) {
        directionForward = pastDate.isBefore($selectedDate)
            ? NoticeDirection.Forward
            : NoticeDirection.Backward;
        pastDate = $selectedDate;
    }

    onMount(() => {
        datepickerStore.subscribe(
            (value: {
                selected: Date;
            }) => {
                let calendarDate = dayjs(value.selected);
                if (formatDate($selectedDate) !== formatDate(calendarDate)) {
                    selectedDate.set(calendarDate);
                }
            }
        );
    });

    let desktopMode = writable(false);
    $: desktopMode.set(browser ? window.innerWidth > mobileWidthTransition : true)

    type GestureEvent = CustomEvent<{
        direction: "left" | "right" | "top" | "bottom";
        target: EventTarget | null;
    }>;

    let noticeXGestureOffset = tweened(0, {duration: 400});

    function gestureHandler(event: GestureEvent) {
        let direction = event.detail.direction;
        console.log(event.detail.target);
        if (direction==="right") {
            datepickerStore.add(-1, "day");

            noticeXGestureOffset.set(0);
        } else if (direction==="left") {
            datepickerStore.add(1, "day");
            noticeXGestureOffset.set(0);
        }
    }

    let timetableDay: string;
</script>

<div class="container">
    <header>
        <button
            on:click={() => {
                datepickerStore.add(-1, "day");
            }}
            aria-label="Previous Day"
        >
            <ArrowBack />
            <span class="desktop-only"> Previous </span>
        </button>
        <Datepicker
            {theme}
            bind:store={datepickerStore}
            let:key
            let:send
            let:receive
            selected={defaultDate.toDate()}
        >
            <button
                in:receive|local={{ key }}
                out:send|local={{ key }}
                class="calendar"
            >
                {dayjs($selectedDate).format("YYYY-MM-DD")}
            </button>
        </Datepicker>
        <button
            on:click={() => {
                datepickerStore.add(1, "day");
            }}
            aria-label="Next Day"
        >
            <span class="desktop-only"> Next </span>
            <ArrowForward />
        </button>
    </header>
    <div class="transition-wrapper"
    >
        {#key $selectedDate}
            <!-- Transition has to be split into in-out to force the animation to recompile every time -->

            <div
                class="data-container fancy-scrollbar"
                style="transform: translate3d({$noticeXGestureOffset}px, 0px, 0)"
                in:customFly|local={{ x: transitionX }}
                out:fly|local={{x: -transitionX}}
                use:horizontalSwipe={{ desktopElementBlockList: ["p"], minSwipeDistance: 100, touchAction: 'pan-y', xMovementStore: noticeXGestureOffset, desktopMode }} on:horizontalSwipe={gestureHandler}
                bind:clientWidth={noticeBlockSize}
            >   
                <div class="school-day-container">
                    <h2 class="school-day">
                        <SchoolDay date={$selectedDate} bind:timetableDay />
                    </h2>
                </div>
                <div class="notice-block fancy-scrollbar">
                    <SchoolNotice date={$selectedDate} {timetableDay} dateChangerAvailable/>
                </div>

                <div class="day-change-indicator left" class:hidden={$noticeXGestureOffset<=0}>
                    <ArrowBack/>
                </div>
                <div class="day-change-indicator right" class:hidden={$noticeXGestureOffset>=0}>
                    <ArrowForward/>
                </div>
            </div>
        {/key}
    </div>
</div>

<style lang="scss">
    @use "../../lib/scss/variables.scss" as *;
    .container {
        min-height: 70vh;
        width: 100%;
        border-radius: 10px;
        position: relative;

        display: flex;
        flex-flow: column;
        height: 100%;
        background: #151320;

        $rainbow-thickness: 5px;

        &::before,
        &::after {
            content: "";
            z-index: -1;
            position: absolute;
            width: calc(100% + $rainbow-thickness * 2);
            height: calc(100% + $rainbow-thickness * 2);
            top: -$rainbow-thickness;
            left: -$rainbow-thickness;
            border-radius: 15px;
            background: linear-gradient(
                45deg,
                #fcf4c9 0%,
                #fee3e2 15%,
                #fbcdf2 30%,
                #e8befa 50%,
                #abbfff 65%,
                #bbf3c0 85%,
                #fcf4c9 100%
            );
            background-size: 300%;
            animation: border 20s linear infinite;

            @media screen and (max-width: $mobile-transition) {
                width: calc(100%);
                height: calc(100% + $rainbow-thickness);
                left: 0;
            }
        }

        &::after {
            filter: blur(50px);
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

        header {
            flex: 0 1 auto;

            display: grid;
            grid: 1fr / 1fr 2fr 1fr;
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
                transition: background-color 150ms ease-in-out;

                cursor: pointer;
                &:hover {
                    background: $mid-tone;
                }
                &.calendar {
                    border: $mid-tone solid 1px;
                }
                &:active {
                    background: $dark-tone;
                }

                :global(svg) {
                    height: 1.45rem;
                    position: relative;
                    top: 0.15em;
                    color: $color-text;
                    fill: $color-text;
                }

                @media screen and (max-width: $mobile-transition) {
                    .desktop-only {
                        display: none;
                    }
                }
            }
        }
        .transition-wrapper {
            height: 100%;
            flex: 1 1 auto;
            position: relative;
            overflow-y: hidden;
            overflow-x: hidden;
        }

        .data-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            // overflow-y: hidden;
            overflow-x: visible;

            .school-day-container {
                cursor: ew-resize;
                width: 100%;
                display: flex;
                justify-content: center;
                .school-day {
                    font-size: 2rem;
                    margin: 1px;
                    padding: 0.5rem 1rem;
                    text-align: center;
                    border-bottom: $color-text solid 1px;
                    box-sizing: border-box;
                    min-width: 4rem;
                    width: max-content;
                }
            }

            .notice-block {
                text-align: left;
                margin: 0.5em 0;
                padding: 0.5em 2em;
                width: 100%;
                flex: 1 1 auto;
                display: flex;
                box-sizing: border-box;
                overflow-y: auto;
            }
            .day-change-indicator {
                $arrow-size: 7vw;

                position: absolute;
                top: 0;
                width: $arrow-size;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0.5;
                // transition: opacity 150ms ease;

                &.hidden {
                    opacity: 0;
                }

                :global(svg) {
                    height: 5vw;
                    position: relative;
                    top: 0.15em;
                    color: $color-text;
                    fill: $color-text;
                }

                &.left {
                    left: -$arrow-size;
                }
                &.right {
                    right: -$arrow-size;
                }
            }
        }
        @media screen and (max-width: $mobile-transition) {
            flex: 1;
            border-bottom: none;
            .data-container {
                overflow-y: auto;
                .notice-block {
                    overflow-y: visible;
                    padding: 0 1em;
                }
            }
        }
    }
</style>
