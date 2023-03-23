<script lang="ts">
    import ArrowBack from "$lib/icons/ArrowBack.svelte";
    import HuanuiGlowingCenterBox from "$lib/layouts/HuanuiGlowingCenterBox.svelte";
    import type { ActionData } from "../$types";
    import { enhance } from "$app/forms";
    import { RegisterStatus, type FormResponse } from "../common";
    import { onMount } from "svelte";
    import { page } from '$app/stores';


    let state = RegisterStatus.Ready;

    let emailValue: string = "";

    $: emailValid = emailValue?.match(/.+@.+\..+/);

    onMount(() => {
        const startingEmail = $page.url.searchParams.get("email");
        // Check not {{mj:contact.email}} temporarily, until I work out why Mailjet is not substituting it
        if (startingEmail && startingEmail !== "{{mj:contact.email}}") {
            emailValue = startingEmail
        }
    });

    async function formResult({
        result,
        update,
    }: {
        result: any;
        update: any;
    }) {
        const data = result.data as FormResponse;
        console.log(data);
        if (!data) {
            state = RegisterStatus.ServerError;
        } else {
            state = data.state;
        }
        // `result` is an `ActionResult` object
        update({ reset: false });
    }
</script>

<HuanuiGlowingCenterBox>
    <h2>Daily Newsletter</h2>
    <div class="content">
        <p>You can easily unsubscribe here:</p>
        <form
            method="POST"
            action="/mail?/deregister"
            use:enhance={({}) => {
                state = RegisterStatus.Loading;

                return formResult;
            }}
        >
            <input
                class="email"
                type="email"
                name="email"
                placeholder="Email Address"
                class:fail={state === RegisterStatus.ServerError ||
                            state === RegisterStatus.AlreadyCompleted ||
                    state === RegisterStatus.InvalidEmail}
                class:success={state === RegisterStatus.Success}
                bind:value={emailValue}
            />
            {#if state === RegisterStatus.ServerError}
                <p class="message error">
                    There was an unknown server error, please try again in a
                    while.
                </p>
            {:else if state === RegisterStatus.Success}
                <p class="message success">You have been unsubscribed!</p>
            {:else if state === RegisterStatus.AlreadyCompleted}
                <p class="message error">Email wasn't subscribed!</p>
            {:else if state === RegisterStatus.InvalidEmail}
                <p class="message error">Email not valid</p>
            {:else if state === RegisterStatus.Loading}
                <p class="message">Unsubscribing....</p>
            {:else}
                <p class="message">
                    You can <a href="/mail">resubscribe</a> at any time
                </p>
            {/if}
            <div
                class="button-wrap"
                class:disabled={!emailValid}
                class:pressed={state === RegisterStatus.Loading}
            >
                <input
                    type="submit"
                    value="Unsubscribe"
                    disabled={!emailValid}
                />
            </div>
        </form>
    </div>
    <svelte:fragment slot="footer">
        <a href={`/mail`} class="footer-button">
            <ArrowBack />
            Back
        </a>
    </svelte:fragment>
</HuanuiGlowingCenterBox>

<style lang="scss">
    @use "../../../../lib/scss/variables.scss" as *;
    @use "../../../../lib/scss/footer.scss" as *;

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
    }

    .footer-button {
        @include footer-button;
    }
</style>
