---
date: 2016-05-08 9:15:00 -0400
title: "Localization"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: page
---

If you'll recalled, we used the `setUnlocalizedName` method in both our `BlockBase` and `ItemBase` classes. The name that we passed into that method is what Minecraft uses when localizing the name of our block or item for the currently active language. 

In these tutorials, we are only going to add English localizations however you can easily add more localizations by following the same pattern.

Language files are located at `src/main/resources/assets/tutorial/lang/IDENTIFIER.lang` where `IDENTIFIER` is the locale code of the language. Let's create a localization file with the identifier `en_US` (see [here](http://minecraft.gamepedia.com/Language) for more locale codes).

Language files are written in a simple `key=value` format with one entry per line. The `value` is obviously the translated name, this obviously differs for every language file. The `key` is the key that Minecraft uses when translating things. This is slightly different for blocks and items. For blocks the key is `tile.UNLOCALIZED.name`. For items the key is `item.UNLOCALIZED.name`. Where `UNLOCALIZED` is what we passed into `setUnlocalizedName`.

**Note:** Lines starting with `#` are comments and won't be parsed.

{% highlight properties linenos %}
# Items
item.ingotCopper.name=Copper Ingot

# Blocks
tile.oreCopper.name=Copper Ore
{% endhighlight %}

Now, both our Copper Ore and Copper Ingot have properly localized names!

![Copper Ore Screenshot](http://i.imgur.com/f6T09kI.png)
![Copper Ingot Screenshot](http://i.imgur.com/oafpj5q.png)