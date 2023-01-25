<script>
    import ArrowBack from "$lib/icons/ArrowBack.svelte";
    import HuanuiGlowingCenterBox from "$lib/layouts/HuanuiGlowingCenterBox.svelte";

</script>
<HuanuiGlowingCenterBox>
    <h2>Daily Newsletter</h2>
    <div class="content">
        <p>
            A daily newsletter of the notices and the timetable day is being planned, you can register your interest and pre-join.
        </p>
        <form method="POST" action="?/register">
            <input type="email" placeholder="Email Address"/>
            <button type="submit">Register</button>
        </form>
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

    .content {
        padding: 1rem;
        font-size: 1.2rem;
        text-align: center;
    }

    .footer-button {
        @include footer-button;
    }
</style>