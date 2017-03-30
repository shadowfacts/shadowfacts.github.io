---
date: 2016-06-15 11:42:00 -0400
title: "Advanced Creative Tabs"
type: 'tutorial'
series: 'forge-modding-1112'
series-name: 'Making a Forge Mod for 1.11.2'
layout: tutorial
---

## Searchable Tab
Let's make our creative tab searchable, just like the Search Items tab. 

There are two main parts to this:
1. Returning `true` from the `hasSearchBar` method of our creative tab class.
2. Setting the texture name for the background image of our creative tab, so the search bar appears.

{% highlight java linenos %}
package net.shadowfacts.tutorial.client;

import net.minecraft.creativetab.CreativeTabs;
import net.minecraft.item.ItemStack;
import net.shadowfacts.tutorial.TutorialMod;
import net.shadowfacts.tutorial.item.ModItems;

public class TutorialTab extends CreativeTabs {

	public TutorialTab() {
		super(TutorialMod.modId);
		setBackgroundImageName("item_search.png");
	}

	@Override
	public ItemStack getTabIconItem() {
		return new ItemStack(ModItems.ingotCopper);
	}

	@Override
	public boolean hasSearchBar() {
		return true;
	}

}
{% endhighlight %}

As you can see, we are returning `true` from `hasSearchBar` so Minecraft will allow us to type in our tab and filter the visible items.

We're also calling `setBackgroundImageName` with `"item_search.png"`. Minecraft will use this string to find the texture to use for the background. It will look for the texture at `assets/minecraft/textures/gui/container/creative_inventory/tab_BACKGROUND_NAME` where `BACKGROUND_NAME` is what you passed into `setBackgroundImageName`. `tag_item_search.png` is provided by Minecraft, so we don't need to do anything else.

![Searchable Creative Tab](http://i.imgur.com/C34Nh4R.png)

## Custom Background
As explained above, we can use custom backgrounds for our creative tabs.

> Minecraft will use this string to find the texture to use for the background. It will look for the texture at `assets/minecraft/textures/gui/container/creative_inventory/tab_BACKGROUND_NAME` where `BACKGROUND_NAME` is what you passed into `setBackgroundImageName`.

By passing a different string into `setBackgroundImageName` and adding the texture into the correct folder of our `src/main/resources` folder, we can use a custom background.

In our constructor, let's call `setBackgroundImageName` with `"tutorialmod.png"`. This will tell Minecraft to look for the texture at `assets/minecraft/textures/gui/container/creative_inventory/tab_tutorialmod.png`

Download [this](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/minecraft/textures/gui/container/creative_inventory/tab_tutorialmod.png) texture and save it to `src/main/resources/assets/minecraft/textures/gui/container/creative_inventory/tab_tutorialmod.png` in your mod folder.

That's it! When you open up the creative tab, you should now see our nice custom texture!

![Creative Tab with Custom Background](http://i.imgur.com/pP2W6h0.png)