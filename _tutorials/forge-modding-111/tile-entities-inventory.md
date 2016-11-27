---
date: 2016-11-27 14:25:42 -0400
title: "Tile Entities with Inventory"
type: 'tutorial'
series: 'forge-modding-111'
series-name: 'Making a Forge Mod for 1.11'
layout: tutorial
---

Now that we've learned the basics of making tile entities, let's make a more complicated one that has an inventory.

**Note:** If you haven't already completed the [tile entities tutorial](/tutorials/forge-modding-111/tile-entities/), you'll want to do that so you'll have the foundations that this tutorial builds on.

## The Block

Firstly, we'll move the `BlockPedestal` from the `block` package to the `block.pedestal` package. Next, we'll change `BlockPedestal` so it extends `BlockTileEntity` instead of `BlockBase`. We'll also add a generic type parameter of `TileEntityPedestal`, which will be the tile entity class for our pedestal. Next, we'll need to implement the abstract methods provided by `BlockTileEntity` (`getTileEntityClass` and `createTileEntity`):

{% highlight java linenos %}
// ...
public class BlockPedestal extends BlockTileEntity<TileEntityPedestal> {

	// ...

	@Override
	public Class<TileEntityPedestal> getTileEntityClass() {
		return TileEntityPedestal.class;
	}
	
	@Nullable
	@Override
	public TileEntityPedestal createTileEntity(World world, IBlockState state) {
		return new TileEntityPedestal();
	}

}
{% endhighlight %}

From the `getTileEntityClass` method, we'll return `TileEntityPedestal.class` (this will cause errors because we haven't creeated the tile entity class yet) and from the `createTileEntity` method, we'll return a new instance of the `TileEntityPedestal` class.

Next, we'll add the `onBlockActivated` method which will handle our block being right-clicked. The logic for this method will be something like this:

1. Check that we're running on the server (see the [Sides section](/tutorials/forge-modding-111/tile-entities/#sides) of the previous tutorial).
   1. Retrieve the `TileEntity` and the `IItemHandler` instance.
   2. If the player is sneaking:
      1. If the player's hand is empty:
         1. Take what's in the pedestal's `IItemHandler` and put it in the player's hand.
      2. Otherwise:
         1. Take what's in the player's hand and attempt to insert it into the pedestal
      3. Mark the tile entity as dirty so Minecraft knows it needs to be saved to disk.
   3. Otherwise:
      1. Retrieve the `ItemStack` currently in the pedestal
      2. If there is a stack (i.e. it `!stack.isEmpty()`)
         1. Send a chat message to the player with count and name of the item.
      3. Otherwise
         1. Send a chat message to the player telling them that the pedestal's empty
2. Return `true`

{% highlight java linenos %}
// ...
public class BlockPedestal extends BlockTileEntity<TileEntityPedestal> {

	// ...

	@Override
	public boolean onBlockActivated(World world, BlockPos pos, IBlockState state, EntityPlayer player, EnumHand hand, EnumFacing side, float hitX, float hitY, float hitZ) {
		if (!world.isRemote) {
			TileEntityPedestal tile = getTileEntity(world, pos);
			IItemHandler itemHandler = tile.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY, side);
			if (!player.isSneaking()) {
				if (heldItem.isEmpty()) {
					player.setHeldItem(hand, itemHandler.extractItem(0, 64, false));
				} else {
					player.setHeldItem(hand, itemHandler.insertItem(0, heldItem, false));
				}
				tile.markDirty();
			} else {
				ItemStack stack = itemHandler.getStackInSlot(0);
				if (!stack.isEmpty()) {
					String localized = TutorialMod.proxy.localize(stack.getUnlocalizedName() + ".name");
					player.addChatMessage(new TextComponentString(stack.getCount() + "x " + localized));
				} else {
					player.addChatMessage(new TextComponentString("Empty"));
				}
			}
		}
		return true;
	}
	
	// ...

}
{% endhighlight %}

The `IItemHandler` and capability stuff might look a bit confusing, but that's ok, it will be explained in more detail later on. For now, suffice it to say that the `IItemHandler` is the object that stores the pedestal's inventory.

Before we can continue, we'll also need to add a new method to our proxy class. This method will take an unlocalized name (e.g. `item.diamond.name`) and translate it into the correct version (e.g. `Diamond`). This needs to be a method in our proxy class because there are two different ways of localizing things depending if you're on the client or the server. If you're on the server, you need to use `net.minecraft.util.text.translation.I18n` whereas if you're on the client, you need to use `net.minecraft.client.resources.I18n`. In our `CommonProxy` class, we'll add the server-side version of this:

{% highlight java linenos %}
// ...
import net.minecraft.util.text.translation.I18n;

public class CommonProxy {

	// ...

	public String localize(String unlocalized, Object... args) {
		return I18n.translateToLocalFormatted(unlocalized, args);
	}

}
{% endhighlight %}

And in the `ClientProxy`, we'll add the client-side version of this:

{% highlight java linenos %}
// ...
import net.minecraft.client.resources.I18n;

public class ClientProxy extends CommonProxy {

	// ...

	@Override
	public String localize(String unlocalized, Object... args) {
		return I18n.format(unlocalized, args);
	}

}
{% endhighlight %}

The very last thing we'll need to add to our block class is the `breakBlock` method. This method is called when our block is destroyed in the world, and we'll use it to drop the contents of the pedestal's inventory.

{% highlight java linenos %}
// ...
public class BlockPedestal extends BlockTileEntity<TileEntityPedestal> {

	// ...

