---
date: 2017-03-29 18:58:42 -0400
title: "Tile Entities with Inventory GUI"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

Now that we've got the inventory for our tile entity working, let's add a GUI so people can easily see what's inside of it.

Of course, in Minecraft, GUIs only exist on the client-side. This poses a problem because inventory's can only be interacted with from the server-side. In order to handle this, we use something called a Container which bridges the gap between the client and the server. There are two identical instances of the `Container` subclass that exist on both the client and the server. Whenever a change is made on the server, the change is automatically sent to the client, and vice versa: whenever a change is made on the client, it's automatically sent to the server.

## Container

First off, we'll create our container class. We'll create a new class called `ContainerPedestal` in the `block.pedestal` package of our mod that extends Minecraft's `Container` class.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block.pedestal;

import net.minecraft.inventory.*;

public class ContainerPedestal extends Container {
​	
}
{% endhighlight %}

This will cause an error because we need to implement the abstract method `canInteractWith` from the `Container` class. This method determines if a given player can open the container. For our pedestal, we don't have any special restrictions so we'll just return true regardless of the player.

{% highlight java linenos %}
// ...

public class ContainerPedestal extends Container {
​	
	@Override
	public boolean canInteractWith(EntityPlayer player) {
		return true;
	}

}
{% endhighlight %}

Nextly, we'll override the `transferStackInSlot` method from `Container`. This method handle's when a player tries to quick-transfer a stack by shift-clicking it. The implementation of this method is copied from [my library mod](https://github.com/shadowfacts/ShadowMC/blob/1.11/src/main/java/net/shadowfacts/shadowmc/inventory/ContainerBase.java) which is designed to work with any container regardless of the number of slots. This differs from the vanilla implementations of this method are dependent on the number of slots being a specific number. This method is fairly complicated and not that important so I won't go over super in-detail here. The gist of it is that it tries to add the stack that's been shift-clicked into the opposite inventory leaving anything that can't be transferred in the slot that was shift-clicked.

{% highlight java linenos %}
// ...
public class ContainerPedestal extends Container {
	// ...

	@Override
	public ItemStack transferStackInSlot(EntityPlayer player, int index) {
		ItemStack itemstack = null;
		Slot slot = inventorySlots.get(index);
	
		if (slot != null && slot.getHasStack()) {
			ItemStack itemstack1 = slot.getStack();
			itemstack = itemstack1.copy();
	
			int containerSlots = inventorySlots.size() - player.inventory.mainInventory.length;
	
			if (index < containerSlots) {
				if (!this.mergeItemStack(itemstack1, containerSlots, inventorySlots.size(), true)) {
					return null;
				}
			} else if (!this.mergeItemStack(itemstack1, 0, containerSlots, false)) {
				return null;
			}
	
			if (itemstack1.stackSize == 0) {
				slot.putStack(null);
			} else {
				slot.onSlotChanged();
			}
	
			if (itemstack1.stackSize == itemstack.stackSize) {
				return null;
			}
	
			slot.onPickupFromSlot(player, itemstack1);
		}
	
		return itemstack;
	}

}
{% endhighlight %}

Nextly, we'll add the most important part of the container, our constructor. In the constructor, we'll add all the slots for the player inventory and the slot for the pedestal's inventory. The container stores a `List` of `Slot` objects, each of which has a position on the GUI to render at and represents one inventory slot (either from the player's inventory or anything else). Minecraft's built in `Slot` class expects an `IInventory`  but obviously, our pedestal doesn't use `IInventory`, it uses Forge's `IItemHandler` capability. In order to have containers still work with `IItemHandler`s, Forge provides a `SlotItemHandler` which takes an `IItemHandler` and creates a dummy `IInventory` object and overrides all the necessary methods to use the `IItemHandler`. We'll have a single one of these slots for our pedestal's inventory. We'll also have 36 normal slots which are for the player's inventory. We'll use some for loops add in all 36 of the slots at the correct positions so we don't have to type them all out.

{% highlight java linenos %}
// ...
public class ContainerPedestal extends Container {

	public ContainerPedestal(InventoryPlayer playerInv, final TileEntityPedestal pedestal) {
		IItemHandler inventory = pedestal.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY, EnumFacing.NORTH);
		addSlotToContainer(new SlotItemHandler(inventory, 0, 80, 35) {
			@Override
			public void onSlotChanged() {
				pedestal.markDirty();
			}
		});
	
		for (int i = 0; i < 3; i++) {
			for (int j = 0; j < 9; j++) {
				addSlotToContainer(new Slot(playerInv, j + i * 9 + 9, 8 + j * 18, 84 + i * 18));
			}
		}
	
		for (int k = 0; k < 9; k++) {
			addSlotToContainer(new Slot(playerInv, k, 8 + k * 18, 142));
		}
	}
	
	// ...
}
{% endhighlight %}

