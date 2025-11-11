import type { PrivacyUpdate } from "$lib/domain/PrivacyUpdate"

export function getPrivacyPolicyUpdateTemplace(privacyUpdate: PrivacyUpdate, firstName: string, lastName: string) {
	return /*html*/ `
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
					Update Privacybeleid
				</h2>

				<p style="color: #555555; font-size: 16px; margin: 0 0 20px 0;">
					Hallo <strong>${firstName} ${lastName}</strong>,
				</p>
				
				<p style="color: #555555; font-size: 16px; margin: 0 0 20px 0;">
					We willen u informeren dat we ons privacybeleid hebben bijgewerkt. Deze wijzigingen zijn van kracht vanaf vandaag.
				</p>

				<div style="background-color: #f8f9fa; border-left: 4px solid #FE5252; padding: 20px; margin: 30px 0;">
					<h3 style="color: #333333; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">
						Belangrijkste wijzigingen:
					</h3>
					<p style="color: #555555; font-size: 15px; margin: 0; white-space: pre-line;">${privacyUpdate.notableChanges}</p>
				</div>
				
				<p style="color: #555555; font-size: 16px; margin: 20px 0 30px 0;">
					We raden u aan het volledige privacybeleid door te nemen om alle wijzigingen te begrijpen.
				</p>
				
				<!-- CTA Button -->
				<div style="text-align: center; margin: 40px 0;">
					<a href="https://trbl.be/privacy-policy" 
					style="display: inline-block; background-color: #FE5252; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-size: 16px; font-weight: bold; text-align: center; transition: background-color 0.3s ease;">
						Bekijk Privacybeleid
					</a>
				</div>
				
				<p style="color: #888888; font-size: 14px; margin: 30px 0 0 0; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;">
					U ontvangt deze mail omdat u een account heeft bij 
					<a href="https://trbl.be" style="color: #007bff; text-decoration: none;">trbl.be</a>. 
					Voor vragen kunt u contact met ons opnemen.
				</p>
			</div>
			
			<!-- Footer -->
			<div style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; font-size: 12px; color: #888888;">
				<p style="margin: 0;">
					© 2025 TRBL. Alle rechten voorbehouden.
				</p>
			</div>
		</div>
	</body>
	`
}
