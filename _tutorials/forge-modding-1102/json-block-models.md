---
date: 2016-08-08 13:58:00 -0400
title: "JSON Block Models"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

We're going to add a new block that has a custom JSON model (that is, one defined completely by us, not one of Mojang's). 

The first thing we'll need to do is create a block class. We need to create a new class instead of just using the `BlockBase` class because w'll need to override a couple of methods to have the model render properly. Our `BlockPedestal` class will extend our `BlockBase` class so we can use the code we've already written for item model registration.

The two methods we'll be override are `isOpaqueCube` and `isFullCube`. In both of these methods, we'll want to return false from both of these methods in order to change some of the default Minecraft behavior. 

`isOpaqueCube` is used to determine if this block should cull faces of the adjacent block. Since our block doesn't take up the entirety of the 1m^3 cube, we'll want to return `false` so the faces of adjacent blocks can be seen behind our block.

`isFullCube` is used to determine if light should pass through the block. Once again, we'll want to return `false` because our block is less than 1m^3 so we'll want light to propgate through it.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.material.Material;
import net.minecraft.block.state.IBlockState;

public class BlockPedestal extends BlockBase {

	public BlockPedestal() {
		super(Material.ROCK, "pedestal");
	}

	@Override
	@Deprecated
	public boolean isOpaqueCube(IBlockState state) {
		return false;
	}

	@Override
	@Deprecated
	public boolean isFullCube(IBlockState state) {
		return false;
	}

}
{% endhighlight %}

Next, we'll need to register our pedestal block in our `ModBlocks` class.

{% highlight java linenos %}
// ...
public class ModBlocks {
	// ...
	public static void init() {
		// ...
		pedestal = register(new BlockPedestal());
	}
	// ...
}
{% endhighlight %}

Don't forget to add a localization for the pedestal block!

{% highlight properties linenos %}
# Blocks
# ...
tile.pedestal.name=Pedestal
# ...
{% endhighlight %}

Next we'll need to create a blockstate file at `assets/tutorial/blockstates/pedestal.json` that tells Forge which model to use for the normal variant and the inventory variant.

**Note:** See [Basic Forge Blockstates](/tutorials/forge-modding-1102/basic-forge-blockstates/) for more information about the Forge blockstate format.

{% highlight json linenos %}
{
	"forge_marker": 1,
	"variants": {
		"normal": {
			"model": "tutorial:pedestal"
		},
		"inventory": {
			"model": "tutorial:pedestal",
			"transform": "forge:default-block"
		}
	}
}
{% endhighlight %}

Our blockstate file does a couple of things.

1. It instructs Forge to use the model at `assets/tutorial/models/block/pedestal.json` for both the `normal` and `inventory` variants.
2. It uses the `forge:default-block` transformation for the inventory variant. This makes the block appear at the proper angle in the inventory and in the hand.

Now we need to create the Pedestal model itself. The model will be located at `assets/tutorial/models/block/pedestal.json`.

{% highlight json linenos %}
{
	"textures": {
		"pedestal": "blocks/stonebrick",
		"particle": "blocks/stonebrick"
	},
	"elements": [
		{
			"from": [3, 0, 3],
			"to": [13, 11, 13],
			"faces": {
				"down": {
					"uv": [0, 0, 10, 10],
					"texture": "#pedestal",
					"cullface": "down"
				},
				"north": {
					"uv": [0, 0, 10, 11],
					"texture": "#pedestal"
				},
				"south": {
					"uv": [0, 0, 10, 11],
					"texture": "#pedestal"
				},
				"west": {
					"uv": [0, 0, 10, 11],
					"texture": "#pedestal"
				},
				"east": {
					"uv": [0, 0, 10, 11],
					"texture": "#pedestal"
				}
			}
		},
		{
			"from": [2, 11, 2],
			"to": [14, 12, 14],
			"faces": {
				"down": {
					"uv": [0, 0, 12, 12],
					"texture": "#pedestal"
				},
				"north": {
					"uv": [0, 0, 12, 1],
					"texture": "#pedestal"
				},
				"south": {
					"uv": [0, 0, 12, 1],
					"texture": "#pedestal"
				},
				"west": {
					"uv": [0, 0, 12, 1],
					"texture": "#pedestal"
				},
				"east": {
					"uv": [0, 0, 12, 1],
					"texture": "#pedestal"
				}
			}
		},
		{
			"from": [1, 12, 1],
			"to": [15, 13, 15],
			"faces": {
				"down": {
					"uv": [0, 0, 14, 14],
					"texture": "#pedestal"
				},
				"up": {
					"uv": [0, 0, 14, 14],
					"texture": "#pedestal"
				},
				"north": {
					"uv": [0, 0, 14, 1],
					"texture": "#pedestal"
				},
				"south": {
					"uv": [0, 0, 14, 1],
					"texture": "#pedestal"
				},
				"west": {
					"uv": [0, 0, 14, 1],
					"texture": "#pedestal"
				},
				"east": {
					"uv": [0, 0, 14, 1],
					"texture": "#pedestal"
				}
			}
		}
	]
}
{% endhighlight %}

The model has two primary parts, the `textures` and the `elements`. 

The `textures` section contains a map of texture name to the location of the texture itself. We define the `pedestal` texture as `blocks/stonebrick` and then reference it using `#pedestal` in the face `texture` attribute. (The `particle` texture is used by Minecraft to generate the block breaking particle.)

The `elements` section is an array of the elements in the model.

Each element has 3 properties:

1. `from`: This is the bottom/left/backmost point of the element.
2. `to`: This is the top/right/frontmost point of the elemnt. With the `from` property, this is used to determine the size of the element.
3. `faces`: This is an object containg a map of directions to faces. All the faces are optional. 

Each face has several properties:

1. `texture`: This is the texture to use for the face. This can be a reference to a predefined texture (e.g. `#pedestal`) or a direct reference (e.g. `blocks/stonebrick`).
2. `uv`: This is an array of 4 integer elements representing the minimum U, mimumin V, maximum U, and maximum V (in that order).
3. `cullface`: This is optional. If specified, this face will be culled if there is a solid block against the specified face of the block.

![Finished Pedestal Model](http://i.imgur.com/Axt5iiE.png)