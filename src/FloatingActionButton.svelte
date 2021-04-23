<script lang="ts">
    export let rightPos = "40px";
    export let externalLink;
</script>

<a href={externalLink} target="_blank" class="float" style="right: {rightPos}">
    <slot />
</a>

<style lang="scss">
    @import "vars.scss";

    .float {
        margin: 1em;

        width: 60px;
        height: 60px;

        background-color: var(--primary);
        color: #fff;
        border-radius: 50px;
        text-align: center;
        box-shadow: 2px 2px 3px #999;
        &:hover {
            box-shadow: 0 0 0 0, 0 6px 12px rgb(126, 126, 126);
            transition: all 0.3s ease;
            transform: translate3D(0, -2px, 0);
        }
    }
    @media (min-width: 700px) {
        .float {
            margin: 0;
            position: fixed;
            bottom: 40px;
        }
    }
</style>
