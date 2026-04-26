import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing your service pages
const servicesDir = path.join(__dirname, 'resources', 'js', 'pages', 'Services');

// The new fun facts content
const newFunFacts = `
                {/* start: Fun fact Section */}
                <section className="tj-funfact-section section-gap section-gap-x">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="heading-wrap-content">
                                    <div className="sec-heading style-4">
                                        <span className="sub-title wow fadeInUp" data-wow-delay=".3s"><i className="tji-box"></i>OUR FUN FACT</span>
                                        <h2 className="sec-title title-anim">Numbers and facts that define performance.</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row row-gap-4">
                            <div className="col-lg-4 col-md-6">
                                <div className="countup-item style-2 wow fadeInUp" data-wow-delay=".7s">
                                    <span className="count-icon"><i className="tji-growth"></i></span>
                                    <span className="steps">01.</span>
                                    <div className="count-inner">
                                        <span className="count-text">Faster Growth</span>
                                        <div className="inline-content">
                                            <span className="odometer countup-number" data-count="8.5"></span>
                                            <span className="count-plus">X</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="countup-item style-2 wow fadeInUp" data-wow-delay=".5s">
                                    <span className="count-icon"><i className="tji-worldwide"></i></span>
                                    <span className="steps">02.</span>
                                    <div className="count-inner">
                                        <span className="count-text">Reach Worldwide</span>
                                        <div className="inline-content">
                                            <span className="odometer countup-number" data-count="20"></span>
                                            <span className="count-plus">M</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                                <div className="countup-item style-2 wow fadeInUp" data-wow-delay=".1s">
                                    <span className="count-icon"><i className="tji-complete"></i></span>
                                    <span className="steps">03.</span>
                                    <div className="count-inner">
                                        <span className="count-text">Projects Completed.</span>
                                        <div className="inline-content">
                                            <span className="odometer countup-number" data-count="93"></span>
                                            <span className="count-plus">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-shape-1">
                        <img src="/assets/images/shape/pattern-2.svg" alt="" />
                    </div>
                    <div className="bg-shape-2">
                        <img src="/assets/images/shape/pattern-3.svg" alt="" />
                    </div>
                </section>
                {/* end: Fun fact Section */}
`;

// Function to update the fun facts section in a file
function updateFunFacts(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Create a regex pattern to find the fun facts section
        const funFactsRegex = /(\/\*\s*start:\s*Fun\s*fact\s*Section\s*\*\/)[\s\S]*?(\/\*\s*end:\s*Fun\s*fact\s*Section\s*\*\/)/g;
        
        // Replace the old fun facts section with the new one
        const updatedContent = content.replace(
            funFactsRegex,
            newFunFacts
        );
        
        // Only write if changes were made
        if (updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`✅ Updated: ${path.relative(process.cwd(), filePath)}`);
        } else {
            console.log(`ℹ️  No changes needed: ${path.relative(process.cwd(), filePath)}`);
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
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
        } else if (file.endsWith('.tsx') && !file.includes('node_modules')) {
            updateFunFacts(fullPath);
        }
    });
}

// Start processing
console.log('🔄 Updating fun facts in service pages...');
processDirectory(servicesDir);
console.log('✨ All service pages have been updated!');