One important thing to note is how in our `SlotItemHandler` instance, we override the `onSlotChanged` method to call `markDirty` on our pedestal. This makes it so that when the contents of the slot changes, the tile entity will be marked as dirty so Minecraft knows it needs to be saved to disk. If we were using a normal `Slot` instead of a `SlotItemHandler`, this wouldn't be necessary because `IInventory` has a `markDirty` method that the slot can call. However, because we're using Forge's `IItemHandler` which obeys separation of concerns, no equivalent method exists, meaning we need to handle it ourselves.

## GUI

Now that we've finished our container class, we need to make the client-side GUI itself. We'll create a new class called `GuiPedestal` that extends `GuiContainer` in our `block.pedestal` package. 

{% highlight java linenos %}
package net.shadowfacts.tutorial.block.pedestal;

import net.minecraft.client.gui.GuiContainer;

public class GuiPedestal extends GuiContainer {
​	
}
{% endhighlight %}

We'll have a constructor that takes a `Container` and a `InventoryPlayer`. It will pass the container to the super-constructor so that `GuiContainer` can render our slots and handle interaction with them. It will also save the `InventoryPlayer` to a field for later.

{% highlight java linenos %}
// ..
public class GuiPedestal extends GuiContainer {
	private InventoryPlayer playerInv;

	public GuiPedestal(Container container, InventoryPlayer playerInv) {
		super(container);
		this.playerInv = playerInv;
	}
}
{% endhighlight%}

Before we can move on to the next method, we'll add a `private static final` to store the `ResourceLocation` for the background texture of the GUI.

{% highlight java linenos %}
// ...
public class GuiPedestal extends GuiContainer {
	private static final ResourceLocation BG_TEXTURE = new ResourceLocation(TutorialMod.modId, "textures/gui/pedestal.png");
}
{% endhighlight %}

You can download the texture for the pedestal GUI [here](https://raw.githubusercontent.com/shadowfacts/TutorialMod/519b5e5265c6203997d9f378ec5eaccbc33a6870/src/main/resources/assets/tutorial/textures/gui/pedestal.png). You'll want to save it to `src/main/resources/assets/tutorial/textures/gui/pedestal.png`.



In our `GuiPedestal` class, we'll need to override two methods: `drawGuiContainerBackgroundLayer` and `drawGuiContainerForegroundLayer`. These two methods respectively handle rendering the background (the stuff that renders _behind_ the slots) and rendering the foreground (the stuff that renders _in front of_ the background and the slots). 



Firstly, the background method:

{% highlight java linenos %}
// ...
public class GuiPedestal extends GuiContainer {
	// ...

	@Override
	protected void drawGuiContainerBackgroundLayer(float partialTicks, int mouseX, int mouseY) {
		GlStateManager.color(1, 1, 1, 1);
		mc.getTextureManager().bindTexture(BG_TEXTURE);
		int x = (width - xSize) / 2;
		int y = (height - ySize) / 2;
		drawTexturedModalRect(x, y, 0, 0, xSize, ySize);
	}
}
{% endhighlight %}

In our `drawGuiContainerBackgroundLayer` method, we:

1. Call `GlStateManager.color(1, 1, 1, 1)`. This resets the GL color to solid white, instead of potentially something else. If we don't reset it, and the color isn't already white, our texture would be tinted with that color.
2. Call `bindTexture(BG_TEXTURE)`. This binds the background texture that we've specified in our `BG_TEXTURE` field to Minecraft's rendering engine, so that when we render a rectangle with a texture on it, the correct texture is used.
3. Calculate the X and Y positions to draw our texture at. We want our texture to be centered on screen, so we take half the width and height of the screen and subtract half the x-size and y-size of our GUI from it, giving us the position of the upper left hand corner of the GUI, which is the position the texture should be drawn at.
4. Call `drawTexturedModalRect`. This actually draws the texture. We pass in:
   1. The `x` and `y` positions.
   2. The point (0, 0) for the UV position. This is where on the texture rendering should start from. Because in our image, the GUI is at the top left corner, we use (0, 0).
   3. The x-size and the y-size for the dimensions of the drawn texture.

Lastly for our GUI, we override the `drawGuiContainerForegroundLayer` method:

{% highlight java linenos %}
// ...
public class GuiPedestal {
	// ...

	@Override
	protected void drawGuiContainerForegroundLayer(int mouseX, int mouseY) {
		String name = I18n.format(ModBlocks.pedestal.getUnlocalizedName() + ".name");
		fontRendererObj.drawString(name, xSize / 2 - fontRendererObj.getStringWidth(name) / 2, 6, 0x404040);
		fontRendererObj.drawString(playerInv.getDisplayName().getUnformattedText(), 8, ySize - 94, 0x404040);
	}
}
{% endhighlight %}

In this method, we:

1. Call `I18n.format` with our pedestal block's unlocalized name. This converts the unlocalized name of our block (`tile.pedestal.name`) into the correct name for the current locale as specified in our localization files. For English, this will be `Pedestal`.
2. Draw the localized name of our block on the screen. We draw it at the top center of our GUI, so we subtract half of width of our localized name (as calculated by `getStringWidth`) from half of the x-size of the GUI, giving use the X position that will result in it being centered in the GUI. We also pass 6 as the Y coordinate, so 6 pixels from the top of the GUI, and `0x404040` as the color, in hexadecimal, for our string.
3. Draw the localized name of the player's inventory on the screen. We call `playerInv.getDisplayName()` which returns an `ITextComponent` and call `getUnformattedText()` on it to get the string to render. We draw it at X position 8, just offset from the left side of our GUI, and at the Y position which is 94 pixels (the height of the player's inventory in our GUI) above the bottom of our GUI.




