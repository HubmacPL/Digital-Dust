import type { TombstoneData } from '../cemetery/types'

/** Dane usług — rozszerzone pod Epitaph / Wayback / portal. */
export const GRAVEYARD_SERVICES: TombstoneData[] = [
  {
    id: 'flash-player',
    name: 'Flash Player',
    originDate: '1996',
    deathDate: '2020',
    popularity: 100,
    color: '#c2412c',
    longDescription:
      'Fundament interaktywnego internetu. Adobe wycofało wtyczkę po latach walki z lukami bezpieczeństwa i energochłonnością. Era multimediów opartych na pluginach zakończyła się wraz z nadejściem HTML5 i polityki „mobile first” Steve’a Jobsa.',
    waybackUrl: 'https://web.archive.org/web/20201231195917/https://www.adobe.com/products/flashplayer/end-of-life.html',
  },
  {
    id: 'google-plus',
    name: 'Google+',
    originDate: '2011',
    deathDate: '2019',
    popularity: 90,
    color: '#dd4b39',
    longDescription:
      'Ambitna próba rzucenia wyzwania Facebookowi. Mimo integracji z ekosystemem Google, platforma nigdy nie zyskała duszy. Niskie zaangażowanie, zmiana strategii giganta oraz głośny wyciek danych API w 2018 roku przypieczętowały jej los.',
    waybackUrl: 'https://web.archive.org/web/20190308173623/https://plus.google.com/',
  },
  {
    id: 'vine',
    name: 'Vine',
    originDate: '2013',
    deathDate: '2016',
    popularity: 55,
    color: '#00bf8f',
    longDescription:
      'Sześć sekund, które zmieniło świat wideo. Twitter nie znalazł sposobu na monetyzację genialnego formatu, pozwalając twórcom uciec na Instagram i rodzącego się TikToka. Krótka, ale intensywna lekcja cyfrowej kreatywności.',
    waybackUrl: 'https://web.archive.org/web/20161028144517/https://vine.co/',
  },
  {
    id: 'msn-messenger',
    name: 'MSN Messenger',
    originDate: '1999',
    deathDate: '2014',
    popularity: 75,
    color: '#0078d4',
    longDescription:
      'Miejsce, w którym dorastało pierwsze pokolenie internautów. Microsoft scalił komunikację w Skype po przejęciu w 2011 roku, wygaszając legendarną markę. Wraz z nim odeszły kultowe „wtyczki”, niestandardowe statusy i dźwięki logowania.',
    waybackUrl: 'https://web.archive.org/web/20140315000000/http://www.microsoft.com/en-us/windows/messenger',
  },
  {
    id: 'myspace',
    name: 'MySpace',
    originDate: '2003',
    deathDate: '2019',
    popularity: 98,
    color: '#1a1aff',
    longDescription:
      'Król, który utonął we własnym chaosie. Przegrał z Facebookiem przez przeładowanie reklamami, trudną personalizację profili i autoodtwarzaną muzykę. News Corp kupił go za 580 mln dolarów, by po latach sprzedać za marne 35 mln.',
    waybackUrl: 'https://web.archive.org/web/20081001000000/http://www.myspace.com/',
  },
  {
    id: 'napster',
    name: 'Napster',
    originDate: '1999',
    deathDate: '2002',
    popularity: 88,
    color: '#7c3aed',
    longDescription:
      'Pionier wymiany plików, który wypowiedział wojnę przemysłowi muzycznemu. Metallica i Dr. Dre doprowadzili do sądowego zamknięcia serwisu w 2001 roku. Choć przetrwał jako usługa streamingowa, jego rewolucyjny duch zgasł na zawsze.',
    waybackUrl: 'https://web.archive.org/web/20010301000000/http://www.napster.com/',
  },
  {
    id: 'gadu-gadu',
    name: 'Gadu-Gadu',
    originDate: '2000',
    deathDate: '2023',
    popularity: 80,
    color: '#f59e0b',
    longDescription:
      'Żółte słoneczko, które świeciło nad Polską przez dekadę. Kultowe numery GG były cyfrowym dowodem osobistym całego pokolenia. Rynek bezlitośnie przejęły globalne komunikatory, spychając GG do roli nostalgicznego reliktu przeszłości.',
    waybackUrl: 'https://web.archive.org/web/20050101000000/http://www.gadu-gadu.pl/',
  },
  {
    id: 'netscape',
    name: 'Netscape',
    originDate: '1994',
    deathDate: '2008',
    popularity: 70,
    color: '#2563eb',
    longDescription:
      'Pierwsza brama do świata WWW. Przegrała brutalną wojnę przeglądarek z Internet Explorerem, który był darmowo dołączany do systemu Windows. AOL przejął markę, ale nie zdołał uratować okrętu przed ostatecznym zatonięciem w 2008 roku.',
    waybackUrl: 'https://web.archive.org/web/20071231000000/http://browser.netscape.com/',
  },
  {
    id: 'orkut',
    name: 'Orkut',
    originDate: '2004',
    deathDate: '2014',
    popularity: 50,
    color: '#ea580c',
    longDescription:
      'Społecznościowa potęga, która niespodziewanie zdominowała Brazylię i Indie. Google zamknęło serwis w 2014 roku, próbując siłowo przenieść miliony wiernych użytkowników do Google+. Legenda o „kolorowych profilach” żyje tam do dziś.',
    waybackUrl: 'https://web.archive.org/web/20120601000000/http://www.orkut.com/',
  },
  {
    id: 'yahoo-answers',
    name: 'Yahoo! Answers',
    originDate: '2005',
    deathDate: '2021',
    popularity: 70,
    color: '#6d28d9',
    longDescription:
      'Absurdalne archiwum ludzkiej niewiedzy i ciekawości. Przez lata było kopalnią kultowych pytań i internetowego trollingu. Yahoo wyłączyło platformę w 2021 roku, nie radząc sobie z moderacją treści i spadkiem wiarygodności.',
    waybackUrl: 'https://web.archive.org/web/20210101000000/https://answers.yahoo.com/',
  },
  {
    id: 'zapytaj-onet',
    name: 'Zapytaj.onet.pl',
    originDate: '2007',
    deathDate: '2016',
    popularity: 50,
    color: '#dc2626',
    longDescription:
      'Polska mekka uczniów i internautów szukających szybkich odpowiedzi. Serwis tętnił życiem, dopóki Facebook nie przejął roli głównego forum wymiany opinii. Onet zamknął projekt w 2016 roku, skazując miliony wpisów na cyfrowy niebyt.',
    waybackUrl: 'https://web.archive.org/web/20150601000000/http://zapytaj.onet.pl/',
  },
]