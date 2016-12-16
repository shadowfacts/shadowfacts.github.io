---
date: 2016-09-17 16:53:00 -0400
title: "Armor"
type: 'tutorial'
series: 'forge-modding-111'
series-name: 'Making a Forge Mod for 1.11'
layout: tutorial
---

Before we can create armor, we'll need to create an armor material to use for our copper armor.

We'll add a new field to our main mod class. 

{% highlight java linenos %}
// ...
public class TutorialMod {
	// ...
	public static final ItemArmor.ArmorMaterial copperArmorMaterial = EnumHelper.addArmorMaterial("COPPER", modId + ":copper", 15, new int[]{2, 5, 6, 2}, 9, SoundEvents.ITEM_ARMOR_EQUIP_IRON, 0.0F);
	// ...
}
{% endhighlight %}

`EnumHelper.addArmorMaterial` takes a number of parameters:
- `"COPPER"`: The name of the new enum value, this is completely capitalized, following the enum naming convention.
- `modId + ":copper"`: This is the texture that will be used for our armor. We prefix it with our mod ID to use our mod's domain instead of the default `minecraft` domain.
- `15`: The maximum damage factor.
- `new int[]{2, 5, 6, 2}`: The damage reduction factors for each armor piece.
- `9`: The enchantibility of the armor.
- `SoundEvents.ITEM_ARMOR_EQUIP_IRON`: The sound event that is played when the armor is equipped.
- `0.0F`: The toughness of the armor.

Next we'll need the textures for the armor material that are used to render the on-player overlay.
Download the layer 1 texture [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/models/armor/copper_layer_1.png) and save it to `src/main/resources/assets/tutorial/textures/model/armor/copper_layer_1.png`. Download the layer 2 texture [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/master/src/main/resources/assets/tutorial/textures/models/armor/copper_layer_2.png) and save it to `src/main/resources/assets/tutorial/textures/models/armor/copper_layer_2.png`.

## Armor Item Base Class
Before we can begin creating armor items, we'll need to create a base class that implements our `ItemModelProvider` interface so it can be used with our registration helper method.

We'll create a class called `ItemArmor` in our `item` package that extends the Vanilla `ItemArmor` class and implements `ItemModelProvider`.

{% highlight java linenos %}
package net.shadowfacts.tutorial.item;

import net.minecraft.inventory.EntityEquipmentSlot;
import net.minecraft.item.Item;
import net.shadowfacts.tutorial.TutorialMod;

public class ItemArmor extends net.minecraft.item.ItemArmor implements ItemModelProvider {
	
	private String name;

	public ItemArmor(ArmorMaterial material, EntityEquipmentSlot slot, String name) {
		super(material, 0, slot);
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

## Copper Helmet
Firstly, we'll create a field for our copper helmet item and register it in our `ModItems.init` method.

{% highlight java linenos %}
public class ModItems {
	// ...
	public static ItemArmor copperHelmet;

	public static void init() {
		// ...
		copperHelmet = register(new ItemArmor(TutorialMod.copperArmorMaterial, EntityEquipmentSlot.HEAD, "copper_helmet"));
	}
}
{% endhighlight %}

Next, we'll need to create a JSON model for our item. The file will be at `src/main/resources/assets/tutorial/models/item/copper_helmet.json`.

{% highlight java linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/copper_helmet"
	}
}
{% endhighlight %}

You can download the copper helmet texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.11/src/main/resources/assets/tutorial/textures/items/copper_helmet.png) and save it to `src/main/resources/assets/tutorial/textures/items/copper_helmet.png`.

Lastly, we'll need to add a localization entry for the helmet.

{% highlight properties linenos %}
# ...
item.copper_helmet.name=Copper Helmet
{% endhighlight %}

## Copper Chestplate
First, we'll create a field for our copper chestplate item and register it in our `ModItems.init` method.

{% highlight java linenos %}
public class ModItems {
	// ...
	public static ItemArmor copperChestplate;

	public static void init() {
		// ...
		copperChestplate = register(new ItemArmor(TutorialMod.copperArmorMaterial, EntityEquipmentSlot.CHEST, "copper_chestplate"));
	}
}
{% endhighlight %}

Next, we'll need to create a JSON model for our item. The file will be at `src/main/resources/assets/tutorial/models/item/copper_chestplate.json`.

{% highlight java linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/copper_chestplate"
	}
}
{% endhighlight %}

You can download the copper helmet texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.11/src/main/resources/assets/tutorial/textures/items/copper_chestplate.png) and save it to `src/main/resources/assets/tutorial/textures/items/copper_chestplate.png`.

Lastly, we'll need to add a localization entry for the helmet.

{% highlight properties linenos %}
# ...
item.copper_chestplate.name=Copper Chestplate
{% endhighlight %}

## Copper Leggings
First, we'll create a field for our copper leggings item and register it in our `ModItems.init` method.

{% highlight java linenos %}
public class ModItems {
	// ...
	public static ItemArmor copperLeggings;

	public static void init() {
		// ...
		copperLeggings = register(new ItemArmor(TutorialMod.copperArmorMaterial, EntityEquipmentSlot.LEGS, "copper_leggings"));
	}
}
{% endhighlight %}

Next, we'll need to create a JSON model for our item. The file will be at `src/main/resources/assets/tutorial/models/item/copper_leggings.json`.

{% highlight java linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/copper_leggings"
	}
}
{% endhighlight %}

You can download the copper helmet texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.11/src/main/resources/assets/tutorial/textures/items/copper_leggings.png) and save it to `src/main/resources/assets/tutorial/textures/items/copper_leggings.png`.

Lastly, we'll need to add a localization entry for the helmet.

{% highlight properties linenos %}
# ...
item.copper_leggings.name=Copper Leggings
{% endhighlight %}

## Copper Boots
First, we'll create a field for our copper boots item and register it in our `ModItems.init` method.

{% highlight java linenos %}
public class ModItems {
	// ...
	public static ItemArmor copperBoots;

	public static void init() {
		// ...
		copperBoots = register(new ItemArmor(TutorialMod.copperArmorMaterial, EntityEquipmentSlot.FEET, "copper_boots"));
	}
}
{% endhighlight %}

Next, we'll need to create a JSON model for our item. The file will be at `src/main/resources/assets/tutorial/models/item/copper_boots.json`.

{% highlight java linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/copper_boots"
	}
}
{% endhighlight %}

You can download the copper boots texture from [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/1.11/src/main/resources/assets/tutorial/textures/items/copper_boots.png) and save it to `src/main/resources/assets/tutorial/textures/items/copper_boots.png`.

Lastly, we'll need to add a localization entry for the boots.

{% highlight properties linenos %}
# ...
item.copper_boots.name=Copper Boots
{% endhighlight %}

## Done!
Now, when we run the game, we can obtain our copper armor from the Combat creative tab, and when we equip it, we can see the player overlay being rendered and the armor value being show on the HUD:

![copper armor screenshot](https://i.imgur.com/Vv8Qzne.png)
