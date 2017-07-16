---
date: 2016-06-30 10:49:00 -0400
title: "Crafting Recipes"
type: 'tutorial'
series: 'forge-modding-112'
series-name: 'Making a Forge Mod for 1.12'
layout: tutorial
---

## Crafting Recipes
There are two kinds of crafting recipes: shaped recipes and shapeless recipes. 

In a shapeless recipe, the ingredients can be placed in any arrangement on the crafting grid. An example of a shapeless recipe is the [Pumpkin Pie recipe](http://minecraft.gamepedia.com/Pumpkin_Pie#Crafting).

Shaped recipes require their ingredients to be placed in a specific arrangement. An example of a shaped recipe is the [Cake recipe](http://minecraft.gamepedia.com/Cake#Crafting).

## Shapeless Recipe
Our shapeless recipe is going to be a simple recipe that lets people craft 1 corn into 1 corn seed. To add this, we'll create a JSON file in the `recipes` subfolder of our mod assets folder called `corn_seed.json`. (The full path from the project root should be `src/main/resources/assets/tutorial/recipes/corn_seed.json`.)

Inside the root object of the file, we'll have a couple of things: the recipe type, the recipe's ingredients, and the recipe's output. The type will be `minecraft:crafting_shapeless`, meaning it's a crafting recipe and it's of the shapeless variety. The sole ingredient will be one of our Corn items, and the output will be one of our Corn Seeds.

{% highlight json linenos %}
{
	"type": "minecraft:crafting_shapeless",
	"ingredients": [
		{
			"item": "tutorial:corn"
		}
	],
	"result": {
		"item": "tutorial:corn_seed"
	}
}
{% endhighlight %}

Each object in the `ingredients` array and the `results` object represent items. The `item` key in the object should have a value that is the registry name of our item, including our mod ID. For the Corn item, this is `tutorial:corn` and for the Corn Seed this is `tutorial:corn_seed`.

![Shapeless Recipe](http://i.imgur.com/tFZdyK3.png)

## Shaped Recipe
Our shaped recipe is going to be an additional recipe for Rabbit Stew that accepts corn instead of carrots. We'll create another JSON file in the same folder as before, this time called `rabbit_stew.json`.

In this case, the type will be `minecraft:crafting_shaped` and the result will be the `minecraft:rabbit_stew` item, but the ingredients part of the recipe will be a bit different.

In order to avoid very repetitive code, shaped recipe inputs are defined by a pattern and a key. The pattern is an array of up to three strings, each of which can be up to three characters long. Each string in the array represents the row in the crafting grid corresponding to its index in the array, and each character in the string corresponds to the slot at the string's row and at the column corresponding to its index in the string. The key is an object mapping each character in the pattern to an input ingredient. (The space character is already defined by Minecraft to mean an empty slot.)

{% highlight json linenos %}
{
	"type": "minecraft:crafting_shaped",
	"pattern": [
		" R ",
		"CPM",
		" B "
	],
	"key": {
		"R": {
			"item": "minecraft:cooked_rabbit"
		},
		"C": {
			"item": "tutorial:corn"
		},
		"P": {
			"item": "minecraft:baked_potato"
		},
		"M": {
			"item": "minecraft:brown_mushroom"
		},
		"B": {
			"item": "minecraft:bowl"
		}
	},
	"result": {
		"item": "minecraft:rabbit_stew"
	}
}
{% endhighlight %}

Our finished recipe looks like this:

![Shaped Recipe](http://i.imgur.com/KaatGDN.png)
