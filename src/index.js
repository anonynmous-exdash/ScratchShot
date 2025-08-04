import AdmZip from 'adm-zip'
import readline from 'readline'


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
    }
}
while(true){
    await getCommandInput()
}