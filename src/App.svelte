<script lang="ts">
	import NoticeBlock from "./NoticeBlock.svelte";

</script>

<main>
	<h1>Huanui College Notices</h1>
	<h3>Unofficial notices reader, because your eyes matter.</h3>
	<div class="PrimaryContent">
		<NoticeBlock/>
	</div>
</main>

<style lang="scss">
	@import "vars.scss";

	main {
		max-width: none;
		height: 100%;
		// overflow-x: hidden;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		h1 {
			text-align: center;
			text-transform: uppercase;
			font-size: 4rem;
			font-weight: 100;
			margin-bottom: 0;
		}
		h3 {
			text-align: center;
			font-weight: bold;
		}
		.PrimaryContent {
			margin-top: 2em;
			background-color: rgb(230, 230, 230);
			box-shadow: 1px 1px 8px $drop-down-shadow;
			width: 80%;
		}
	}

	@media (max-width: 640px) {
		main {
			padding: 0;
			h1 {
				font-size: 2rem;
			}
			.PrimaryContent {
				width: 100vw;
				margin: 0;
			}
			
		}
	}
</style>
