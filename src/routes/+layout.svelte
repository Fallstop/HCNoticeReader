<script>
	import '$lib/scss/variables.scss';
	import '$lib/scss/layout.scss';
</script>

<div class="app">

	<main>
		<slot />
	</main>
</div>

<style lang="scss">
	@use "../lib/scss/variables.scss" as *;

	.app {
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 80rem;
		margin: 0 auto;
		box-sizing: border-box;
		min-height: 100vh;
	}
	@media (max-width: $mobile-transition) {
		main {
			padding: 0;
			max-width: none;
			margin: 0;
			overflow-y: scroll;
		}
	}
</style>
