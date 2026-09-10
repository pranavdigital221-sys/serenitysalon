/**
 * Serenity Salon - Self-Contained Luxury Visual Assets
 * High-definition, standalone SVG Data-URIs that render instantly with 0ms network latency
 * and 100% guarantee that products and services NEVER fail to show rich pictures.
 */

// Helper to create clean SVG Data URIs
const svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim().replace(/\s+/g, ' '))}`;
};

// 1. Professional Hair Dryer (Ikonic Blaze Black)
export const VISUAL_HAIR_DRYER = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2D4A3E" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#F7F5F1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2A2A2A"/>
      <stop offset="50%" stop-color="#141414"/>
      <stop offset="100%" stop-color="#0A0A0A"/>
    </linearGradient>
    <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E5C78A"/>
      <stop offset="50%" stop-color="#C9A66B"/>
      <stop offset="100%" stop-color="#9E7A3E"/>
    </linearGradient>
    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#333333"/>
      <stop offset="100%" stop-color="#1A1A1A"/>
    </linearGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#1F3A26" flood-opacity="0.18"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="600" rx="32" fill="#FAF8F5"/>
  <circle cx="300" cy="300" r="260" fill="url(#bgGlow)"/>

  <!-- Podia/Pedestal -->
  <ellipse cx="300" cy="490" rx="200" ry="24" fill="#E8E4DC" opacity="0.6"/>
  <ellipse cx="300" cy="485" rx="160" ry="18" fill="#DFD9CE" opacity="0.7"/>

  <!-- Hair Dryer Main Group -->
  <g filter="url(#softShadow)" transform="translate(40, -10)">
    <!-- Cord -->
    <path d="M 280 430 Q 260 510 210 530 T 140 520" fill="none" stroke="#222222" stroke-width="12" stroke-linecap="round"/>
    
    <!-- Handle -->
    <path d="M 260 270 L 295 430 Q 300 445 285 450 L 255 450 Q 240 445 235 430 L 220 280 Z" fill="url(#handleGrad)"/>
    
    <!-- Handle Controls -->
    <rect x="250" y="320" width="10" height="24" rx="4" fill="url(#goldAcc)"/>
    <rect x="255" y="360" width="10" height="24" rx="4" fill="url(#goldAcc)"/>

    <!-- Main Barrel / Motor Housing -->
    <rect x="180" y="160" width="220" height="115" rx="28" fill="url(#bodyGrad)"/>
    
    <!-- Rear Filter Grill -->
    <path d="M 180 160 Q 155 217 180 275 Z" fill="#1C1C1C"/>
    <ellipse cx="178" cy="217.5" rx="12" ry="52" fill="#141414" stroke="url(#goldAcc)" stroke-width="4"/>
    <circle cx="178" cy="217.5" r="6" fill="#C9A66B"/>

    <!-- Gold Accent Ring -->
    <rect x="300" y="157" width="14" height="121" rx="4" fill="url(#goldAcc)"/>

    <!-- Front Nozzle Taper -->
    <path d="M 400 175 L 470 190 L 470 245 L 400 260 Z" fill="url(#bodyGrad)"/>
    
    <!-- Concentrator Nozzle Attachment -->
    <path d="M 470 185 L 515 170 L 525 265 L 470 250 Z" fill="#111111" stroke="url(#goldAcc)" stroke-width="2"/>
    <rect x="520" y="172" width="8" height="90" rx="3" fill="url(#goldAcc)"/>

    <!-- Brand Typography on Barrel -->
    <text x="245" y="210" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" letter-spacing="2">IKONIC</text>
    <text x="245" y="226" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#C9A66B" letter-spacing="3">PROFESSIONAL BLAZE</text>
    <text x="245" y="240" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="400" font-size="8" fill="#888888">2000W SALON MOTOR</text>
  </g>

  <!-- Luxury Badge Top Right -->
  <g transform="translate(460, 40)">
    <rect width="100" height="32" rx="16" fill="#1F3A26"/>
    <text x="50" y="20" font-family="Arial, sans-serif" font-weight="bold" font-size="11" fill="#C9A66B" text-anchor="middle" letter-spacing="1">SALON PRO</text>
  </g>
</svg>
`);

