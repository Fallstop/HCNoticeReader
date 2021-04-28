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
        flex-grow: none;

        background-color: var(--primary);
        border-radius: 50px;
        text-align: center;
        box-shadow:  3px 3px 7px var(--primary-darker),
                    -3px -3px 7px var(--primary-lighter);
        border: solid 1px var(--primary-secondary);
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
