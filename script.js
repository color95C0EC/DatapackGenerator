var varJson;
const mcVersionInput = document.getElementById("mc-version-input");
const namespaceInput = document.getElementById("namespace-input");
const datapackNameInput = document.getElementById("datapack-name-input");


document.addEventListener("DOMContentLoaded", function () {
  fetch('./var.json').then(response => response.json()).then(data => {
    varJson = data;

    const varPackFormat = varJson["packFormat"];
    for (let mcVersion of Object.keys(varPackFormat)) {
      if (varPackFormat[mcVersion] == "---") {
        const child = document.createElement("hr");
        child.innerText = "";
        mcVersionInput.appendChild(child);
      } else {
        const child = document.createElement("option");
        child.textContent = mcVersion;
        mcVersionInput.appendChild(child);
      };
    };
  });
});








function generateDatapack() {
  // 色々取ってくる
  const dpDescription = document.getElementById("description-input").value;
  const dpName = datapackNameInput.value;
  const dpNamespace = namespaceInput.value;
  const mcVerInput = mcVersionInput.value;
  // const functionSysTick = document.getElementById("function-sys-tick-input").checked;
  // const functionSysLoad = document.getElementById("function-sys-load-input").checked;
  // const functionSysSetup = document.getElementById("function-sys-setup-input").checked;

  const zip = new JSZip();

  const packFormat = parseInt(varJson["packFormat"][mcVerInput]);


  function getDirectoryNameDependingVersion(directoryName) {
    if (packFormat >= 45) {
      return directoryName;
    } else {
      return directoryName + "s";
    };
  };

  function generateFunction(functionName, generateTags, functionType) {
    zip.file(`data/${dpNamespace}/${getDirectoryNameDependingVersion("function")}/${functionName}.mcfunction`, "");
    if (generateTags) {
      zip.file(`data/minecraft/tags/${getDirectoryNameDependingVersion("function")}/${functionType}.json`, JSON.stringify({
        values: [
          `${dpNamespace}:${functionName}`
        ]
      }, null, 2));
    };
  };







  // pack.mcmeta
  zip.file('pack.mcmeta', JSON.stringify({
    pack: {
      pack_format: packFormat,
      description: dpDescription
    }
  }, null, 4));



  // function
  generateFunction("sys/tick", true, "tick");
  generateFunction("sys/load", true, "load");

  generateFunction("sys/setup", false);
  zip.file(`data/${dpNamespace}/${getDirectoryNameDependingVersion("advancement")}/setup.json`, JSON.stringify({
    criteria: {
      enter: {
        trigger: "minecraft:location"
      }
    },
    rewards: {
      function: `${dpNamespace}:sys/setup`
    }
  }, null, 2));



  // recipe
  zip.file(`data/${dpNamespace}/${getDirectoryNameDependingVersion("recipe")}/`, "");






  zip.generateAsync({ type: "blob" }).then(blob => {
    // ダウンロードリンクを生成
    let dlLink = document.createElement("a");

    // blobからURLを生成
    const dataUrl = URL.createObjectURL(blob);
    dlLink.href = dataUrl;
    dlLink.download = `${dpName}.zip`;

    // 設置/クリック/削除
    document.body.insertAdjacentElement("beforeEnd", dlLink);
    dlLink.click();
    dlLink.remove();

    // https://r17n.page/2020/01/12/js-download-zipped-images-to-local/
  });
}




function complement() {
  let value = "";
  const datapackName = datapackNameInput.value.replace(/[^A-Za-z-_]/g, "");
  value += datapackName.charAt(0).toLowerCase();
  value += datapackName.substr(1).replace(/([A-Z])/g, "_$1").toLowerCase();
  namespaceInput.value = value;
}


document.getElementById("generate-btn").addEventListener("click", generateDatapack);

const namespaceComplementInput = document.getElementById("namespace-complement-input");

datapackNameInput.addEventListener("input", function () {
  if (namespaceComplementInput.checked) { complement(); }
});
namespaceComplementInput.addEventListener("change", function () {
  if (namespaceComplementInput.checked) {
    namespaceInput.disabled = true;
    complement();
  } else {
    namespaceInput.disabled = false;
  };
});
