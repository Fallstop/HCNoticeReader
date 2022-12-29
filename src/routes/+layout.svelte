<script>
	import '$lib/scss/variables.scss';
	import '$lib/scss/layout.scss';

	import Modal from 'svelte-simple-modal';
</script>

<div class="app">
	<Modal
		unstyled={true}
		classBg="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center bg-orange-100/[.9]"
		classWindowWrap="relative m-2 max-h-full"
		classWindow="relative w-40 max-w-full max-h-full my-2 mx-auto text-orange-200 rounded shadow-md bg-indigo-900"
		classContent="relative p-2 overflow-auto"
		closeButton={false}
	>
		<main>
			<slot />
		</main>
	</Modal>
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
		justify-content: space-between;
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
