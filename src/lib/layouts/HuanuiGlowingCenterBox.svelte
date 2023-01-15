<section>
    <h1>Huanui College Notices</h1>
    <div class="container">
        <slot />
    </div>
</section>

{#if $$slots.footer}
    <footer>
        <slot name="footer" />
    </footer>
{:else}
<div class="spacer"></div>
{/if}


<style lang="scss">
    @use "../../lib/scss/variables.scss" as *;
    @use "../../lib/scss/footer.scss";

    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
        h1 {
            width: 100%;
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 0.75rem;
            margin-bottom: 2em;
        }

        .container {
            min-height: 70vh;
            width: 100%;
            border-radius: 10px;
            position: relative;

            display: flex;
            flex-flow: column;
            height: 100%;
            background: $text-area-bg;

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

            @media screen and (max-width: $mobile-transition) {
                flex: 1;
                border-bottom: none;
            }
        }
    }

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		gap: 1rem;

		@media screen and (max-width: $mobile-transition) {
			gap: 0;
			border-top: $mid-tone solid 1px;
			background: rgba(0, 0, 0, 0.4);
		}
	}

    .spacer {
        height: calc((footer.$font-size * footer.$line-height) + (footer.$padding-height * 2));
    }

    @media screen and (max-height: 880px) {
		section h1 {
			margin: 0.5em;
		}
	}

    @media screen and (max-width: $mobile-transition) {
		section {
			justify-content: flex-start;
			flex: 1;
			h1 {
				font-size: 1.5rem;
				text-transform: none;
				letter-spacing: normal;
				margin-bottom: 1em;
			}
		}
	}
</style>
