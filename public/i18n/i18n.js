// @ts-ignore
export const i18n = i18next;

export async function initializeI18nAsync() {
  const response = await fetch('/i18n/locales/de.json');
  const responseJson = await response.json();

  await i18n.init({
    lng: 'de',
    ns: ['app'],
    defaultNS: 'app',
    resources: {
      de: responseJson
    }
  });
}
