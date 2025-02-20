// 初期化用関数
var varJson;
function _init_() {
    // JSON読み込み
    fetch('./var.json').then(response => response.json()).then(data => {
        varJson = data;

        // バージョン
        mcVerInput = document.getElementById("mc-ver-input");
        for (let i = 0; i < Object.keys(varJson.packFormat).length; i++) {
            const child = document.createElement("option");
            child.textContent = Object.keys(varJson.packFormat)[i];
            mcVerInput.appendChild(child);
        }
    })
}

// 生成用関数
function generateDatapack() {
    // 色々取ってくる
    const dpDescription = document.getElementById("description-input").value;
    const dpName = document.getElementById("datapack-name-input").value;
    const dpNamespace = document.getElementById("namespace-input").value;
    const functionSysTick = document.getElementById("function-sys-tick-input").checked;
    const functionSysLoad = document.getElementById("function-sys-load-input").checked;
    const functionSysSetup = document.getElementById("function-sys-setup-input").checked;
    const mcVerInput = document.getElementById("mc-ver-input").value;

    const zip = new JSZip();

    // pack.mcmeta
    zip.file('pack.mcmeta', JSON.stringify({
        pack: {
            pack_format: parseInt(varJson.packFormat[mcVerInput]),
            description: dpDescription
        }
    }, null, 4))

    // function
    if (functionSysTick == true) {
        zip.file(`data/${dpNamespace}/function/sys/tick.mcfunction`, "")
        zip.file(`data/minecraft/tags/function/tick.json`, JSON.stringify({
            values: [
                `${dpNamespace}:sys/tick`
            ]
        }, null, 4))
    }
    if (functionSysLoad == true) {
        zip.file(`data/${dpNamespace}/function/sys/load.mcfunction`, "")
        zip.file(`data/minecraft/tags/function/load.json`, JSON.stringify({
            values: [
                `${dpNamespace}:sys/load`
            ]
        }, null, 4))
    }
    if (functionSysSetup == true) {
        zip.file(`data/${dpNamespace}/function/sys/setup.mcfunction`, "")
        zip.file(`data/${dpNamespace}/advancement/setup.json`, JSON.stringify({
            criteria: {
                enter: {
                    trigger: "minecraft:location"
                }
            },
            rewards: {
                function: `${dpNamespace}:sys/setup`
            }
        }, null, 4))
    }

    //TODO: 遅延版（_delayed, 40t遅らせる）



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

function test_() {
    if (document.getElementById("namespace-auto").checked == true) {
        document.getElementById("namespace-input").value = document.getElementById("datapack-name-input").value.toLowerCase();
    }
}




// 初期化
_init_();

// 押されたら生成
document.getElementById("generate-btn").addEventListener("click", generateDatapack);

// 補完
document.getElementById("datapack-name-input").addEventListener("input", test_)

document.getElementById("namespace-auto").addEventListener("change", function () {
    if (document.getElementById("namespace-auto").checked == true) {
        document.getElementById("namespace-input").disabled = true
    } else {
        document.getElementById("namespace-input").disabled = false
    }
})