// 2. Luxury Rosewater & Botanical Serum Dropper Bottle (Skin Care)
export const VISUAL_SERUM_BOTTLE = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="pinkGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#F9EAE1"/>
      <stop offset="100%" stop-color="#FAF8F5"/>
    </radialGradient>
    <linearGradient id="glassBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E8A598" stop-opacity="0.85"/>
      <stop offset="35%" stop-color="#FCDAD2" stop-opacity="0.95"/>
      <stop offset="70%" stop-color="#E8A598" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#B87368" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="goldCap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E8CE99"/>
      <stop offset="50%" stop-color="#C9A66B"/>
      <stop offset="100%" stop-color="#936D2E"/>
    </linearGradient>
    <linearGradient id="dropperRubber" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#EFEFEF"/>
      <stop offset="100%" stop-color="#D0D0D0"/>
    </linearGradient>
    <filter id="serumShadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#8F4B3C" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#pinkGlow)"/>

  <!-- Decorative Botanical Leaves Behind -->
  <g opacity="0.35" transform="translate(180, 80)">
    <path d="M-80 180 C -120 120, -100 40, -40 10 C 20 60, -20 120, -80 180 Z" fill="#4F7358"/>
    <path d="M280 220 C 340 160, 320 80, 260 50 C 200 100, 220 160, 280 220 Z" fill="#4F7358"/>
  </g>

  <!-- Pedestal -->
  <ellipse cx="300" cy="510" rx="180" ry="24" fill="#E8D5CE" opacity="0.7"/>

  <!-- Main Serum Bottle -->
  <g filter="url(#serumShadow)">
    <!-- Dropper Pipette Tip inside -->
    <rect x="296" y="240" width="8" height="180" rx="4" fill="#FFFFFF" opacity="0.6"/>

    <!-- Bottle Body (Frosted Rose Glass) -->
    <rect x="210" y="230" width="180" height="240" rx="36" fill="url(#glassBody)"/>
    <path d="M 210 266 Q 210 230 246 230 L 354 230 Q 390 230 390 266 L 390 434 Q 390 470 354 470 L 246 470 Q 210 470 210 434 Z" fill="url(#glassBody)"/>
    
    <!-- Light Reflection on Glass -->
    <path d="M 226 250 L 240 250 L 240 450 L 226 440 Z" fill="#FFFFFF" opacity="0.45"/>
    <circle cx="370" cy="270" r="16" fill="#FFFFFF" opacity="0.25"/>

    <!-- Minimalist Label -->
    <rect x="235" y="280" width="130" height="140" rx="12" fill="#FFFFFF" opacity="0.95" filter="drop-shadow(0 2px 8px rgba(0,0,0,0.06))"/>
    <line x1="250" y1="300" x2="350" y2="300" stroke="#C9A66B" stroke-width="2"/>
    <text x="300" y="322" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="11" fill="#1F3A26" text-anchor="middle" letter-spacing="1">SERENITY</text>
    <text x="300" y="338" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="600" font-size="9" fill="#C9A66B" text-anchor="middle" letter-spacing="0.5">ROSEWATER ELIXIR</text>
    <text x="300" y="360" font-family="Arial, sans-serif" font-size="8" fill="#666666" text-anchor="middle">Hyaluronic 2% + B5</text>
    <text x="300" y="375" font-family="Arial, sans-serif" font-size="7.5" fill="#888888" text-anchor="middle">Organic Damask Rose</text>
    <text x="300" y="402" font-family="Arial, sans-serif" font-weight="bold" font-size="8" fill="#1F3A26" text-anchor="middle">50 ML / 1.7 FL. OZ</text>

    <!-- Bottle Neck -->
    <rect x="265" y="195" width="70" height="38" rx="6" fill="url(#goldCap)"/>

    <!-- Dropper Gold Collar -->
    <rect x="255" y="150" width="90" height="48" rx="8" fill="url(#goldCap)" stroke="#A67B2C" stroke-width="1.5"/>
    <line x1="255" y1="165" x2="345" y2="165" stroke="#FFFFFF" stroke-width="1.5" opacity="0.6"/>

    <!-- White Silicone Bulb -->
    <path d="M 270 150 C 270 100, 330 100, 330 150 Z" fill="url(#dropperRubber)" filter="drop-shadow(0 -2px 4px rgba(0,0,0,0.1))"/>
  </g>
