<script lang="ts">
    import { pageHeadStore } from "$lib/stores/PageHeadStore"

    // -- Page title --
    pageHeadStore.updatePageTitle("Winkelmandje")

    // Dummy cart data
    let cartItems = [
        {
            id: 1,
            name: "1000w Verticale Rookmachine",
            price: 18.99,
            quantity: 1,
            image: "https://via.placeholder.com/150"
        },
        {
            id: 2,
            name: "3 meter licht statief",
            price: 8.00,
            quantity: 3,
            image: "https://via.placeholder.com/150"
        },
        {
            id: 3,
            name: "ART910-AX High-end Media Topkast",
            price: 28.99,
            quantity: 1,
            image: "https://via.placeholder.com/150"
        }
    ]

    $: subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    function updateQuantity(id: number, newQuantity: number) {
        if (newQuantity < 1) return
        cartItems = cartItems.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        )
    }

    function removeItem(id: number) {
        cartItems = cartItems.filter(item => item.id !== id)
    }
</script>

<div class="max-w-6xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Winkelmandje</h1>
    
    {#if cartItems.length === 0}
        <div class="card bg-base-200">
            <div class="card-body text-center">
                <p class="text-xl">Je winkelmandje is leeg</p>
                <div class="card-actions justify-center mt-4">
                    <a href="/products" class="btn btn-primary">Ga verder met winkelen</a>
                </div>
            </div>
        </div>
    {:else}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Cart Items -->
            <div class="lg:col-span-2 space-y-4">
                {#each cartItems as item (item.id)}
                    <div class="card bg-base-200 shadow-lg">
                        <div class="card-body">
                            <div class="flex flex-col sm:flex-row gap-4">
                                <!-- Product Image -->
                                <div class="avatar">
                                    <div class="w-24 h-24 rounded">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                </div>

                                <!-- Product Info -->
                                <div class="flex-1">
                                    <h3 class="card-title text-lg">{item.name}</h3>
                                    <p class="text-success font-semibold mt-2">€ {item.price.toFixed(2)}</p>
                                    
                                    <!-- Quantity Controls -->
                                    <div class="flex items-center gap-2 mt-4">
                                        <span class="text-sm">Aantal:</span>
                                        <div class="join">
                                            <button 
                                                class="btn btn-sm join-item"
                                                on:click={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <input 
                                                type="number" 
                                                class="input input-sm input-bordered join-item w-16 text-center"
                                                value={item.quantity}
                                                min="1"
                                                on:change={(e) => updateQuantity(item.id, parseInt(e.currentTarget.value))}
                                            />
                                            <button 
                                                class="btn btn-sm join-item"
                                                on:click={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Price & Remove -->
                                <div class="flex flex-col items-end justify-between">
                                    <button 
                                        class="btn btn-ghost btn-sm btn-circle"
                                        on:click={() => removeItem(item.id)}
                                        aria-label="Verwijder item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                    <div class="text-right">
                                        <p class="text-sm text-base-content/70">Totaal:</p>
                                        <p class="text-xl font-bold text-success">€ {(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
                <div class="card bg-base-200 shadow-lg sticky top-6">
                    <div class="card-body">
                        <h2 class="card-title">Overzicht</h2>
                        
                        <div class="divider"></div>
                        
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span>Subtotaal:</span>
                                <span>€ {subtotal.toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Verzendkosten:</span>
                                <span>t.b.d.</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Betaling:</span>
                                <span>Factuur of bij ontvangst</span>
                            </div>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <div class="flex justify-between text-xl font-bold">
                            <span>Totaal:</span>
                            <span class="text-success">€ {(subtotal * 1.21).toFixed(2)}</span>
                        </div>

                        <div class="card-actions flex-col mt-4">
                            <button class="btn btn-primary btn-block">
                                Afrekenen
                            </button>
                            <a href="/products" class="btn btn-ghost btn-block">
                                Verder winkelen
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>