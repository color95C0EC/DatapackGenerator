// 初期化用関数
function _init_() {
    // JSON読み込み
    var varJson;
    fetch('./var.json').then(response => response.json()).then(data => {
        varJson = data;
        console.log(varJson);
        // console.log(Object.keys(data.packFormat));
    })

    // バージョン
    // console.log(varJson);
    // mcVerInput = document.getElementById("mc-ver-input");
    // for (let i = 0; i < Object.keys(varJson.packFormat).length; i++) {
    //     const child = document.createElement("option");
    //     child.textContent = Object.keys(varJson.packFormat)[i];
    //     mcVerInput.appendChild(child);
    // }
}

// 生成用関数
function generateDatapack() {
    // 色々取ってくる
    const dpDescription = document.getElementById("description-input").value;
    const dpName = document.getElementById("datapack-name-input").value;
    const dpNamespace = document.getElementById("namespace-input").value;
    const _function_sys_tick = document.getElementById("function-sys-tick-input").checked
    const docs_readme = document.getElementById("readme-input").checked
    const docs_info = document.getElementById("info-json-input").checked

    const zip = new JSZip();

    // pack.mcmetaを生成
    zip.file('pack.mcmeta', JSON.stringify({
        pack: {
            pack_format: 61,
            description: dpDescription
        }
    }, null, 4))

    // function
    if (_function_sys_tick == true) {
        zip.file(`data/${dpNamespace}/function/sys/tick.mcfunction`, "")
        zip.file(`data/minecraft/tags/function/tick.json`, JSON.stringify({
            values: [
                `${dpNamespace}:sys/tick`
            ]
        }, null, 4))
    }

    // docs/*
    if (docs_readme == true) {
        zip.file("docs/README.md", "# 動作環境\n")
    }
    if (docs_readme == true) {
        zip.file("docs/info.json", JSON.stringify({
            namespace: [dpNamespace]
        }, null, 4))
    }




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
document.getElementById("datapack-name-input").addEventListener("change", test_)
