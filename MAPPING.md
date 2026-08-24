# LeetCode City — Data to 3D Visual Mapping Specification (`MAPPING.md`)

This document defines the deterministic mapping logic used by **LeetCode City** to transform raw LeetCode statistics into a 3D isometric city scene structure (`CityScene`).

---

## 1. Core Data Contract (`CityScene`)

```typescript
export interface DistrictData {
  id: string;
  topic: string;           // e.g. "Dynamic Programming", "Arrays", "Graphs"
  buildingCount: number;   // Problems solved in this topic
  avgHeight: number;       // Average derived building height in this district
  position: [number, number]; // Grid offset [x, z] for district center
  color: string;           // District accent theme color (hex)
}

export interface BuildingData {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  height: number;          // Scaled 3D block height (1.0 to 12.0)
  width: number;           // Block footprint width (0.8 to 1.6)
  depth: number;           // Block footprint depth (0.8 to 1.6)
  position: [number, number, number]; // [x, y, z] local coordinates
  colorTier: 'easy' | 'medium' | 'hard';
  colorHex: string;        // Hex code for 3D rendering
}

export interface CityScene {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  ranking: number;
  districts: DistrictData[];
  buildings: BuildingData[];
  activityDensity: Array<{ date: string; count: number }>;
  streak: { current: number; longest: number };
  contestRating?: {
    rating: number;
    globalRanking: number;
    topPercentage: number;
    badge?: string;
  };
  languages: Array<{ name: string; solvedCount: number }>;
  badgesCount: number;
  statsFetchedAt: string;
}
```

---

## 2. Stat-to-Visual Mapping Rules

### Rule A: Building Height (Logarithmic Scaling)
Problem counts within a single topic vary widely (e.g., 2 solved vs 150 solved). To prevent power-user buildings from soaring endlessly into the camera frustum while keeping smaller counts visible:

$$\text{Height} = \text{clamp}\left(1.2 + 2.5 \times \ln(1 + \text{solvedCount}), \; 1.0, \; 12.0\right)$$

- **Minimum height:** $1.0$ units (ensures single solved problem is visually distinct).
- **Maximum height:** $12.0$ units (skyscrapers cap out cleanly).
- **Recency bonus:** If the problem was solved recently (derived from calendar activity), height receives a $+15\%$ flourish.

---

### Rule B: Building Color & Material Tiers
Building glass and roof glow colors directly reflect LeetCode problem difficulty levels:

| Difficulty Tier | Visual Color | Hex Code | Material Properties |
| :--- | :--- | :--- | :--- |
| **Easy** | Emerald Green | `#10B981` | Standard gloss finish, subtle green window emission |
| **Medium** | Amber Gold | `#F59E0B` | Warm metallic finish, warm gold window emission |
| **Hard** | Vivid Crimson | `#EF4444` | Dark chrome body, intense crimson neon roof glow |

---

### Rule C: District Placement (Spatial Grid Layout)
Each LeetCode topic/skill tag (e.g., *Dynamic Programming*, *Trees*, *Algorithms*) forms an isolated urban district block:

1. **District Sorting:** Topics are sorted descending by number of solved problems.
2. **Spiral Grid Positioning:** Districts are arranged in a expanding square spiral around the city center $(0, 0)$:
   - District 0 (Highest solved): Center $[0, 0]$
   - District 1: $[+18, 0]$
   - District 2: $[+18, +18]$
   - District 3: $[0, +18]$
   - District 4: $[-18, +18]$
   - ...and so forth.
3. **Sub-Grid Placement:** Buildings within a district are arranged in a dense $N \times N$ local sub-grid with $2.2$-unit spacing between building centers.

---

### Rule D: Sustainability & Green Energy Motif (Streak Count)
The active problem-solving streak powers eco-friendly city flourishes:

- **Current Streak $\ge 1$:** Adds animated **3D Windmills** on district hilltops and coastlines.
  - Number of Windmills = $\min(\text{floor}(\text{currentStreak} / 5) + 1, \; 6)$.
- **Longest Streak $\ge 7$:** Adds **Solar Panel Arrays** along district perimeters.
- **Rotor Spin Speed:** Proportional to $\min(\text{currentStreak}, 30) \times 0.05 \text{ rad/frame}$.

---

### Rule E: Coastline & Vegetation (Submission Activity Calendar)
Submission volume over the past 365 days drives the density of natural flora and coastal development around the island:

- **High Activity Days ($>100$ total active submission days):** Lush forest density along coastlines with dynamic palm and pine trees.
- **Moderate Activity Days ($30 - 100$ days):** Standard coastal park with scattered trees and street lamps.
- **Low Activity Days ($<30$ days):** Minimal coastal vegetation with sandy shoreline.

---

### Rule F: Landmark Skyscraper (Contest Rating / City Hall)
If the user has participated in LeetCode contests and achieved a rating:

- **Landmark Tower Position:** Located at the prominent city center landmark plaza $[0, 0, -8]$.
- **Landmark Height:** Scaled proportionally to rating:
  $$\text{LandmarkHeight} = \text{clamp}\left(\frac{\text{rating} - 1200}{100}, \; 4.0, \; 20.0\right)$$
- **Beacons:** Users with top $10\%$ contest rating get a glowing laser beacon projecting upwards into the sky.

---

## 3. Decoupling & Architecture

The transformation from raw API JSON payloads to `CityScene` takes place exclusively inside `backend/src/transform/toCityScene.ts`. 

- Express route handlers strictly delegate data reshaping to `toCityScene()`.
- React Three Fiber frontend components consume `CityScene` props directly without containing any statistical parsing logic.
- Visual parameters can be adjusted in `toCityScene.ts` without modifying React components or Express API handlers.
