<script lang="ts">
    import ArrowBack from "$lib/icons/ArrowBack.svelte";
    import HuanuiGlowingCenterBox from "$lib/layouts/HuanuiGlowingCenterBox.svelte";
    import { postRefreshCache } from "$lib/api";
    import { adminToken } from "$lib/stores";
    import { ClearCacheStatus } from "./common";

    let clearCacheStatus: ClearCacheStatus;

    async function submitRefreshCache() {
        clearCacheStatus = ClearCacheStatus.Loading;
        if ($adminToken) {
            clearCacheStatus = await postRefreshCache($adminToken)
        } else {
            clearCacheStatus = ClearCacheStatus.WrongPassword;
        }
    }
</script>

<svelte:head>
    <meta
        name="description"
        content="Can't remember to check Huanui College's Daily Notices every day? Want a morning summary of the school's events? Register for the automated Daily Notice Newsletter, it's the same as the website, but in your email!"
    />
</svelte:head>

<HuanuiGlowingCenterBox>
    <h2>Admin Dashboard</h2>
    <div class="content">
        <p>
        </p>
        <form on:submit|preventDefault={submitRefreshCache}>
            <label for="password">Admin Token</label>
            <input
                class="password"
                type="password"
                name="password"
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                class:fail={clearCacheStatus === ClearCacheStatus.ServerError ||
                    clearCacheStatus === ClearCacheStatus.WrongPassword}
                class:success={clearCacheStatus === ClearCacheStatus.Success}
                bind:value={$adminToken}
            />
            {#if clearCacheStatus === ClearCacheStatus.ServerError}
                <p class="message error">
                    There was an unknown server error, please try again.
                </p>
            {:else if clearCacheStatus === ClearCacheStatus.Success}
                <p class="message success">Successfully pulled the latest data!</p>
            {:else if clearCacheStatus === ClearCacheStatus.WrongPassword}
                <p class="message error">Incorrect admin token</p>
            {:else if clearCacheStatus === ClearCacheStatus.Loading}
                <p class="message">Submitting....</p>
            {:else}
                <p class="message">
                    Enter the admin token and press the "Clear Cache" button to update to the latest notice information.
                </p>
            {/if}
            <div
                class="button-wrap"
                class:disabled={!$adminToken}
                class:pressed={clearCacheStatus === ClearCacheStatus.Loading}
            >
                <input
                    type="submit"
                    value="Clear Cache"
                    disabled={!$adminToken}
                />
            </div>
        </form>
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

            .password {
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

                &.fail {
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
