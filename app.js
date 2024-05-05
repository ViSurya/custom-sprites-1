const fs = require('fs');
const path = require('path');

const repoPath = './'; // Path to the repository root
const outputDir = './json_files'; // Output directory for JSON files

// Function to recursively traverse directories
function traverseDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    const data = {};
    files.forEach(file => {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            // If the current item is a directory, recursively traverse it
            data[file.name] = traverseDirectory(filePath);
        } else {
            // If the current item is a file, add it to the current directory's data
            if (!data.files) {
                data.files = [];
            }
            data.files.push(file.name);
        }
    });
    return data;
}

// Function to create directory if it doesn't exist
function createDirIfNotExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Function to save JSON data to a file
function saveToJson(data, directoryPath) {
    Object.keys(data).forEach(name => {
        const filePath = path.join(directoryPath, `${name}.json`);
        const jsonData = JSON.stringify(data[name], null, 2);
        fs.writeFileSync(filePath, jsonData);
    });
}

// Function to traverse directories and save file names to JSON
function traverseAndSave(directoryName) {
    const directoryPath = path.join(repoPath, directoryName);
    const directoryData = traverseDirectory(directoryPath);
    const outputDirectory = path.join(outputDir, directoryName);
    createDirIfNotExists(outputDirectory);
    saveToJson(directoryData, outputDirectory);
    console.log(`${directoryName} data saved to JSON.`);
}

// Create the output directory if it doesn't exist
createDirIfNotExists(outputDir);

// Traverse the CustomBattlers and Other directories and save file names to JSON
traverseAndSave('CustomBattlers');
traverseAndSave('Other');
