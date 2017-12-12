---
date: 2016-05-29 10:29:00 -0400
title: "Crops"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

## Preparation

Before we get started making our corn crop, we'll need to make a couple of changes to the base item/block infrastructure we've already created. Specifically what we need to change has to do with item models. Currently, `BlockBase` and `ItemBase` have their own `registerItemModel` methods. We're going to move this into the `ItemModelProvider` interface so that blocks and items we create that don't extend `BlockBase` or `ItemBase` can still use our system for registering item models.

Create a new `ItemModelProvider` interface and add one method to it:
{% highlight java linenos %}
package net.shadowfacts.tutorial.item;

import net.minecraft.item.Item;

public interface ItemModelProvider {

	void registerItemModel(Item item);

}
{% endhighlight %}

This interface functions exactly the same as the `registerItemModel` methods in `BlockBase` and `ItemBase`.

Next, we'll change `BlockBase` to implement `ItemModelProvider`. Just add the `implements ItemModelProvider` after the class declaration, change the `reigsterItemModel` method to accept an `Item` instead of an `ItemBlock` and add `@Override` to the `registerItemModel` method.

We'll repeat a similar process for `ItemBase`. Add `implements ItemModelProvider`, change `registerItemModel` to accept an `Item`, and add `@Override` to it.

Now that we've changed our `BlockBase` and `ItemBase` classes, we'll need to make some changes to our `ModItems` and `ModBlocks` classes to ensure that `ItemModelProvider#registerItemModel` is called even if the block or item isn't a subclass of our block or item base classes.

In `ModBlocks`, simply change `block instanceof BlockBase` to `block instanceof ItemModelProvider` and change the cast from `BlockBase` to `ItemModelProvider`. Do the same for the `ModItems` class, replacing `ItemBase` with `ItemModelProvider` in the appropriate section of the code.

Due to the way we are going to implement our crop, we'll need to make another modification to our `ModBlocks` class. Before we make this modification, let me explain why it's necessary.

Our crop is going to have 3 important parts:

1. The crop block
2. The seed item
3. The food item

Because we have a separate seed item, the crop block won't have an `ItemBlock` to go along with it.

In our `register(T block, ItemBlock itemBlock)` method, we'll need to add a null check to `itemBlock` so we don't attempt to register `itemBlock` if it's null.

Lastly, we'll need to make one change in our main `TutorialMod` class. Due to the way Minecraft's `ItemSeed` works, our blocks need to be initialized before we can call the constructor of our seed. Simply move the `ModItems.init` call in `TutorialMod.preInit` to after the `ModBlocks.init` call.

## Crop
The crop we are going to create will be corn.

As I mentioned before, our crop will be divided into 3 main parts:

1. The crop block (corn crop)
2. The seed item (corn seed)
3. The food item (corn)

We're going to create these one at a time. At the intermediate stages, our code will contain errors because we are referencing things we haven't created yet, but everything should be fine at the end.

### Corn Crop
Let's create a class called `BlockCropCorn` that extends Minecraft's `BlockCrops`. The crop block won't have an `ItemBlock` so this class won't implement `ItemModelProvider` and it is why we need that null check in `ModBlocks.register`.

In this class, we'll need to override 2 methods to return our own items instead of the vanilla ones. `getSeed` should return `ModItems.cornSeed` and `getCrop` should return `ModItems.corn`.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.BlockCrops;
import net.minecraft.item.Item;
import net.shadowfacts.tutorial.item.ModItems;

public class BlockCropCorn extends BlockCrops {

	public BlockCropCorn() {
		setUnlocalizedName("cropCorn");
		setRegistryName("cropCorn");
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
public static BlockCropCorn cropCorn;

public static init() {
	// ...
	cropCorn = register(new BlockCropCorn(), null);
}
// ...
{% endhighlight %}

The last thing we'll need to do is create a model. Download the textures from [here](https://github.com/shadowfacts/TutorialMod/tree/master/src/main/resources/assets/tutorial/textures/blocks/corn/) and save them into `src/main/resources/assets/tutorial/textures/blocks/corn/` and have there filenames the `0.png` through `7.png`.

Let's create a blockstate for our crop. Create `src/main/resources/assets/tutorial/blockstates/cropCorn.json`. We're once again going to be using the Forge blockstates format because this is a fairly complicated blockstate.

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
Now let's make our corn seed item. Create a new class called `ItemCornSeed` that extends `ItemSeeds` and implements `ItemModelProvider`.

In our constructor, we'll need to pass a couple of things to the `ItemSeeds` constructor, `ModBlocks.cropCorn` and `Blocks.FARMLAND`. The first parameter of the `ItemSeeds` constructor is the crop block and the second is the soil block. Since we implemented `ItemModelProvider`, we'll need to provide an implementation for `registerItemModel` which will just use our `registerItemRenderer` proxy method.

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
		setUnlocalizedName("cornSeed");
		setRegistryName("cornSeed");
	}

	@Override
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(item, 0, "cornSeed");
	}

}
{% endhighlight %}

Let's register our corn seed in `ModItems`.

{% highlight java linenos %}
// ...
public static ItemCornSeed cornSeed;

public static void init() {
	// ...
	cornSeed = register(new ItemCornSeed());
}
// ...
{% endhighlight %}

Lastly, we'll create a simple JSON model for the corn seed. First you'll want to download the texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.10.2/src/main/resources/assets/tutorial/textures/items/cornSeed.png) and save it to `src/main/resources/assets/tutorial/textures/items/cornSeed.png`. Now create a JSON file in the `models/item` folder called `cornSeed.json`. This model with be fairly similar to our copper ingot model, it will just have a parent of `item/generated` and a layer 0 texture of `tutorial:items/cornSeed`.

{% highlight json linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/cornSeed"
	}
}
{% endhighlight %}

### Corn Item
For now, our corn item is going to be a simple instance of our `ItemBase` class which means you won't be able to eat it (yet!). Let's add our corn item to our `ModItems` class.

{% highlight java linenos %}
// ...
public static ItemBase corn;

public static void init() {
	// ...
	corn = register(new ItemBase("corn").setCreativeTab(CreativeTabs.FOOD));
}
// ...
{% endhighlight %}

Now let's also make a simple model for our corn item. Download the texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.10.2/src/main/resources/assets/tutorial/textures/items/corn.png) and save it as `corn.png` in the `textures/items` folder. Now let's create a `corn.json` file for our model. This model will also be very simple, with a parent of `item/generated` and a layer 0 texture of `tutorial:items/corn`.

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
item.cornSeed.name=Corn Seed
# ...
{% endhighlight %}

### Finished
Now, you should be able to launch game from inside the IDE and see our corn seed in the materials creative tab, plant it, grow it with bone meal, and break it to get corn and more seeds.

![Corn Screenshot](http://i.imgur.com/1G1k8Sh.png)