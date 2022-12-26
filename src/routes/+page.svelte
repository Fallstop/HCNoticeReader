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

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}
</style>
