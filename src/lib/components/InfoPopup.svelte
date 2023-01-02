<script lang="ts">
</script>

<div class="content">
	<h1>HCNotices <span class="light-text">V2</span></h1>
	<p>
		HCNotices is a webapp that allows students to easily view Huanui
		College's daily notices online in a connivent and eye-pleasing form.
	</p>
	<p>
		HCNotices is built using Svelte, and is open-source. You can find the
		source code at <a
			href="https://github.com/Fallstop/HCNoticeReader"
			target="_blank"
			rel="noreferrer">Fallstop/HCNoticeReader</a
		>. It also uses the HC-Tools API, which is open-source and the documentation can be found
		at <a
			href="https://jmw.nz/projects/hc-tools"
			target="_blank"
			rel="noreferrer">jmw.nz/projects/hc-tools</a
		>.
	</p>
	<p>Created by <a href="https://jmw.nz" >Jasper M-W</a>, <a href="mailto:contact@jmw.nz" target="__blank" rel="noreferrer">contact@jmw.nz</a>.</p>
	<p class="light-text">HCNotices is not affiliated with Huanui College.</p>
</div>

<style lang="scss">
	@use "../scss/variables.scss" as *;
	.content {
	}
	h1 {
		font-size: 2rem;
		text-align: left;
		font-weight: bold;

	}

	.light-text {
		font-weight: lighter;
		color: $light-tone;
	}

	a {
		color: $color-text;
		text-decoration: underline;
		transition: color 0.15s ease-in-out;
		&:hover {
			color: $mid-tone;
		}
	}
</style>
