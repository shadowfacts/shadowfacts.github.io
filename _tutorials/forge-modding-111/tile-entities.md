---
date: 2016-11-27 12:32:42 -0400
title: "Tile Entities"
type: 'tutorial'
series: 'forge-modding-111'
series-name: 'Making a Forge Mod for 1.11'
layout: tutorial
---

In Minecraft, the `Block` class is used to represent a _type_ of block, not a single block in the world. The `Block` instance has the properties for every single instance of your block that exists. If we want to have data that is unique to an instance of a block in the world, we need to use a `TileEntity`.

A common myth that exists in the world of modding is that tile entities are bad, especially for performance. **This is not true.** Tile entities can be bad for performance if they're implemented poorly, just like anything else, but they are not bad just by virtue of existing.

There are two varieties of tile entities: _ticking_ and _non-ticking_. Ticking tile entities, as the name implies, are updated (or ticked) every single game tick (usually 20 times per second). Tick tile entities are the more performance intensive kind because they're updated so frequently and as such, need to be written carefully. Non-ticking tile entities on the other hand don't tick at all, they exist simply for storing data. In this tutorial we'll be making a non-ticking tile entity. Ticking tile entities we'll get to later.

## Helper Stuff

Before we create the tile entity, we'll add some more code to our mod that will make it easier to add more tile entities in the future.

Firstly, we'll create a `BlockTileEntity` class in our `block` package.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block;

import net.minecraft.block.material.Material;
import net.minecraft.block.state.IBlockState;
import net.minecraft.tileentity.TileEntity;
import net.minecraft.util.math.BlockPos;
import net.minecraft.world.IBlockAccess;
import net.minecraft.world.World;

import javax.annotation.Nullable;

public abstract class BlockTileEntity<TE extends TileEntity> extends BlockBase {

	public BlockTileEntity(Material material, String name) {
		super(material, name);
	}
	
	public abstract Class<TE> getTileEntityClass();
	
	public TE getTileEntity(IBlockAccess world, BlockPos pos) {
		return (TE)world.getTileEntity(pos);
	}
	
	@Override
	public boolean hasTileEntity(IBlockState state) {
		return true;
	}
	
	@Nullable
	@Override
	public abstract TE createTileEntity(World world, IBlockState state);

}
{% endhighlight %}

Our `BockTileEntity` class wil provide a couple of things:

1. It will extend `BlockBase` so we still have access to all our existing helpers.
2. It will have a generic parameter `TE` which will be the type of our tile entity class. This will be used to create a simple helper method to reduce the numebr of casts necessary to obtain the instance of our tile entity for a specific position in the world and to ensure that the `TileEntity` we create is of the correct type for our block instance.
3. It will override the `hasTileEntity(IBlockState)` method from Minecraft's `Block` class to return `true`. This will tell Minecraft that our block has a tile entity associated with it that needs to be created.
4. It will have two abstract methods:
   1. `getTileEntityClass`: From here, we'll return the `Class` that our tile entity is so it can automatically be registered when our block is registered.
   2. `createTileEntity`: This is a more specific version of the `Block` class' `createTileEntity`. This method will be called by Minecraft whenever it needs to create a new instance of our tile entity, like when our block has been placed.

Nextly, we'll add another check to the `register` method in our `ModBlocks` class. This will check if the block being registered is an instance of our `BlockTileEntity` class and if so, register the tile entity class that's associated with the block to the name of the block. (This tile entity registration is necessary so that Minecraft knows which class to create for a tile entity that's been saved to and reloaded from the disk.)

{% highlight java linenos %}
// ...
public class ModBlocks {

	// ...

	private static <T extends Block> T register(T block, ItemBlock itemBlock) {
		GameRegistry.register(block);
		// ...
	
		if (block instanceof BlockTileEntity) {
			GameRegistry.registerTileEntity(((BlockTileEntity<?>)block).getTileEntityClass(), block.getRegistryName().toString());
		}
	
		return block;
	}
	
	// ...

}
{% endhighlight %}

## The Block

Now that we've got all the necessary helpers out of the way it's time to create the block.

We'll create a new class called `BlockCounter` in the `block.counter` package of our mod. This class will be block class that extends `BlockTileEntity`. (This class will have some errors because we haven't created the tile entity class itself yet.)

{% highlight java linenos %}

package net.shadowfacts.tutorial.block.counter;

import net.minecraft.block.material.Material;
import net.minecraft.block.state.IBlockState;
import net.minecraft.entity.player.EntityPlayer;
import net.minecraft.item.ItemStack;
import net.minecraft.util.EnumFacing;
import net.minecraft.util.EnumHand;
import net.minecraft.util.math.BlockPos;
import net.minecraft.util.text.TextComponentString;
import net.minecraft.world.World;
import net.shadowfacts.tutorial.block.BlockTileEntity;

import javax.annotation.Nullable;

public class BlockCounter extends BlockTileEntity<TileEntityCounter> {

	public BlockCounter() {
		super(Material.ROCK, "counter");
	}
	
	@Override
	public boolean onBlockActivated(World world, BlockPos pos, IBlockState state, EntityPlayer player, EnumHand hand, EnumFacing side, float hitX, float hitY, float hitZ) {
		if (!world.isRemote) {
			TileEntityCounter tile = getTileEntity(world, pos);
			if (side == EnumFacing.DOWN) {
				tile.decrementCount();
			} else if (side == EnumFacing.UP) {
				tile.incrementCount();
			}
			player.addChatMessage(new TextComponentString("Count: " + tile.getCount()));
		}
		return true;
	}
	
