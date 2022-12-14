let fs = require("fs-extra");
let config = require("../../../letture.config");

let deneme = [];

function writeFile(file, componentFile, folderName) {

  const { mobileComponentFileName = "mobile" } = config;

  //i detect "import" line
  let component_file = fs.readFileSync(file).toString().split("\n");
  for (i in component_file) {
    let lines = component_file[i];
    let import_lines = component_file[i].substring(0, 6);
    if (import_lines == "import") {
      deneme.push(lines);
    }
  }

  //this block create mobile component file
  fs.readFile(file, "utf8", function (err, data) {
    let result = data.replace(/'react'/g, "vue");
    fs.writeFile(
      `${folderName}/${componentFile}_${mobileComponentFileName}.txt`,
      result,
      "utf8",
      function (err) {
        if (err) return console.log(err);
      }
    );
  });

}

module.exports = writeFile;
