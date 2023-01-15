<script>
    import ArrowBack from "$lib/icons/ArrowBack.svelte";
    import HuanuiGlowingCenterBox from "$lib/layouts/HuanuiGlowingCenterBox.svelte";

</script>
<HuanuiGlowingCenterBox>
    <h2>Daily Newsletter</h2>
    <div class="content">
        asdasd
    </div>
    <!-- <svelte:fragment slot="footer">
		<a
			href={`/`}
			class="footer-button"
		>
			<ArrowBack />
			Back
		</a>
    </svelte:fragment> -->
</HuanuiGlowingCenterBox>

<style lang="scss">
    @use "../../../lib/scss/variables.scss" as *;
    @use "../../../lib/scss/footer.scss" as *;

    h2 {
        text-align: center;
        font-size: 2rem;
    }

    .footer-button {
        @include footer-button;
    }
</style>