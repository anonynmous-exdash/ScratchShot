# ScratchShot
Use the power of git with your sb3 files. Recommended to use TurboWarp with this. 

# Tutorial
Download node.js if you don't already have it.
Then run `npm i -g adm-zip`
Just download the repo as a zip file and copy the js file into a folder with a project.sb3 file. Then open command prompt and run `node scratchshot.js` 

### Before pushing changes or receiving changes
Run `unpackage` to unpackage the project.sb3 into a project folder.

### After receiving changes 
Run `package` to package the project folder into a project.sb3 file.


# How?
This works by unzipping the Scratch sb3 file and splitting up its project.json into different files and folders and then formatting them so git can see changes.
