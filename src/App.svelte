<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import Particle from './classes/Particle.ts';
    import Red from './classes/Red.ts';
    import White from './classes/White.ts';
    import Blue from './classes/Blue.ts';
    import Camera from './classes/Camera.ts';
    import Field from './classes/Field.ts';
    import { Text, Button, Slider } from '@ottav14/dui';

    const bloomBlur: number = 20;

    let canvas: HTMLCanvasElement;
    let mouseMode: string = 'particle';
    let particleCreationMode: string = 'P';
    let particles: Particle[] = [];
    let camera = new Camera();
    let mouseHeld = false;
    let settingsOpen = false;

    const displayParams: Record<string, any> = {
        'showRanges': false,
        'minimalParticles': false,
    };

    const physicsParams: Record<string, any> = {
        'electromagneticRange': 300,
        'electromagneticStrength': 0.03,
    };

    const field = new Field();

    const createParticle = (x: number, y: number, type: string) => {
        switch(type) {
            case 'P':
                particles.push(new Red(x, y));
                break;
            case 'N':
                particles.push(new White(x, y));
                break;
            case 'E':
                particles.push(new Blue(x, y));
                break;
        }
    }

    const updateParticles = () => {
        for(const particle of particles)
            particle.update(particles, physicsParams);
    }

    const handleKeydown = (e: KeyboardEvent) => {
        switch(e.key) {
            case 'Shift':
                mouseMode = 'panning';
                break;
        }
    }

    const handleKeyup = (e: KeyboardEvent) => {
        switch(e.key) {
            case 'Shift':
                mouseMode = 'particle';
                break;
        }
    }

    const handleMouseDown = (e: MouseEvent) => {
        mouseHeld = true;
        switch(mouseMode) {
            case 'particle':
                createParticle(
                    e.clientX - camera.x,
                    e.clientY - camera.y,
                    particleCreationMode
                );
                break;
            case 'panning':
                break;
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if(mouseMode === 'panning' && mouseHeld) {
            camera.pan(e);
        }
    }

    const bloom = (ctx: CanvasRenderingContext2D, particlePass: HTMLCanvasElement) => {
        ctx.filter = `blur(${bloomBlur}px)`;
        ctx.globalCompositeOperation = "lighter";

        ctx.drawImage(particlePass, 0, 0);

        ctx.filter = "none";
        ctx.globalCompositeOperation = "source-over";
    }

    // Reused every frame; allocating a full-screen canvas per frame churns the GC.
    const particleLayer = document.createElement("canvas");

    const particleDrawPass = () => {
        if(particleLayer.width !== canvas.width || particleLayer.height !== canvas.height) {
            // Assigning either dimension also clears the canvas.
            particleLayer.width = canvas.width;
            particleLayer.height = canvas.height;
        }
        else {
            particleLayer.getContext('2d')?.clearRect(0, 0, particleLayer.width, particleLayer.height);
        }

        for(const particle of particles)
            particle.display(particleLayer, camera, displayParams, physicsParams);

        return particleLayer;
    }

    const loop = () => {
        const ctx = canvas.getContext('2d');
        if(!ctx)
            throw new Error('Failed to retrieve canvas rendering context.');

        camera.update();
        updateParticles();

        ctx.fillStyle = '#101010';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        field.display(canvas, camera, particles, physicsParams);

        const particlePass = particleDrawPass();
        ctx.drawImage(particlePass, 0, 0);

        bloom(ctx, particlePass);
        
        requestAnimationFrame(loop);
    }

    onMount(() => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        canvas.addEventListener('mousedown', (e) => handleMouseDown(e));
        window.addEventListener('mouseup', () => mouseHeld = false);
        window.addEventListener('mousemove', (e) => handleMouseMove(e));
        window.addEventListener('keydown', (e) => handleKeydown(e));
        window.addEventListener('keyup', (e) => handleKeyup(e));

        loop();
    });
</script>

<div class="ui">
    <div class="buttonContainer">
        <Button 
            text="P" 
            onClick={() => particleCreationMode = 'P'}
            bottomBorder={false} 
        />
        <Button 
            text="N" 
            onClick={() => particleCreationMode = 'N'}
            bottomBorder={false} 
        />
        <Button 
            text="E" 
            onClick={() => particleCreationMode = 'E'}
            bottomBorder={false} 
        />
        <Button 
            text="C"
            onClick={() => displayParams['showRanges'] = !displayParams['showRanges']}
            bottomBorder={false} 
            toggleButton={true}
        />
        <Button 
            text="M"
            onClick={() => displayParams['minimalParticles'] = !displayParams['minimalParticles']}
            bottomBorder={false} 
            toggleButton={true}
        />
        <Button 
            onClick={() => settingsOpen = !settingsOpen}
            toggleButton={true}
            type="settings"
        />
        {#if settingsOpen}
            <div class="settingsMenu" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
                <div>
                    <Text 
                        text="Electromagnetic Range" 
                        align="center"
                    />
                    <Slider 
                        value={physicsParams['electromagneticRange']} 
                        min={50}
                        max={800}
                        increment={1}
                        onChange={(val) => physicsParams['electromagneticRange'] = val}
                     />
                    <Slider 
                        value={physicsParams['electromagneticStrength']} 
                        min={0.001}
                        max={0.1}
                        increment={0.001}
                        decimalDigits={3}
                        onChange={(val) => physicsParams['electromagneticStrength'] = val}
                     />
                </div>
            </div>
        {/if}
    </div>
</div>
<canvas 
    bind:this={canvas}
    style={`
        cursor: ${mouseMode === 'panning' ? (mouseHeld ? 'grabbing' : 'grab') : 'default'}
    `}
 >
</canvas>

<style>
    .ui {
        position: absolute;
        top: 2rem;
        left: 2rem;
    }

    .buttonContainer {
        position: relative;
    }

    .settingsMenu {
        position: absolute;
        display: grid;
        grid-template-columns: 1fr 1fr;
        height: calc(100% - 2px);
        background-color: #101010;
        z-index: -1;
        top: 0;
        left: 100%;
        border-right: 1px solid #ededed;
        border-top: 1px solid #ededed;
        border-bottom: 1px solid #ededed;
    }

    canvas {
        position: absolute;
        z-index: -2;
    }

</style>
