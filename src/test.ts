import JSZip from "jszip";


export default async function generateDatapack({
  namespace,
  description,
  packFormat
}: {
  namespace: string
  description: string
  packFormat: number
}): Promise<Blob> {
  const packFormatArr = packFormat.toString().split(".").map((s) => Number(s));
  const zip = new JSZip();
  //MEMO: 82.0境にどっちか必要な方だけ入れるように
  zip.file("pack.mcmeta", JSON.stringify({
    "pack": {
      "min_format": packFormatArr,
      "max_format": packFormatArr,
      "pack_format": packFormat,
      "description": description
    }
  }, null, 4));
  const dirData = zip.folder("data");
  const dirN = dirData?.folder(namespace);
  const dirM = dirData?.folder("minecraft");

  const dirMTags = dirM?.folder("tags");
  const dirMTagsFunction = dirMTags?.folder(
    (packFormat < 45) ? "functions": "function"
  );
  dirMTagsFunction?.file("load.json", JSON.stringify({
    "values": [
      `${namespace}:load`
    ]
  }, null, 4));
  dirMTagsFunction?.file("tick.json", JSON.stringify({
    "values": [
      `${namespace}:main`
    ]
  }, null, 4));

  const dirNFunction = dirN?.folder(
    (packFormat < 45) ? "functions": "function"
  );
  dirNFunction?.file("load.mcfunction", "");
  dirNFunction?.file("main.mcfunction", "");
  dirNFunction?.file("setup.mcfunction", "");

  return zip.generateAsync({ type: "blob" });
}
