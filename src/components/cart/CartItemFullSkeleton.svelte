<div class="card bg-base-200 shadow-lg">
	<div class="card-body">
		<div class="flex flex-col sm:flex-row gap-4">
			<!-- Product Image -->
			<div class=" w-24 h-24 rounded skeleton"></div>

			<!-- Product Info -->
			<div class="flex-1">
				<div class="card-title link link-hover h-4 w-80 mt-2 skeleton"></div>
				<span class="badge gap-1 font-semibold mt-1 h-5 w-20 skeleton"> </span>

				<!-- Quantity Controls -->
				<div class="flex items-center gap-2 mt-6 w-44 skeleton h-8"></div>
			</div>

			<!-- Price & Remove -->
			<div class="flex flex-col items-end justify-between">
				<button
					class="btn btn-square btn-ghost hover:btn-primary btn-sm"
					aria-label="Verwijder item"
				>
				</button>
				<div class="text-right">
					<p
						class=" ml-auto text-xl font-bold text-success h-4 skeleton mt-1 w-16"
					></p>
					<p class="text-xl font-bold text-success h-6 skeleton mt-1 w-24"></p>
				</div>
			</div>
		</div>
	</div>
</div>
