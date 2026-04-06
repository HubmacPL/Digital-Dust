# PROJECT MAP — DigitalDust (`./src`)

> Mapa dla agentów AI. Opisuje strukturę katalogu `./src`, rolę każdego pliku
> oraz kluczowe eksporty i zależności kontekstowe.

---

## Technologia

- **React 19** + **TypeScript**
- **@react-three/fiber** — deklaratywny React renderer dla Three.js
- **@react-three/drei** — gotowe helpers (OrbitControls, Stars, MeshReflectorMaterial…)
- **@react-three/postprocessing** + **postprocessing v6.39+** — efekty post-procesu (DepthOfField, Bloom, Noise)
- **Vite** — bundler

---

## Drzewo katalogów

```
src/
├── main.tsx
├── App.tsx
├── App.css
├── index.css
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── context/
│   └── GraveSelectionContext.tsx
├── data/
│   └── graveyardServices.ts
├── components/
│   └── EpitaphPanel.tsx
└── cemetery/
    ├── index.ts
    ├── types.ts
    ├── CemeteryScene.tsx
    ├── CameraManager.tsx
    ├── CemeteryPostFX.tsx
    ├── Tombstone.tsx
    ├── GhostPortal.tsx
    ├── CyberFireflies.tsx
    ├── DigitalDust.tsx
    ├── GradientSky.tsx
    ├── MouseFollowSpotlight.tsx
    ├── organicLayout.ts
    ├── fonts.ts
    └── textures/
        └── stoneNoiseTexture.ts
```

---

## Opis plików

### Root (`src/`)

| Plik | Rola |
|---|---|
| `main.tsx` | Punkt wejścia — montuje React, renderuje `<App />` do DOM |
| `App.tsx` | Główny shell — opakowuje wszystko w `GraveSelectionProvider`, obsługuje skrót `Escape` (deselect), renderuje `<Canvas>` z `CemeteryScene` |
| `index.css` | Globalne style CSS (reset, body, root) |
| `App.css` | Style specyficzne dla `App` — header, layout |

---

### `src/assets/`

| Plik | Rola |
|---|---|
| `hero.png` | Obraz/ilustracja używana w UI |
| `react.svg`, `vite.svg` | Statyczne ikony (deweloperskie, można usunąć) |

---

### `src/context/`

| Plik | Rola | Kluczowe eksporty |
|---|---|---|
| `GraveSelectionContext.tsx` | **Centralny stan wyboru nagrobka.** Provider i hook do zarządzania `selectedService` (aktualnie wybrany nagrobek). Konsumują go: `CameraManager`, `CemeteryPostFX`, `Tombstone`, `EpitaphPanel` | `GraveSelectionProvider`, `useGraveSelection` → `{ selectedService, setSelectedService }` |

---

### `src/data/`

| Plik | Rola | Kluczowe eksporty |
|---|---|---|
| `graveyardServices.ts` | Lista danych nagrobków — tablica obiektów `TombstoneData` (id, nazwa usługi, opis, popularność itp.) | `GRAVEYARD_SERVICES: TombstoneData[]` |

---

### `src/components/`

| Plik | Rola |
|---|---|
| `EpitaphPanel.tsx` | Panel HTML/React (poza Canvas) wyświetlający epitafium / szczegóły wybranego nagrobka. Renderowany nad canvasem gdy `selectedService !== null` |

---

### `src/cemetery/`

Wszystkie komponenty 3D sceny cmentarza. Montowane przez `CemeteryScene`.

