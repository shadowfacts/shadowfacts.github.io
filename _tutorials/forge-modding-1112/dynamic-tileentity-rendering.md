---
date: 2017-03-30 17:03:42 -0400
title: "Dynamic TileEntity Rendering"
type: 'tutorial'
series: 'forge-modding-1112'
series-name: 'Making a Forge Mod for 1.11.2'
layout: tutorial
---

Now that our Pedestal is capable of storing an item and has a GUI with which players can interact, let's add some rendering code so the stored item actually renders in the world.

## Updating the `TileEntity`
The first thing we'll need to do is make some modifications to our `TileEntityPedestal` to accomodate the new rendering code.

First off, we'll add a `long` field called `lastChangeTime` to our TE. This field will store the world time, in ticks, of the last time the TE's inventory was modified. This number will be used in our rendering code to make sure that, when the pedestal's item is bobbing up and down (similar to item entities), they're not all synchronized.

{% highlight java linenos %}
// ...
public class TileEntityPedestal extends TileEntity {
​	
	private ItemStackHandler inventory = new ItemStackHandler(1);
	public long lastChangetime;
	
	// ...
}
{% endhighlight %}

We'll also add this to the `writeToNBT` and `readFromNBT` methods so that it persists between launches:

{% highlight java linenos %}
// ...
public class TileEntityPedestal extends TileEntity {
	// ...
	@Override
	public NBTTagCompound writeToNBT(NBTTagCompound compound) {
		compound.setTag("inventory", inventory.serializeNBT());
		compound.setLong("lastChangeTime", lastChangeTime);
		return super.writeToNBT(compound);
	}
	
	@Override
	public void readFromNBT(NBTTagCompound compound) {
		inventory.deserializeNBT(compound.getCompoundTag("inventory"));
		lastChangeTime = compound.getLong("lastChangeTime");
		super.readFromNBT(compound);
	}
	// ...
}
{% endhighlight %}

Nextly, we'll make our `inventory` field public and  change our `ItemStackHandler` instance to override the `onContentsChanged` method on instantiation. We need this because, when our TE's inventory is updated on the server, we'll need to notify the client of the change so that it renders the correct item.

{% highlight java linenos %}
// ...
public class TileEntityPedestal extends TileEntity {
​	
	public ItemStackHandler inventory = new ItemStackHandler(1) {
		@Override
		protected void onContentsChanged(int slot) {
			if (!world.isRemote) {
				lastChangeTime = world.getTotalWorldTime();
				TutorialMod.network.sendToAllAround(new PacketUpdatedPedestal(TileEntityPedestal.this), new NetworkRegistry.TargetPoint(world.provider.getDimension(), pos.getX(), pos.getY(), pos.getZ(), 64));
			}
		}
	};
	
	// ...
}
{% endhighlight %}

The `onContentsChanged` method is called by Forge's `ItemStackHandler` every time what's stored in a slot changes. We surround our code in a `!world.isRemote` check because we don't want this code, which sends a packet, to be executed on the client and the server, but just the server. 

