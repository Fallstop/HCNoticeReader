<script lang="ts">
</script>

<div class="content">
	<h1>HCNotices <span class="light-text">V2</span></h1>
	<div class="block-link-container">
		<a class="block-link" href="https://v1.hcnoticereader.pages.dev/" target="_blank"
		rel="noreferrer">
			Checkout HCNotices V1
		</a>
		<a class="block-link" href="https://status.qrl.nz/status/public#:~:text=Huanui%20College%20Services" target="_blank"
		rel="noreferrer">
			View server status
		</a>
	</div>
	<p>
		HCNotices is a webapp that allows students to easily view Huanui
		College's daily notices online in a connivent and eye-pleasing form.
	</p>
	<p>
		HCNotices is built using Svelte, and is open-source under the <a href="https://github.com/Fallstop/HCNoticeReader/blob/main/LICENSE.md" target="_blank" rel="noreferrer">MIT license</a>. You can find the
		source code at <a
			href="https://github.com/Fallstop/HCNoticeReader"
			target="_blank"
			rel="noreferrer">Fallstop/HCNoticeReader</a
		>. It also uses the HC-Tools API, which is <a href="https://github.com/Fallstop/HC-API-Tools" target="_blank" rel="noreferrer">open-source</a> and the documentation can be found
		at <a
			href="https://jmw.nz/projects/hc-tools"
			target="_blank"
			rel="noreferrer">jmw.nz/projects/hc-tools</a
		>.
	</p>

	<p>Developed by <a href="https://jmw.nz" >Jasper M-W</a>, <a href="mailto:contact@jmw.nz" target="__blank" rel="noreferrer">contact@jmw.nz</a>.</p>
	<p class="light-text">HCNotices is not endorsed by, directly affiliated with, or maintained by Huanui College.</p>
</div>

<style lang="scss">
	@use "../scss/variables.scss" as *;
	h1 {
		font-size: 2rem;
		text-align: left;
		font-weight: bold;

	}

	.light-text {
		font-weight: lighter;
		color: $mid-tone;
	}

	a:not(.block-link) {
		color: $color-text;
		text-decoration: underline;
		transition: color 0.15s ease-in-out;
		&:hover {
			color: $mid-tone;
		}
	}
	.block-link-container {
		display: flex;
		gap: 1rem;
		margin: 0.5rem 0;
		flex-wrap: wrap;
		.block-link {
			display: block;
			color: $color-text;
			text-decoration: none;
			border: $color-text solid 1px;
			border-radius: 0.25rem;
			padding: 0.25rem 0.5rem;
		}
	}
</style>
