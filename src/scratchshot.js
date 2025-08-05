import AdmZip from 'npm:adm-zip'
import readline from 'node:readline'

import fs from 'node:fs'

async function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function getCommandInput(){
    let input = (await getUserInput("> ")).split(" ")
    switch(input[0]){
        case("help"):
            console.log("chwd - Change working directory to given path")
            console.log("unpackage - Unpackage project.sb3 from the working directory to the project folder")
            console.log("package - Package the project folder from the working directory to the project.sb3")
            console.log("exit - Exit ScratchShot")
            console.log("clear/cls - Clear the console")
            console.log("help - Show this help message")
            break;
        case("chwd"):
            if(input[1]){
                let newDir = input.splice(1, input.length).join(" ")
                process.chdir(newDir)
                console.log(`Changed working directory to ${newDir}`)
            }else{
                console.log("Please provide a path")
            }
            break;
        case("unpackage"):
            try {
                if(fs.existsSync("./project"))fs.rmSync("./project", { recursive: true, force: true });
                const zip = new AdmZip("project.sb3");
                zip.extractAllTo("./project", true);
                console.log("Unpackaged project.sb3 to ./project");
                
                let projectJson = fs.readFileSync("./project/project.json", "utf-8");
                let projectData = JSON.parse(projectJson);

                fs.mkdirSync("./project/targets");
                Object.keys(projectData["targets"]).forEach((targetId) => {
                    const target = projectData["targets"][targetId];
                    fs.writeFileSync(`./project/targets/${targetId}.json`, JSON.stringify(target, null, 2));
                });

                delete projectData["targets"];

                fs.writeFileSync("./project/project.json", JSON.stringify(projectData, null, 2));
            } catch (error) {
                console.error("Error unpackaging project.sb3:", error);
            }
            break;

        case("package"):
            try {
                if(!fs.existsSync("./project")) {
                    console.error("Project folder does not exist. Please unpackage a project first.");
                    return;
                }
                const zip = new AdmZip();
                let projectJson = fs.readFileSync("./project/project.json", "utf-8");
                let projectData = JSON.parse(projectJson);

                projectData["targets"] = [];
                const targetFiles = fs.readdirSync("./project/targets");
                targetFiles.forEach((file) => {
                    const targetId = file.replace(".json", "");
                    const targetData = JSON.parse(fs.readFileSync(`./project/targets/${file}`, "utf-8"));
                    projectData["targets"][targetId] = targetData;
                });

                fs.readdirSync("./project").forEach((file) => {
                    if(["jpg","jpeg","svg","png", "mp3", "wav"].includes(file.split(".").pop())){
                        zip.addLocalFile(`./project/${file}`);
                    }
                });

                zip.addFile("project.json", JSON.stringify(projectData));
                zip.writeZip("project.sb3");
                console.log("Packaged project folder to project.sb3");
            } catch (error) {
                console.error("Error packaging project:", error);
            }
            break;
        case("exit"):
            console.log("Exiting ScratchShot...");
            process.exit(0);
            break;
        case("clear"):
        case("cls"):
            console.clear();
            break;
        default:
            console.log("Unknown command. Type 'help' for a list of commands.");
            break;
        }
}
console.log("ScratchShot - v1.0.0")
while(true){
    await getCommandInput()
}