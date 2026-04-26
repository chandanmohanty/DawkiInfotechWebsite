import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing your service pages
const servicesDir = path.join(__dirname, 'resources', 'js', 'pages', 'Services');

// Function to update image paths in a file
function updateImagePaths(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace relative paths with absolute paths
        content = content.replace(
            /(src|data-bg-image|data-src|data-bg)="(\.\.\/)*assets\//g, 
            '$1="/assets/'
        );
        
        // Fix any remaining paths that might be missing the leading slash
        content = content.replace(
            /(src|data-bg-image|data-src|data-bg)="(?!\/)(assets\/)/g, 
            '$1="/$2'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated paths in ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Recursively find all .tsx files in the services directory
function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.tsx')) {
            updateImagePaths(fullPath);
        }
    });
}

// Start processing
console.log('Fixing image paths in service pages...');
processDirectory(servicesDir);
console.log('Done!');