	@Override
	public void breakBlock(World world, BlockPos pos, IBlockState state) {
		TileEntityPedestal tile = getTileEntity(world, pos);
		IItemHandler itemHandler = tile.getCapability(CapabilityItemHandler.ITEM_HANDLER_CAPABILITY, EnumFacing.NORTH);
		ItemStack stack = itemHandler.getStackInSlot(0);
		if (!stack.isEmpty()) {
			EntityItem item = new EntityItem(world, pos.getX(), pos.getY(), pos.getZ(), stack);
			world.spawnEntityInWorld(item);
		}
		super.breakBlock(world, pos, state);
	}
	
	// ...

}
{% endhighlight %}

In the break block method, we'll:

1. Get the tile entity instance, the `IItemHandler` instance, and the `ItemStack` stored in the inventory.
2. If there is a stack (i.e. `!stack.isEmpty()`):
   1. Create a new `EntityItem` instance at the correct position with the stack
   2. Spawn the entity in the world so the item is dropped
3. Call the `super.breakBlock` method to remove our block and tile entity from the world.

## The Tile Entity

Like in the previous tutorial, the tile entity class itself will be fairly simple. This is possible because of Forge's `IItemHandler` capability and its `ItemStackHandler` class which handles all the logic for storing items, reading/writing them to/from NBT, and inserting/extracting items. 

### Capabilities

Forge provides a simple Entity Component System called capabilities. Capabilities allow mod developers to easily add/use functionality without having to implement lots of interfaces or perform lots of `instanceof` checks and casts. In this tutorial we'll use the Forge-provided `IItemHandler` capability which is a replacement for Vanilla's `IInventory` and `ISidedInventory`. We'll be using the `ItemStackHandler` implementation of the `IItemHandler` interface which is provided by Forge. By overriding the `hasCapability` and `getCapability` methods of our tile entity, we can "regster" the capabilty object and make it accessible to everyone else.

The `IItemHandler` interface provides a couple methods that we can use for interacting with the inventory:

1. `insertItem`: This method takes 3 parameters: `int slot`, `ItemStack stack`, and `boolean simulate` and returns an `ItemStack`.
   1. `int slot`: The index of the slot in the inventory that we want to insert into.
   2. `ItemStack stack`: The stack that we are attempting to insert.
   3. `boolean simulate`: If true, no modification of the `IItemHandler`'s internal inventory will be performed. This is useful if you want to test if an interaction can be performed.
   4. `ItemStack` return: The remainder of the stack that could not be inserted. If the stack was fully inserted, this will be `ItemStack.EMPTY`.
2. `extractItem`: This method takes 3 parameters: `int slot`, `int amount`, `boolean simulate` and returns an `ItemStack`.
   1. `int slot`: The index of the slot in the inventory that we want to extract from.
   2. `int amount`: The amount of items we want to extract from the slot.
   3. `boolean simulate`: If true, no modification of the `IItemHandler`'s internal inventory will be performed. This is useful if you want to test if an interaction can be performed.
   4. `ItemStack` return: The stack that was extracted from the inventory.

**Note:** If you want to know more about capabilities, you can checkout the [official Forge documentation](http://mcforge.readthedocs.io/en/latest/datastorage/capabilities/) on the subject.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block.pedestal;

import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.util.EnumFacing;
import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.items.CapabilityItemHandler;
import net.minecraftforge.items.ItemStackHandler;

import javax.annotation.Nullable;

public class TileEntityPedestal extends TileEntity {

	private ItemStackHandler inventory = new ItemStackHandler(1);

	@Override
	public NBTTagCompound writeToNBT(NBTTagCompound compound) {
		compound.setTag("inventory", inventory.serializeNBT());
		return super.writeToNBT(compound);
	}
	
	@Override
	public void readFromNBT(NBTTagCompound compound) {
		inventory.deserializeNBT(compound.getCompoundTag("inventory"));
		super.readFromNBT(compound);
	}
	
	@Override
	public boolean hasCapability(Capability<?> capability, @Nullable EnumFacing facing) {
		return capability == CapabilityItemHandler.ITEM_HANDLER_CAPABILITY || super.hasCapability(capability, facing);
	}
	
	@Nullable
	@Override
	public <T> T getCapability(Capability<T> capability, @Nullable EnumFacing facing) {
		return capability == CapabilityItemHandler.ITEM_HANDLER_CAPABILITY ? (T)inventory : super.getCapability(capability, facing);
	}

}
{% endhighlight %}

In our tile entity, we'll have a `private ItemStackHandler inventory` field which is initialized to a `new ItemStackHandler(1)`. The first parameter of the `ItemStackHandler` constructor is the number of slots it should have. In our case, this is 1 because the pedestal can only hold 1 stack at a time. 

`ItemStackHandler` also provides `serializeNBT` and `deserializeNBT` methods making it very easy to save our inventory. In the `writeToNBT` method, we'll call `inventory.serializeNBT()` to create an `NBTTagCompound` that represents the inventory and set that to the key `inventory` on the root compound. Similarly, in the `readFromNBT` method, we'll retrieve the tag compound that has the key `inventory` and pass it to `inventory.deserializeNBT` so that the items that were saved to NBT are loaded back into our `ItemStackHandler` object.

Lastly, we'll override the `hasCapability` and `getCapability` methods. In `hasCapability` we'll return if the capability being tested is the `IItemHandler` capability instance, or if it's provided by the super method*. Likewise, in the `getCapability` method, we'll check if the capability being requested is the `IItemHandler` capability and if so, return our `inventory`, and otherwise, delegate to the super method\*.

*: We delegate back to the super method because Forge provides an `AttachCapabilitiesEvent` which allows other mods to add capabilites to tile entities and other objects that they don't own.

## Finished

Now we can launch Minecraft and see how our pedestal can now store an item in its inventory:

![Pedestal Gif](https://zippy.gfycat.com/DescriptiveWhoppingBangeltiger.gif)