</svg>
`);

// 3. Botanical Face Oil / Golden Glow Dropper
export const VISUAL_FACE_OIL = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="amberGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#FDF3E7"/>
      <stop offset="100%" stop-color="#F7F5F1"/>
    </radialGradient>
    <linearGradient id="oilGlass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D99B26"/>
      <stop offset="35%" stop-color="#FCD36A"/>
      <stop offset="70%" stop-color="#EAA82C"/>
      <stop offset="100%" stop-color="#B87B15"/>
    </linearGradient>
    <linearGradient id="woodCap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B2618"/>
      <stop offset="50%" stop-color="#5C3D26"/>
      <stop offset="100%" stop-color="#2B1A0E"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#amberGlow)"/>
  <ellipse cx="300" cy="505" rx="160" ry="20" fill="#E6DCCE" opacity="0.8"/>

  <!-- Bottle Group -->
  <g transform="translate(0, 10)">
    <!-- Dropper Pipette -->
    <rect x="296" y="240" width="8" height="170" rx="4" fill="#FFFFFF" opacity="0.7"/>

    <!-- Cylinder Glass Body -->
    <rect x="220" y="220" width="160" height="240" rx="30" fill="url(#oilGlass)" opacity="0.92" filter="drop-shadow(0 16px 24px rgba(184, 123, 21, 0.25))"/>
    
    <!-- Light Reflection -->
    <rect x="235" y="235" width="16" height="205" rx="8" fill="#FFFFFF" opacity="0.4"/>

    <!-- Dark Luxury Label -->
    <rect x="240" y="270" width="120" height="140" rx="10" fill="#1F3A26" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))"/>
    <text x="300" y="305" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="10" fill="#C9A66B" text-anchor="middle" letter-spacing="1.5">AURA BOTANICS</text>
    <text x="300" y="325" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="9" fill="#FFFFFF" text-anchor="middle">COLD-PRESSED</text>
    <text x="300" y="340" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="9" fill="#FFFFFF" text-anchor="middle">FACIAL OIL</text>
    <text x="300" y="362" font-family="Arial, sans-serif" font-size="8" fill="#E5C78A" text-anchor="middle">Rosehip &amp; Blue Tansy</text>
    <text x="300" y="392" font-family="Arial, sans-serif" font-size="8" fill="#AAAAAA" text-anchor="middle">30 ML / 1.0 FL. OZ</text>

    <!-- Collar & Bamboo Cap -->
    <rect x="260" y="155" width="80" height="68" rx="8" fill="url(#woodCap)"/>
    <line x1="260" y1="180" x2="340" y2="180" stroke="#7A5235" stroke-width="1"/>

    <!-- Dropper Squeeze Bulb -->
    <path d="M 272 155 C 272 110, 328 110, 328 155 Z" fill="#222222"/>
  </g>
</svg>
`);

// 4. Luxury Hair Silk & Amber Treatment Oil (Deals of the Day #2)
export const VISUAL_HAIR_SILK = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="silkGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FAF0E6"/>
      <stop offset="100%" stop-color="#F5EFEB"/>
    </radialGradient>
    <linearGradient id="amberSilk" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2903C"/>
      <stop offset="50%" stop-color="#F8B854"/>
      <stop offset="100%" stop-color="#B86718"/>
    </linearGradient>
    <linearGradient id="pumpGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F2D79E"/>
      <stop offset="50%" stop-color="#C9A66B"/>
      <stop offset="100%" stop-color="#9C7736"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#silkGlow)"/>
  <ellipse cx="300" cy="510" rx="190" ry="22" fill="#E2D4C8" opacity="0.7"/>

  <!-- Bottle Group -->
  <g transform="translate(0, 15)">
    <!-- Tall Sleek Bottle -->
    <rect x="225" y="210" width="150" height="260" rx="28" fill="url(#amberSilk)" filter="drop-shadow(0 18px 24px rgba(184, 103, 24, 0.28))"/>
    
    <!-- Highlights -->
    <rect x="238" y="225" width="14" height="230" rx="7" fill="#FFFFFF" opacity="0.45"/>

    <!-- Premium Center Label -->
    <rect x="242" y="260" width="116" height="150" rx="10" fill="#FFFFFF" opacity="0.96" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.06))"/>
    <text x="300" y="288" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="10" fill="#1F3A26" text-anchor="middle" letter-spacing="1">SERENITY SALON</text>
    <line x1="260" y1="298" x2="340" y2="298" stroke="#C9A66B" stroke-width="1.5"/>
    <text x="300" y="318" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="9" fill="#C9A66B" text-anchor="middle">SWEET AMBER</text>
    <text x="300" y="332" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="9" fill="#1F3A26" text-anchor="middle">VANILLA CASHMERE</text>
    <text x="300" y="352" font-family="Arial, sans-serif" font-size="8" fill="#555555" text-anchor="middle">Hair Silk Treatment</text>
    <text x="300" y="367" font-family="Arial, sans-serif" font-size="7.5" fill="#777777" text-anchor="middle">Camellia &amp; Marula</text>
    <text x="300" y="395" font-family="Arial, sans-serif" font-weight="bold" font-size="8" fill="#1F3A26" text-anchor="middle">100 ML</text>

    <!-- Pump Dispenser -->
    <rect x="270" y="175" width="60" height="38" rx="6" fill="url(#pumpGold)"/>
    <rect x="280" y="145" width="40" height="32" rx="4" fill="url(#pumpGold)"/>
    <!-- Pump Nozzle -->
    <path d="M 285 145 L 235 140 Q 230 140 230 148 L 230 158 Q 235 162 245 160 L 285 158 Z" fill="url(#pumpGold)" stroke="#9C7736" stroke-width="1"/>
  </g>
