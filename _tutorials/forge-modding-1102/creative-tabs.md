---
date: 2016-06-14 16:26:00 -0400
title: "Creative Tabs"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

In this tutorial, we are going to create a custom creative tab that players can use to access all of our items when in creative mode.

## Creative Tab
First off, let's create our creative tab class. Create a class called `TutorialTab` that extends `CreativeTabs`. It will need a couple things:

1. A no-args constructor that calls the super constructor with the correct label.
2. An overridden `getTabIconItem` which returns the item to render as the icon.

The `String` passed into the super constructor is the label. The label is used to determine the localization key for the tab. For the label, we are going to pass in `TutorialMod.modId` so Minecraft uses our mod's ID to determine the localization key.

The item we return from the `getTabIconItem` will be rendered on the tab in the creative inventory GUI. We'll use `ModItems.ingotCopper` as the icon item so our creative tab has a nice distinctive icon.

{% highlight java linenos %}
package net.shadowfacts.tutorial.client;

import net.minecraft.creativetab.CreativeTabs;
import net.minecraft.item.Item;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.item.ModItems;

public class TutorialTab extends CreativeTabs {

	public TutorialTab() {
		super(TutorialMod.modId);
	}

	@Override
	public Item getTabIconItem() {
		return ModItems.ingotCopper;
	}

}
{% endhighlight %}

Let's add a field to our `TutorialMod` class that stores the instance of our creative tab.

{% highlight java linenos %}
// ...
public static final TutorialTab creativeTab = new TutorialTab();
// ...
{% endhighlight %}

## Updating Everything Else
Now that we've got our creative tab all setup, let's change all of our items and blocks to use it.

Let's add a line to the end of our `BlockBase` and `ItemBase` constructors that calls `setCreativeTab` with our creative tab.

{% highlight java linenos %}
public BlockBase(Material material, String name) {
	// ...
	setCreativeTab(TutorialMod.creativeTab);
}
{% endhighlight %}

{% highlight java linenos %}
public ItemBase(String name) {
	// ...
	setCreativeTab(TutorialMod.creativeTab);
}
{% endhighlight %}

We'll also need to add this line to the `BlockCropCorn` and `ItemCornSeed` classes because they don't extend our base item/block classes.

{% highlight java linenos %}
public BlockCropCorn() {
	// ...
	setCreativeTab(TutorialMod.creativeTab);
}
{% endhighlight %}

{% highlight java linenos %}
public ItemCornSeed() {
	// ...
	setCreativeTab(TutorialMod.creativeTab);
}
{% endhighlight %}

Lastly, we'll need to update our `ModBlocks` and `ModItems` classes so we're no longer setting the creative tabs to other tabs.

Remove the `setCreativeTab` call from the end of the BlockOre constructor on the line where we register/create the copper ore block.

Remove the `setCreativeTab` calls from the copper ingot and corn items in `ModItems`.

## All Done!
Now when we start the game and open the creative inventory, we should be able to see our creative tab on the second page.

![our creative tab in action](http://i.imgur.com/JfEhwvu.png)