<script>
    import InfoSymbol from "$lib/icons/InfoSymbol.svelte";
    import PrintSymbol from "$lib/icons/PrintSymbol.svelte";
import NoticeBlock from "./NoticeBlock.svelte";

</script>


<svelte:head>
	<title>HC Daily Notices</title>
	<meta name="description" content="Huanui College Daily Notices" />
</svelte:head>

<section>
	<h1>Huanui College Notices</h1>
	<NoticeBlock />
</section>
<footer>
	<!-- <div class="footer-line">Created by Jasper M-W.</div>
	<div class="footer-line">
		Source-code found here: <a href="https://github.com/Fallstop/HCNoticeReader" target="_blank" rel="noreferrer" >Fallstop/HCNoticeReader</a>.
	</div>
	<div class="footer-line">
		Uses HC-Tools API found here: <a href="https://jmw.nz/projects/hc-tools" target="_blank" rel="noreferrer">jmw.nz/projects/hc-tools</a>.
	</div> -->
	<button>
		<PrintSymbol/>
		Print
	</button>
	<button>
		<InfoSymbol/>
		Info
	</button>
</footer>

<style lang="scss">
	@use "../lib/scss/variables.scss" as *;

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
		}
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		gap: 1rem;

		button {
			border: none;
			background: none;
			padding: 0.25rem 1rem;
			border-radius: 5px;
			color: $color-text;
			transition: background-color 150ms ease-in-out;
			font-size: 1.5rem;

			cursor: pointer;
			&:hover {
				background: $mid-tone;
			}
				border: $mid-tone solid 1px;
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

			
		}
		@media screen and (max-width: $mobile-transition) {
			gap: 0;
			border-top: $mid-tone solid 1px;
			background: rgba(0,0,0, 0.4);
			button {
				flex: 1;
				border-radius: 0;
				font-size: 1.2rem;
				padding: 0.2rem;
				:global(svg) {
					height: 1.2rem;
				}
			}
		}
		.footer-line {
			margin: 0.2rem;
			text-align: center;
			a {
				color: $color-text;
				text-decoration: underline;
				transition: color 0.15s ease-in-out;
				&:hover {
					color: $mid-tone;
				}
			}
		}

	}

	@media (max-width: $mobile-transition) {
		section {
			justify-content: flex-start;
			flex: 1;
			h1 {
				font-size: 1.5rem;
				text-transform: none;
				letter-spacing: normal;
			}
		}

	}

	
</style>