</svg>
`);

// 5. Bio-Retinol Overnight Cream / Mask Jar (Deals of the Day #1)
export const VISUAL_BIO_RETINOL_JAR = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="jarGlow" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#EBF4EE"/>
      <stop offset="100%" stop-color="#FAF8F5"/>
    </radialGradient>
    <linearGradient id="jarBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2D4D36"/>
      <stop offset="35%" stop-color="#4F7358"/>
      <stop offset="70%" stop-color="#3A5C43"/>
      <stop offset="100%" stop-color="#1F3A26"/>
    </linearGradient>
    <linearGradient id="goldLid" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F2D79E"/>
      <stop offset="50%" stop-color="#C9A66B"/>
      <stop offset="100%" stop-color="#9C7736"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#jarGlow)"/>
  <ellipse cx="300" cy="495" rx="200" ry="24" fill="#DCE6DF" opacity="0.8"/>

  <!-- Cosmetic Jar -->
  <g transform="translate(0, 30)">
    <!-- Frosted Forest Green Glass Tub -->
    <rect x="180" y="270" width="240" height="180" rx="36" fill="url(#jarBody)" filter="drop-shadow(0 18px 26px rgba(31, 58, 38, 0.3))"/>
    
    <!-- Light Reflection -->
    <path d="M 200 290 Q 215 360 200 420" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" opacity="0.25"/>

    <!-- Elegant Label Plate -->
    <rect x="215" y="310" width="170" height="100" rx="12" fill="#FAF8F5" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.1))"/>
    <text x="300" y="338" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="11" fill="#1F3A26" text-anchor="middle" letter-spacing="1">SERENITY</text>
    <text x="300" y="356" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="9" fill="#C9A66B" text-anchor="middle">BIO-RETINOL</text>
    <text x="300" y="374" font-family="Arial, sans-serif" font-size="8" fill="#555555" text-anchor="middle">Overnight Recovery Mask</text>
    <text x="300" y="394" font-family="Arial, sans-serif" font-weight="bold" font-size="8" fill="#1F3A26" text-anchor="middle">75 ML / 2.5 FL. OZ</text>

    <!-- Metallic Gold Heavy Screw Lid -->
    <rect x="170" y="210" width="260" height="65" rx="14" fill="url(#goldLid)" stroke="#9C7736" stroke-width="1.5" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.15))"/>
    <line x1="170" y1="235" x2="430" y2="235" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>
  </g>
</svg>
`);

