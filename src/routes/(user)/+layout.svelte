<script lang="ts">
	import '$lib/scss/variables.scss';
	import '$lib/scss/layout.scss';
	import '$lib/scss/modal.scss';

	import Modal from 'svelte-simple-modal';
</script>
<Modal
unstyled={true}
classBg="__modal-bg"
classWindowWrap="__modal-window-wrap"
classWindow="__modal-window"
classContent="__modal-content fancy-scrollbar"
classCloseButton="__modal-close-button"
>
<div class="app">
	<main>
		<slot />
	</main>
</div>
</Modal>

<style lang="scss">
	@use "../../lib/scss/variables.scss" as *;

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
