---
date: 2016-05-07 21:45:00 -0400
title: "Basic Blocks"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

For our first block, we are going to make a Copper Ore to go along with our Copper Ingot. 

### Base Block
We're going to do something similar to what we did for [Basic Items](/tutorials/forge-modding-19/basic-items/), create a base class for all of our blocks to extend to make our life a bit easier.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.Block;
import net.minecraft.block.material.Material;
import net.minecraft.creativetab.CreativeTabs;
import net.minecraft.item.ItemBlock;
import net.shadowfacts.tutorial.TutorialMod;

public class BlockBase extends Block {

	protected String name;

	public BlockBase(Material material, String name) {
		super(material);

		this.name = name;

		setUnlocalizedName(name);
		setRegistryName(name);
	}

	public void registerItemModel(ItemBlock itemBlock) {
		TutorialMod.proxy.registerItemRenderer(itemBlock, 0, name);
	}

	@Override
	public BlockBase setCreativeTab(CreativeTabs tab) {
		super.setCreativeTab(tab);
		return this;
	}

}
{% endhighlight %}

This is almost exactly the same as our `ItemBase` class except it extends `Block` instead of `Item`. It sets the unlocalized and registry names, has a method to register the item model, and has an overriden version of `Block#setCreativeTab` that returns a `BlockBase`.

We'll also create a `BlockOre` class which extends `BlockBase` to make adding ore's a little easier.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.material.Material;
import net.minecraft.creativetab.CreativeTabs;

public class BlockOre extends BlockBase {

	public BlockOre(String name) {
		super(Material.ROCK, name);

		setHardness(3f);
		setResistance(5f);
	}

	@Override
	public BlockOre setCreativeTab(CreativeTabs tab) {
		super.setCreativeTab(tab);
		return this;
	}

}
{% endhighlight %}

### `ModBlocks`

Now let's create a `ModBlocks` class similar to `ModItems` to assist us when registering blocks.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.Block;
import net.minecraft.creativetab.CreativeTabs;
import net.minecraft.item.ItemBlock;
import net.minecraftforge.fml.common.registry.GameRegistry;

public class ModBlocks {

	public static void init() {
		
	}

	private static <T extends Block> T register(T block, ItemBlock itemBlock) {
		GameRegistry.register(block);
		GameRegistry.register(itemBlock);

		if (block instanceof BlockBase) {
			((BlockBase)block).registerItemModel(itemBlock);
		}

		return block;
	}

	private static <T extends Block> T register(T block) {
		ItemBlock itemBlock = new ItemBlock(block);
		itemBlock.setRegistryName(block.getRegistryName());
		return register(block, itemBlock);
	}

}
{% endhighlight %}

This class is slightly different than our `ModItems` class due to the way blocks work in 1.9. In 1.9, we register the block and the `ItemBlock` separately whereas previously Forge would register the default `ItemBlock` automatically. 

**Brief aside about how `ItemBlock`s work:** The `ItemBlock` for a given block is what is used as the inventory form of a given block. In the game, when you have a piece of Cobblestone in your inventory, you don't actually have on of the Cobblestone blocks in your inventory, you have one of the Cobblestone _`ItemBlock`s_ in your inventory.

Once again, we'll need to update our `preInit` method to call the `init` method of our `ModBlocks` class:

{% highlight java linenos %}
@Mod.EventHandler
public void preInit(FMLPreInitializationEvent event) {
	ModItems.init();
	ModBlocks.init();
}
{% endhighlight %}

### Copper Ore

Now, because we have our `BlockBase` and `ModBlocks` classes in place, we can quickly add a new block:

{% highlight java linenos %}
public static BlockOre oreCopper;

public static void init() {
	oreCopper = register(new BlockOre("oreCopper", "oreCopper").setCreativeTab(CreativeTabs.MATERIALS));
}
{% endhighlight %}

This will:

1. Create a new `BlockOre` with the name `oreCopper`.
2. Sets the creative tab of the block to the Materials tab.
3. Registers the block with the `GameRegistry`.
4. Registers the default `ItemBlock` with the `GameRegistry`.


Now, in the game, we can see our (untextured) copper ore block!

![Copper Ore Screenshot](http://i.imgur.com/uWdmyA5.png)

Next, we'll look at how to make a simple model for our copper ore block.