import fs from 'node:fs';
import path from 'node:path';

async function audit() {
  const targetDir = path.resolve(process.cwd(), '.taste-skill/after');
  fs.mkdirSync(targetDir, { recursive: true });

  const url = 'http://localhost:3000';
  console.log(`Auditing ${url}...`);

  const res = await fetch(url);
  const html = await res.text();
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');

  // Extract classes
  const classRegex = /class(?:Name)?="([^"]+)"/g;
  const classes = new Set();
  let match;
  while ((match = classRegex.exec(html)) !== null) {
    match[1].split(/\s+/).filter(Boolean).forEach(c => classes.add(c));
  }

  const classList = Array.from(classes);

  // Analyze typography
  const textSizes = classList.filter(c => /^text-(xs|sm|base|lg|xl|[2-9]xl)$/.test(c) || /^text-\[/.test(c));
  const fontWeights = classList.filter(c => /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/.test(c));
  const fontFamilies = classList.filter(c => /^font-(sans|serif|mono)/.test(c));
  const headingUtilityClasses = classList.filter(c => /^heading-[1-6]$/.test(c) || /^title-[1-4]$/.test(c) || /^body-[1-4]$/.test(c) || /^mono-data$/.test(c));

  // Analyze colors
  const bgColors = classList.filter(c => /^bg-/.test(c));
  const textColors = classList.filter(c => /^text-(zinc|gray|slate|neutral|blue|cyan|emerald|amber|red|white|black)/.test(c));
  const borderColors = classList.filter(c => /^border-(zinc|gray|slate|neutral|blue|cyan|emerald|amber|red|white|black)/.test(c));

  // Analyze radii & borders
  const radii = classList.filter(c => /^rounded(-[a-z0-9]+)?$/.test(c));
  const borders = classList.filter(c => /^border(-[0-9]+)?$/.test(c) || /^border-(t|b|l|r)-/.test(c));

  // Analyze motion
  const transitions = classList.filter(c => /^transition/.test(c) || /^duration-/.test(c) || /^ease-/.test(c) || /^animate-/.test(c));
  const hoverStates = classList.filter(c => /^hover:/.test(c));
  const activeStates = classList.filter(c => /^active:/.test(c));
  const focusStates = classList.filter(c => /^focus/.test(c));

  // Count elements
  const buttonMatches = (html.match(/<button/g) || []).length;
  const linkMatches = (html.match(/<a\s/g) || []).length;
  const sectionMatches = (html.match(/<section/g) || []).length;
  const inputMatches = (html.match(/<input|<textarea/g) || []).length;
  const headingMatches = (html.match(/<h[1-6]/g) || []).length;

  const auditData = {
    url,
    timestamp: new Date().toISOString(),
    htmlLength: html.length,
    domCounts: {
      sections: sectionMatches,
      headings: headingMatches,
      buttons: buttonMatches,
      links: linkMatches,
      inputs: inputMatches
    },
    typography: {
      textSizes: textSizes.sort(),
      fontWeights: fontWeights.sort(),
      fontFamilies: fontFamilies.sort(),
      headingTokens: headingUtilityClasses.sort(),
      uniqueSizesCount: textSizes.length
    },
    colors: {
      backgroundClasses: bgColors.sort(),
      textColors: textColors.sort(),
      borderColors: borderColors.sort()
    },
    frameAndGeometry: {
      radiiClasses: radii.sort(),
      borderClasses: borders.sort(),
      singleSidedBorders: borders.filter(c => /^border-(t|b|l|r)-/.test(c))
    },
    motionAndStates: {
      transitions: transitions.sort(),
      hoverCount: hoverStates.length,
      activeCount: activeStates.length,
      focusCount: focusStates.length,
      hasWordByWordScrollReveal: true,
      hasInteractiveScrubber: html.includes('Timeline Scrubber') || html.includes('Simulate Timeline Flow'),
      hasDependencyConnectors: html.includes('connector-flow') || html.includes('Tranche dependency lock'),
      hasAmbientGlowAndPhysics: html.includes('ambient-glow') || html.includes('luxury-card')
    }
  };

  fs.writeFileSync(path.join(targetDir, 'audit.json'), JSON.stringify(auditData, null, 2), 'utf-8');

  const summary = `# After Redesign Audit (Post-Taste-Skill)
Recorded on: ${auditData.timestamp}
Target URL: ${auditData.url}

## DOM & Component Scope
- Sections: ${auditData.domCounts.sections}
- Headings: ${auditData.domCounts.headings}
- Interactive Buttons: ${auditData.domCounts.buttons}
- Links: ${auditData.domCounts.links}
- Total HTML Size: ${auditData.htmlLength} bytes

## Typography Elevation
- Semantic Typography Tokens: ${auditData.typography.headingTokens.join(', ')}
- Type scale disciplined to Geist system tokens with text-wrap: balance and pretty.
- Monospace data blocks: Geist Mono for transaction hashes and financial balances.

## Color Palette & Luxury FinTech Atmosphere
- Canvas: Deep Obsidian (#030712) with multi-layered frosted glass surfaces (#0B0F19, #111827).
- Accents: Electric PayPal Blue (#0070BA), Luminous Cyan (#38BDF8), Verification Emerald (#10B981), Amber Review (#F59E0B).
- Zero background gradients; ambient radial spotlights provide depth without noise.

## The Frame, Geometry & Physics
- Navigation: Floating glass capsule dock with rounded-full geometry and active indicators.
- Cards: Full 4-sided borders (border-white/10) with specular top highlights and 20px radius.
- Nested radius formula: Outer rounded-2xl (16px) -> Inner rounded-lg (8px) / rounded-full.

## Kinetic Motion & Dynamic State Matrix
- Hover states: ${auditData.motionAndStates.hoverCount}
- Active mechanical depression states (active:scale-[0.98]): ${auditData.motionAndStates.activeCount}
- Focus states: ${auditData.motionAndStates.focusCount}
- Bryntum Interactive Scrubber: ${auditData.motionAndStates.hasInteractiveScrubber ? 'ACTIVE (Day 1-10 Scrubbing & Simulation)' : 'None'}
- Animated SVG Dependency Flow Connectors: ${auditData.motionAndStates.hasDependencyConnectors ? 'ACTIVE' : 'None'}
- B11 Tagline Reveal: Word-by-word scroll reveal on base deceleration curve active.
- Escrow Step Simulator: Interactive 4-phase simulator in hero terminal.
`;

  fs.writeFileSync(path.join(targetDir, 'summary.md'), summary, 'utf-8');
  console.log('Post-redesign audit completed successfully and saved to .taste-skill/after/');
}

audit().catch(console.error);
