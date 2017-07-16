---
date: 2016-05-29 10:29:00 -0400
title: "Crops"
type: 'tutorial'
series: 'forge-modding-112'
series-name: 'Making a Forge Mod for 1.12'
layout: tutorial
---

We're going to be creating a corn crop, and code-wise, it will be divided into three main parts:

1. The crop block (corn crop)
2. The seed item (corn seed)
3. The food item (corn)

We're going to create these one at a time. At the intermediate stages, our code will contain errors because we are referencing things we haven't created yet, but everything should be fine at the end.

### Corn Crop
Let's create a class called `BlockCropCorn` that extends Minecraft's `BlockCrops`. The crop block won't have an `ItemBlock` and therefore won't have an item model, so this class won't provide `createItemBlock` or `registerItemModel` methods.

In this class, we'll need to override 2 methods to return our own items instead of the vanilla ones. `getSeed` should return `ModItems.cornSeed` and `getCrop` should return `ModItems.corn`.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.BlockCrops;
import net.minecraft.item.Item;
import net.shadowfacts.tutorial.item.ModItems;

public class BlockCropCorn extends BlockCrops {

	public BlockCropCorn() {
		setUnlocalizedName("crop_corn");
		setRegistryName("crop_corn");
	}
	
	@Override
	protected Item getSeed() {
		return ModItems.cornSeed;
	}
	
	@Override
	protected Item getCrop() {
		return ModItems.corn;
	}

}
{% endhighlight %}

Minecraft will use the seed and crop we specified to determine what to drop when our crop block is broken. Let's register our block in the `ModBlocks` class:

{% highlight java linenos %}
// ...
public static BlockCropCorn cropCorn = new BlockCropCorn();

public static register(IForgeRegistry<Block> registry) {
	registry.registerAll(
			// ...
			cropCorn
	);
}
// ...
{% endhighlight %}

The last thing we'll need to do is create a model. Download the textures from [here](https://github.com/shadowfacts/TutorialMod/tree/1.12/src/main/resources/assets/tutorial/textures/blocks/corn/) and save them into `src/main/resources/assets/tutorial/textures/blocks/corn/` and have there filenames the `0.png` through `7.png`.

Let's create a blockstate for our crop. Create `src/main/resources/assets/tutorial/blockstates/crop_corn.json`. We're once again going to be using the Forge blockstates format because this is a fairly complicated blockstate.

{% highlight json linenos %}
{
	"forge_marker": 1,
	"defaults": {
		"model": "cross"
	},
	"variants": {
		"age": {
			"0": {
				"textures": {
					"cross": "tutorial:blocks/corn/0"
				}
			},
			"1": {
				"textures": {
					"cross": "tutorial:blocks/corn/1"
				}
			},
			"2": {
				"textures": {
					"cross": "tutorial:blocks/corn/2"
				}
			},
			"3": {
				"textures": {
					"cross": "tutorial:blocks/corn/3"
				}
			},
			"4": {
				"textures": {
					"cross": "tutorial:blocks/corn/4"
				}
			},
			"5": {
				"textures": {
					"cross": "tutorial:blocks/corn/5"
				}
			},
			"6": {
				"textures": {
					"cross": "tutorial:blocks/corn/6"
				}
			},
			"7": {
				"textures": {
					"cross": "tutorial:blocks/corn/7"
				}
			}
		}
	}
}
{% endhighlight %}

The `model` specified in the `defaults` section is Minecraft's `cross` model which is just the same texture rendered twice. You can see what this model looks like by looking at the various flowers in vanilla.

The `age` property is the age of the crop. All the objects inside the `age` object are for one value of the property. In our case, `age` can have a value 0 through 7 so we'll need separate JSON objects for each of those. For each value of age, we'll have a different texture that is specified in the `textures` object with the name `cross`.

### Corn Seed
Now let's make our corn seed item. Create a new class called `ItemCornSeed` that extends `ItemSeeds`.

In our constructor, we'll need to pass a couple of things to the `ItemSeeds` constructor, `ModBlocks.cropCorn` and `Blocks.FARMLAND`. The first parameter of the `ItemSeeds` constructor is the crop block and the second is the soil block. Since this item will have an item model, we'll also create a `registerItemModel` method which will just use our `registerItemRenderer` proxy method.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item;

import net.minecraft.init.Blocks;
import net.minecraft.item.Item;
import net.minecraft.item.ItemSeeds;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.block.ModBlocks;

public class ItemCornSeed extends ItemSeeds implements ItemModelProvider {

	public ItemCornSeed() {
		super(ModBlocks.cropCorn, Blocks.FARMLAND);
		setUnlocalizedName("corn_seed");
		setRegistryName("corn_seed");
	}
	
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(item, 0, "corn_seed");
	}

}
{% endhighlight %}

Let's also update our `ModItems` class to register our corn seed and its item model.

{% highlight java linenos %}
// ...
public static ItemCornSeed cornSeed = new ItemCornSeed();

public static void register(IForgeRegistry<Item> registry) {
	registry.registerAll(
			// ...
			corn
	);
}

public static void registerModels() {
	// ...
	corn.registerItemModel();
}
// ...
{% endhighlight %}

Lastly, we'll create a simple JSON model for the corn seed. First you'll want to download the texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.12/src/main/resources/assets/tutorial/textures/items/corn_seed.png) and save it to `src/main/resources/assets/tutorial/textures/items/corn_seed.png`. Now create a JSON file in the `models/item` folder called `corn_seed.json`. This model with be fairly similar to our copper ingot model, it will just have a parent of `item/generated` and a layer 0 texture of `tutorial:items/corn_seed`.

{% highlight json linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/corn_seed"
	}
}
{% endhighlight %}

### Corn Item
For now, our corn item is going to be a simple instance of our `ItemBase` class which means you won't be able to eat it (yet!). Let's add our corn item to our `ModItems` class.

{% highlight java linenos %}
// ...
public static ItemBase corn = new ItemBase("corn").setCreativeTab(CreativeTabs.FOOD);

public static void register(IForgeRegistry<Item> registry) {
	registry.registerAll(
			// ...
			corn
	);
}

public static void registerModels() {
	// ...
	corn.registerItemModel();
}
// ...
{% endhighlight %}

Now let's also make a simple model for our corn item. Download the texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.12/src/main/resources/assets/tutorial/textures/items/corn.png) and save it as `corn.png` in the `textures/items` folder. Now let's create a `corn.json` file for our model. This model will also be very simple, with a parent of `item/generated` and a layer 0 texture of `tutorial:items/corn`.

{% highlight json linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/corn"
	}
}
{% endhighlight %}


### Localization
Now let's quickly add localization for new items:

{% highlight properties linenos %}
# ...
item.corn.name=Corn
item.corn_seed.name=Corn Seed
# ...
{% endhighlight %}

### Finished
Now, you should be able to launch game from inside the IDE and see our corn seed in the materials creative tab, plant it, grow it with bone meal, and break it to get corn and more seeds.

![Corn Screenshot](http://i.imgur.com/1G1k8Sh.png)