	@Override
	public Class<TileEntityCounter> getTileEntityClass() {
		return TileEntityCounter.class;
	}
	
	@Nullable
	@Override
	public TileEntityCounter createTileEntity(World world, IBlockState state) {
		return new TileEntityCounter();
	}

}
{% endhighlight %}

Our block class will extend `BlockTileEntity` and have a generic parameter of `TileEntityCounter` because that's the type of tile entity that belongs to this block.

In the constructor, we'll simply call the super constructor with the material `ROCK` and the name `"counter"`. 

In the `getTileEntityClass` method, we'll return `TileEntityCounter.class` (this wil cause an error, but don't worry, we haven't created this class yet). This will allow our `ModBlocks` class to automatically register our `TileEntityCounter.class` to the name `tutorial:counter`.

In the `createTileEntity` class, we'll simply return a new instance of our `TileEntityCounter ` class.

Lastly, and most importantly, in the `onBlockActivated`  method, which is called when our block is right-clicked, we'll do a number of things:

1. Check that we're operating on the server[*](#sides).
   1. Retrieve the `TileEntityCounter` instance.
   2. If the player hit the bottom side:
      1. Decrement the counter.
   3. Or if the player hit the top side:
      1. Increment the counter.
   4. Send a chat message to the player with the current value of the counter.
2. Return true



<h2 id="sides">Sides</h2>

As I mentioned above, before we modify the counter, we check that we're on the server. We need to do this because the Minecraft client and the server are completely separated and some methods are called on both.

In a multiplayer scenario, there are multiple clients connect to one server. In this case, the distinction between client and server is fairly obvious, but in a single player scenario, things get more complicated. In a multiplayer scenario, the servger that everybody's connecting to is referred to as the **physical server** and all of the individual clients are the **physical clients**.

In a single player world, the client and the server are still decoupled, even though they are running on the same computer (and even in the same JVM, just on different threads). In singleplayer, the client connects to a local, private server that functions very similarly to a physical server. In this case, the server thread is referred to as the **logical server** and the client thread as the **logical client** because both logical sides are running on the same physical side.

The `World.isRemote` field is used to check which logical side we're operating on (be it logical or physical). The field is `true` for the physical client in a multiplayer scenario and for the logical client in a single-player scenario. The reverse is also true. The field is `false` for the physical server in a multiplayer scenario and for the logical server in the single-player scenario. So by checking `!world.isRemote`, we ensure that the code inside the `if` statement will only be run on the server (be it logical or physical).

If you want to know more about sides in Minecraft and how they work, you can see [here](http://mcforge.readthedocs.io/en/latest/concepts/sides/) for the official Forge documentation.

## The `TileEntity`

Now that our block is finished, we can finally create the tile entity itself.

We'll create a new class called `TileEntityCounter` which will also reside in the `block.counter` package of our mod (this is my preferred package structure, however, many people also prefer to have all the tile entity classes reside in a separete `tileentity` package and the block classes reside in the `block` package).

{% highlight java linenos %}
package net.shadowfacts.tutorial.block.counter;

import net.minecraft.nbt.NBTTagCompound;
import net.minecraft.tileentity.TileEntity;

public class TileEntityCounter extends TileEntity {

	private int count;

	@Override
	public NBTTagCompound writeToNBT(NBTTagCompound compound) {
		compound.setInteger("count", count);
		return super.writeToNBT(compound);
	}
	
	@Override
	public void readFromNBT(NBTTagCompound compound) {
		count = compound.getInteger("count");
		super.readFromNBT(compound);
	}
	
	public int getCount() {
		return count;
	}
	
	public void incrementCount() {
		count++;
	}
	
	public void decrementCount() {
		count--;
	}

}
{% endhighlight %}

Our `TileEntityCounter` class is fairly simple. It will:

- Extend Minecraft's `TileEntity` class so Minecraft knows what to do with it.
- Have a private `int count` field which will store the value of the counter.
- Override the `writeToNBT` and `readFromNBT` methods so Minecraft is able to properly save and load it from the disk.
- Provide `getCount`, `incrementCount`, and `decrementCount` methods for accessing and modifying the value of the field.

### The NBT (Named Binary Tag) Format

NBT is a format for storing all types of data into a key/value tree structure that can easily be serialized to bytes and saved to the disk. You can read more about the internal structure of the NBT format [here](http://wiki.vg/NBT). You can look at the `NBTTagCompound` class in Minecraft to see all the types of things that can be stored. Vanilla code is also a good example of how to store more complex things in NBT.

In this case, we'll store our `count` integer field with the `count` key in the `NBTTagCompound` in the `writeToNBT` method and read it back from the tag compound in the `readFromNBT` method.

## Registration

Lastly, we'll need to add our counter to our `ModBlocks` class.

{% highlight java linenos %}
// ...
public class ModBlocks {

	// ...
	public static BlockCounter counter;

	public static void init() {
		// ...
		counter = register(new BlockCounter());
	}

	// ...

}
{% endhighlight %}

## Finished

Now that we've got everything done, we can run Minecraft, grab one of our counters from our creative tab, place it, and see how the counter changes when the top and bottom of the block are right-clicked.

![Click on the top](http://i.imgur.com/zD1x2m0.png)

![Click on the bottom](http://i.imgur.com/UCqVJSI.png)