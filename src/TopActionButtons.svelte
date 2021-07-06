<script lang="ts">
    let localStorage = window.localStorage;
    let isDarkMode;

    function makeDarkMode() {
        localStorage.setItem("colourScheme", "dark");
        console.log(localStorage.getItem("colourScheme"));
        window.document.body.classList.add("dark-mode");
        isDarkMode = true;
    }
    function makeLightMode() {
        localStorage.setItem("colourScheme", "light");
        console.log(localStorage.getItem("colourScheme"));
        window.document.body.classList.remove("dark-mode");
        isDarkMode = false;
    }
    function printPage() {
        console.log("Print Pop");
        window.print();
    }

    if (window.matchMedia) {
        // Initialize localstore with user variables
        if (
            window.matchMedia &&
            (window.matchMedia("(prefers-color-scheme: dark)").matches ||
                localStorage.getItem("colourScheme") !== "light")
        ) {
            makeDarkMode();
        } else if (
            window.matchMedia &&
            localStorage.getItem("colourScheme") !== "dark"
        ) {
            makeLightMode();
        }
    }
</script>

<div class="topActionButtonsContainer">
    {#if isDarkMode}
        <button on:click={makeLightMode}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                class="bi bi-sun"
                viewBox="0 0 16 16"
            >
                <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
                />
            </svg>
        </button>
    {:else}
        <button on:click={makeDarkMode}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                class="bi bi-moon"
                viewBox="0 0 16 16"
            >
                <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"
                />
            </svg>
        </button>
    {/if}
    <button on:click={printPage}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            class="bi bi-printer"
            viewBox="0 0 16 16"
        >
            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z" />
            <path
                d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"
            />
        </svg>
    </button>
</div>

<style lang="scss">
    
    .topActionButtonsContainer {
        position: fixed;
        top: 50px;
        right: 50px;

        button {
            margin: 0 0.5em;
            background: linear-gradient(
                145deg,
                var(--primary),
                var(--primary-secondary)
            );
            box-shadow: 3px 3px 7px var(--primary-darker),
                -3px -3px 7px var(--primary-lighter);
            border: 1px solid var(--highlight-border);
            border-radius: 32px;
            padding: 0.5rem;
            transition: all 0.3s ease;
            height: 60px;
            width: 60px;
            cursor: pointer;
            &:hover {
                box-shadow: 0 0 0 0, 0 6px 12px var(--primary-background-darker);
                transform: translate3D(0, -2px, 0);
            }
            &:active {
                background: var(--primary);
                box-shadow: inset 3px 3px 7px var(--primary-darker),
                    inset -3px -3px 7px var(--primary-lighter);
            }
        }
    }
    @media (max-width: 640px) {
        .topActionButtonsContainer {
            flex-grow: 2;
            margin: 0.5em;
            position: inherit;
            width: 60px;
            height: 60px;
        }
    }
    @media print {
        * :not(.PrimaryContent) {
            display: none !important;
        }
    }
</style>
