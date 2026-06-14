const fs = require('fs');
const html = fs.readFileSync('get-started.html', 'utf8');
const lines = html.split('\n');

// Find SVG elements that are neither self-closing nor have a matching closing tag
const svgVoidish = ['circle', 'line', 'path', 'rect', 'polyline', 'polygon', 'ellipse'];

svgVoidish.forEach(tag => {
  const opens = [];
  const closes = [];
  
  const openRx = new RegExp(`<${tag}[\\s>]`, 'g');
  const selfRx = new RegExp(`<${tag}[^>]*/\\s*>`, 'g');
  const closeRx = new RegExp(`</${tag}>`, 'g');
  
  let m;
  // count opens (not self-closing)
  const allOpen = [...html.matchAll(new RegExp(`<${tag}[\\s>][^>]*>`, 'g'))];
  const selfClose = [...html.matchAll(new RegExp(`<${tag}[^>]*/\\s*>`, 'g'))];
  const allClose = [...html.matchAll(new RegExp(`</${tag}>`, 'g'))];
  
  const nonSelfOpens = allOpen.filter(m => !m[0].endsWith('/>'));
  
  if (nonSelfOpens.length > allClose.length) {
    console.log(`<${tag}>: ${nonSelfOpens.length} opens, ${allClose.length} closes, ${selfClose.length} self-closing`);
    nonSelfOpens.forEach(m => {
      const lineNum = html.substring(0, m.index).split('\n').length;
      // Check if there's a close tag after this
      const rest = html.substring(m.index + m[0].length);
      const hasClose = rest.indexOf(`</${tag}>`) !== -1;
      if (!hasClose) {
        console.log(`  UNCLOSED at line ${lineNum}: ${m[0].substring(0, 80)}`);
      }
    });
  }
});
