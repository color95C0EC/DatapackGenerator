import TextInput from "../components/TextInput";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import { useState } from "react";
import generateDatapack from "../test";
import { Select, SelectItem } from "../components/NativeSelect";
import { packFormat as packFormatList } from "../data/packFormat";
// import { Link } from "react-router-dom";


export default function MainPage() {
  const [namespaceError, setNamespaceError] = useState<string | undefined>(undefined);
  const [canSubmit, setCanSubmit] = useState(true);

  return (
    <div className="font-mplus bg-dark-bg min-h-screen text-dark-text">
      <div className="flex">
        <form
          className="*:my-3 px-2"
          action={(data) => {
            const datapackName = data.get("datapackName")?.toString() ?? "";
            const namespace = data.get("namespace")?.toString() ?? "";
            const description = data.get("description")?.toString() ?? "";
            const packFormat = Number(data.get("packFormat"));
            generateDatapack({
              namespace,
              description,
              packFormat
            }).then((content) => {
              const a = document.createElement("a");
              a.href = URL.createObjectURL(content);
              a.download = `${datapackName}.zip`;
              a.click();
              URL.revokeObjectURL(a.href);
              a.remove();
            });
          }}
        >
          {/* //CHECK: Enterでのsubmit防止 */}
          <button type="submit" disabled className="hidden"></button>
          {/* 入力側 */}
          <TextInput
            label="データパック名"
            requiredText="*"
            name="datapackName"
            autoComplete="off"
          />
          <TextInput
            label="名前空間"
            errorText={namespaceError}
            requiredText="*"
            name="namespace"
            autoComplete="off"
            onChange={(e) => {
              const unavailableChars = e.target.value.match(/[^\da-z_-]/g);
              if (unavailableChars) {
                setNamespaceError(`${unavailableChars.join(",\u{0020}")}は名前空間に使用できません`);
                setCanSubmit(false);
              } else {
                setNamespaceError(undefined);
                setCanSubmit(true);
              }
            }}
          />
          <TextArea
            label="説明"
            name="description"
          />

          <div>
            <Select name="packFormat">
              {packFormatList.map(({label, packFormat}) => <SelectItem label={label} value={packFormat} />)}
            </Select>
          </div>

          <Button type="submit" disabled={!canSubmit}>生成</Button>
        </form>
        <div>
          {/* ディレクトリ構成表示 */}
        </div>
      </div>
      {/* <Link to="/licenses">ライセンス</Link> */}
    </div>
  );
}
