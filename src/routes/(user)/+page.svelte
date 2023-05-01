<script lang="ts">
	import InfoSymbol from "$lib/icons/InfoSymbol.svelte";
	import PrintSymbol from "$lib/icons/PrintSymbol.svelte";
	import NoticeBlock from "./NoticeBlock.svelte";

	import { getContext, onMount } from "svelte";
	import InfoPopup from "$lib/components/InfoPopup.svelte";
	import { formatDate } from "$lib/date";
	import {default as dayjs, type Dayjs} from "dayjs";
	import type { Writable } from "svelte/store";
	import CopyPopup from "$lib/components/CopyPopup.svelte";
	import CopySymbol from "$lib/icons/CopySymbol.svelte";
    import { lunchtimeActivityMap, noticeMap, serverTime, timetableDayMap } from "$lib/stores";
    import MailSymbol from "$lib/icons/MailSymbol.svelte";
    import HuanuiGlowingCenterBox from "$lib/layouts/HuanuiGlowingCenterBox.svelte";
    import { page } from "$app/stores";
    import { browser } from "$app/environment";

	const { open } = getContext("simple-modal") as any;

	function openInfo() {
		open(InfoPopup);
	}
	function openCopy() {
		open(CopyPopup, { selectedDate });
	}

	$: urlSelectedDate = browser ? dayjs($page.url.searchParams.get("date")) : dayjs(null);
	$: defaultDate = urlSelectedDate.isValid() ? urlSelectedDate : dayjs()

	let selectedDate: Writable<Dayjs> | undefined;

	export let data: import('./$types').PageData;
	if (data.date && data.noticeText && data.timetableDay && data.lunchtimeActivity) {
		$noticeMap.set(data.date, data.noticeText);
		$timetableDayMap.set(data.date, data.timetableDay);
		$lunchtimeActivityMap.set(data.date, data.lunchtimeActivity);
	}
	if (data.serverTime) {
		serverTime.set(data.serverTime)
	}

	onMount(()=>{
		
	})
</script>

<svelte:head>
	<meta name="description" content="Easily view Huanui College Daily Notice's in a convenient and eye-pleasing form. Check old notices, and skip forward to future notices to get a snapshot of the school's happenings."/>
</svelte:head>

<HuanuiGlowingCenterBox>
	<NoticeBlock bind:selectedDate {defaultDate}/>
	<svelte:fragment slot="footer">
		<a
			href={`/print/${formatDate($selectedDate ?? new Date())}`}
			target="_blank"
			rel="noreferrer"
			class="footer-button"
		>
			<PrintSymbol />
			<span class="desktop-only">Print</span>
		</a>
		<button on:click={openCopy} class="footer-button mobile-only">
			<CopySymbol />
			<span class="desktop-only">Copy</span>
		</button>
		<a
			href={`/mail`}
			class="footer-button"
		>
			<MailSymbol />
			<span class="desktop-only">Mail</span>
		</a>
		<button on:click={openInfo} class="footer-button">
			<InfoSymbol />
			<span class="desktop-only">Info</span>
		</button>
	</svelte:fragment>
	
</HuanuiGlowingCenterBox>


<style lang="scss">
	@use "../../lib/scss/variables.scss" as *;
	@use "../../lib/scss/footer.scss" as *;

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

	.mobile-only {
		display: none;
	}

	.footer-button {
		@include footer-button;
	}

	@media screen and (max-width: $mobile-transition) {
		.mobile-only {
			display: unset;
		}
	}

</style>
