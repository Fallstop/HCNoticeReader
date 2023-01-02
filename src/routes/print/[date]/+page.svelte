<script>
    import SchoolNotice from "$lib/components/SchoolNotice.svelte";

    export function load({ params }) {
    if (params.slug === 'hello-world') {
        return {
        title: 'Hello world!',
        content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
        };
    }
    
    throw error(404, 'Not found');
    }
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<SchoolNotice/>