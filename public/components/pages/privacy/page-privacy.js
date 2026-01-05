import Component from '/core/component.js';
import { i18n } from '/i18n/i18n.js';
import { html } from '/core/utils/html-utils.js';

export default class PagePrivacy extends Component {
  cssFilePath = 'components/pages/privacy/page-privacy.css';

  get email() {
    return atob('dG0wZTgzQGdtYWlsLmNvbQ==');
  }

  get phone() {
    return atob('KzQ5IDE3NiA5NyA4ODIgOTk5');
  }

  get template() {
    return html`
      <div class="privacy-policy">
        <h1>${i18n.t('privacy.title', 'Datenschutzerklärung')}</h1>

        <div class="last-updated">
          <p><strong>Stand:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
        </div>

        <section>
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br>
            <strong>PlaySpot</strong><br>
            Neugasse 21<br>
            68649 Groß-Rohrheim<br>
            E-Mail: ${this.email}<br>
            Telefon: ${this.phone}
          </p>
        </section>

        <section>
          <h2>2. Allgemeine Hinweise zur Datenverarbeitung</h2>
          <p>
            Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen
            Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser
            Datenschutzerklärung.
          </p>
          <p>
            Die Nutzung unserer Website ist grundsätzlich ohne Angabe personenbezogener Daten möglich.
            Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder
            E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis.
          </p>
        </section>

        <section>
          <h2>3. Datenerfassung bei der Registrierung</h2>
          <h3>3.1 Erfasste Daten</h3>
          <p>Bei der Registrierung für einen Account erfassen wir folgende Daten:</p>
          <ul>
            <li><strong>E-Mail-Adresse:</strong> Für die Kontoerstellung und Kommunikation</li>
            <li><strong>Benutzername:</strong> Für die Identifikation im System</li>
            <li><strong>Passwort:</strong> Verschlüsselt gespeichert für die Kontosicherheit</li>
            <li><strong>Spracheinstellung:</strong> Für die personalisierte Nutzererfahrung</li>
          </ul>

          <h3>3.2 Rechtsgrundlage</h3>
          <p>
            Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO zur Erfüllung
            des Vertrages bzw. zur Durchführung vorvertraglicher Maßnahmen.
          </p>
        </section>

        <section>
          <h2>4. Spielbezogene Datenverarbeitung</h2>
          <h3>4.1 Spielstatistiken</h3>
          <p>Während der Nutzung unserer Spiele erheben wir:</p>
          <ul>
            <li><strong>Spielergebnisse:</strong> Gewinne, Verluste, Spielverläufe</li>
            <li><strong>Kontosaldo:</strong> Virtueller Spielstand (keine echte Währung)</li>
            <li><strong>Spielhistorie:</strong> Anzahl gespielter Runden pro Spiel</li>
            <li><strong>Leaderboard-Daten:</strong> Höchstpunktzahlen für Ranglisten</li>
          </ul>

          <h3>4.2 Zweck der Verarbeitung</h3>
          <ul>
            <li>Bereitstellung der Spielfunktionalitäten</li>
            <li>Anzeige von Leaderboards und Statistiken</li>
            <li>Verbesserung des Spielerlebnisses</li>
            <li>Technische Wartung und Optimierung</li>
          </ul>
        </section>

        <section>
          <h2>5. Firebase und Google Cloud Services</h2>
          <h3>5.1 Verwendete Services</h3>
          <p>Wir nutzen Firebase (Google LLC) für:</p>
          <ul>
            <li><strong>Firebase Authentication:</strong> Benutzeranmeldung und -verwaltung</li>
            <li><strong>Firebase Realtime Database:</strong> Speicherung von Benutzerdaten und Spielständen</li>
            <li><strong>Firebase Hosting:</strong> Bereitstellung der Webanwendung</li>
          </ul>

          <h3>5.2 Datenübertragung</h3>
          <p>
            Firebase ist ein Service der Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
            Die Datenübertragung in die USA erfolgt auf Grundlage der Angemessenheitsentscheidung der
            Europäischen Kommission für das EU-US Data Privacy Framework.
          </p>

          <h3>5.3 Weitere Informationen</h3>
          <p>
            Weitere Informationen zum Datenschutz bei Google finden Sie unter:
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
              https://policies.google.com/privacy
            </a>
          </p>
        </section>

        <section>
          <h2>6. Local Storage und Cookies</h2>
          <h3>6.1 Local Storage</h3>
          <p>Wir verwenden Local Storage für:</p>
          <ul>
            <li>Spracheinstellungen des Benutzers</li>
            <li>Technische Session-Daten</li>
            <li>Temporäre Spielzustände</li>
          </ul>

          <h3>6.2 Cookies</h3>
          <p>
            Unsere Website verwendet hauptsächlich technisch notwendige Cookies. Diese sind für die
            Funktionalität der Website erforderlich und können nicht abgewählt werden.
          </p>
        </section>

        <section>
          <h2>7. Ihre Rechte als Betroffener</h2>
          <p>Sie haben folgende Rechte:</p>
          <ul>
            <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre gespeicherten Daten verlangen</li>
            <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger Daten verlangen</li>
            <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen</li>
            <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen</li>
            <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können die Übertragung Ihrer Daten verlangen</li>
            <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung widersprechen</li>
          </ul>
        </section>

        <section>
          <h2>8. Datensicherheit</h2>
          <p>
            Wir verwenden geeignete technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten
            gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den Zugriff
            unberechtigter Personen zu schützen. Unsere Sicherheitsmaßnahmen werden entsprechend der
            technologischen Entwicklung fortlaufend verbessert.
          </p>
          <ul>
            <li>SSL/TLS-Verschlüsselung für die Datenübertragung</li>
            <li>Verschlüsselte Speicherung von Passwörtern</li>
            <li>Regelmäßige Sicherheitsupdates</li>
            <li>Zugriffsbeschränkungen auf Serverdaten</li>
          </ul>
        </section>

        <section>
          <h2>9. Datenlöschung</h2>
          <p>
            Ihre Daten werden gelöscht, wenn:
          </p>
          <ul>
            <li>Sie Ihr Benutzerkonto löschen</li>
            <li>Der Zweck der Datenverarbeitung entfällt</li>
            <li>Sie Ihre Einwilligung widerrufen und keine andere Rechtsgrundlage besteht</li>
            <li>Die gesetzlichen Aufbewahrungsfristen ablaufen</li>
          </ul>
        </section>

        <section>
          <h2>10. Minderjährigenschutz</h2>
          <p>
            Unsere Dienste richten sich nicht an Personen unter 16 Jahren. Wir erfassen wissentlich
            keine personenbezogenen Daten von Kindern unter 16 Jahren. Falls wir feststellen, dass
            ein Kind unter 16 Jahren personenbezogene Daten bereitgestellt hat, löschen wir diese
            Informationen umgehend.
          </p>
        </section>

        <section>
          <h2>11. Änderungen der Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen
            rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der
            Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
          </p>
        </section>

        <section>
          <h2>12. Kontakt</h2>
          <p>
            Fragen zu dieser Datenschutzerklärung richten Sie bitte an:<br>
            <strong>E-Mail:</strong> ${this.email}<br>
            <strong>Telefon:</strong> ${this.phone}
          </p>
        </section>

        <section>
          <h2>13. Beschwerderecht</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
            Ihrer personenbezogenen Daten durch uns zu beschweren. Die für uns zuständige
            Aufsichtsbehörde ist:
          </p>
          <p>
            Hessischer Beauftragter für Datenschutz und Informationsfreiheit<br>
            Gustav-Stresemann-Ring 1<br>
            65189 Wiesbaden<br>
            Deutschland<br>
            Telefon: +49 611 1408-0<br>
            E-Mail: poststelle@datenschutz.hessen.de<br>
            Website: https://www.datenschutz.hessen.de<br>
          </p>
        </section>
      </div>
    `;
  }
}

customElements.define('page-privacy', PagePrivacy);
