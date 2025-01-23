export const generateDatapack = (minecraftVersion, craftingRecipe, craftingName, rawTags) => {
    const generatedTags = generateTags(rawTags)

    const isAfter121 = compareMinecraftVersions(minecraftVersion, '1.21') <= 0
    const path = isAfter121 ? 'data/crafting/recipe/' : 'data/crafting/recipes/'

    let zip = new JSZip()
    // add the pack file
    zip.file('pack.mcmeta', JSON.stringify({
        pack: {
            pack_format: getPackFormat(minecraftVersion),
            description: 'Generated with TheDestruc7i0n\'s Crafting Generator: https://crafting.thedestruc7i0n.ca'
        }
    }))
    // add the crafting recipe
    zip.file(path + craftingName, JSON.stringify(craftingRecipe, null, 4))
    // add all the tags
    generatedTags.forEach(({ namespace, name, data }) => {
        zip.file(`data/${namespace}/tags/items/${name}.json`, JSON.stringify(data, null, 4))
    })
    // generate and download
    zip.generateAsync({ type: 'blob' })
        .then((content) => saveAs(content, 'datapack.zip'))
}