// 6. Hair Spa & Salon Hair Services Category Visual
export const VISUAL_HAIR_SERVICES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="hairBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1F3A26"/>
      <stop offset="50%" stop-color="#2D4D36"/>
      <stop offset="100%" stop-color="#142619"/>
    </linearGradient>
    <linearGradient id="goldLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E5C78A"/>
      <stop offset="50%" stop-color="#C9A66B"/>
      <stop offset="100%" stop-color="#8F6A2C"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#hairBg)"/>
  
  <!-- Flowing Gold Hair Strands Abstract Graphic -->
  <g opacity="0.35">
    <path d="M 50 100 Q 200 300 150 550" fill="none" stroke="url(#goldLine)" stroke-width="4"/>
    <path d="M 120 50 Q 280 250 220 550" fill="none" stroke="url(#goldLine)" stroke-width="6"/>
    <path d="M 220 50 Q 400 220 320 550" fill="none" stroke="url(#goldLine)" stroke-width="8"/>
    <path d="M 320 50 Q 520 280 450 550" fill="none" stroke="url(#goldLine)" stroke-width="5"/>
  </g>

  <!-- Scissors & Comb Salon Art Centerpiece -->
  <g transform="translate(300, 270)" filter="drop-shadow(0 14px 20px rgba(0,0,0,0.4))">
    <!-- Golden Scissors -->
    <g stroke="url(#goldLine)" stroke-width="12" stroke-linecap="round" fill="none">
      <path d="M -80 -80 L 70 70"/>
      <path d="M 80 -80 L -70 70"/>
      <circle cx="-95" cy="-95" r="32" fill="none"/>
      <circle cx="95" cy="-95" r="32" fill="none"/>
    </g>
    <circle cx="0" cy="-5" r="10" fill="#FFFFFF"/>

    <!-- Golden Comb Silhouette -->
    <g transform="translate(-100, 90)">
      <rect x="0" y="0" width="200" height="24" rx="6" fill="url(#goldLine)"/>
      <line x1="20" y1="24" x2="20" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="40" y1="24" x2="40" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="60" y1="24" x2="60" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="80" y1="24" x2="80" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="100" y1="24" x2="100" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="120" y1="24" x2="120" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="140" y1="24" x2="140" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="160" y1="24" x2="160" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
      <line x1="180" y1="24" x2="180" y2="55" stroke="url(#goldLine)" stroke-width="5"/>
    </g>
  </g>

  <!-- Typography -->
  <text x="300" y="470" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">HAIR SERVICES</text>
  <text x="300" y="500" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="14" fill="#C9A66B" text-anchor="middle" letter-spacing="1">Cuts, Color &amp; Restorative Therapy</text>
</svg>
`);

// 7. Skin & Facial Services Category Visual
export const VISUAL_SKIN_SERVICES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="skinBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#382E2B"/>
      <stop offset="50%" stop-color="#54433D"/>
      <stop offset="100%" stop-color="#241B18"/>
    </linearGradient>
    <radialGradient id="glowG" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#E5C78A" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#54433D" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#skinBg)"/>
  <circle cx="300" cy="260" r="200" fill="url(#glowG)"/>

  <!-- Botanical Sparkle Face Art -->
  <g transform="translate(300, 240)" filter="drop-shadow(0 10px 18px rgba(0,0,0,0.3))">
    <!-- Radiant Lotus / Blossom Icon -->
    <path d="M 0 -70 C 35 -30, 70 20, 0 70 C -70 20, -35 -30, 0 -70 Z" fill="#C9A66B" opacity="0.9"/>
    <path d="M 0 -70 C 60 -10, 100 40, 30 75 C -10 40, 20 -10, 0 -70 Z" fill="#E5C78A" opacity="0.7"/>
    <path d="M 0 -70 C -60 -10, -100 40, -30 75 C 10 40, -20 -10, 0 -70 Z" fill="#E5C78A" opacity="0.7"/>

    <!-- Sparkles -->
    <circle cx="-90" cy="-60" r="6" fill="#FFFFFF"/>
    <circle cx="100" cy="-40" r="8" fill="#FFFFFF"/>
    <circle cx="80" cy="80" r="5" fill="#C9A66B"/>
    <circle cx="-80" cy="70" r="5" fill="#C9A66B"/>
  </g>

  <!-- Typography -->
  <text x="300" y="460" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">SKIN &amp; FACIAL</text>
  <text x="300" y="490" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="14" fill="#C9A66B" text-anchor="middle" letter-spacing="1">Holistic Organic Skin Rejuvenation</text>
</svg>
`);

