---
date: 2016-05-07 16:32:00 -0400
title: "JSON Item Models"
type: 'tutorial'
series: 'forge-modding-194'
series-name: 'Making a Forge Mod for 1.9.4'
layout: tutorial
---

Models for items and blocks are created using Mojang's fairly simple JSON format. We're going to create a simple item model for our copper ingot.

Before we do this, we'll need to add our copper ingot texture. Download the copper ingot texture from [here](https://raw.githubusercontent.com/CyanideX/Unity/master/assets/thermalfoundation/textures/items/material/IngotCopper.png) and save it to `src/main/resources/assets/tutorial/textures/items/ingotCopper.png` so we can use it from our model.


Now we'll create a simple JSON model and save it to `src/main/resources/assets/tutorial/models/item/ingotCopper.json`

{% highlight json linenos %}
{
	"parent": "item/generated",
	"textures": {
		"layer0": "tutorial:items/ingotCopper"
	}
}
{% endhighlight %}

Let's go over what each bit does:

- `parent`: specifies which model to use as the parent. We're using `item/generated` which is a code model that is part of Minecraft that generates that nice 3D look that items have.
- `textures`: specifies all the textures to use for this model.
- `layer0`: Our model only has one texture so we only need to specify one layer.
- `tutorial:items/ingotCopper`: There are two important parts of this bit.
	- `tutorial` specifies that the texture is part of the `tutorial` domain.
	- `items/ingotCopper` specifies what path the texture is at.
	- These are all combined to get the entire path to the texture `assets/tutorial/textures/items/ingotCopper.png`

Now our item has a nice texture and nice model in-game!

![Copper Ingot Model/Texture Screenshot](http://i.imgur.com/cup7xwW.png)