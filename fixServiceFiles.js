import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesDir = path.join(__dirname, 'resources', 'js', 'pages', 'Services');

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const originalContent = content;
        
        // Fix: Remove extra opening brace before Fun Fact Section
        content = content.replace(
            /\{\s*\{\s*\/\*\s*start: Fun fact Section\s*\*\/\s*\n\s*<section className="tj-funfact-section/g,
            '\n                {/* start: Fun fact Section */}\n                <section className="tj-funfact-section'
        );
        
        // Fix: Remove extra closing brace after end of Fun Fact Section
        content = content.replace(
            /<\/section>\s*\n\s*\/\*\s*end: Fun fact Section\s*\*\/\s*\n\s*\}/g,
            '                </section>\n                {/* end: Fun fact Section */}'
        );
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed: ${path.relative(process.cwd(), filePath)}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
}

function processDirectory(directory) {
    let fixedCount = 0;
    
    const files = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(directory, file.name);
        
        if (file.isDirectory()) {
            fixedCount += processDirectory(fullPath);
        } else if (file.name.endsWith('.tsx') || file.name.endsWith('.jsx') || file.name.endsWith('.js')) {
            if (fixFile(fullPath)) {
                fixedCount++;
            }
        }
    }
    
    return fixedCount;
}

console.log('🔍 Checking service files for syntax issues...');
const filesFixed = await processDirectory(servicesDir);

if (filesFixed > 0) {
    console.log(`\n✨ Successfully fixed ${filesFixed} file(s).`);
    console.log('✅ Build should now work correctly. Try running `npm run build` again.');
} else {
    console.log('\n✅ No syntax issues found in service files.');
    console.log('   If you\'re still seeing build errors, please share the error message.');
}
