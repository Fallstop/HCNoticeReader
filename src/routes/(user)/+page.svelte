<script lang="ts">
	import InfoSymbol from "$lib/icons/InfoSymbol.svelte";
	import PrintSymbol from "$lib/icons/PrintSymbol.svelte";
	import NoticeBlock from "./NoticeBlock.svelte";

	import { getContext } from "svelte";
	import InfoPopup from "$lib/components/InfoPopup.svelte";
    import { goto } from "$app/navigation";
    import { formatDate } from "$lib/date";
    import type { Dayjs } from "dayjs";
	import type { Writable } from "svelte/store";

	const { open } = getContext("simple-modal") as any;

	function openInfo() {
		open(InfoPopup);
	}

	let selectedDate: Writable<Dayjs> | undefined;

</script>

<svelte:head>
	<title>HC Daily Notices</title>
	<meta name="description" content="Huanui College Daily Notices" />
</svelte:head>

<section>
	<h1>Huanui College Notices</h1>
	<NoticeBlock bind:selectedDate={selectedDate}/>
</section>
<footer>
	<a href={`/print/${formatDate($selectedDate ?? new Date())}`} target="_blank" rel="noreferrer" class="footer-button">
		<PrintSymbol />
		Print
	</a>
	<button on:click={openInfo} class="footer-button">
		<InfoSymbol />
		Info
	</button>
</footer>

<style lang="scss">
	@use "../../lib/scss/variables.scss" as *;

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
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		gap: 1rem;

		.footer-button {
			border: none;
			background: none;
			padding: 0.25rem 1rem;
			border-radius: 5px;
			color: $color-text;
			transition: background-color 150ms ease-in-out;
			font-size: 1.5rem;
			text-decoration: none;

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
			background: rgba(0, 0, 0, 0.4);
			.footer-button {
				flex: 1;
				border-radius: 0;
				font-size: 1.2rem;
				padding: 0.2rem;
				text-align: center;
				:global(svg) {
					height: 1.2rem;
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
				margin-bottom: 1em;
			}
		}
	}
	@media screen and (max-height: 880px) {
		section h1 {
			margin: 0.5em;
		}
	}
</style>
