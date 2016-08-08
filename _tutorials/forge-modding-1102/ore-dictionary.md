---
date: 2016-08-08 11:28:00 -0400
title: "Ore Dictionary"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

Forge's Ore Dictionary system provides an API that modders can use to mark items/blocks as equivalent to one another. This was originally created because multiple mods were all adding their own versions of the same ores and ingots (copper, tin, etc.). The way this system works is each `ItemStack` as a list of `String` ore names associated with it.

Let's create an `ItemOreDict` interface in the `item` package of our mod. This interface will be used to mark our items/blocks to be registered with the Ore Dictionary. This interface will have a single abstract method called `initOreDict` that performs the registration.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item;

public interface ItemOreDict {
	
	void initOreDict();

}
{% endhighlight %}

We'll also create a `ItemOre` class that extends `ItemBase` and implements `ItemOreDict` to give us a nice fully implemented class for ore-dictionaried items.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item;

import net.minecraftforge.oredict.OreDictionary;

public class ItemOre extends ItemBase implements ItemOreDict {

	private String oreName;

	public ItemOre(String name, String oreName) {
		super(name);

		this.oreName = oreName;
	}

	@Override
	public void initOreDict() {
		OreDictionary.registerOre(oreName, this);
	}

}
{% endhighlight %}

This class simply takes a second `String` parameter in its constructor that is the ore-dictionary name and then uses that in the `initOreDict` method.

We'll do something similar for our `BlockOre` class, that is, have it implement `ItemOreDict` and `initOreDict` and have a second parameter for the ore dictionary name.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.material.Material;
import net.minecraft.creativetab.CreativeTabs;
import net.minecraftforge.oredict.OreDictionary;
import net.shadowfacts.tutorial.item.ItemOreDict;

public class BlockOre extends BlockBase implements ItemOreDict {

	private String oreName;

	public BlockOre(String name, String oreName) {
		super(Material.ROCK, name);

		this.oreName = oreName;

		setHardness(3f);
		setResistance(5f);
	}

	@Override
	public void initOreDict() {
		OreDictionary.registerOre(oreName, this);
	}

	@Override
	public BlockOre setCreativeTab(CreativeTabs tab) {
		super.setCreativeTab(tab);
		return this;
	}

}
{% endhighlight %}

We'll need to make some changes to our `ModItems` and `ModBlocks` classes so they call the `initOreDict` method after the item/block is registered with the `GameRegistry`.

We'll first check if the item implements our `ItemOreDict` interface (because not all our items will use the Ore Dictionary) and if so, call the `initOreDict` method on it.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...

	private static <T extends Item> T register(T item) {
		GameRegistry.register(item);

		if (item instanceof ItemModelProvider) {
			((ItemModelProvider)item).registerItemModel(item);
		}
		if (item instanceof ItemOreDict) {
			((ItemOreDict)item).initOreDict();
		}

		return item;
	}
}
{% endhighlight %}

We'll do this similarly in the `ModBlocks` class excpet we'll check `instanceof ItemOreDict` and call `initOreDict` on both the block itself and the associated `ItemBlock`.

{% highlight java linenos %}
// ...
public class ModBlocks {
	// ...

	private static <T extends Block> T register(T block, ItemBlock itemBlock) {
		GameRegistry.register(block);
		if (itemBlock != null) {
			GameRegistry.register(itemBlock);

			if (block instanceof ItemModelProvider) {
				((ItemModelProvider)block).registerItemModel(itemBlock);
			}
			if (block instanceof ItemOreDict) {
				((ItemOreDict)block).initOreDict();
			}
			if (itemBlock instanceof ItemOreDict) {
				((ItemOreDict)itemBlock).initOreDict();
			}
		}
	}
}
{% endhighlight %}

Now that we've got all our base classes setup, we're going to modify some of our items and blocks to given the ore dictionary names!

The only block that will have an ore dictionary name is the Copper Ore block. Following with the conventions for ore dictionary names (if you look in the `OreDictionary` class, you can get a general idea for what these conventions are), our Copper Ore block will have an ore dictionary name of `oreCopper`.

We'll simply change our registration call for the Copper Ore block to have a second parameter that is also `"oreCopper"`, telling the `BlockOre` class to use `oreCopper` as the ore dictionary name for that block.

{% highlight java linenos %}
// ...
public class ModBlocks {
	// ...
	public static void init() {
		oreCopper = register(new BlockOre("oreCopper", "oreCopper"));
		// ...
	}
}
{% endhighlight %}

We'll now change both our Copper Ingot and Corn items to have ore dictionary names `ingotCopper` and `cropCorn` respectively. All this requires is changing the `ItemBase` instantiations to `ItemOre` instantiations and passing in the desired ore dictionary name as the second constructor parameter.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...
	public static void init() {
		ingotCopper = register(new ItemOre("ingotCopper", "ingotCopper"));
		corn = register(new ItemOre("corn", "cropCorn"));
		// ...
	}
}
{% endhighlight %}

## Recipes
Now that we've got ore dictionary names for some of our items and blocks, let's add recipes that utilize them. Forge adds the `ShapedOreRecipe` and `ShapelessOreRecipe` classes that are identical to the vanilla shaped and shapless recipes, except instead of just accepting an item/block/stack for the input, they can also accept a string of an ore dictionary name that will match anything with that given name.

These recipes need to be instantiated manually and registered using `GameRegistry.addRecipe` unlike normal shaped/shapeless recipes which have convienience methods in `GameRegistry`.

{% highlight java linenos %}
// ...
public class ModRecipes {
	
	public static void init() {
		// ...
		GameRegistry.addRecipe(new ShapedOreRecipe(Items.BUCKET, "I I", " I ", 'I', "ingotCopper"));

		// ...
	}

}
{% endhighlight %}

This recipe is the same as the vanilla bucket recipe, except it matches any item with the `ingotCopper` ore dictionary name instead of just iron ingots.

![Shaped Ore Recipe](http://i.imgur.com/OICDDTJ.png)