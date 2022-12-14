let fs = require("fs-extra");
let glob = require("glob");
let config = require("./letture.config");

let import_handler = require('./src/modules/import_modules/import_handler');

//i catch config.js file
function configFileImport() {
  const { path } = config;
  glob("**/lettuce.config.js", function (er, files) {
    const srcDir = files[0];
    const destDir = "./node_modules/lettuce/letture.config.js";
    try {
      fs.copySync(srcDir, destDir, { overwrite: false });
      _createComponentFolder(path);
      console.log("--->", path);
    } catch (err) {
      console.error(err);
    }
  });
}

// i create component folder name in project
function _createComponentFolder(path) {
  const COMPONENT_FOLDER_NAME = path.replace(/([^a-zA-z0-9]+)/g, (s0) => "");
  if (config.mobileComponentFolderName) {
    fs.promises.mkdir(
      `${COMPONENT_FOLDER_NAME}/${config.mobileComponentFolderName}`,
      { recursive: true }
    );
  } else {
    fs.promises.mkdir(`${COMPONENT_FOLDER_NAME}/mobile_components`, {
      recursive: true,
    });
  }
  _detectWebComponents(COMPONENT_FOLDER_NAME);
}

/** 
 * this function detect web components in the components folder. 
 * Also i call the import handler function for import line detect
 * */ 
function _detectWebComponents(path) {
  const { mobileComponentFileName = "mobile" } = config;
  glob(`${path}/**/*.txt`, function (er, files) {
    fs.readFile(files[0], "utf8", function (err, data) {
      let folder = files[0].split(/[/]/);
      let componentFile, folderName;
      
      for (let i = 0; i < folder.length; i++) {
        if (new RegExp("\\b" + ".txt" + "\\b").test(folder[i])) {
          componentFile = folder[i].replace(`_${mobileComponentFileName}.txt"`, "");
          folderNameIndex = folder[folder.indexOf(folder[i])];
          folderName = folder
          .splice(folderNameIndex, folder.length - 1)
          .join("/");
        } else {
          //console.log("not found", folder[i]);
        }
      }
      import_handler(files[0], componentFile, folderName);

      if (err) {
        return console.log(err);
      }
    });
  });
}

module.exports = configFileImport;
