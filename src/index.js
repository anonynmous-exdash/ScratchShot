import AdmZip from 'adm-zip'
import readline from 'readline'

import fs from 'fs'

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
    }
}
while(true){
    await getCommandInput()
}