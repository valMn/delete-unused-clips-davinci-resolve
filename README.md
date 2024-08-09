## Script used to batch rename and delete unused Davinci Resolve project video clips.

Youtube tutorial link: (https://www.youtube.com/watch?v=WT0zjqI25K4).

Download and install Node JS:
- Mac (https://nodejs.org/en/download/package-manager) use terminal to install
- Windows (https://nodejs.org/en/download/prebuilt-installer) download installer

Download script and place in the same parent folder as your project folders containing the video clips:
(https://github.com/valMn/delete-unused-clips-davinci-resolve/blob/main/renameUnusedFiles.js)

Initialize project and install csv parser (run this in terminal at parent folder location of your video clips and script)
`npm init -y && npm install csv-parser`

Save your metadata.csv file from Davinci in same parent folder as the script.

At same parent location run in terminal `node renameUnusedFiles.js` to run the script.

See the rest of the video demo for step by step instructions.
