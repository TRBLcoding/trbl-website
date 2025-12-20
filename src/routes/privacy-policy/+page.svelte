<script lang="ts">
	import { resolve } from "$app/paths"
	import { authStore } from "$lib/stores/AuthStore"
	import { pageHeadStore } from "$lib/stores/PageHeadStore"

	// -- Page title --
	pageHeadStore.updatePageTitle("Privacybeleid")
</script>

<div class="max-w-6xl mx-auto p-6">
	<div class="flex gap-3 mb-3 items-center">
		<h1 class="text-4xl font-semibold">TRBL Privacybeleid</h1>
		{#if $authStore && $authStore.isAdmin()}
			<a href={resolve("/privacy-policy/send-update")} class="btn btn-primary btn-sm">
				Update verzenden
			</a>
		{/if}
	</div>

	<h2 class="text-xl font-bold mb-2">Over ons privacybeleid</h2>
	<div class="mb-8 flex flex-col gap-4">
		<div>
			Uw privacy is belangrijk! TRBL verwerkt daarom uitsluitend gegevens die
			nodig zijn voor (het verbeteren van) onze dienstverlening. We gaan
			zorgvuldig om met de informatie die wij over u en uw gebruik van onze
			diensten hebben verzameld. Wij stellen uw gegevens nooit voor commerciële
			doelstellingen ter beschikking aan derden.
		</div>
		<div>
			Dit privacybeleid is van toepassing op het gebruik van de website en de
			daarop ontsloten dienstverlening van TRBL. De ingangsdatum voor de
			geldigheid van deze voorwaarden is 04/11/2025, met het publiceren van een
			nieuwe versie vervalt de geldigheid van alle voorgaande versies. Dit
			privacybeleid beschrijft welke gegevens over u door ons worden verzameld,
			waar deze gegevens voor worden gebruikt en met wie en onder welke
			voorwaarden deze gegevens eventueel met derden kunnen worden gedeeld. Ook
			leggen wij aan u uit op welke wijze wij uw gegevens opslaan en hoe wij uw
			gegevens tegen misbruik beschermen en welke rechten u heeft met betrekking
			tot de door u aan ons verstrekte persoonsgegevens. Als u vragen heeft over
			ons privacybeleid kunt u contact opnemen via <a
				class="link"
				href="mailto:privacy@trbl.be">privacy@trbl.be</a
			>, of de contactgegevens aan het einde van ons privacybeleid.
		</div>
	</div>

	<h2 class="text-xl font-bold mb-2">Doel van de gegevensverwerking</h2>
	<div class="mb-8 flex flex-col gap-4">
		<div>
			<h3 class="text-lg font-semibold mb-1">
				Algemeen doel van de verwerking
			</h3>
			<div>
				Wij gebruiken uw gegevens uitsluitend ten behoeve van onze
				dienstverlening. Dat wil zeggen dat het doel van de verwerking altijd
				direct verband houdt met de opdracht die u verstrekt. Wij gebruiken uw
				gegevens niet voor (gerichte) marketing. Als u gegevens met ons deelt en
				wij gebruiken deze gegevens om - anders dan op uw verzoek - op een later
				moment contact met u op te nemen, vragen wij u hiervoor expliciet
				toestemming. Uw gegevens worden niet met derden gedeeld, anders dan om
				aan boekhoudkundige en overige administratieve verplichtingen te
				voldoen. Deze derden zijn allemaal tot geheimhouding gehouden op grond
				van de overeenkomst tussen hen en ons of een eed of wettelijke
				verplichting.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">
				Automatisch verzamelde gegevens
			</h3>
			<div>
				Gegevens die automatisch worden verzameld door onze website worden
				verwerkt met het doel onze dienstverlening verder te verbeteren. Deze
				gegevens (bijvoorbeeld uw IP-adres, webbrowser en besturingssysteem)
				zijn geen persoonsgegevens.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">
				Medewerking aan fiscaal en strafrechtelijk onderzoek
			</h3>
			<div>
				In voorkomende gevallen kan TRBL op grond van een wettelijke
				verplichting worden gehouden tot het delen van uw gegevens in verband
				met fiscaal of strafrechtelijk onderzoek van overheidswege. In een
				dergelijk geval zijn wij gedwongen uw gegevens te delen. Wij zullen ons
				echter steeds binnen de mogelijkheden die de wet ons biedt daartegen
				verzetten.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">Bewaartermijnen</h3>
			<div>
				Wij bewaren uw gegevens zolang u cliënt van ons bent. Dit betekent dat
				wij uw klantprofiel bewaren totdat u aangeeft dat u niet langer van onze
				diensten gebruik wenst te maken. Op grond van toepasselijke
				administratieve verplichtingen dienen wij facturen met uw
				(persoons)gegevens te bewaren, deze gegevens zullen dus voor zolang het
				toepasselijke termijn loopt bewaard blijven.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">Uw rechten</h3>
			<div>
				Op grond van de geldende Belgische en Europese wetgeving heeft u als
				betrokkene bepaalde rechten met betrekking tot de persoonsgegevens die
				door of namens ons worden verwerkt. Wij leggen u hieronder uit welke
				rechten dit zijn en hoe u zich op deze rechten kunt beroepen. In
				beginsel sturen wij om misbruik te voorkomen afschriften en kopieën van
				uw gegevens enkel naar uw bij ons reeds bekende e-mailadres. In het
				geval dat u de gegevens op een ander e-mailadres of bijvoorbeeld per
				post wenst te ontvangen, zullen wij u vragen zich te legitimeren. Wij
				houden een administratie bij van afgehandelde verzoeken, in het geval
				van een vergeetverzoek administreren wij geanonimiseerde gegevens. Alle
				afschriften en kopieën van gegevens ontvangt u in de machineleesbare
				gegevensindeling die wij binnen onze systemen hanteren.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">Inzagerecht</h3>
			<div>
				U heeft altijd het recht om de gegevens die wij (laten) verwerken en die
				betrekking hebben op uw persoon of daartoe herleidbaar zijn, in te zien.
				U kunt een verzoek met die strekking doen aan onze contactpersoon voor
				privacyzaken. U ontvangt dan binnen 30 dagen een reactie op uw verzoek.
				Als uw verzoek wordt ingewilligd sturen wij u op het bij ons bekende
				e-mailadres een kopie van alle gegevens met een overzicht van de
				verwerkers die deze gegevens onder zich hebben, onder vermelding van de
				categorie waaronder wij deze gegevens hebben opgeslagen.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">Rectificatierecht</h3>
			<div>
				U heeft altijd het recht om de gegevens die wij (laten) verwerken en die
				betrekking hebben op uw persoon of daartoe herleidbaar zijn, te laten
				aanpassen. U kunt een verzoek met die strekking doen aan onze
				contactpersoon voor privacyzaken. U ontvangt dan binnen 30 dagen een
				reactie op uw verzoek. Als uw verzoek wordt ingewilligd sturen wij u op
				het bij ons bekende e-mailadres een bevestiging dat de gegevens zijn
				aangepast.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">
				Recht op beperking van de verwerking
			</h3>
			<div>
				U heeft altijd het recht om de gegevens die wij (laten) verwerken die
				betrekking hebben op uw persoon of daartoe herleidbaar zijn, te
				beperken. U kunt een verzoek met die strekking doen aan onze
				contactpersoon voor privacyzaken. U ontvangt dan binnen 30 dagen een
				reactie op uw verzoek. Als uw verzoek wordt ingewilligd sturen wij u op
				het bij ons bekende e-mailadres een bevestiging dat de gegevens tot u de
				beperking opheft niet langer worden verwerkt.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">Recht op overdraagbaarheid</h3>
			<div>
				U heeft altijd het recht om de gegevens die wij (laten) verwerken en die
				betrekking hebben op uw persoon of daartoe herleidbaar zijn, door een
				andere partij te laten uitvoeren. U kunt een verzoek met die strekking
				doen aan onze contactpersoon voor privacyzaken. U ontvangt dan binnen 30
				dagen een reactie op uw verzoek. Als uw verzoek wordt ingewilligd sturen
				wij u op het bij ons bekende e-mailadres afschriften of kopieën van alle
				gegevens over u die wij hebben verwerkt of in opdracht van ons door
				andere verwerkers of derden zijn verwerkt. Naar alle waarschijnlijkheid
				kunnen wij in een dergelijk geval de dienstverlening niet langer
				voortzetten, omdat de veilige koppeling van databestanden dan niet
				langer kan worden gegarandeerd.
			</div>
		</div>

		<div>
			<h3 class="text-lg font-semibold mb-1">
				Recht van bezwaar en overige rechten
			</h3>
			<div>
				U heeft in voorkomende gevallen het recht bezwaar te maken tegen de
				verwerking van uw persoonsgegevens door of in opdracht van TRBL. Als u
				bezwaar maakt zullen wij onmiddellijk de gegevensverwerking staken in
				afwachting van de afhandeling van uw bezwaar. Is uw bezwaar gegrond dat
				zullen wij afschriften en/of kopieën van gegevens die wij (laten)
				verwerken aan u ter beschikking stellen en daarna de verwerking blijvend
				staken. U heeft bovendien het recht om niet aan geautomatiseerde
				individuele besluitvorming of profiling te worden onderworpen. Wij
				verwerken uw gegevens niet op zodanige wijze dat dit recht van
				toepassing is. Bent u van mening dat dit wel zo is, neem dan contact op
				met onze contactpersoon voor privacyzaken.
			</div>
		</div>
	</div>

	<h2 class="text-xl font-bold mb-2">Cookies</h2>
	<div class="mb-8 flex flex-col gap-4">
		<div>
			<div>
				Deze website maakt geen gebruik van cookies of vergelijkbare technieken
				die gegevens over uw gebruik van onze website verzamelen.
			</div>
		</div>
	</div>

	<h2 class="text-xl font-bold mb-2">Wijzigingen in het privacybeleid</h2>
	<div class="mb-8 flex flex-col gap-4">
		Wij behouden te allen tijde het recht ons privacybeleid te wijzigen. Op deze
		pagina vindt u echter altijd de meest recente versie. Als het nieuwe
		privacybeleid gevolgen heeft voor de wijze waarop wij reeds verzamelde
		gegevens met betrekking tot u verwerken, dan brengen wij u daarvan per
		e-mail op de hoogte.
	</div>

	<h2 class="text-xl font-bold mb-2">Contactgegevens</h2>
	<div class="mb-8 flex flex-col gap-1">
		<div>TRBL</div>
		<div>Nederpolder 4</div>
		<div>9000 Gent België</div>
		<div>info@trbl.be</div>
	</div>

	<h2 class="text-xl font-bold mb-2">Contactpersoon voor privacyzaken</h2>
	<div class="mb-8 flex flex-col gap-1">
		<div>Teun Van de Voorde</div>
		<a class="link" href="mailto:teun@trbl.be">teun@trbl.be</a>
	</div>
</div>