## GUI Handler
Now that we've got our container and GUI classes finished, we need to add a GUI handler. This class will have methods which are called by Forge that will be responsible for creating the correct instances of our GUI and container classes from some pieces of information.

We'll create a class called `ModGuiHandler` that implements the `IGuiHandler` interface in our root mod package.

{% highlight java linenos %}
package net.shadowfacts.tutorial;

import net.minecraftforge.fml.common.network.IGuiHandler;

public class ModGuiHandler implements IGuiHandler {
​	
}
{% endhighlight %}

First off, we'll add a constant field to our GUI handler for the Pedestal's GUI ID. Forge uses integer IDs to differentiate between which GUI should be opened, and since this is our first GUI, its ID will be `0`.

{% highlight java linenos %}
// ...
public class ModGuiHandler implements IGuiHandler {
​	public static final int PEDESTAL = 0;
}
{% endhighlight %}

Nextly, we'll implement the `getServerGuiElement` method. This method returns the appropriate instance (or `null`, if there is none) for the given ID, player, world, and position.

{% highlight java linenos %}
// ...
public class ModGuiHandler implements IGuiHandler {
	// ...

	@Override
	public Container getServerGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z) {
		switch (ID) {
			case PEDESTAL:
				return new ContainerPedestal(player.inventory, (TileEntityPedestal)world.getTileEntity(new BlockPos(x, y, z)));
			default:
				return null;
		}
	}
}
{% endhighlight %}

**Note:** We've changed the return type of our `getServerGuiElement` method to `Container` from `Object`. Forge uses `Object` because client-only classes aren't present on servers, so there can't be any references to them in the signatures of methods that will exist on both sides. Forge also uses this logic for the container method, but because `Container` is present on both sides, we can change the return type to `Container` from `Object` without issue.

In this method, we switch over the GUI ID, and if it's the pedestal's ID, return a new `ContainerPedestal` instance using the player's inventory, and the `TileEntityPedestal` that's in the world. Otherwise, if the ID doesn't match any of the one's we've added (this should never happen, but it's necessary just to satisfy the Java compiler), we return `null`.

Nextly, we add the `getClientGuiElement` method which returns the appropriate `GuiScreen` instance given the same data as the `getServerGuiElement`. 

{% highlight java linenos %}
@Override
public Object getClientGuiElement(int ID, EntityPlayer player, World world, int x, int y, int z) {
	switch (ID) {
		case PEDESTAL:
			return new GuiPedestal(getServerGuiElement(ID, player, world, x, y, z), player.inventory);
		default:
			return null;
	}
}
{% endhighlight %}

Similarly to the `getServerGuiElement` method, we switch on the ID, and if it's the pedestal's, we return a new instance of `GuiPedestal` with a new container instance and the player's inventory. 

Finally, we need to register our GUI handler.

{% highlight java linenos %}
// ...
public class TutorialMod {
	// ...
	@Mod.EventHandler
	public void preInit(FMLPreInitializationEvent event) {
		// ...
		NetworkRegistry.INSTANCE.registerGuiHandler(this, new ModGuiHandler());
	}
	// ...
}
{% endhighlight %}

This tells Forge that our GUI handler instance corresponds to our mod instance, so it knows which GUI handler to use when we actually open our GUI.

## Updating the Block
Lastly, in order to open the GUI, we need to modify our Block's `onBlockActivated` method. 

{% highlight java linenos %}
// ...
public class BlockPedestal extends BlockTileEntity<TileEntityPedestal> {
	// ...
	@Override
	public boolean onBlockActivated(World world, BlockPos pos, IBlockState state, EntityPlayer player, EnumHand hand, EnumFacing side, float hitX, float hitY, float hitZ) {
		if (!world.isRemote) {
			// ...
 			if (!player.isSneaking()) {
 				// ...
  			} else {
  				player.openGui(TutorialMod.instance, ModGuiHandler.PEDESTAL, world, pos.getX(), pos.getY(), pos.getZ());
  			}
  		}
  		return true;

	}
	// ...
}
{% endhighlight %}

We'll remove the code that prints messages to chat and replace it with a call to `player.openGui` with our mod instance, the Pedestal's GUI ID, the world, and the positions which get passed into our GUI handler to open the GUI.

## Finished

Now that we've finished, we can launch Minecraft, and once we shift right-click on the pedestal block, we can see and interact with our GUI:

![Pedestal GUI](http://i.imgur.com/0ajo2b2.png)