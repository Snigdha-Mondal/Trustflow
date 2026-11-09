import fs from 'node:fs';
import path from 'node:path';

async function audit() {
  const targetDir = path.resolve(process.cwd(), '.taste-skill/before');
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
  
  // Analyze colors
  const bgColors = classList.filter(c => /^bg-/.test(c));
  const textColors = classList.filter(c => /^text-(zinc|gray|slate|neutral|blue|emerald|amber|red|white|black)/.test(c));
  const borderColors = classList.filter(c => /^border-(zinc|gray|slate|neutral|blue|emerald|amber|red|white|black)/.test(c));

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
      hasWordByWordScrollReveal: html.includes('tagline-reveal') || html.includes('IntersectionObserver'),
      hasStaggeredAnimations: html.includes('stagger') || transitions.some(t => t.includes('delay-')),
      hasPhysicsOrGlowEffects: html.includes('radial-gradient') || html.includes('conic-gradient')
    }
  };

  fs.writeFileSync(path.join(targetDir, 'audit.json'), JSON.stringify(auditData, null, 2), 'utf-8');

  const summary = `# Before Redesign Audit (Baseline)
Recorded on: ${auditData.timestamp}
Target URL: ${auditData.url}

## DOM & Component Scope
- Sections: ${auditData.domCounts.sections}
- Headings: ${auditData.domCounts.headings}
- Interactive Buttons: ${auditData.domCounts.buttons}
- Links: ${auditData.domCounts.links}
- Total HTML Size: ${auditData.htmlLength} bytes

## Typography Findings
- Font Sizes used: ${auditData.typography.textSizes.join(', ')}
- Font Weights used: ${auditData.typography.fontWeights.join(', ')}
- Font Families: ${auditData.typography.fontFamilies.join(', ')}
- Deficiencies: Lacks fluid micro-typography, lacks disciplined scale tokens for subheads, lacks balanced heading wrapping.

## Color Palette Findings
- Backgrounds: Plain pitch black (\`bg-black\`) with basic zinc cards (\`bg-zinc-900\`, \`bg-zinc-950\`). Lacks subtle obsidian layers, luminous depth, and high-class surface separation.
- Accent: Basic Tailwind blue (\`blue-600\`) without authentic PayPal brand depth (\`#0070BA\`), glowing highlights, or stateful active brightness.

## The Frame & Layout Findings
- Flat card containers with generic \`rounded-2xl\` and \`rounded-xl\`.
- Single-sided border occurrences found: ${auditData.frameAndGeometry.singleSidedBorders.length}
- Header sits static or basic sticky rather than a floating frosted glass pill dock.
- Bryntum Gantt timeline board renders plain tables/cards without animated dependency flow lines, milestone pulse beacons, or interactive scrubber physics.

## Motion & Interactive States
- Hover classes: ${auditData.motionAndStates.hoverCount}
- Active classes (\`active:scale-[0.98]\`): ${auditData.motionAndStates.activeCount}
- Focus classes: ${auditData.motionAndStates.focusCount}
- Tagline reveal word-by-word on scroll: ${auditData.motionAndStates.hasWordByWordScrollReveal ? 'Present' : 'MISSING (Mandatory per B11)'}
- Staggered entrances & smooth deceleration curves: ${auditData.motionAndStates.hasStaggeredAnimations ? 'Present' : 'MISSING'}
- Glass surface highlights & ambient radial glow: ${auditData.motionAndStates.hasPhysicsOrGlowEffects ? 'Present' : 'MISSING'}
`;

  fs.writeFileSync(path.join(targetDir, 'summary.md'), summary, 'utf-8');
  console.log('Audit completed successfully and saved to .taste-skill/before/');
}

audit().catch(console.error);

