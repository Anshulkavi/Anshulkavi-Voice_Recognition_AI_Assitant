const { exec } = require('child_process');
const path = require('path');

const openFile = (filePath) => {
    exec(`start ${filePath}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error opening file: ${err.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
};

// Accept file path from command line argument
const filePath = process.argv[2];
if (filePath) {
    openFile(filePath);
} else {
    console.log("No file path provided.");
}
