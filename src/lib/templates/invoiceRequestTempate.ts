import type { InvoiceMessage } from "$lib/domain/InvoiceRequest"
import { productStore } from "$lib/stores/ProductStore"


export async function getAdminInvoiceRequestTemplate(invoiceMessage: InvoiceMessage) {
	const mappedProducts = await Promise.all(invoiceMessage.selectedProducts.map(async e => {
		return { product: await productStore.getProductById(e.id), amount: e.amount }
	}))
	const totalPrice = mappedProducts.reduce((acc, curr) => {
		return acc + (curr.product.price * curr.amount)
	}, 0)
	console.log(mappedProducts.length)

	return /*html*/`
	<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; line-height: 1.6;">
		<div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
			<!-- Header -->
			<div style="background-color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 2px solid #f0f0f0;">
				<img src="https://mlhqzqapatk4.i.optimole.com/cb:UGQh.37d8a/w:auto/h:auto/q:90/f:best/http://trbl.be/files/2023/01/TRBL-Logo-Zwart-transparant-Zoomed16x9.png" 
					alt="Logo TRBL" 
					width="200" 
					height="auto"
					style="width: 180px !important; height: auto !important; display: block; margin: 0 auto; max-width: 100%;">
			</div>
			
			<!-- Content -->
			<div style="padding: 40px;">
				<h2 style="color: #333333; font-size: 28px; margin: 0 0 20px 0; font-weight: bold; text-align: center;">
					Aanvraag tot offerte
				</h2>

				<p style="color: #555555; font-size: 16px; margin: 0 0 20px 0;">
					Hallo,
				</p>
				
				<p style="color: #555555; font-size: 16px; margin: 0 0 30px 0;">
					Er is een nieuwe aanvraag tot offerte binnengekomen via trbl.be.
				</p>
				
				<!-- Customer Details -->
				<div style="margin: 30px 0;">
					<h3 style="color: #333333; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-bottom: 2px solid #FE5252; padding-bottom: 10px;">
						Factuurgegevens
					</h3>
					<div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>Naam:</strong> ${invoiceMessage.firstName} ${invoiceMessage.lastName}
						</p>
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>E-mailadres:</strong> <a href="mailto:${invoiceMessage.emailAddress}" style="color: #007bff; text-decoration: none;">${invoiceMessage.emailAddress}</a>
						</p>
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>Telefoonnummer:</strong> ${invoiceMessage.phoneNumber}
						</p>
						${invoiceMessage.companyName ? /*html*/`
							<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
								<strong>Bedrijfsnaam:</strong> ${invoiceMessage.companyName}
							</p>`: ``}
						${invoiceMessage.BTWNumber ? /*html*/`
							<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
								<strong>BTW-nummer:</strong> ${invoiceMessage.BTWNumber}
							</p>`	: ``}
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>Land:</strong> ${invoiceMessage.country}
						</p>
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>Straat+Nr:</strong> ${invoiceMessage.streetAndNumber}
						</p>
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>Postcode:</strong> ${invoiceMessage.postalCode}
						</p>
						<p style="color: #333333; font-size: 14px; margin: 0">
							<strong>Plaats:</strong> ${invoiceMessage.place}
						</p>
					</div>
				</div>

				<!-- Delivery Details -->
				<div style="margin: 30px 0;">
					<h3 style="color: #333333; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-bottom: 2px solid #FE5252; padding-bottom: 10px;">
						Levering
					</h3>
					<div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
						<p style="color: #333333; font-size: 14px; margin: 0;">
							<strong>Leveringsmethode:</strong> ${invoiceMessage.deliveryMethod === "pick-up" ? "Afhaling door klant" : "Levering"}
						</p>
						${invoiceMessage.deliveryDetails ? /*html*/`
							<p style="color: #333333; font-size: 14px; margin: 15px 0 10px 0;">
								<strong>Contactpersoon:</strong> ${invoiceMessage.deliveryDetails.deliveryFirstName} ${invoiceMessage.deliveryDetails.deliveryLastName}
							</p>
							<p style="color: #333333; font-size: 14px; margin: 0">
								<strong>Adres:</strong> ${invoiceMessage.deliveryDetails.deliveryStreetAndNumber} ${invoiceMessage.deliveryDetails.deliveryPostalCode} ${invoiceMessage.deliveryDetails.deliveryPlace} ${invoiceMessage.deliveryDetails.deliveryCountry}
							</p>`: ``}
					</div>
				</div>

				<!-- Order Details -->
				<div style="margin: 30px 0;">
					<h3 style="color: #333333; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-bottom: 2px solid #FE5252; padding-bottom: 10px;">
						Bestellingsdetails
					</h3>
					<div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>Type evenement:</strong> ${invoiceMessage.eventType}
						</p>
						<p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
							<strong>Huurperiode:</strong> ${invoiceMessage.rentPeriod}
						</p>
						<p style="color: #333333; font-size: 14px; margin: 0;">
							<strong>Betaalmethode:</strong> ${invoiceMessage.paymentMethod === "bank-transfer" ? "Overschrijving bij factuur" : "Contant bij levering"}
						</p>
						${invoiceMessage.couponCode ? /*html*/`
							<p style="color: #333333; font-size: 14px; margin: 10px 0 0 0;">
								<strong>Kortingscode:</strong> ${invoiceMessage.couponCode}
							</p>` : ``}
					</div>
				</div>

				<!-- Products -->
				<div style="margin: 30px 0;">
					<h3 style="color: #333333; font-size: 20px; margin: 0 0 15px 0; font-weight: bold; border-bottom: 2px solid #FE5252; padding-bottom: 10px;">
						Geselecteerde Producten
					</h3>
					<div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px;">
						<!-- Product 1 -->
						${mappedProducts.map((selectedProduct, i) => /*html*/`
							<div style="display: table; width: 100%; margin-bottom: 15px; ${i < mappedProducts.length - 1 ? 'padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;' : ''}">
								<div style="display: table-cell; vertical-align: middle; width: 80px; padding-right: 15px;">
									<img src="${selectedProduct.product.getThumbnailUrls()[0]}" 
										alt="${selectedProduct.product.name}" 
										style="width: 80px; height: 80px; border-radius: 4px; object-fit: cover;">
								</div>
								<div style="display: table-cell; vertical-align: middle;">
									<p style="color: #333333; font-size: 16px; font-weight: bold; margin: 0 0 5px 0;">
										${selectedProduct.product.name}
									</p>
									<p style="color: #666666; font-size: 14px; margin: 0 0 5px 0;">
										Aantal: ${selectedProduct.amount} stuks
									</p>
									<p style="color: #666666; font-size: 14px; margin: 0;">
										Prijs per stuk: € ${selectedProduct.product.price.toFixed(2)}
									</p>
								</div>
								<div style="display: table-cell; vertical-align: middle; text-align: right; width: 100px;">
									<p style="color: #333333; font-size: 16px; font-weight: bold; margin: 0;">
										€ ${(selectedProduct.product.price * selectedProduct.amount).toFixed(2)}
									</p>
								</div>
							</div>
						`).join("")}

						<!-- Subtotal -->
						<div style="">
							${invoiceMessage.couponCode || invoiceMessage.deliveryMethod === "delivery" ? /*html*/`
								<div style="display: table; width: 100%; margin-bottom: 8px; border-top: 2px solid #e0e0e0; padding-top: 15px; margin-top: 15px;">
									<div style="display: table-cell;">
										<p style="color: #666666; font-size: 14px; margin: 0;">
											Subtotaal:
										</p>
									</div>
									<div style="display: table-cell; text-align: right;">
										<p style="color: #666666; font-size: 14px; margin: 0;">
											€ ${totalPrice.toFixed(2)}
										</p>
									</div>
								</div>` : ``}
							
							${invoiceMessage.couponCode ? /*html*/`
								<div style="display: table; width: 100%; margin-bottom: 8px;">
									<div style="display: table-cell;">
										<p style="color: #666666; font-size: 14px; margin: 0;">
											Korting (${invoiceMessage.couponCode}): 
										</p>
									</div>
									<div style="display: table-cell; text-align: right;">
										<p style="color: #FE5252; font-size: 14px; margin: 0;">
											-€ ${"TODO coupon logic"}
										</p>
									</div>
								</div>
								`: ``}

							${invoiceMessage.couponCode ? /*html*/`
								<div style="display: table; width: 100%; margin-bottom: 8px;">
									<div style="display: table-cell;">
										<p style="color: #666666; font-size: 14px; margin: 0;">
											Levering: 
										</p>
									</div>
									<div style="display: table-cell; text-align: right;">
										<p style="color: #FE5252; font-size: 14px; margin: 0;">
											TBD
										</p>
									</div>
								</div>
								`: ``}
							
							<div style="display: table; width: 100%; background-color: #FE5252;  border-radius: 4px; margin-top: 15px;">
								<div style="display: table-cell; padding: 12px;">
									<p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0;">
										Totaal:
									</p>
								</div>
								<div style="display: table-cell; text-align: right; padding: 12px;">
									<p style="color: #ffffff; font-size: 18px; font-weight: bold; margin: 0;">
										€ ${totalPrice.toFixed(2)}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<p style="color: #888888; font-size: 14px; margin: 30px 0 0 0; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;">
					Deze mail werd automatisch doorgestuurd vanuit het bestelsysteem op 
					<a href="https://trbl.be" style="color: #007bff; text-decoration: none;">trbl.be</a>.
				</p>
			</div>
			
			<!-- Footer -->
			<div style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; font-size: 12px; color: #888888;">
				<p style="margin: 0;">
					© ${new Date().getFullYear()} TRBL. Alle rechten voorbehouden.
				</p>
			</div>
		</div>
	</body>
	`
}

export function getCustomerInvoiceRequestTemplate(invoiceMessage: InvoiceMessage) {
	return ""
}
