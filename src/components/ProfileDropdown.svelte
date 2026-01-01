<script lang="ts">
	import { resolve } from "$app/paths"
	import { authStore } from "$lib/stores/AuthStore"
	import {
		faChevronDown,
		faSignOut,
		faUser,
	} from "@fortawesome/free-solid-svg-icons"
	import Fa from "svelte-fa"
</script>

{#if $authStore}
	<div title="Profiel" class="dropdown dropdown-end">
		<div tabindex="0" role="button" class="btn btn-ghost gap-2 normal-case">
			<Fa icon={faUser} class="text-xl" />
			<Fa icon={faChevronDown} class="text-gray-500" />
		</div>
		<ul
			class="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
		>
			<li class="menu-title">
				<span>{$authStore.firstName || "User"}</span>
			</li>
			<li><a href={resolve("/profile")}>Profiel</a></li>
			{#if $authStore.isAdmin()}
				<li><a href={resolve("/dashboard")}>Dashboard</a></li>
			{/if}
			<li class="flex flex-row gap-1">
				<button on:click={authStore.signOut} class="w-full">
					<Fa icon={faSignOut} class="text-lg" />
					Uitloggen
				</button>
			</li>
		</ul>
	</div>
{/if}
