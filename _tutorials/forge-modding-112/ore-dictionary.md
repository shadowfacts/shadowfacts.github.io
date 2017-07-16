---
date: 2016-08-08 11:28:00 -0400
title: "Ore Dictionary"
type: 'tutorial'
series: 'forge-modding-112'
series-name: 'Making a Forge Mod for 1.12'
layout: tutorial
---

Forge's Ore Dictionary system provides an API that modders can use to mark items/blocks as equivalent to one another. This was originally created because multiple mods were all adding their own versions of the same ores and ingots (copper, tin, etc.). The way this system works is each `ItemStack` as a list of `String` ore names associated with it.

Let's create a `ItemOre` class that extends `ItemBase` and has a `initOreDict` method for handling Ore Dictionary registration. This will give us a nice fully implemented class for ore-dictionaried items.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item;

import net.minecraftforge.oredict.OreDictionary;

public class ItemOre extends ItemBase {

	private String oreName;

	public ItemOre(String name, String oreName) {
		super(name);
	
		this.oreName = oreName;
	}
	
	public void initOreDict() {
		OreDictionary.registerOre(oreName, this);
	}

}
{% endhighlight %}

This class simply takes a second `String` parameter in its constructor that is the ore-dictionary name and then uses that in the `initOreDict` method.

We'll also update our `BlockOre` class to provide a similar `initOreDict` method.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.material.Material;
import net.minecraft.creativetab.CreativeTabs;
import net.minecraftforge.oredict.OreDictionary;

public class BlockOre extends BlockBase {

	private String oreName;

	public BlockOre(String name, String oreName) {
		super(Material.ROCK, name);
	
		this.oreName = oreName;
	
		setHardness(3f);
		setResistance(5f);
	}
	
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

Now that we've got all our base classes setup, we're going to modify some of our items and blocks to given the ore dictionary names!

The only block that will have an ore dictionary name is the Copper Ore block. Following with the conventions for ore dictionary names (if you look in the `OreDictionary` class, you can get a general idea for what these conventions are), our Copper Ore block will have an ore dictionary name of `oreCopper`.

We'll simply change our registration call for the Copper Ore block to have a second parameter that is also `"oreCopper"`, telling the `BlockOre` class to use `oreCopper` as the ore dictionary name for that block.

{% highlight java linenos %}
// ...
public class ModBlocks {
	// ...
	public static BlockOre oreCopper = new BlockOre("ore_copper", "oreCopper");
	// ...
}
{% endhighlight %}

We'll now change both our Copper Ingot and Corn items to have ore dictionary names `ingotCopper` and `cropCorn` respectively. All this requires is changing the `ItemBase` instantiations to `ItemOre` instantiations and passing in the desired ore dictionary name as the second constructor parameter.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...
	public static ItemOre ingotCopper = new ItemOre("ingot_copper", "ingotCopper");
	public static ItemOre corn = new ItemOre("corn", "cropCorn");
	// ...
}
{% endhighlight %}

Lastly, we'll update our `ModRecipes` class to call the various `initOreDict` methods.

{% highlight java linenos %}
// ...
public class ModRecipes {

	public static void init() {
		// Ore Dict
		ModBlocks.oreCopper.initOreDict();
		ModItems.ingotCopper.initOreDict();
		ModItems.corn.initOreDict();
	
		// ...
	}

}
{% endhighlight %}

## Recipes
Now that we've got ore dictionary names for some of our items and blocks, let's add recipes that utilize them. Forge provides two new recipe types specifically for use with Ore Dictionary inputs: `forge:ore_shaped` and `forge:ore_shapeless`. 

We'll create a new file in the `recipes` subfolder of our assets folder called `bucket.json`. In the root object, there will be a couple properties similar to the other shaped recipe we added. This time, the recipe type will be `forge:ore_shaped`, the pattern will be the bucket pattern, the result item will be `minecraft:bucket`, and the input ingredient will be a bit different so that it uses the ore dictionary.

Instead of only specifying an `item` parameter for the ingredient, we'll specify the `type` as `forge:ore_dict`, so the Ore Dictionary ingredient is used, and we'll specify the `ore` as `ingotCopper`, so that any copper ingot is accepted.

{% highlight json linenos %}
{
	"type": "forge:ore_shaped",
	"pattern": [
		"I I",
		" I "
	],
	"key": {
		"I": {
			"type": "forge:ore_dict",
			"ore": "ingotCopper"
		}
	},
	"result": {
		"item": "minecraft:bucket"
	}
}
{% endhighlight %}

![Shaped Ore Recipe](http://i.imgur.com/OICDDTJ.png)