// 8. Makeup & Beauty Services Category Visual
export const VISUAL_MAKEUP_SERVICES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="makeupBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A2633"/>
      <stop offset="50%" stop-color="#6B384A"/>
      <stop offset="100%" stop-color="#2D141E"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#makeupBg)"/>
  
  <!-- Makeup Brush & Palette Art -->
  <g transform="translate(300, 240)" filter="drop-shadow(0 12px 18px rgba(0,0,0,0.35))">
    <!-- Lipstick Silhouette -->
    <rect x="-60" y="20" width="40" height="80" rx="8" fill="#1A1A1A"/>
    <rect x="-56" y="-10" width="32" height="32" rx="4" fill="#C9A66B"/>
    <path d="M -56 -10 L -40 -60 L -24 -10 Z" fill="#D94E64"/>

    <!-- Powder Brush -->
    <g transform="rotate(35)">
      <rect x="30" y="0" width="16" height="120" rx="8" fill="#1A1A1A" stroke="#C9A66B" stroke-width="2"/>
      <rect x="26" y="-20" width="24" height="24" rx="4" fill="#C9A66B"/>
      <path d="M 22 -20 C 22 -65, 54 -65, 54 -20 Z" fill="#E8C3B9"/>
    </g>
  </g>

  <!-- Typography -->
  <text x="300" y="460" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">MAKEUP &amp; BEAUTY</text>
  <text x="300" y="490" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="14" fill="#C9A66B" text-anchor="middle" letter-spacing="1">Bridal, Occasion &amp; Editorial Artistry</text>
</svg>
`);

// 9. Nail Care Category Visual
export const VISUAL_NAIL_SERVICES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="nailBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D3A45"/>
      <stop offset="50%" stop-color="#3F5261"/>
      <stop offset="100%" stop-color="#1A232B"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#nailBg)"/>

  <!-- Nail Polish Bottle Art -->
  <g transform="translate(300, 240)" filter="drop-shadow(0 14px 20px rgba(0,0,0,0.3))">
    <!-- Bottle Base -->
    <rect x="-55" y="-10" width="110" height="120" rx="24" fill="#E88C96" stroke="#C9A66B" stroke-width="4"/>
    <rect x="-42" y="5" width="14" height="90" rx="7" fill="#FFFFFF" opacity="0.4"/>
    <!-- Black Cap -->
    <rect x="-24" y="-95" width="48" height="90" rx="8" fill="#111111" stroke="#C9A66B" stroke-width="2"/>
  </g>

  <!-- Typography -->
  <text x="300" y="460" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">NAIL CARE</text>
  <text x="300" y="490" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="14" fill="#C9A66B" text-anchor="middle" letter-spacing="1">Manicures, Gel Art &amp; Spa Pedicures</text>
</svg>
`);

// 10. Spa & Wellness Category Visual
export const VISUAL_SPA_SERVICES = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="spaBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#283B32"/>
      <stop offset="50%" stop-color="#3B574A"/>
      <stop offset="100%" stop-color="#18241F"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#spaBg)"/>

  <!-- Zen Stones & Lotus Water Art -->
  <g transform="translate(300, 240)" filter="drop-shadow(0 12px 20px rgba(0,0,0,0.35))">
    <!-- Stacked Zen River Stones -->
    <ellipse cx="0" cy="80" rx="100" ry="34" fill="#404040"/>
    <ellipse cx="0" cy="30" rx="75" ry="26" fill="#555555"/>
    <ellipse cx="0" cy="-15" rx="50" ry="20" fill="#6E6E6E"/>
    
    <!-- Warm Candle Glow -->
    <circle cx="0" cy="-55" r="16" fill="#C9A66B"/>
    <path d="M 0 -85 Q 12 -65 0 -45 Q -12 -65 0 -85 Z" fill="#FFE6A3"/>
  </g>

  <!-- Typography -->
  <text x="300" y="460" font-family="'Plus Jakarta Sans', sans-serif" font-weight="800" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">SPA &amp; WELLNESS</text>
  <text x="300" y="490" font-family="'Plus Jakarta Sans', sans-serif" font-weight="500" font-size="14" fill="#C9A66B" text-anchor="middle" letter-spacing="1">Aromatherapy &amp; Peaceful Body Rituals</text>
