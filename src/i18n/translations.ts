export type SupportedLanguage = 'pl' | 'en'

export type TombstoneTranslation = {
  name: string
  description: string
}

export interface TranslationMap {
  ui: Record<string, string>
  tombstones: Record<string, TombstoneTranslation>
}

export const translations: Record<SupportedLanguage, TranslationMap> = {
  pl: {
    ui: {
      causeOfDeath: 'PRZYCZYNA ŚMIERCI',
      close: 'Zamknij',
      changeLanguage: 'Zmień język',
      clickHint: 'Kliknij nagrobek, by przywołać ducha. Ponowny klik lub × zamyka.',
    },
    tombstones: {
      'flash-player': {
        name: 'Flash Player',
        description:
          'Fundament interaktywnego internetu. Adobe wycofało wtyczkę po latach walki z lukami bezpieczeństwa i energochłonnością. Era pluginów zakończyła się wraz z nadejściem HTML5.',
      },
      'google-plus': {
        name: 'Google+',
        description:
          'Ambitna próba Google — nie zyskała wystarczającego zaangażowania. Platforma została zamknięta po serii problemów z prywatnością.',
      },
      vine: {
        name: 'Vine',
        description:
          'Krótki format wideo (6s), który zapoczątkował nowy język internetu. Nie udało się go skutecznie skomercjalizować.',
      },
      'msn-messenger': {
        name: 'MSN Messenger',
        description:
          'Miejsce, w którym dorastało pierwsze pokolenie internautów. Zastąpiony przez Skype i późniejsze komunikatory.',
      },
      myspace: {
        name: 'MySpace',
        description:
          'Personalizowane profile i muzyka — król social media przed Facebookiem. Upadł przez nadmiar reklam i problemy z UX.',
      },
      napster: {
        name: 'Napster',
        description:
          'Pionier peer-to-peer i burzliwa historia z przemysłem muzycznym. Jego duch przetrwał, lecz model się zmienił.',
      },
      'gadu-gadu': {
        name: 'Gadu-Gadu',
        description:
          'Żółte słoneczko polskiego internetu. Kultowy komunikator, symbol ery SMS-ów i pierwszych IMów w Polsce.',
      },
      netscape: {
        name: 'Netscape',
        description:
          'Pierwsza przeglądarka, która wyniosła WWW do mas. Przegrała konfrontację z Internet Explorerem i rynkowymi strategiami.',
      },
      orkut: {
        name: 'Orkut',
        description:
          'Społecznościowy fenomen w Brazylii i Indiach — zamknięty po latach decentralizacji społeczności.',
      },
      'yahoo-answers': {
        name: 'Yahoo! Answers',
        description:
          'Archipelag pytań i memów. Serwis padł ofiarą spadku jakości treści i problemów moderacyjnych.',
      },
      'zapytaj-onet': {
        name: 'Zapytaj.onet.pl',
        description:
          'Polski serwis pytań i odpowiedzi — ikona szkolnych poszukiwań wiedzy w internecie.',
      },
    },
  },
  en: {
    ui: {
      causeOfDeath: 'CAUSE OF DEATH',
      close: 'Close',
      changeLanguage: 'Change language',
      clickHint: 'Click a tombstone to summon the ghost. Click again or × to close.',
    },
    tombstones: {
      'flash-player': {
        name: 'Flash Player',
        description:
          'The backbone of interactive web. Adobe retired the plugin after years of security issues and high resource usage. HTML5 sealed its fate.',
      },
      'google-plus': {
        name: 'Google+',
        description:
          'Google’s ambitious social attempt — never gained enough traction and was shut down after privacy incidents.',
      },
      vine: {
        name: 'Vine',
        description:
          'Six-second videos that changed short-form storytelling. Twitter couldn’t monetise the format effectively.',
      },
      'msn-messenger': {
        name: 'MSN Messenger',
        description:
          'Where the first generation of netizens grew up. Microsoft migrated users to Skype and retired the classic client.',
      },
      myspace: {
        name: 'MySpace',
        description:
          'Customisable profiles and music — once the social king before Facebook, undone by ads and UX issues.',
      },
      napster: {
        name: 'Napster',
        description:
          'Peer-to-peer pioneer that challenged the music industry. Though transformed, its revolutionary spirit faded.',
      },
      'gadu-gadu': {
        name: 'Gadu-Gadu',
        description:
          'A Polish IM staple with its iconic yellow logo. Nostalgic relic of a local messaging era.',
      },
      netscape: {
        name: 'Netscape',
        description:
          'One of the first gateways to the Web. Lost market share in the browser wars despite early lead.',
      },
      orkut: {
        name: 'Orkut',
        description:
          'Social platform that found localized success in Brazil and India before being discontinued.',
      },
      'yahoo-answers': {
        name: 'Yahoo! Answers',
        description:
          'A repository of strange questions and internet folklore. Closed due to declining quality and moderation issues.',
      },
      'zapytaj-onet': {
        name: 'Zapytaj.onet.pl',
        description:
          'A Polish Q&A site — once a go-to for students seeking quick answers online.',
      },
    },
  },
}

/**
 * Lightweight dot-path lookup helper. Returns fallback (key) when missing.
 */
export function lookup(lang: SupportedLanguage, path: string): string {
  const parts = path.split('.')
  let node: any = translations[lang]
  for (const p of parts) {
    if (!node) return path
    node = node[p]
  }
  return typeof node === 'string' ? node : path
}

export default translations
