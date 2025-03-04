<script lang="ts">
    import ArrowBack from "$lib/icons/ArrowBack.svelte";
    import HuanuiGlowingCenterBox from "$lib/layouts/HuanuiGlowingCenterBox.svelte";
    import { enhance } from "$app/forms";
    import { RegisterStatus } from "./common";
    import { onMount } from "svelte";
    import { getMailStats, type MailStats } from "$lib/api";
    import { fade } from "svelte/transition";
    import { posthog } from "posthog-js";

    export let form: { state: RegisterStatus; email: string } | undefined;

    $: state = form?.state ?? RegisterStatus.Ready;

    let emailValue: string = "";

    $: emailValid = emailValue?.match(/.+@.+\..+/);

    let statsData: MailStats = null;

    let loadingTimers: NodeJS.Timer[] = [];


    onMount(async () => {
        console.log("Form state", state, form);
        if (form?.state) {
            state = form.state;
        }
        statsData = await getMailStats();
    });
</script>

<svelte:head>
	<meta name="description" content="Can't remember to check Huanui College's Daily Notices every day? Want a morning summary of the school's events? Register for the automated Daily Notice Newsletter, it's the same as the website, but in your email!"/>
</svelte:head>

<HuanuiGlowingCenterBox>
    <h2>Daily Newsletter</h2>
    <div class="content">
        <p>
            Can't remember to check the notices every day? Want a morning
            summary of the school's events?<br />Register for the automated
            Daily Notice Newsletter, it's the same as the website, but in your
            email!<br />
            You can
            <a href="/mail/api/sendmail" target="_blank"
                >preview the email here</a
            >, it'll be sent to you every school day 8am sharp.
        </p>
        <form
            method="POST"
            action="?/register"
            use:enhance={({}) => {
                state = RegisterStatus.Loading;

                return async ({ result, update }) => {
                    if (!result.hasOwnProperty('data')) {
                        state = RegisterStatus.ServerError;
                    }

                    // `result` is an `ActionResult` object
                    update({ reset: false });
                    posthog.capture('newsletter-register', { email: emailValue })
                };
            }}
        >
            <input
                class="email"
                type="email"
                name="email"
                placeholder="Email Address"
                class:fail={state === RegisterStatus.ServerError ||
                    state === RegisterStatus.InvalidEmail}
                class:success={state === RegisterStatus.AlreadyCompleted ||
                    state === RegisterStatus.Success}
                bind:value={emailValue}
            />
            {#if state === RegisterStatus.ServerError}
                <p class="message error">
                    There was an unknown server error, please try again.
                </p>
            {:else if state === RegisterStatus.Success}
                <p class="message success">You have been registered!</p>
            {:else if state === RegisterStatus.AlreadyCompleted}
                <p class="message success">You are already registered!</p>
            {:else if state === RegisterStatus.InvalidEmail}
                <p class="message error">Email not valid</p>
            {:else if state === RegisterStatus.OverSignupLimit}
                <p class="message error">Sorry, too many people have signed up!</p>
            {:else if state === RegisterStatus.Loading}
                <p class="message">Submitting....</p>
            {:else}
                <p class="message mobile">
                    You can <a href="/mail/unsubscribe">unsubscribe</a> at any time.<br/>We will never share your email.
                </p>
                <p class="message desktop">
                    You can <a href="/mail/unsubscribe">unsubscribe</a> at any time, we will never share your email.
                </p>

            {/if}

            <div
                class="button-wrap"
                class:disabled={!emailValid}
                class:pressed={state === RegisterStatus.Loading}
            >
                <input type="submit" value="Register" disabled={!emailValid} />
            </div>
        </form>
        {#if statsData}
            <p class="stats" in:fade|local>
                {statsData.sentEmailsLastMonth} emails sent this month, {Math.round(statsData.capacityPercentage*100)}% of capacity.
            </p>
        {/if}

    </div>
    <svelte:fragment slot="footer">
        <a href={`/`} class="footer-button">
            <ArrowBack />
            Back
        </a>
    </svelte:fragment>
</HuanuiGlowingCenterBox>

<style lang="scss">
    @use "../../../lib/scss/variables.scss" as *;
    @use "../../../lib/scss/footer.scss" as *;

    h2 {
        text-align: center;
        font-size: 2rem;
    }

    .content {
        padding: 1rem;
        font-size: 1.1rem;
        text-align: center;

        form {
            display: flex;
            flex-direction: column;
            padding: 1em;
            align-items: center;

            .email {
                display: block;
                width: 100%;
                text-align: center;
                box-sizing: border-box;
                background: none;

                padding: 0.5rem;
                border: none;
                border-bottom: 1px solid $mid-tone;
                border-radius: 0;
                margin: 0.5rem 0;
                color: $color-text;
                &:focus-within {
                    outline: none;
                }

                &.error {
                    border-bottom: 1px solid $error;
                }
                &.success {
                    border-bottom: 1px solid $success;
                }
            }
            .message {
                font-style: italic;
                color: $mid-tone;
                &.success {
                    color: $success;
                }
                &.error {
                    color: $error;
                }
                margin-top: 0;


                &.mobile {
                    display: none;
                }

                @media screen and (max-width: $mobile-transition) {
                    &.desktop {
                        display: none;
                    }
                    &.mobile {
                        display: block;
                    }
                }
            }
            .button-wrap {
                $border-radius: 6px;
                $border-width: 2px;

                position: relative;
                background: $pastel-gradient;
                padding: $border-width;
                width: min-content;
                border-radius: $border-radius + $border-width;
                background-size: 300%;
                animation: border 20s linear infinite;

                @keyframes border {
                    0%,
                    100% {
                        background-position: 0 0;
                    }

                    50% {
                        background-position: 300%;
                    }
                }

                input {
                    display: block;
                    width: 100%;
                    background: $text-area-bg;
                    color: $color-text;
                    border: none;
                    padding: 0.5rem;
                    border-radius: $border-radius;
                    text-transform: uppercase;
                    letter-spacing: 0.1rem;
                    font-weight: bold;
                    cursor: pointer;

                    transition: all 0.2s ease-in-out;
                }

                &.disabled {
                    background: $mid-tone;
                    input {
                        cursor: default;
                        color: $mid-tone;
                    }
                }

                &.pressed {
                    animation: none;
                    background: none;
                    input {
                        background: $pastel-gradient;
                        color: $text-area-bg;
                        border: none;
                        background-size: 300%;
                        animation: border 5s linear infinite;
                    }
                }
            }
        }
        .warning {
            color: #b1a500;
        }

        .stats {
            color: $mid-tone;
            margin-top: 2rem;
            font-size: 1.0rem;
            font-weight: bold;
        }
    }

    .footer-button {
        @include footer-button;
    }
</style>
