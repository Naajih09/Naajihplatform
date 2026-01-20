import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = './dist';

// Check if metafiles exist before processing
const esmMetafile = join(distDir, 'metafile-esm.json');
const cjsMetafile = join(distDir, 'metafile-cjs.json');

function stripUseClient(format) {
  const metafilePath = format === 'esm' ? esmMetafile : cjsMetafile;

  if (!existsSync(metafilePath)) {
    console.log(
      `⚠️ Metafile not found: ${metafilePath}, skipping ${format} processing`
    );
    return;
  }

  try {
    const metafile = JSON.parse(readFileSync(metafilePath, 'utf8'));

    Object.keys(metafile.outputs).forEach((outputPath) => {
      if (outputPath.endsWith('.js')) {
        const fullPath = join(process.cwd(), outputPath);

        if (existsSync(fullPath)) {
          let content = readFileSync(fullPath, 'utf8');

          // Remove "use client" directives from the top of files
          content = content.replace(/^["']use client["'];?\s*\n?/gm, '');

          writeFileSync(fullPath, content, 'utf8');
          console.log(`✅ Stripped "use client" from ${outputPath}`);
        }
      }
    });
  } catch (error) {
    console.log(`⚠️ Error processing ${format} metafile:`, error.message);
  }
}

// Process both formats
stripUseClient('esm');
stripUseClient('cjs');

console.log('✅ Use client stripping completed');
