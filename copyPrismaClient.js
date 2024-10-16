const fs = require('fs');
const path = require('path');

// Define source and destination paths
const sourcePath = path.join(__dirname, 'node_modules', '.prisma', 'client');
const destPath = path.join(__dirname, 'dist', '.prisma', 'client');

// Create the destination directory if it doesn't exist
if (!fs.existsSync(destPath)){
    fs.mkdirSync(destPath, { recursive: true });
}

// Copy the files from the source to the destination
fs.readdir(sourcePath, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
        const sourceFile = path.join(sourcePath, file);
        const destFile = path.join(destPath, file);
        
        fs.stat(sourceFile, (err, stats) => {
            if (err) throw err;

            // Only copy files, skip directories
            if (stats.isFile()) {
                fs.copyFile(sourceFile, destFile, (err) => {
                    if (err) throw err;
                    console.log(`Copied ${file} to ${destPath}`);
                });
            } else {
                console.log(`Skipped directory ${file}`);
            }
        });
    });
});
