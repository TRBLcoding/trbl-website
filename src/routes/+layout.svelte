<script lang="ts">
	import { resolve } from "$app/paths"
	import Footer from "$components/Footer.svelte"
	import LoginModal from "$components/LoginModal.svelte"
	import ProfileDropdown from "$components/ProfileDropdown.svelte"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faDiscord,
		faFacebookSquare,
		faInstagram,
		faYoutube,
	} from "@fortawesome/free-brands-svg-icons"
	import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
	import {
		faBars,
		faChevronDown,
		faRightToBracket,
		faSignIn,
		faSignOut,
		faXmark,
	} from "@fortawesome/free-solid-svg-icons"
	import { SvelteToast } from "@zerodevx/svelte-toast"
	import { onMount } from "svelte"
	import Fa from "svelte-fa"
	import "../app.css"
	import Cart from "../components/cart/Cart.svelte"

	let showMenu = true
	const loginModalID = "login-modal"

	// Fix toasts rendering only on client side, otherwise they dont have proper positioning styles
	let toasts = false
	onMount(() => {
		toasts = true
	})

	// eslint-disable-next-line @typescript-eslint/no-unused-expressions
	$authStore // Make sure user is always loaded, by subscribing to authStore
</script>

<svelte:head>
	<title>{$pageHeadStore.getFullTitle()}</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<div class="relative z-20 bg-base-100">
		<div class="border-b border-base-300">
			<div class="py-5 mx-auto max-w-3/4 flex justify-between">
				<!-- Socials -->
				<div class="flex gap-3 mx-auto lg:mx-0 my-auto">
					<a href="https://facebook.com/trblsoundandlight" target="_blank">
						<Fa icon={faFacebookSquare} />
					</a>
					<a href="https://instagram.com/trbl_snl/" target="_blank">
						<Fa icon={faInstagram} />
					</a>
					<a
						href="https://youtube.com/channel/UCKdrfhbUobqx98V_ViPOHDg"
						target="_blank"
					>
						<Fa icon={faYoutube} />
					</a>
					<a href="mailto:info@trbl.be" target="_blank">
						<Fa icon={faEnvelope} />
					</a>
					<a href="https://discordapp.com/users/_Teunvdv_#5637" target="_blank">
						<Fa icon={faDiscord} />
					</a>
				</div>
			</div>
		</div>

		<div class="border-b border-base-300">
			<div class="flex justify-between items-center mx-auto max-w-3/4">
				<a href={resolve("/")}
					><img src="/TRBL_Logo.avif" alt="TRBL logo" class="w-40" /></a
				>
				<!-- Small screen -->
				<div class="lg:hidden">
					<button
						class="btn btn-square btn-ghost"
						on:click={() => (showMenu = !showMenu)}
					>
						<Fa icon={showMenu ? faBars : faXmark} size="lg" />
					</button>
					<Cart></Cart>
				</div>
				<!-- Large screen -->
				<div class="hidden lg:block">
					<div class="dropdown dropdown-hover">
						<div tabindex={0} role="button" class="btn">
							Sound and light <Fa icon={faChevronDown} class="" />
						</div>
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<ul
							tabindex={-1}
							class="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm min-w-38"
						>
							<li><a href={resolve("/todo")}>Op Maat</a></li>
							<li><a href={resolve("/todo")}>Verhuur</a></li>
						</ul>
					</div>
					<div class="dropdown dropdown-hover">
						<div tabindex={0} role="button" class="btn">
							Electronics <Fa icon={faChevronDown} class="" />
						</div>
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<ul
							tabindex={-1}
							class="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
						>
							<li><a href={resolve("/todo")}>TRBL producten</a></li>
							<li><a href={resolve("/todo")}>Hersteldienst</a></li>
						</ul>
					</div>
					<a class="btn shadow-none" href="/#contact">Contact</a>
					<a class="btn btn-primary px-6" href={resolve("/products")}>Verhuur</a
					>
					<Cart></Cart>
					{#if !$authStore}
						<label
							for={loginModalID}
							class="btn btn-square btn-ghost"
							title="Account"
						>
							<Fa icon={faRightToBracket} size="lg" />
						</label>
					{:else}
						<ProfileDropdown></ProfileDropdown>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex flex-col lg:hidden" class:hidden={showMenu}>
			<a href={resolve("/")} on:click={() => (showMenu = true)}>
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Home</div>
				</div>
			</a>
			<div
				class="collapse collapse-arrow bg-base-100 border-base-300 border rounded-none"
			>
				<input id="sound-and-light-collapse" type="checkbox" />
				<div class="collapse-title">Sound and Light</div>
				<div class="collapse-content text-sm">
					Click the "Sign Up" button in the top right corner and follow the
					registration process.
				</div>
			</div>
			<div
				class="collapse collapse-arrow bg-base-100 border-base-300 border rounded-none"
			>
				<input id="electronics-collapse" type="checkbox" />
				<div class="collapse-title">Electronics</div>
				<div class="collapse-content text-sm">
					Click the "Sign Up" button in the top right corner and follow the
					registration process.
				</div>
			</div>
			<a href={resolve("/products")} on:click={() => (showMenu = true)}>
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Verhuur</div>
				</div>
			</a>
			<a href="/#contact" on:click={() => (showMenu = true)}>
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Contact</div>
				</div>
			</a>
			{#if $authStore}
				<a href={resolve("/profile")} on:click={() => (showMenu = true)}>
					<div class="bg-base-100 border-base-300 border rounded-none">
						<div class="collapse-title">Profiel</div>
					</div>
				</a>
			{/if}
			{#if $authStore && $authStore.isAdmin()}
				<a href={resolve("/dashboard")} on:click={() => (showMenu = true)}>
					<div class="bg-base-100 border-base-300 border rounded-none">
						<div class="collapse-title">Dashboard</div>
					</div>
				</a>
			{/if}
			{#if $authStore}
				<button
					type="button"
					on:click={() => {
						authStore.signOut()
						showMenu = true
					}}
				>
					<div class="bg-base-100 border-base-300 border rounded-none">
						<div class="collapse-title flex gap-2 items-center">
							<Fa icon={faSignOut} class="text-lg" /> Uitloggen
						</div>
					</div>
				</button>
			{:else}
				<button
					type="button"
					class="w-full text-left"
					on:click={() => {
						showMenu = true
						document.getElementById(loginModalID)?.click()
					}}
					title="Account"
				>
					<div class="bg-base-100 border-base-300 border rounded-none">
						<div class="collapse-title flex gap-2 items-center">
							<Fa icon={faSignIn} class="text-lg" /> Aanmelden
						</div>
					</div>
				</button>
			{/if}
		</div>
	</div>

	<div class="flex-1">
		<slot />
	</div>

	<Footer />
</div>

<LoginModal {loginModalID} />

{#if toasts}
	<SvelteToast />
{/if}

<style lang="postcss">
	@reference "../app.css";
	:root {
		/* Toast formatting */
		--toastBackground: transparent;
		--toastPadding: 0;
		--toastMsgPadding: 0;
		--toastWidth: fit-content;
		--toastBoxShadow: none;

		/* Toast layout */
		--toastContainerTop: auto;
		--toastContainerRight: 2rem;
		--toastContainerBottom: 2.5rem;
	}
</style>
