---
date: 2016-08-14 15:04:00 -0400
title: "Tools"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

Let's make some copper tools!

First we'll need to create a tool material for our new tools to use. We'll use Forge's `EnumHelper` class to add a value to the Minecraft `Item.ToolMaterial` enum.

{% highlight java linenos %}
// ...
public class TutorialMod {
	// ...
	public static final Item.ToolMaterial copperMaterial = EnumHelper.addToolMaterial("COPPER", 2, 500, 6, 2, 14);
	// ...
}
{% endhighlight %}

Each tool is going to be quite similar, so feel free to skip ahead to the one you want.

- [Sword](#sword)
- [Pickaxe](#pickaxe)
- [Axe](#axe)
- [Shovel](#shovel)
- [Hoe](#hoe)

## Sword
First we'll create an `ItemSword` class in the `item.tool` package inside our mod package. This class will extend the vanilla `ItemSword` class and implement our `ItemModelProvider` interface. 

In the constructor, we'll:

- Call the `super` constructor with the tool material
- Set the unlocalized and registry names
- Store the name for use in item model registration

We'll also override `registerItemModel` and use the stored `name` to register our item model.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item.tool;

import net.minecraft.item.Item;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.item.ItemModelProvider;

public class ItemSword extends net.minecraft.item.ItemSword implements ItemModelProvider {

	private String name;

	public ItemSword(ToolMaterial material, String name) {
		super(material);
		setRegistryName(name);
		setUnlocalizedName(name);
		this.name = name;
	}

	@Override
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(this, 0, name);
	}

}
{% endhighlight %}

Next, we'll add our copper sword to our `ModItems` class simply by adding a field and initializing it using our `register` method.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...
	public static ItemSword copperSword;

	public static void init() {
		// ...
		copperSword = register(new ItemSword(TutorialMod.copperMaterial, "copperSword"));
	}
	// ...
}
{% endhighlight %}

We'll also create our JSON item model at `assets/tutorial/models/item/copperSword.json`. Unlike our other item models, the parent for the model will be `item/handheld` instead of `item/generated`. `item/handheld` provides the transformations used by handheld items, such as tools.

{% highlight json linenos %}
{
	"parent": "item/handheld",
	"textures": {
		"layer0": "tutorial:items/copperSword"
	}
}
{% endhighlight %}

We'll also need the texture, which you can download [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/items/copperSword.png).

And lastly, we'll add a localization entry for the sword.

{% highlight properties linenos %}
# Items
# ...
item.copperSword.name=Copper Sword
{% endhighlight %}

![Copper Sword](http://i.imgur.com/ye5yMy4.png)

## Pickaxe
Let's create an `ItemPickaxe` class in the `item.tool` package of our mod. This class will extend the vanilla `ItemPickaxe` and implement our `ItemModelProvider` interface.

In our `ItemPickaxe` constructor we'll:

- Call the `super` constructor with the tool material
- Set the unlocalized name and registry names
- Store the name for use in the item model registration

We'll also override `registerItemModel` and use the stored `name` field to register our item model.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item.tool;

import net.minecraft.item.Item;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.item.ItemModelProvider;

public class ItemPickaxe extends net.minecraft.item.ItemPickaxe implements ItemModelProvider {

	private String name;

	public ItemPickaxe(ToolMaterial material, String name) {
		super(material);
		setRegistryName(name);
		setUnlocalizedName(name);
		this.name = name;
	}

	@Override
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(this, 0, name);
	}

}
{% endhighlight %}

Next, we'll add our copper pickaxe to our `ModItems` class simply by adding a field and initializing it using our `register` method.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...
	public static ItemPickaxe copperPickaxe;

	public static void init() {
		// ...
		copperPickaxe = register(new ItemPickaxe(TutorialMod.copperMaterial, "copperPickaxe"));
	}
	// ...
}
{% endhighlight %}

We'll create a JSON model for our item at `assets/tutorial/models/item/copperPickaxe.json`. This model will have a parent of `item/handheld` instead of `item/generated` so it inherits the transformations for handheld models.

{% highlight json linenos %}
{
	"parent": "item/handheld",
	"textures": {
		"layer0": "tutorial:items/copperPickaxe"
	}
}
{% endhighlight %}

You can download the texture for the copper pickaxe [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/items/copperPickaxe.png).

Lastly, we'll need a localization entry for the pick.

{% highlight properties linenos %}
# Items
# ...
item.copperPickaxe.name=Copper Pickaxe
{% endhighlight %}

![Copper Pickaxe](http://i.imgur.com/FsbvVur.png)

## Axe
First off, we'll need an `ItemAxe` class that extends the vanilla `ItemAxe` class and implements our `ItemModelProvider` interface.

If you look at the vanilla `ItemAxe` class, you'll notice that it has two constructors. One of them takes only a `ToolMaterial` whereas the other takes a `ToolMaterial` and two `float`s. Only vanilla `ToolMaterial`s will work with the `ToolMaterial` only constructor, any modded materials will cause an `ArrayIndexOutOfBoundsException` because of the hardcoded values in the `float` arrays in the `ItemAxe` class. Forge provides the secondary constructor that accepts the two `float`s as well, allowing modders to add axes with their own tool materials.

In the `ItemPickaxe` constructor, we will:

- Call the `super` constructor with the tool material and the damage and attack speeds used by the vanilla iron axe.
- Set the unlocalized and registry names
- Store the name for use in the item model registration

Additionally, we'll override `registerItemModel` and use the stored `name` to register our model.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item.tool;

import net.minecraft.item.Item;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.item.ItemModelProvider;

public class ItemAxe extends net.minecraft.item.ItemAxe implements ItemModelProvider {

	private String name;

	public ItemAxe(ToolMaterial material, String name) {
		super(material, 8f, -3.1f);
		setRegistryName(name);
		setUnlocalizedName(name);
		this.name = name;
	}

	@Override
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(this, 0, name);
	}

}
{% endhighlight %}

Next, we'll add our copper axe to our `ModItems` class simply by adding a field and initializing it using our `register` method.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...
	public static ItemAxe copperAxe;

	public static void init() {
		// ...
		copperAxe = register(new ItemAxe(TutorialMod.copperMaterial, "copperAxe"));
	}
	// ...
}
{% endhighlight %}

Additionally, we'll need a JSON item model. We'll create it at `assets/tutorials/models/item/copperAxe.json`.

Our model will have a parent of `item/handheld` instead of `item/generated` so it has the same transformations used by other hand-held items.

{% highlight json linenos %}
{
	"parent": "item/handheld",
	"textures": {
		"layer0": "tutorial:items/copperHoe"
	}
}
{% endhighlight %}

You can download the texture for the copper axe [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/items/copperAxe.png).

Lastly, we'll need a localization entry for our axe.

{% highlight properties linenos %}
# Items
# ...
item.copperAxe.name=Copper Axe
{% endhighlight %}

![Copper Axe](http://i.imgur.com/5E3vjTo.png)

## Shovel
Firstly we'll create an `ItemShovel` class that extends the vanilla `ItemSpade` class and implements our `ItemModelProvider` interface.

In the `ItemShovel` constructor, we'll:

- Call the `super` constructor with the tool material used
- Set the unlocalized and registry names
- Store the name to be used for item model registration

We'll also need to implement `registerItemModel` and register a item model for our shovel.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item.tool;

import net.minecraft.item.Item;
import net.minecraft.item.ItemSpade;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.item.ItemModelProvider;

public class ItemShovel extends ItemSpade implements ItemModelProvider {

	private String name;

	public ItemShovel(ToolMaterial material, String name) {
		super(material);
		setRegistryName(name);
		setUnlocalizedName(name);
		this.name = name;
	}

	@Override
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(this, 0, name);
	}

}
{% endhighlight %}

Next, we'll add our copper shovel to our `ModItems` class simply by adding a field and initializing it using our `register` method.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...
	public static ItemShovel copperShovel;

	public static void init() {
		// ...
		copperShovel = register(new ItemShovel(TutorialMod.copperMaterial, "copperShovel"));
	}
	// ...
}
{% endhighlight %}