</svg>
`);

// 11. Fragrances / Perfume Visual
export const VISUAL_PERFUME = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <radialGradient id="perfumeGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#F7EBE1"/>
      <stop offset="100%" stop-color="#FAF8F5"/>
    </radialGradient>
    <linearGradient id="perfumeGlass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5C78A" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#C9A66B" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="goldPerfumeCap" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F2D79E"/>
      <stop offset="50%" stop-color="#C9A66B"/>
      <stop offset="100%" stop-color="#9C7736"/>
    </linearGradient>
  </defs>

  <rect width="600" height="600" rx="32" fill="url(#perfumeGlow)"/>
  <ellipse cx="300" cy="505" rx="170" ry="20" fill="#E6DCCE" opacity="0.8"/>

  <!-- Perfume Flacon -->
  <g transform="translate(0, 20)">
    <!-- Heavy Glass Square Flacon -->
    <rect x="200" y="240" width="200" height="220" rx="20" fill="url(#perfumeGlass)" stroke="#C9A66B" stroke-width="3" filter="drop-shadow(0 16px 24px rgba(201, 166, 107, 0.25))"/>
    
    <!-- Golden Liquid Well Inside -->
    <rect x="225" y="275" width="150" height="160" rx="12" fill="#F8DF9E" opacity="0.85"/>

    <!-- Black & Gold Center Label -->
    <rect x="240" y="310" width="120" height="90" rx="8" fill="#1F3A26" filter="drop-shadow(0 2px 6px rgba(0,0,0,0.15))"/>
    <text x="300" y="338" font-family="'Plus Jakarta Sans', sans-serif" font-weight="bold" font-size="10" fill="#C9A66B" text-anchor="middle" letter-spacing="2">SERENITY</text>
    <text x="300" y="356" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="8.5" fill="#FFFFFF" text-anchor="middle">VELVET JASMINE</text>
    <text x="300" y="380" font-family="Arial, sans-serif" font-size="7.5" fill="#C9A66B" text-anchor="middle">Eau De Parfum • 50 ML</text>

    <!-- Spray Atomizer Neck & Cap -->
    <rect x="275" y="205" width="50" height="35" rx="4" fill="url(#goldPerfumeCap)"/>
    <rect x="260" y="145" width="80" height="62" rx="10" fill="#111111" stroke="url(#goldPerfumeCap)" stroke-width="2"/>
  </g>
</svg>
`);

// 12. Smart Category Mapper for Instant Visual Retrieval
export function getFallbackVisual(
  type?: string,
  title?: string,
  category?: string
): string {
  const query = `${type || ''} ${title || ''} ${category || ''}`.toLowerCase();

  if (query.includes('hair dryer') || query.includes('ikonic') || query.includes('dryer') || query.includes('blaze')) {
    return VISUAL_HAIR_DRYER;
  }
  if (query.includes('hair silk') || query.includes('vanilla cashmere') || query.includes('amber') || query.includes('deal-2')) {
    return VISUAL_HAIR_SILK;
  }
  if (query.includes('retinol') || query.includes('overnight mask') || query.includes('deal-1') || query.includes('creme') || query.includes('jar')) {
    return VISUAL_BIO_RETINOL_JAR;
  }
  if (query.includes('perfume') || query.includes('fragrance') || query.includes('jasmine') || query.includes('eau de')) {
    return VISUAL_PERFUME;
  }
  if (query.includes('face oil') || query.includes('botanical oil') || query.includes('glow serum') || query.includes('vit c')) {
    return VISUAL_FACE_OIL;
  }
  if (query.includes('skin') || query.includes('facial') || query.includes('rosewater') || query.includes('elixir') || query.includes('serum') || query.includes('cleanser')) {
    return VISUAL_SERUM_BOTTLE;
  }
  if (query.includes('hair services') || query.includes('haircut') || query.includes('hair care')) {
    return VISUAL_HAIR_SERVICES;
  }
  if (query.includes('makeup') || query.includes('blush') || query.includes('lipstick')) {
    return VISUAL_MAKEUP_SERVICES;
  }
  if (query.includes('nail') || query.includes('polish') || query.includes('manicure')) {
    return VISUAL_NAIL_SERVICES;
  }
  if (query.includes('spa') || query.includes('wellness') || query.includes('massage')) {
    return VISUAL_SPA_SERVICES;
  }

  // General default fallback
  return VISUAL_SERUM_BOTTLE;
}
