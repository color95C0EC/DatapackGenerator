# import
import os
import json
import shutil
from pathlib import Path

import flet as ft

# いろいろ
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
file_path = (
    os.path.join(os.path.expanduser("~"), "Downloads")
    + "/py/datapack_generator"
)
ver_conv = json.load(open(file_path + "/dp_gen.json", "r"))["ver_conv"]
available_char = json.load(open(file_path + "/dp_gen.json", "r"))[
    "available_char"
]
pack_png = None


def main(page: ft.Page):
    page.title = "DatapackGenerator"
    page.window_width = 580
    page.window_height = 850

    def tag_check(e):
        if tag_block_box.value == True:
            tag_box.value = True
        if tag_entity_box.value == True:
            tag_box.value = True
        if tag_item_box.value == True:
            tag_box.value = True
        if tag_function_box.value == True:
            tag_box.value = True
        tag_box.update()

    # UIの設定
    datapack_name_box = ft.TextField(
        label="データパック名", width=300, text_align=ft.TextAlign.LEFT
    )
    namespace_name_box = ft.TextField(
        label="名前空間", width=300, text_align=ft.TextAlign.LEFT
    )
    mc_ver_box = ft.Dropdown(
        label="Minecraftのバージョン", width=300, options=[]
    )
    for ver in ver_conv:
        mc_ver_box.options.append(ft.dropdown.Option(str(ver)))
    mc_ver_box.value = list(ver_conv)[0]
    description_box = ft.TextField(
        label="データパックの説明", width=300, text_align=ft.TextAlign.LEFT
    )
    damage_type_box = ft.Checkbox(label="damage_type", value=False)
    enchantment_box = ft.Checkbox(label="enchantment", value=False)
    item_modifier_box = ft.Checkbox(label="item_modifier", value=False)
    loot_table_box = ft.Checkbox(label="loot_table", value=False)
    predicate_box = ft.Checkbox(label="predicate", value=False)
    recipe_box = ft.Checkbox(label="recipe", value=False)
    structure_box = ft.Checkbox(label="structure", value=False)
    tag_box = ft.Checkbox(label="tags", value=False)
    trim_material_box = ft.Checkbox(label="trim_material", value=False)
    trim_pattern_box = ft.Checkbox(label="trim_pattern", value=False)
    worldgen_box = ft.Checkbox(label="worldgen", value=False)
    function_main_box = ft.Checkbox(label="main.mcfunction", value=True)
    tag_block_box = ft.Checkbox(
        label="block", value=False, on_change=tag_check
    )
    tag_entity_box = ft.Checkbox(
        label="entity_type", value=False, on_change=tag_check
    )
    tag_item_box = ft.Checkbox(label="item", value=False, on_change=tag_check)
    tag_function_box = ft.Checkbox(
        label="function", value=False, on_change=tag_check
    )

    # バナー表示用
    def open_banner(message, color):
        page.snack_bar = ft.SnackBar(
            ft.Text(message, color=color), open=True, bgcolor=ft.colors.BLACK54
        )
        page.update()

    # pack.png選択用
    def pick_files_result(e: ft.FilePickerResultEvent):
        if e.files[0].path.split(".")[-1] == "png":
            global pack_png
            global img_name
            pack_png = e.files[0].path
            img_name = Path(e.files[0].path).name
        else:
            open_banner(
                message="データパックのアイコンに使用する画像は拡張子がpngである必要があります",
                color="red",
            )

    pick_file_dialog = ft.FilePicker(on_result=pick_files_result)
    page.overlay.extend([pick_file_dialog])

    # 生成
    def generate(e):
        # いろいろ
        error = False
        error_char = []
        datapack_name = str(datapack_name_box.value)
        namespace_name = str(namespace_name_box.value)
        pack_format = ver_conv[str(mc_ver_box.value)]
        namespace_name_char = list(namespace_name)
        if description_box.value == "":
            description = datapack_name.replace("_ver.1.0.0.0", "")
        else:
            description = str(description_box.value)

        # エラーチェック
        if datapack_name == "" and namespace_name == "":
            error = True
            open_banner(
                message="データパック名, 名前空間を入力してください",
                color="red",
            )
        elif datapack_name == "":
            error = True
            open_banner(
                message="データパック名を入力してください", color="red"
            )
        elif namespace_name == "":
            error = True
            open_banner(message="名前空間を入力してください", color="red")

        for char in namespace_name_char:
            if char not in available_char:
                error = True
                error_char.append(char.replace(" ", "半角スペース"))
        if not error_char == []:
            error_message = (
                "名前空間に"
                + ", ".join(error_char)
                + "はつかえないよ(´・ω・`)"
            )
            open_banner(message=error_message, color="red")

        # エラーなかったとき
        if error == False:
            # ディレクトリ生成
            namespace_dir = (
                desktop_path + "/" + datapack_name + "/data/" + namespace_name
            )
            os.makedirs(namespace_dir)

            # pack.mcmeta生成
            mcmeta = {
                "pack": {
                    "pack_format": int(pack_format),
                    "description": description,
                }
            }
            with open(
                desktop_path + "/" + datapack_name + "/pack.mcmeta", "w"
            ) as f:
                json.dump(mcmeta, f, indent=4, ensure_ascii=False)

            # docs/readme.txt生成
            docs_path = desktop_path + "/" + datapack_name + "/docs"
            os.makedirs(docs_path)
            readme = f"＜動作環境＞\n    Minecraft JavaEdition {mc_ver_box.value}\n    マルチ未対応（未検証）\n\n\n＜推奨設定＞\n    特になし\n\n\n＜注意＞\n    特になし\n\n\n＜詳細説明＞\n"
            with open(os.path.join(docs_path, "readme.txt"), "w") as output:
                output.write(readme)

            # damage_type生成
            if damage_type_box.value == True:
                os.makedirs(namespace_dir + "/damage_type")

            # enchantment生成
            if enchantment_box.value == True:
                os.makedirs(namespace_dir + "/enchantment")

            # functions生成
            # load用advancements
            os.makedirs(namespace_dir + "/advancement")
            load = {
                "criteria": {"enter": {"trigger": "minecraft:location"}},
                "rewards": {"function": namespace_name + ":load"},
            }
            with open(
                os.path.join(namespace_dir + "/advancement", "load.json"), "w"
            ) as f:
                json.dump(load, f, indent=4, ensure_ascii=False)

            # load.mcfunction
            os.makedirs(namespace_dir + "/function")
            with open(
                os.path.join(namespace_dir + "/function", "load.mcfunction"),
                "w",
            ) as output:
                output.write(
                    '# 導入確認\n    tellraw @a {"text":"'
                    + datapack_name.replace("_ver.1.0.0.0", "")
                    + 'の導入が完了しました＼(^o^)／","color":"gold"}\n\n# 遅れて実行\n    schedule function '
                    + namespace_name
                    + ":load_delay 10t"
                )

            # load_delay.mcfunction
            with open(
                os.path.join(
                    namespace_dir + "/function", "load_delay.mcfunction"
                ),
                "w",
            ) as output:
                output.write(
                    '# 汎用ライブラリの導入チェック\n    execute unless data storage common_lib:common {import_check:true} run tellraw @a {"text":"CommonLibを導入してください(´・ω・`)","color":"red"}'
                )

            # main.mcfunction
            if function_main_box.value == True:
                os.makedirs(
                    desktop_path
                    + "/"
                    + datapack_name
                    + "/data/minecraft/tags/function"
                )
                with open(
                    os.path.join(
                        namespace_dir + "/function", "main.mcfunction"
                    ),
                    "w",
                ) as output:
                    output.write("")
                with open(
                    desktop_path
                    + "/"
                    + datapack_name
                    + "/data/minecraft/tags/function"
                    + "/tick.json",
                    "w",
                ) as f:
                    json.dump(
                        {"values": [namespace_name + ":main"]},
                        f,
                        indent=4,
                        ensure_ascii=False,
                    )

            # item_modifiers生成
            if item_modifier_box.value == True:
                os.makedirs(namespace_dir + "/item_modifier")

            # loot_tables生成
            if loot_table_box.value == True:
                os.makedirs(namespace_dir + "/loot_table")

            # predicates生成
            if predicate_box.value == True:
                os.makedirs(namespace_dir + "/predicate")

            # recipes生成
            if recipe_box.value == True:
                os.makedirs(namespace_dir + "/recipe")

            # structures生成
            if structure_box.value == True:
                os.makedirs(namespace_dir + "/structure")

            # tags生成
            if tag_box.value == True:
                os.makedirs(namespace_dir + "/tags")
                if tag_block_box.value == True:
                    os.makedirs(namespace_dir + "/tags/block")
                if tag_entity_box.value == True:
                    os.makedirs(namespace_dir + "/tags/entity_type")
                if tag_item_box.value == True:
                    os.makedirs(namespace_dir + "/tags/item")
                if tag_function_box.value == True:
                    os.makedirs(namespace_dir + "/tags/function")

            # trim_material生成
            if trim_material_box.value == True:
                os.makedirs(namespace_dir + "/trim_material")

            # trim_pattern生成
            if trim_pattern_box.value == True:
                os.makedirs(namespace_dir + "/trim_pattern")

            # worldgen生成
            if worldgen_box.value == True:
                os.makedirs(namespace_dir + "/worldgen")

            # pack.png生成
            if pack_png == None:
                shutil.copy(
                    file_path+"/pack.png", desktop_path+"/"+datapack_name
                )
            else:
                shutil.copy(pack_png, desktop_path+"/"+datapack_name)
                os.rename(desktop_path+"/"+datapack_name+"/"+img_name, desktop_path+"/"+datapack_name+"/pack.png")

            # ＼(^o^)／
            open_banner("＼(^o^)／", "green")

    # UIの配置
    page.add(
        ft.Row(
            [
                ft.Column(
                    controls=[
                        damage_type_box,
                        enchantment_box,
                        ft.Text("function"),
                        ft.Row(
                            [ft.Text("  "), function_main_box]
                        ),  # ft.Text("  ")は位置合わせ用
                        item_modifier_box,
                        loot_table_box,
                        predicate_box,
                        recipe_box,
                        structure_box,
                        tag_box,
                        ft.Row([ft.Text("  "), tag_block_box]),
                        ft.Row([ft.Text("  "), tag_entity_box]),
                        ft.Row([ft.Text("  "), tag_item_box]),
                        ft.Row([ft.Text("  "), tag_function_box]),
                        trim_material_box,
                        trim_pattern_box,
                        worldgen_box,
                    ]
                ),
                ft.Column(
                    controls=[
                        datapack_name_box,
                        namespace_name_box,
                        mc_ver_box,
                        description_box,
                        ft.TextButton(
                            text="pack.png用の画像を選択",
                            on_click=lambda _: pick_file_dialog.pick_files(
                                allow_multiple=True
                            ),
                        ),
                        ft.TextButton(text="Generate", on_click=generate),
                    ]
                ),
            ],
            alignment=ft.MainAxisAlignment.CENTER,
        )
    )


# 実行
ft.app(target=main)
