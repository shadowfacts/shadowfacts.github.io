---
date: 2016-05-07 21:45:00 -0400
title: "Basic Blocks"
type: 'tutorial'
series: 'forge-modding-112'
series-name: 'Making a Forge Mod for 1.12'
layout: tutorial
---

For our first block, we are going to make a Copper Ore to go along with our Copper Ingot. 

### Base Block
We're going to do something similar to what we did for [Basic Items](/tutorials/forge-modding-111/basic-items/), create a base class for all of our blocks to extend to make our life a bit easier.

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
	
	public void registerItemModel(Item itemBlock) {
		TutorialMod.proxy.registerItemRenderer(itemBlock, 0, name);
	}
	
	public Item createItemBlock() {
		return new ItemBlock(this).setRegistryName(getRegistryName());
	}
	
	@Override
	public BlockBase setCreativeTab(CreativeTabs tab) {
		super.setCreativeTab(tab);
		return this;
	}

}
{% endhighlight %}

This is almost exactly the same as our `ItemBase` class except it extends `Block` instead of `Item`. It sets the unlocalized and registry names, has a method to register the item model, and has an overriden version of `Block#setCreativeTab` that returns a `BlockBase`.

The one additional method that `BlockBase` has (`createItemBlock`) is added to make dealing with `ItemBlock`s a bit easier. The `ItemBlock` for a given block is what is used as the inventory form of a given block. In the game, when you have a piece of Cobblestone in your inventory, you don't actually have the Cobblestone block in your inventory, you have the Cobblestone _`ItemBlock`_ in your inventory. We'll be using this method when we register our `ItemBlock`s, just to make dealing with them a bit easier.

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
import net.minecraft.item.Item;
import net.minecraft.item.ItemBlock;
import net.minecraftforge.registries.IForgeRegistry;

public class ModBlocks {

	public static void register(IForgeRegistry<Block> registry) {

	}

	public static void registerItemBlocks(IForgeRegistry<Item> registry) {

	}

	public static void registerModels() {

	}

}
{% endhighlight %}

We'll need to add a new event handler method to our `RegistrationHandler` to call `ModBlocks.register`.

{% highlight java linenos %}
@Mod.EventBusSubscriber
public static class RegistrationHandler {

	@SubscribeEvent
	public static void registerBlocks(RegistryEvent.Register<Block> event) {
		ModBlocks.register(event.getRegistry());
	}
	
	// ...

}
{% endhighlight %}

We'll also need to update the two previously-created `RegistrationHandler` methods to handle registering our `ItemBlock`s and our block models.

{% highlight java linenos %}
@Mod.EventBusSubscriber
public static class RegistrationHandler {

	// ...

	@SubscribeEvent
	public static void registerItems(RegistryEvent.Register<Item> event) {
		ModItems.register(event.getRegistry());
		ModBlocks.registerItemBlocks(event.getRegistry());
	}
	
	@SubscribeEvent
	public static void registerModels(ModelRegistryEvent event) {
		ModItems.registerModels();
		ModBlocks.registerModels();
	}

}
{% endhighlight %}

### Copper Ore

Now, because we have our `BlockBase` and `ModBlocks` classes in place, we can quickly add a new block:

{% highlight java linenos %}
// ...
public class ModBlocks {

	public static BlockOre oreCopper = new BlockOre("ore_copper").setCreativeTab(CreativeTabs.MATERIALS);

	public static void register(IForgeRegistry<Block> registry) {
		registery.registerAll(
				oreCopper
		);
	}
	
	public static void registerItemBlocks(IForgeRegistry<Item> registry) {
		registry.registerAll(
				oreCopper.createItemBlock()
		);
	}
	
	public static void registerModels() {
		oreCopper.registerItemModel(Item.getItemFromBlock(oreCopper));
	}

}
{% endhighlight %}

This will:

1. Create a new `BlockOre` with the name `oreCopper` and set the creative tab to the Materials tab.
2. Registers the block itself with the block registry.
3. Registers the `ItemBlock` with the item registry.
4. Registers the item model.


Now, in the game, we can see our (untextured) copper ore block!

![Copper Ore Screenshot](http://i.imgur.com/uWdmyA5.png)

Next, we'll look at how to make a simple model for our copper ore block.
