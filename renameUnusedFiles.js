const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, 'metadata.csv');
const rootFolder = __dirname;
let fileNames = [];
let filesFoundInCSV = 0;
let filesRenamed = 0;

// Read the CSV file and extract filenames
fs.createReadStream(csvFilePath, { encoding: 'utf16le' }) // Adjust encoding if necessary
  .pipe(csv({
    mapHeaders: ({ header }) => header.trim() // Trim headers to remove any leading or trailing spaces
  }))
  .on('data', (row) => {
    const fileName = row['File Name'] || row['��F\x00i\x00l\x00e\x00 \x00N\x00a\x00m\x00e\x00']; // Adjust for header variations
    if (fileName) {
      fileNames.push(fileName.trim()); // Trim filename to remove any leading or trailing spaces
      filesFoundInCSV++;
    }
  })
  .on('end', () => {
    console.log('File names found in CSV:');
    console.log(fileNames);

    // Start scanning folders recursively
    scanFolders(rootFolder);
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
  });

function scanFolders(folder) {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error(`Error reading folder ${folder}: ${err}`);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(folder, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for file ${filePath}: ${err}`);
          return;
        }

        if (stats.isDirectory()) {
          scanFolders(filePath);
        } else if (stats.isFile()) {
          const fileName = path.basename(file);
          if (fileNames.includes(fileName)) {
            console.log(`Found matching file: ${filePath}`);
            renameFile(filePath);
          }
        }
      });
    });
  });
}

function renameFile(filePath) {
  const ext = path.extname(filePath);
  const newFilePath = filePath.replace(ext, `-unused_Davinci{ext}`);
  fs.rename(filePath, newFilePath, (err) => {
    if (err) {
      console.error(`Error renaming file ${filePath} to ${newFilePath}: ${err}`);
    } else {
      console.log(`Renamed file ${filePath} to ${newFilePath}`);
      filesRenamed++;
    }

    // Check if all files have been renamed
    if (filesRenamed === fileNames.length) {
      console.log(`All ${fileNames.length} files found in CSV have been renamed.`);
    }
  });
}

// Handle process exit to log summary
process.on('exit', () => {
  console.log(`Total files found in CSV: ${filesFoundInCSV}`);
  console.log(`Total files successfully renamed: ${filesRenamed}`);
});
