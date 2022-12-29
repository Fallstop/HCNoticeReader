<script>
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

<style lang="scss">
	@use "../lib/scss/variables.scss" as *;

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
		text-transform: uppercase;
		font-weight: bold;
		letter-spacing: 0.75rem;

	}

	@media (max-width: $mobile-transition) {
		section {
			justify-content: flex-start;
			flex: 1;
		}
		h1 {
			font-size: 1.5rem;
			text-transform: none;
			letter-spacing: normal;
		}
	}
</style>
