---
date: 2016-06-30 10:49:00 -0400
title: "Crafting/Smelting Recipes"
type: 'tutorial'
series: 'forge-modding-1112'
series-name: 'Making a Forge Mod for 1.11.2'
layout: tutorial
---

## Setup
Before we implement any recipes, we'll create a little class in which we'll register all of our recipes. We'll call this class `ModRecipes`, following the same convention as our `ModItems` and `ModBlocks` classes. We'll put this into the `recipe` package inside our main package so once when we implement more complex custom recipes, we'll  have a place to group them together.

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

## Crafting Recipes
There are two kinds of crafting recipes: shaped recipes and shapeless recipes. 

In a shapeless recipe, the ingredients can be placed in any arrangement on the crafting grid. An example of a shapeless recipe is the [Pumpkin Pie recipe](http://minecraft.gamepedia.com/Pumpkin_Pie#Crafting).

Shaped recipes require their ingredients to be placed in a specific arrangement. An example of a shaped recipe is the [Cake recipe](http://minecraft.gamepedia.com/Cake#Crafting).

## Shapeless Recipe
Our shapeless recipe is going to be a simple recipe that lets people craft 1 corn into 1 corn seed. All this requires is 1 line in `ModRecipes`.

{% highlight java linenos %}
public static void init() {
	GameRegistry.addShapelessRecipe(new ItemStack(ModItems.cornSeed), ModItems.corn);
}
{% endhighlight %}

`GameRegistry.addShapelessRecipe` does exactly as the name says, it registers a shapeless recipe. The first argument is an `ItemStack` that is the output of the recipe, in this case a corn seed. The second argument is a varargs array of `Object`s that can be `Item`s, `Block`s, or `ItemStack`s.

![Shapeless Recipe](http://i.imgur.com/tFZdyK3.png)

## Shaped Recipe
Our shaped recipe is going to be an additional recipe for Rabbit Stew that accepts corn instead of carrots. This requires a call to `GameRegistry.addShapedRecipe` which, you guessed it, registers a shaped recipe.

{% highlight java linenos %}
public static void init() {
	// ...
	GameRegistry.addShapedRecipe(new ItemStack(Items.RABBIT_STEW), " R ", "CPM", " B ", 'R', Items.COOKED_RABBIT, 'C', ModItems.corn, 'P', Items.BAKED_POTATO, 'M', Blocks.BROWN_MUSHROOM, 'B', Items.BOWL);
}
{% endhighlight %}

The first argument to `GameRegistry.addShapedRecipe` is an `ItemStack` that is the output of the recipe. The next arguments should be anywhere from 1 to 3 `String` arguments that determine the pattern of the recipe. A space in a pattern string represents an empty slot and each character represents an item/block/stack specified by the following arguments. The remaining arguments should be pairs of characters and `Item`/`Block`/`ItemStack`. The character should be the same (including case) as used in the pattern strings. The item/block/stack should be what is used for the instances of that character in the pattern.

Our finished recipe looks like this:

![Shaped Recipe](http://i.imgur.com/KaatGDN.png)

## Smelting Recipe
Our furnace recipe is going to be a simple 1 Copper Ore to 1 Copper Ingot recipe. All this requires is 1 call to `GameRegistry.addSmelting`

{% highlight java linenos %}
public static void init() {
	// ...
	GameRegistry.addSmelting(ModBlocks.oreCopper, new ItemStack(ModItems.ingotCopper), 0.7f);
}
{% endhighlight %}

`GameRegistry.addSmelting` takes 3 parameters, the item/block/stack input, the `ItemStack` output, and the amount of experience to be given to the player (per smelt).

![Smelting Recipe](http://i.imgur.com/aU1ZiqG.png)