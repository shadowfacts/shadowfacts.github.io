---
date: 2016-05-07 15:27:00 -0400
title: "Main Mod Class"
type: 'tutorial'
series: 'forge-modding-111'
series-name: 'Making a Forge Mod for 1.11'
layout: tutorial
---

Every mod has a main mod class that Forge loads and uses as a starting point when it runs your mod. Before getting started, you'll want to delete all the exist code that comes in the MDK by deleting the `com.example.examplemod` package. For this tutorial, I'll be putting all of the code in the `net.shadowfacts.tutorial` package, so you'll need to create that in your IDE. Next, create a class called `TutorialMod`.

{% highlight java linenos %}
package net.shadowfacts.tutorial;

import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPostInitializationEvent;
import net.minecraftforge.fml.common.event.FMLPreInitializationEvent;

@Mod(modid = TutorialMod.modId, name = TutorialMod.name, version = TutorialMod.version)
public class TutorialMod {

	public static final String modId = "tutorial";
	public static final String name = "Tutorial Mod";
	public static final String version = "1.0.0";

	@Mod.Instance(modId)
	public static TutorialMod instance;

	@Mod.EventHandler
	public void preInit(FMLPreInitializationEvent event) {
		System.out.println(name + " is loading!");
	}

	@Mod.EventHandler
	public void init(FMLInitializationEvent event) {
		
	}

	@Mod.EventHandler
	public void postInit(FMLPostInitializationEvent event) {

	}

}
{% endhighlight %}

Now if we run the Minecraft Client through IDEA, `Tutorial Mod is loading!` should be printed out in the console. Now that we've got some code that's actually running, let's take a look at what it does.

- `@Mod(...)` (L8): This marks our `TutorialMod` class as a main mod class so that Forge will load it. 
- `@Mod.Instance(modId)` (L15-L16): The `@Mod.Instance` annotation marks this field so that Forge will inject the instance of our mod that is used into it. This will become more important later when we're working with GUIs.
- `@Mod.EventHandler` methods (L15, L20, L25): This annotation marks our `preInit`, `init`, and `postInit` methods to be called by Forge. Forge determines which method to call for which lifecycle event by checking the parameter of the method, so these methods can be named anything you want.