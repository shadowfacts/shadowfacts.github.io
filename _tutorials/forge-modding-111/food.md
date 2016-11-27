---
date: 2016-08-12 18:04:00 -0400
title: "Food"
type: 'tutorial'
series: 'forge-modding-111'
series-name: 'Making a Forge Mod for 1.11'
layout: tutorial
---

We've already made a Corn item for our [crop](/tutorials/forge-modding-1102/crops/), however, we were unable to eat the corn (defeating its very purpose). Let's make our Corn behave as actual food.

First we'll need to create an `ItemCorn` class that will be our new corn item, instead of just using `ItemOre`. Our class will extend `ItemFood` so it inherits all of the vanilla food-handling logic. We'll also want our class to implement `ItemModelProvider` and `ItemOreDict` so it retains the functionality from the existing corn item.

The `ItemFood` constructor takes 3 parameters:

1. The amount of hunger restored by this food.
2. The saturation given by this food.
3. If this food is edible by wolves.

We'll pass in `3`, `0.6f`, and `false` for the hunger, saturation, and wolf food values, the same values as the Carrot. Also in the constructor, we'll call `setUnlocalizedName` and `setRegistryName` with the same value as we used for the original corn item (`corn`). We'll also call `setCreativeTab` with our custom creative tab.

We'll also need to override the `registerItemModel` and `initOreDict` methods from the interfaces we implemented.

In `registerItemModel`, we'll use our proxy `registerItemRenderer` method to register an item model for our corn item. We'll use `corn` as the model name, the same as our original item.

We'll also override `initOreDict` and call the `OreDictionary.registerOre` method with `cropCorn` as the ore name, the same as our original item.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item;

import net.minecraft.item.Item;
import net.minecraft.item.ItemFood;
import net.minecraftforge.oredict.OreDictionary;
import net.shadowfacts.tutorial.TutorialMod;

public class ItemCorn extends ItemFood implements ItemModelProvider, ItemOreDict {

	public ItemCorn() {
		super(3, 0.6f, false);
		setUnlocalizedName("corn");
		setRegistryName("corn");
		setCreativeTab(TutorialMod.creativeTab);
	}

	@Override
	public void registerItemModel(Item item) {
		TutorialMod.proxy.registerItemRenderer(this, 0, "corn");
	}

	@Override
	public void initOreDict() {
		OreDictionary.registerOre("cropCorn", this);
	}

}
{% endhighlight %}

In the `ModItems` class, we'll also need to change the `corn` field.

{% highlight java linenos %}
// ...
public class ModItems {
	// ...
	public static ItemCorn corn;
	// ...
	public static void init() {
		// ...
		corn = register(new ItemCorn());
		// ...
	}
}
{% endhighlight %}

We simply need to change the `corn` field to by of item `ItemCorn` and the registration call to instantiate `ItemCorn` instead of `ItemOre`.

Now we've got an edible corn item!

![Edible Corn](http://i.imgur.com/aT5BZ5x.png)