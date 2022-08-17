<script>
    import 'virtual:windi.css'
    import {Page, Icon, Modal, Button, Card, CardBody} from '@svind/svelte'
    import '@svind/svelte/styles.css'
import { goto } from '$app/navigation';
import { page } from '$app/stores';

    let modalOpen = false;

function quit() {
    modalOpen = true
}

</script>
<Page>
    {#if $page.url.pathname !== '/'}
    <div class="absolute text-4xl left-2 top-2 w-10 h-10 bg-gray-700/50 text-white rounded-full animate-pulse animate-repeat-1">
        <Button circle variant="secondary" on:click={() => quit()}>
            <Icon icon="la:times"/>
        </Button>
    </div>
    {/if}

    <slot/>
    <div class="h-12"/>
    <Modal bind:open={modalOpen}>
        <Card>
            <CardBody>


            <div>Are you sure you want to Quit game?</div>
            
            <div class="gap-4 pt-4 flex justify-end">

                <Button outline variant="secondary" on:click={() => {goto('/'); modalOpen = false}}>Yes</Button>
                <Button variant="secondary" on:click={() => modalOpen = false}>No</Button>
            </div>
        </CardBody>
            
        </Card>
    
</Modal>
</Page>

<style global>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }


    html, body {
        height: 100%;
    }
    body {
        overscroll-behavior-y: contain;
        overflow: hidden;
        user-select: none;
    }

    body > div {
        height: 100%;
    }

    .text-shadow {
        text-shadow: 1px 1px 1px #40404060;
    }


</style>
