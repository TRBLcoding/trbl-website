<script lang="ts">
	import Footer from "$components/Footer.svelte"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"
	import {
		faDiscord,
		faFacebookSquare,
		faInstagram,
		faYoutube,
	} from "@fortawesome/free-brands-svg-icons"
	import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
	import { faBars, faRightToBracket, faUser, faXmark } from "@fortawesome/free-solid-svg-icons"
	import { SvelteToast } from "@zerodevx/svelte-toast"
	import Fa from "svelte-fa"
	import "../app.css"
	import Cart from "../components/Cart.svelte"
	import LoginModal from "$components/LoginModal.svelte"
	import ProfileDropdown from "$components/ProfileDropdown.svelte"

	let showMenu = true
	const loginModalID = "login-modal"

	// Make sure user is always loaded, by subscribing to authStore
	$authStore
</script>

<svelte:head>
	<title>{$pageHeadStore.getFullTitle()}</title>
</svelte:head>

<SvelteToast options={{ reversed: true, intro: { y: 192 } }} />

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
				<a href="/"
					><img src="/TRBL_Logo.avif" alt="TRBL logo" class="w-40" /></a
				>
				<!-- Small screen -->
				<div class="lg:hidden">
					<button
						class="btn btn-square btn-ghost"
						onclick={() => (showMenu = !showMenu)}
					>
						<Fa icon={showMenu ? faBars : faXmark} size="lg" />
					</button>
					<Cart></Cart>
				</div>
				<!-- Large screen -->
				<div class="menu menu-horizontal hidden lg:block">
					<div class="dropdown dropdown-hover">
						<div tabindex="0" role="button" class="btn">Sound and light</div>
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<ul
							tabindex="0"
							class="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
						>
							<li><a href="/todo">Op Maat</a></li>
							<li><a href="/todo">Verhuur</a></li>
						</ul>
					</div>
					<div class="dropdown dropdown-hover">
						<div tabindex="0" role="button" class="btn">Electronics</div>
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<ul
							tabindex="0"
							class="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
						>
							<li><a href="/todo">TRBL producten</a></li>
							<li><a href="/todo">Hersteldienst</a></li>
						</ul>
					</div>
					<a class="btn shadow-none" href="/#contact">Contact</a>
					<a class="btn btn-primary px-6" href="/products">Verhuur</a>
					<Cart></Cart>
					{#if !$authStore}
						<label for={loginModalID} class="btn btn-square btn-ghost" title="Account">
							<Fa icon={faRightToBracket} size="lg" />
						</label>
					{:else}
						<ProfileDropdown></ProfileDropdown>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex flex-col lg:hidden" class:hidden={showMenu}>
			<a href="/">
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Home</div>
				</div>
			</a>
			<div
				class="collapse collapse-plus bg-base-100 border-base-300 border rounded-none"
			>
				<input type="checkbox" />
				<div class="collapse-title">Sound and Light</div>
				<div class="collapse-content text-sm">
					Click the "Sign Up" button in the top right corner and follow the
					registration process.
				</div>
			</div>
			<div
				class="collapse collapse-plus bg-base-100 border-base-300 border rounded-none"
			>
				<input type="checkbox" />
				<div class="collapse-title">Electronics</div>
				<div class="collapse-content text-sm">
					Click the "Sign Up" button in the top right corner and follow the
					registration process.
				</div>
			</div>
			<a href="/todo">
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Verhuur</div>
				</div>
			</a>
			<a href="/profile">
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Mijn account</div>
				</div>
			</a>
			<a href="/todo">
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Overzicht Offerte-Aanvraag</div>
				</div>
			</a>
			<a href="/todo">
				<div class="bg-base-100 border-base-300 border rounded-none">
					<div class="collapse-title">Contact</div>
				</div>
			</a>
		</div>
	</div>

	<div class="flex-1">
		<slot />
	</div>
	
	<Footer />
</div>



<LoginModal {loginModalID} />

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
