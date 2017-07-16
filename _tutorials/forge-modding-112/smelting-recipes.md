---
date: 2016-06-30 10:49:42 -0400
title: "Smelting Recipes"
type: 'tutorial'
series: 'forge-modding-112'
series-name: 'Making a Forge Mod for 1.12'
layout: tutorial
---

## Setup
Before we implement any smelting recipes, we'll create a little class in which we'll use to register them. We'll call this class `ModRecipes`, following the same convention as our `ModItems` and `ModBlocks` classes. We'll put this into the `recipe` package inside our main package so if we have to implement more complex custom recipes, we'll have a place to group them together.

You'll want an empty `init` static method in `ModRecipes` which is where we'll register our recipes in just a moment.

{% highlight java linenos %}
package net.shadowfacts.tutorial.recipe;

public class ModRecipes {
	
	public static void init() {

	}

}
{% endhighlight %}

The `ModRecipes.init` method should be called from `TutorialMod#init`. The init method is called during the initialization phase which occurs after the pre-initialization phase. We want to register our recipes here instead of in the pre-init or post-init phases because all mod items/blocks (including those from other mods) should be registered at this point.

{% highlight java linenos %}
// ...
public class TutorialMod {
	// ...
	@Mod.EventHandler
	public void init(FMLInitializationEvent event) {
		ModRecipes.init();
	}
	// ...
}
{% endhighlight %}

## Smelting Recipe
The furnace recipe we'll add is going to be a simple 1 Copper Ore to 1 Copper Ingot recipe. All this requires is 1 call to `GameRegistry.addSmelting` in our `ModRecipes.init` method:

{% highlight java linenos %}
public static void init() {
	GameRegistry.addSmelting(ModBlocks.oreCopper, new ItemStack(ModItems.ingotCopper), 0.7f);
}
{% endhighlight %}

`GameRegistry.addSmelting` takes 3 parameters, the item/block/stack input, the `ItemStack` output, and the amount of experience to be given to the player (per smelt).

![Smelting Recipe](http://i.imgur.com/aU1ZiqG.png)