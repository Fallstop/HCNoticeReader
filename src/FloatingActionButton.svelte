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
        margin:1em;
        
        width: 60px;
        height: 60px;
        
        background-color: $primary;
        color: #fff;
        border-radius: 50px;
        text-align: center;
        box-shadow: 2px 2px 3px #999;
    }
    @media (min-width:700px) {
        .float {
            margin:0;
            position: fixed;
            bottom: 40px;

        }
        
    }
</style>