This code updates the `lastChangeTime` field with the current world time and sends a `PacketUpdatePedestal` (which we'll create in the next section) to every player within 64 meters of our block's position.

Nextly, we'll override the `onLoad` method. This method will (on the client side) send a packet to the server requesting an update, which will inform the client of what's stored in the pedestal and the last time it was modified. We specifically request a packet when a client loads the TE because the TE is only saved on the server, and the client isn't aware of what data is stored in it, so we specifically request an update from the server.

{% highlight java linenos %}
// ...
public class TileEntityPedestal extends TileEntity {
​	// ...
	@Override
	public void onLoad() {
		if (world.isRemote) {
			TutorialMod.network.sendToServer(new PacketRequestUpdatePedestal(this));
		}
	}
	// ...
}
{% endhighlight %}

The `world.isRemote` check makes sure that the packet is only sent when `onLoad` is being called on the client side and `sendToServer`, as the name suggests, sends the packet to the server. The packet itself, `PacketRequestUpdatePedestal`, will be created in the next section.

Lastly for the tile entity, we'll override the `getRenderBoundingBox` method. This method returns an Axis Aligned Bounding Box (AABB) which is used by Minecraft to check if our tile entity should be rendered. If the AABB is in view on the player, it will be rendered, otherwise it won't. Because of the way our tile entity will render the item (floating above the pedestal base), we need to use a larger box than normal, so that  if the base is out of view but the item isn't, the item is still rendered.

{% highlight java linenos %}
// ...
public class TileEntityPedestal extends TileEntity {
​	// ...
	@Override
	public AxisAlignedBB getRenderBoundingBox() {
		return new AxisAlignedBB(getPos(), getPos().add(1, 2, 1));
	}
	// ...
}
{% endhighlight %}

Here we simply return a new box with the first position being at the block's position and the second position being at the opposite corner that's two above the base of the block.

## Networking
This is the first feature in our mod for which we'll need networking and packets to transmit information between the client and server.

For networking in our mod, we'll use Forge's SimpleImpl system which is split into three parts:

1. A channel (a `SimpleNetworkWrapper` instance) which is unique to our mod and is managed by Forge.
2. An `IMessage` implementation. This handles serializing/deserializing for transmission over the network.
3. An `IMessageHandler` implementation which is used to run code when the packet is received.

Firstly, we'll need to setup our `SimpleNetworkWrapper` instance. Let's add a field to our main mod class:

{% highlight java linenos %}
// ...
public class TutorialMod {
	// ...
	public static SimpleNetworkWrapper wrapper;
	// ...
}
{% endhighlight %}

And then we'll set it up in our `preInit` method:
{% highlight java linenos %}
// ...
public class TutorialMod {
	// ...

	@Mod.EventHandler
	public void preInit(FMLPreInitializationEvent event) {
		// ...
	
		network = NetworkRegistry.INSTANCE.newSimpleChannel(modId);
		network.registerMessage(new PacketUpdatePedestal.Handler(), PacketUpdatePedestal.class, 0, Side.CLIENT);
		network.registerMessage(new PacketRequestUpdatePedestal.Handler(), PacketRequestUpdatePedestal.class, 1, Side.SERVER);
	}
	
	// ...
}
{% endhighlight %}

In this code, we:

1. Call `newSimpleChannel` with our mod ID to obtain a `SimpleNetworkWrapper` instance specific to our mod.
2. Call `registerMessage` on our channel to register our two packets. For each packet, we pass in the `IMessageHandler` instance, the class of the `IMessage` implementation, the ID (unique to our channel) of the packet, and the `Side` on which it's received.

The two packets we register are: the `PacketUpdatePedestal`, which is sent from the server to the client and updates the item stored in the pedestal on the client side, and the `PacketRequestUpdatedPedestal` , which is sent from the client to the server to request an update from the server. The `PacketUpdatePedestal` is used whenever the item changes on the server to notify the client. The `PacketRequestUpdatePedestal` is sent to the server when the client first joins to get the stored stack (because the data is only saved on the server, not the client).

Let's start with the `PacketUpdatePedestal` class. We'll create it in a new `network` package and we'll make it implement Forge's `IMessage` interface.

{% highlight java linenos %}
package net.shadowfacts.tutorial.network;

import net.minecraftforge.fml.network.simpleimpl.IMessage;

public class PacketUpdatePedestal implements IMessage {
​	
}
{% endhighlight %}

The first thing we'll need to do is add a couple fields to the packet. The fields we'll need are: `BlockPos pos` for the tile entity's position, `ItemStack stack` for the stack that's stored in the pedestal, and `long lastChangeTime` for the last time the pedestal's constant has changed.

{% highlight java linenos %}
// ...
public class PacketUpdatePedestal implements IMessage {
​	
	private BlockPos pos;
	private ItemStack stack;
	private long lastChangeTime;

}
{% endhighlight %}

Nextly, we'll add a couple constructors. The first constructor will take parameters for all three fields and assign them as expected. The second one will be a convince constructor that takes a parameter for the `TileEntityPedestal` and calls the first constructor will all the values determined from the TE. The last constructor will take no parameters and won't initialize any of the fields. This is necessary because Forge's SimpleImpl will call it via reflection and then call the `fromBytes` method which will initialize the fields.

{% highlight java linenos %}
// ...
public class PacketUpdatePedestal implements IMessage {
	// ...

	public PacketUpdatePedestal(BlockPos pos, ItemStack stack, long lastChangeTime) {
		this.pos = pos;
		this.stack = stack;
		this.lastChangeTime = lastChangeTime;
	}
	
	public PacketUpdatePedestal(TileEntityPedestal te) {
		this(te.getPos(), te.inventory.getStackInSlot(0), te.lastChangeTime);
	}
	
	public PacketUpdatePedestal() {
	}

}
{% endhighlight %}

Next, we'll implement the `toBytes` and `fromBytes` methods which respectively serialize to a `ByteBuf` for transmission over the network and deserialize it back from a `ByteBuf`. One key thing about these two methods is that because they're serializing/deserializing from a `ByteBuf`, which is just a sequence of bytes, we need to do everything in the same order in both methods.

{% highlight java linenos %}
// ...
public class PacketUpdatePedestal implements IMessage {
	// ...

	@Override
	public void toBytes(ByteBuf buf) {
		buf.writeLong(pos.toLong());
		ByteBufUtils.writeItemStack(buf, stack);
		buf.writeLong(lastChangeTime);
	}
	
	@Override
	public void fromBytes(ByteBuf buf) {
		pos = BlockPos.fromLong(buf.readLong());
		stack = ByteBufUtils.readItemStack(buf);
		lastChangeTime = buf.readLong();
	}

}
{% endhighlight %}

First, we use `BlockPos`' `toLong` and `fromLong` to serialize that, then we use the helper methods in `ByteBufUtils` to serialize the stack, and lastly we write the `lastChangeTime`. Note that we're reading/writing things in the same order in both these methods. This is very important, and if something's out of order, we'll end up getting the wrong data  when our packet is received.

Lastly, we'll add the handler. Let's create a static inner `Handler` class in our `PacketUpdatePedestal` class that implements `IMessageHandler`. This interface takes two generic type paramters: the type of the packet that the handler's handling and the type of the packet that the handler responds with. The first type will obviously be `PacketUpdatePedestal` and, because we don't want to respond with a packet, the return packet type will just be `IMessage` and we'll return `null` from the handler method.

What we're going to do in the handler's `onMessage` method is get the tile entity from the world and update its inventory and `lastChangeTime`. Unfortunately, there's a caveat to this so it's a bit more complicated. With Netty (the library Minecraft and Forge use for networking), packets are handled on a different thread that's not the main thread. Because we're going to be interacting with and modifying the world, we can't just do it from a different thread because it could potentially cause a `ConcurrentModificationException` to be thrown. To deal with this, we'll call the `Minecraft.addScheduledTask` method which executes the given `Runnable` on the main thread as soon as possible, so in this runnable, we _can_ interact with the world.

In the runnable, we simply get the tile entity from the client world (`Minecraft.getMinecraft().world`) and modify its inventory and set its `lastChangeTime` field.

{% highlight java linenos %}
// ...
public class PacketUpdatePedestal implements IMessage {
	// ...

	public static class Handler implements IMessageHandler<PacketUpdatePedestal, IMessage> {

		@Override
		public IMessage onMessage(PacketUpdatePedestal message, MessageContext ctx) {
			Minecraft.getMinecraft().addScheduledTask(() -> {
				TileEntityPedestal te = (TileEntityPedestal)Minecraft.getMinecraft().world.getTileEntity(message.pos);
				te.inventory.setStackInSlot(0, message.stack);
				te.lastChangeTime = message.lastChangeTime;
			});
			return null;
		}
	
	}

}
{% endhighlight %}

Lastly for networking, we'll add one more packet: `PacketRequestUpdatePedestal`. This packet is sent from the client to the server when the client loads the tile entity and needs to get its data from the server. This packet will be fairly similar to the previous one, so I won't go over it in as much detail.

This packet has a position and a dimension ID. (This one needs a dimension ID unlike the previous one because this will be received on the server which has multiple worlds, and we need a way to determine which one to use, whereas the previous packet was received on the client which only ever has one world.) These are serialized/deserialized as you'd expect. 

The handler class, however, has a slight difference. Unlike the `PacketUpdatePedestal`, this packet has a response packet. So for the generic types we'll use `PacketRequestUpdatePedestal` and `PacketUpdatePedestal`. In the `onMessage` method, we'll call `FMLCommonHandler.instance().getMinecraftServerInstance()` to obtain the instance of `MinecraftServer`, which stores all the worlds. On that instance we'll call `worldServerForDimension` with the dimension from the packet to obtain the `World` instance. We then get the tile entity and return a new `PacketUpdatePedestal` from it which is sent back to the client.

{% highlight java linenos %}
// ...
public class PacketRequestUpdatePedestal implements IMessage {

	private BlockPos pos;
	private int dimension;
	
	public PacketRequestUpdatePedestal(BlockPos pos, int dimension) {
		this.pos = pos;
		this.dimension = dimension;
	}
	
	public PacketRequestUpdatePedestal(TileEntityPedestal te) {
		this(te.getPos(), te.getWorld().provider.getDimension());
	}
	
	public PacketRequestUpdatePedestal() {
	}
	
	@Override
	public void toBytes(ByteBuf buf) {
		buf.writeLong(pos.toLong());
		buf.writeInt(dimension);
	}
	
	@Override
	public void fromBytes(ByteBuf buf) {
		pos = BlockPos.fromLong(buf.readLong());
		dimension = buf.readInt();
	}
	
	public static class Handler implements IMessageHandler<PacketRequestUpdatePedestal, PacketUpdatePedestal> {
	
		@Override
		public PacketUpdatePedestal onMessage(PacketRequestUpdatePedestal message, MessageContext ctx) {
			World world = FMLCommonHandler.instance().getMinecraftServerInstance().worldServerForDimension(message.dimension);
			TileEntityPedestal te = (TileEntityPedestal)world.getTileEntity(message.pos);
			if (te != null) {
				return new PacketUpdatePedestal(te);
			} else {
				return null;
			}
		}
	
	}

}
{% endhighlight %}

**Note:** See the [official Forge documentation](http://mcforge.readthedocs.io/en/latest/networking/simpleimpl/) for more information about the SimpleImpl networking system.

## `TileEntitySpecialRenderer`

Now that we've updated the tile entity and finished all the networking code, we can finally write the renderer itself.

Let's create a class called `TESRPedestal` in our `block.pedestal` package that extends `TileEntitySpecialRenderer`. The generic type paramter is the type of our tile entity, so we'll use `TileEntityPedestal`.

{% highlight java linenos %}
package net.shadowfacts.tutorial.block.pedestal;

import net.minecraft.client.renderer.tileentity.TileEntitySpecialRenderer;

public class TESRPedestal extends TileEntitySpecialRenderer<TileEntityPedestal> {
​	
}
{% endhighlight %}

Next, we'll overide the `renderTileEntityAt` method. First, we'll get the stored stack from the tile entity, and then, if the stack isn't empty, setup the GL state, render the stack, and reset the GL state.

{% highlight java linenos %}
// ...
public class TESRPedestal extends TileEntitySpecialRenderer<TileEntityPedestal> {

	@Override
	public void renderTileEntityAt(TileEntityPedestal te, double x, double y, double z, float partialTicks, int destroyStage) {
		ItemStack stack = te.inventory.getStackInSlot(0);
		if (!stack.isEmpty()) {
			GlStateManager.enableRescaleNormal();
			GlStateManager.alphaFunc(GL11.GL_GREATER, 0.1f);
			GlStateManager.enableBlend();
			RenderHelper.enableStandardItemLighting();
			GlStateManager.tryBlendFuncSeparate(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA, 1, 0);
			GlStateManager.pushMatrix();
			double offset = Math.sin((te.getWorld().getTotalWorldTime() - te.lastChangeTime + partialTicks) / 8) / 4.0;
			GlStateManager.translate(x + 0.5, y + 1.25 + offset, z + 0.5);
			GlStateManager.rotate((te.getWorld().getTotalWorldTime() + partialTicks) * 4, 0, 1, 0);
	
			IBakedModel model = Minecraft.getMinecraft().getRenderItem().getItemModelWithOverrides(stack, te.getWorld(), null);
			model = ForgeHooksClient.handleCameraTransforms(model, ItemCameraTransforms.TransformType.GROUND, false);
	
			Minecraft.getMinecraft().getTextureManager().bindTexture(TextureMap.LOCATION_BLOCKS_TEXTURE);
			Minecraft.getMinecraft().getRenderItem().renderItem(stack, model);
	
			GlStateManager.popMatrix();
			GlStateManager.disableRescaleNormal();
			GlStateManager.disableBlend();
		}
	}

}
{% endhighlight %}

After setting up the GL state (lighting, blending, etc.), we perform the translation (`GlStateManager.translate`) and rotation (`GlStateManager.rotate`). 

There are two parts to the translation: we translate it to `x + 0.5`, `y + 1.25`, and `z + 0.5` which is above the center of our block, on top of the pedestal. The second part is the part that changes: the `offset` in the `y` value. The offset is the height of the item for any given frame. We recalculate this each time because we want it ot be animating bouncing up and down. We calculate this by:

1. Taking the time (in ticks) since the pedestal was modified by subtracting the `lastChangeTime` from the current total world time.
2. Adding the partial ticks. (The partial ticks is a fractional value representing the amount of time that's passed between the last full tick and now. We use this because otherwise the animation would be jittery because there are fewer ticks per second than frames per second.)
3. Dividing that by 8 to slow the movement down.
4. Taking the sine of that to produce a value that's oscillating back and forth.
5. Dividing that by 4 to compress the sine wave vertically so the item doesn't move up and down as much.

Nextly, we perform the rotation. For this, we take the total world time and add `partialTicks` to it, and multiply it by 4. Unlike for the translation, we don't use a sine wave because we want the item to rotate at a fixed speed. With a sine wave, the rate of rotation would change and it would look rather weird. The last three parameters to the `GlStateManager.rotate` is the vector about which it will be rotated. Because we want to rotate it horizontally we use the vector along the Y-axis: (0, 1, 0).

Now, that the GL state is all setup the way we want it, we can actually render the model. We call `getItemModelWithOverrides` on the `RenderItem` instance obtained from `Minecraft.getMinecraft()` with parameters for the `ItemStack` to be rendered, the `World` it'll be rendered in, and `null` for the entity parameter to indicate that there is no entity. This gives the `IBakedModel` instance for the `ItemStack`. 

`IBakedModel` is asort of "compiled" representation of a model. It has all of the data from the JSON model (or another source) compressed down into a list of `BakedQuad`s that can be passed directly to OpenGL to be rendered.

Now that we've got the `IBakedModel` instance, we call `ForgeHooksClient.handleCameraTransforms` with some parameters: the model that it should handle the transformations for, the type of transformations that should be applied (in this case, `TransformType.GROUND` because on the ground is the closest to what we want because we're rendering it in the world), and `false` for the last parameter because we are not rendering the item in the left hand. 

The `handleCameraTransforms` method handles everything necessary for one of Forge's features: `IPerspectiveAwareModel`. This is an extension of the `IBakedModel` interface which allows the model to be overridden depending on how it's being rendered and provide custom transformations from code. If the model we've gotten from `getItemModelWithOverriddes` is an `IPerspectiveAwareModel`, Forge will call the correct method to get the transformation for the given type (in this case, `GROUND`) and apply those transformations to the current GL state.

Now that we've got the model, we call `bindTexture` on the `TextureManager` instance obtained from `Minecraft.getMinecraft().getTextureManager()` with the ID of the texture we want to bind. In this case, because we want to be bind the main texture map which contains all of the textures that are used in the models, we use the ID `TextureMap.LOCATION_BLOCKS_TEXTURE`. This field name is a bit of a misnomer because it's not just for blocks, it stores the textures for items as well.

With the texture map boudn, we can finally render the item itself. We call `renderItem` with the `ItemStack` we're rendering and the `IBakedModel` to render on the `RenderItem` instance. 

Once we've finished rendering, we reset the GL state back to what it was before our TESR started rendering.

Lastly, we'll need to register our TESR. Let's create a new method in our proxiescalled `registerRenderers`. In our `CommonProxy` this method won't do anything because we only want to register our renderers on the client side. In our `ClientProxy` we'll bind our TESR to our tile entity so that it gets rendered.

{% highlight java linenos %}
// ...
public class CommonProxy {
	// ...

	public void registerRenderers() {
	}

}
{% endhighlight %}

{% highlight java linenos %}
// ...
public class ClientProxy extends CommonProxy {
	// ...

	@Override
	public void registerRenderers() {
		ClientRegistry.bindTileEntitySpecialRenderer(TileEntityPedestal.class, new TESRPedestal());
	}

}
{% endhighlight %}

We call `bindTileEntitySpecialRenderer` to bind a new instance of our `TESRPedestal` to the `TileEntityPedestal` class. This way, for every instance of the `TileEntityPedestal` class that's in the world, the `renderTileEntityAt` method of our TESR will be called.

## Finished

Now that we've finally got all the code done, we can launch Minecraft and take a look at how our Pedestals render:

![Items in Pedestals Rendering In-World](https://fat.gfycat.com/MenacingRipeCod.gif)