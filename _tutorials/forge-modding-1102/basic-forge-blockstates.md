---
date: 2016-05-07 21:45:00 -0400
title: "Forge Blockstates"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

Now that we've got our copper ore block, let's add a simple blockstate to give it a texture. This will go in a file at `src/main/resources/assets/tutorial/blockstates/oreCopper.json`.

{% highlight json linenos %}
{
	"forge_marker": 1,
	"defaults": {
		"textures": {
			"all": "tutorial:blocks/oreCopper"
		}
	},
	"variants": {
		"normal": {
			"model": "cube_all"
		},
		"inventory": {
			"model": "cube_all"
		}
	}
}
{% endhighlight %}

- `forge_marker` (L2): This tells Forge to use its custom blockstate parser instead of Minecraft's which isn't as good. (See [here](https://mcforge.readthedocs.io/en/latest/blockstates/forgeBlockstates/) for more info about Forge's blockstate format)
- `defaults` (L3-L7): Defaults are things to apply for all variants, a feature added by Forge's blockstate format.
- `textures` (L4-L6): This specifies which textures to use for the `cube_all` model. This uses the same texture format as explained in the [JSON Item Models](https://shadowfacts.net/tutorials/forge-modding-1102/json-item-models/) tutorial.
- `variants` (L8-L15): Inside of this block are where all of our individual variants go. Because we don't have any custom block properties, we have the `normal` variant which is the normal, in-world variant. The `inventory` variant is used when rendering our item in inventory and in the player's hand.
- `"model": "cube_all"` (L10 & L13): This uses the `cube_all` model for both variants. This is a simple model included in Minecraft which uses the same `#all` texture for every side of the block. We can't include this in the `defaults` block because Forge expects there to be at least one thing in each variant block.

Now, we just need to download the [copper ore texture](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/blocks/oreCopper.png) to `src/main/resources/assets/tutorial/textures/blocks/oreCopper.png` and we're all set!

![Textured Copper Ore Screenshot](http://i.imgur.com/wJ1iJUg.png)