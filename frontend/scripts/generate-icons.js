const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate SVG icon for each size
sizes.forEach(size => {
  const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#404040"/>
  <rect x="${Math.floor(size * 0.0625)}" y="${Math.floor(size * 0.0625)}" width="${Math.floor(size * 0.875)}" height="${Math.floor(size * 0.875)}" fill="none" stroke="#FFFFFF" stroke-width="${Math.max(2, Math.floor(size * 0.015))}"/>
  <rect x="${Math.floor(size * 0.125)}" y="${Math.floor(size * 0.125)}" width="${Math.floor(size * 0.75)}" height="${Math.floor(size * 0.75)}" fill="none" stroke="#A3A3A3" stroke-width="${Math.max(1, Math.floor(size * 0.008))}"/>
  
  <!-- ASCII-style "A" for AEAMCP -->
  <g fill="#FFFFFF" font-family="Courier New, monospace" font-size="${Math.floor(size * 0.4)}" font-weight="bold">
    <text x="${size/2}" y="${size * 0.625}" text-anchor="middle" dominant-baseline="middle">A</text>
  </g>
  
  <!-- Corner brackets for ASCII aesthetic -->
  <g stroke="#FFFFFF" stroke-width="${Math.max(2, Math.floor(size * 0.012))}" fill="none">
    <path d="M ${Math.floor(size * 0.1875)} ${Math.floor(size * 0.1875)} L ${Math.floor(size * 0.1875)} ${Math.floor(size * 0.25)} M ${Math.floor(size * 0.1875)} ${Math.floor(size * 0.1875)} L ${Math.floor(size * 0.25)} ${Math.floor(size * 0.1875)}"/>
    <path d="M ${Math.floor(size * 0.8125)} ${Math.floor(size * 0.1875)} L ${Math.floor(size * 0.75)} ${Math.floor(size * 0.1875)} M ${Math.floor(size * 0.8125)} ${Math.floor(size * 0.1875)} L ${Math.floor(size * 0.8125)} ${Math.floor(size * 0.25)}"/>
    <path d="M ${Math.floor(size * 0.1875)} ${Math.floor(size * 0.8125)} L ${Math.floor(size * 0.1875)} ${Math.floor(size * 0.75)} M ${Math.floor(size * 0.1875)} ${Math.floor(size * 0.8125)} L ${Math.floor(size * 0.25)} ${Math.floor(size * 0.8125)}"/>
    <path d="M ${Math.floor(size * 0.8125)} ${Math.floor(size * 0.8125)} L ${Math.floor(size * 0.8125)} ${Math.floor(size * 0.75)} M ${Math.floor(size * 0.8125)} ${Math.floor(size * 0.8125)} L ${Math.floor(size * 0.75)} ${Math.floor(size * 0.8125)}"/>
  </g>
</svg>`;

  // For now, we'll create SVG files since we can't generate actual PNG files without additional dependencies
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svgContent);
  console.log(`Generated ${filename}`);
});

// Create a simple favicon.ico placeholder
const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#404040"/>
  <rect x="2" y="2" width="28" height="28" fill="none" stroke="#FFFFFF" stroke-width="2"/>
  <g fill="#FFFFFF" font-family="Courier New, monospace" font-size="16" font-weight="bold">
    <text x="16" y="20" text-anchor="middle" dominant-baseline="middle">A</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), faviconSvg);
console.log('Generated favicon.svg');

console.log('Icon generation complete! Note: For production, convert SVG files to PNG using a tool like sharp or imagemagick.');