| Plik | Rola | Kluczowe eksporty |
|---|---|---|
| `index.ts` | Barrel — re-eksportuje wszystkie komponenty cmentarza | `CemeteryScene`, i inne |
| `types.ts` | Definicje TypeScript — typy danych sceny | `TombstoneData` (zawiera `id`, `worldPosition: [x,y,z]`, `rotationY`, `popularity`) |
| `CemeteryScene.tsx` | **Główny komponent sceny 3D.** Kompozycja: oświetlenie, tło, mgła, reflektor podłogi, rozkład nagrobków, post-FX | `CemeteryScene` |
| `CameraManager.tsx` | **Logika kamery.** Obsługuje tryby: `free` (swobodna), `animating` (lot do nagrobka), `focus` (rubber-band pan). Używa `OrbitControls`. Celuje w `_focusTarget` obliczony z `selectedService.worldPosition`. | `CameraManager` |
| `CemeteryPostFX.tsx` | **Efekty post-processingu.** Depth of Field (autofokus na wybrany nagrobek przez `target`), Bloom, Noise. **API: `focusRange` (jednostki świata), nie `focalLength` (deprecated w v6.39+)** | `CemeteryPostFX` |
| `Tombstone.tsx` | **Komponent nagrobka.** Geometria (baza, płyta), materiał kamienny, panel z tekstem. Klik → `setSelectedService`. Sprawdza `selectedService.id` aby podświetlić aktywny nagrobek | `Tombstone` |
| `GhostPortal.tsx` | Efekt portalu/bramy — animowana sfera wolumetryczna symbolizująca ducha | `GhostPortal` |
| `CyberFireflies.tsx` | Cząsteczki świetlne (instanced mesh) symulujące świetliki. Efekt atmosferyczny | `CyberFireflies` |
| `DigitalDust.tsx` | Cząsteczki "cyfrowego pyłu" — drobne punkty unoszące się w scenie | `DigitalDust` |
| `GradientSky.tsx` | Niebo z shaderem GLSL — gradient od ciemnego fioletu do czerni + gwiezdna mgławica | `GradientSky` |
| `MouseFollowSpotlight.tsx` | Reflektor podążający za kursorem myszy w przestrzeni 3D | `MouseFollowSpotlight` |
| `organicLayout.ts` | Algorytm rozmieszczania nagrobków — oblicza `position` i `rotationY` dla każdego nagrobka, aby tworzyły naturalny, nieregularny układ | `getOrganicTransforms(services)` → `{ position, rotationY }[]` |
| `fonts.ts` | Ładowanie i rejestracja fontów Three.js/Troika używanych w panelach tekstowych nagrobków | stałe ze ścieżkami fontów |
| `textures/stoneNoiseTexture.ts` | Generuje lub importuje teksturę szumu kamienia (normal/roughness map) dla materiałów nagrobków | `stoneNoiseTexture` lub `createStoneTexture()` |

---

## Przepływ danych (Data Flow)

```
GRAVEYARD_SERVICES (data)
        │
        ▼
    App.tsx
        │  GraveSelectionProvider (context)
        ▼
  CemeteryScene
   ├── CameraManager        ← czyta selectedService → animuje kamerę
   ├── CemeteryPostFX       ← czyta selectedService → ustawia target DoF
   ├── Tombstone (×N)
   │    └── onClick → setSelectedService(service)
   └── EpitaphPanel         ← czyta selectedService → wyświetla tekst
```

---

## Ważne uwagi dla agentów

1. **`postprocessing` v6.39+ zmiana API**: `focalLength` jest deprecated i ignorowany. Używaj `focusRange` (w jednostkach świata Three.js).
2. **`target` w `DepthOfField`**: przekaż `Vector3` lub `[x,y,z]` aby włączyć autofokus. `undefined` = autofokus wyłączony.
3. **Kamera**: pozycja docelowa i `_focusTarget` obliczane są każdą klatkę z `selectedService.worldPosition` w `CameraManager.tsx`. Punkt ostrości DoF powinien być spójny z `_goalTarget` z `CameraManager`.
4. **Styl pracy**: pliki w `cemetery/` to czyste komponenty R3F — nie importuj logiki DOM poza `EpitaphPanel`.
5. **Jednostki sceny**: 1 jednostka ≈ ~1 metr. Nagrobki stoją przy Y=0. Panel nagrobka sięga do Y~3-4. Kamera stoi ~7-9 jednostek od nagrobka w trybie focus.
