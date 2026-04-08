🌬️ Digital Dust: The Global Necropolis
Digital Dust is an immersive, interactive 3D web experience built with Three.js and React. It serves as a haunting archive of the "dead" internet—a virtual cemetery dedicated to the services, platforms, and technologies that once shaped our digital lives but have since vanished into the void.

💀 The Concept
The internet moves fast, leaving behind a trail of digital ghosts. From the sunsetting of Adobe Flash to the quiet disappearance of Gadu-Gadu or MySpace profiles, these icons of the past deserve a final resting place.

Digital Dust organizes these memories into a global map. Users navigate a mroczny (dark), 3D globe to visit specific national sectors, exploring rows of glowing tombstones shrouded in procedural fog.

🚀 Features
Atmospheric 3D World: A high-fidelity environment with volumetric fog, dynamic lighting, and post-processing effects (Bloom, Depth of Field).

Interactive Global Navigation: An interactive 3D globe acting as a portal to different national cemetery sectors.

Epitaph System: Click on any tombstone to "summon its spirit"—revealing the history, dates of operation, and a link to the Wayback Machine.

Spatial Audio: Procedural wind sounds and audio cues that react to the user's movement and proximity to graves.

Multilingual Support: A built-in localization system (PL/EN) to honor the local history of the web.

🛠️ Tech Stack
Framework: React 19

3D Engine: Three.js via @react-three/fiber

Utilities: @react-three/drei (Camera management, Helpers)

Post-processing: postprocessing (DoF, Bloom, Grain)

Styling: CSS Modules / Tailwind CSS

Deployment: Vercel

📂 Project Structure
/src/cemetery: Core Three.js logic, shaders, and 3D components.

/src/context: State management for grave selection and camera transitions.

/src/data: The "Graveyard Registry"—a structured database of digital services.

/src/components: React UI overlay for epitaphs and navigation.

🛠️ Getting Started
Clone the repository:

Bash
git clone https://github.com/your-username/digital-dust.git
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

“In the end, we are all just digital dust.” 💾🌌
