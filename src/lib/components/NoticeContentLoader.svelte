<script lang="ts">
    import { Random } from '$lib/seededRandom';
    import { onMount } from 'svelte';
    import ContentLoader from 'svelte-content-loader';

    export let width: number;
    export let height: number;

    interface LineSpec {
        x: number;
        y: number;
        width: number;
    }

    const lineHeight = 10;


    function calculateTemplate(width: number, potentialNumLines: number): LineSpec[] {
        let template = [];

        let seededRandomGen = new Random(42);

        for (let i = 0; i < potentialNumLines; i++) {
            // Starter bars (1/3) start at the base, and reset the regressing width
            let xPost = 0;
            // Bar can between 0.6 and 0.8 of the width
            let barWidth = (seededRandomGen.nextNumber() * (1.0 - 0.6) + 0.6) * width;

            if (i % 3 !== 0) {
                // Subbar, so we indent and regress width
                xPost = 20;
                const lastWidth = template[template.length - 1].width;
                barWidth = lastWidth * ((seededRandomGen.nextNumber()/4)+0.75) - 20;
            }

            template.push({
                x: xPost,
                y: i * lineHeight * 2,
                width: barWidth
            })
        }

        return template;

    }
    $: potentialNumLines = Math.floor(((height*2)/3) / (lineHeight*2))

    $: template = calculateTemplate(width, potentialNumLines);
</script>
<ContentLoader primaryColor="#718394" secondaryColor="#C9CED1" primaryOpacity="0.5" {width} height={(height*2)/3} uniqueKey={"NoticeData"}>
    {#each template as line}
        <rect x={line.x} y={line.y} rx="3" ry="3" width={line.width} height={lineHeight} />
    {/each}
</ContentLoader>