Next, we'll create a JSON item model for our shovel at `assets/tutorial/models/item/copperShovel.json`. This model will have a parent of `item/handheld`, unlike our previous item models, so it inherits the transformations used by handheld items.

{% highlight json linenos %}
{
	"parent": "item/handheld",
	"textures": {
		"layer0": "tutorial:items/copperShovel"
	}
}
{% endhighlight %}

You can download the texture for our shovel [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/items/copperShovel.png).

We'll also need a localization entry for our shovel.

{% highlight properties linenos %}
# Items
# ...
item.copperShovel.name=Copper Shovel
{% endhighlight %}

![Copper Shovel](http://i.imgur.com/l1VMi6L.png)

## Hoe
Let's create an `ItemHoe` class that extends the vanilla `ItemHoe` class and implements our `ItemModelProvider` interface.

In the `ItemHoe` constructor, we'll:

- Call the `super` constructor with the tool material
- Set the unlocalized and registry names
- Store the item name to be used for item model registration

We'll also need to implement `registerItemModel` and register an item model for our hoe.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item.tool;

import net.minecraft.item.Item;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.item.ItemModelProvider;

public class ItemHoe extends net.minecraft.item.ItemHoe implements ItemModelProvider {

	private String name;

	public ItemHoe(ToolMaterial material, String name) {
		super(material);
		setRegistryName(name);
		setUnlocalizedName(name);
		this.name = name;
	}

	@Override
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(this, 0, name);
	}

}
{% endhighlight %}

Next, we'll create a JSON item model for our hoe at `assets/tutorial/models/item/copperHoe.json`. This model will have a parent of `item/handheld` instead of `item/generated` so it inherits the transformations used by vanilla handheld items.

{% highlight json linenos %}
{
	"parent": "item/handheld",
	"textures": {
		"layer0": "tutorial:items/copperHoe"
	}
}
{% endhighlight %}

You can download the copper hoe texture [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/items/copperHoe.png).

Lastly, we'll need a localization entry for our hoe.

{% highlight properties linenos %}
# Items
# ...
item.copperHoe.name=Copper Hoe
{% endhighlight %}

![Copper Hoe](http://i.imgur.com/8PZ3MdD.png)