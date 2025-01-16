// // input要素
// const fileInput = document.getElementById('pack-png-input');
// // changeイベントで呼び出す関数
// const handleFileSelect = () => {
//     const files = fileInput.files;
//     for (let i = 0; i < files.length; i++) {
//         console.log(files[i]);// 1つ1つのファイルデータはfiles[i]で取得できる
//     }
// }
// // ファイル選択時にhandleFileSelectを発火
// fileInput.addEventListener('change', handleFileSelect);


mcVersion = {
    "1.21.4": 61,
    "25w03a": 63
}


function load_() {
    mcVerInput = document.getElementById("mc-ver-input");
    for (let i = 0; i < Object.keys(mcVersion).length; i++) {
        const child = document.createElement("option");
        child.textContent = Object.keys(mcVersion)[i];
        mcVerInput.appendChild(child);
    }
}

load_();
