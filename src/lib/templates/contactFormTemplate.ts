import { ContactMessage } from '$lib/domain/ContactMessage'

export function getAdminContactFormTemplate(message: ContactMessage) {
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
                        Nieuw Contactbericht
                    </h2>

                    <p style="color: #555555; font-size: 16px; margin: 0 0 20px 0;">
                        Hallo,
                    </p>
                    
                    <p style="color: #555555; font-size: 16px; margin: 0 0 30px 0;">
                        U heeft een nieuw bericht ontvangen via het contactformulier op trbl.be.
                    </p>
                    
                    <!-- Contact Details -->
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 30px 0;">
                        <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
                            <strong>Naam:</strong> ${message.firstName} ${message.lastName}
                        </p>
                        <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
                            <strong>E-mailadres:</strong> ${message.emailAddress}
                        </p>
                        <p style="color: #333333; font-size: 14px; margin: 0;">
                            <strong>Onderwerp:</strong> ${message.subject}
                        </p>
                    </div>
                    
                    <!-- Message -->
                    <div style="margin: 30px 0;">
                        <h3 style="color: #333333; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">
                            Bericht:
                        </h3>
                        <div style="background-color: #ffffff; border-left: 4px solid #FE5252; padding: 15px 20px; color: #555555; font-size: 15px;">
                            ${message.message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <p style="color: #888888; font-size: 14px; margin: 30px 0 0 0; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;">
                        Deze mail werd automatisch doorgestuurd vanuit het contactformulier op 
                        <a href="https://trbl.be" style="color: #007bff; text-decoration: none;">trbl.be</a>.
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

export function getCustomerContactFormTemplate(message: ContactMessage) {
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
                        Kopie Contactbericht
                    </h2>

                    <p style="color: #555555; font-size: 16px; margin: 0 0 20px 0;">
                        Beste,
                    </p>
                    
                    <p style="color: #555555; font-size: 16px; margin: 0 0 30px 0;">
                        Dit is een kopie van het bericht dat u heeft verzonden via het contactformulier op trbl.be, u hoeft niet op deze mail te antwoorden. We nemen zo snel mogelijk contact met u op.
                    </p>
                    
                    <!-- Contact Details -->
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 30px 0;">
                        <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
                            <strong>Naam:</strong> ${message.firstName} ${message.lastName}
                        </p>
                        <p style="color: #333333; font-size: 14px; margin: 0 0 10px 0;">
                            <strong>E-mailadres:</strong> ${message.emailAddress}
                        </p>
                        <p style="color: #333333; font-size: 14px; margin: 0;">
                            <strong>Onderwerp:</strong> ${message.subject}
                        </p>
                    </div>
                    
                    <!-- Message -->
                    <div style="margin: 30px 0;">
                        <h3 style="color: #333333; font-size: 18px; margin: 0 0 15px 0; font-weight: bold;">
                            Bericht:
                        </h3>
                        <div style="background-color: #ffffff; border-left: 4px solid #FE5252; padding: 15px 20px; color: #555555; font-size: 15px;">
                            ${message.message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <p style="color: #888888; font-size: 14px; margin: 30px 0 0 0; text-align: center; border-top: 1px solid #f0f0f0; padding-top: 20px;">
                        Deze mail werd automatisch doorgestuurd vanuit het contactformulier op 
                        <a href="https://trbl.be" style="color: #007bff; text-decoration: none;">trbl.be</a>.
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
