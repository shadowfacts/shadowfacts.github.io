---
date: 2016-10-10 11:28:42 -0400
title: "World Generation: Ore"
type: 'tutorial'
series: 'forge-modding-1102'
series-name: 'Making a Forge Mod for 1.10.2'
layout: tutorial
---

We've got our copper ore block, but it doesn't generate in the world so it's not very useful to players. Let's fix that.

The first thing we'll need to do is create a class called `ModWorldGeneration` in the `world` sub-package in our mod. This class will implement Forge's `IWorldGenerator` interface which is used to hook into Minecraft's world generation.

{% highlight java linenos %}
package net.shadowfacts.tutorial.world;

import net.minecraft.world.World;
import net.minecraft.world.chunk.IChunkGenerator;
import net.minecraft.world.chunk.IChunkProvider;
import net.minecraftforge.fml.common.IWorldGenerator;

import java.util.Random;

public class ModWorldGen implements IWorldGenerator {
​	
	@Override
	public void generate(Random random, int chunkX, int chunkZ, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider) {
	
	}

}
{% endhighlight %}

The `generate` method is called by Forge for every chunk that's generated and is our entry point into MC's world generation.  Inside the `generate` method, we'll check if `world.provider.getDimension() == 0` because we only want our ore to generate in the overworld. If that's true, we'll call a separate method called `generateOverworld` that takes the same parameters as `generate`. In this method we'll have our generation code that's specific to the overworld.

{% highlight java linenos %}
// ...
public class ModWorldGen implements IWorldGenerator {
​	
	@Override
	public void generate(Random random, int chunkX, int chunkZ, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider) {
		if (world.provider.getDimension() == 0) { // the overworld
			generateOverworld(random, chunkX, chunkZ, world, chunkGenerator, chunkProvider);
		}
	}
	
	private void generateOverworld(Random random, int chunkX, int chunkY, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider) {
		
	}

}
{% endhighlight %}

Before we write the code that will actually add our Copper Ore into the world, let's write a little helper method to make our lives a bit easier.

This method will take a couple of things:

1. The `IBlockState` to generate.
2. The `World` to generate in.
3. The `Random` to use for generation.
4. The X and Z positions to generate the block at.
5. The minimum and maximum Y positions for which the ore can be generated.
6. The size of each ore vein.
7. The number of veins per chunk.

{% highlight java linenos %}
// ...
public class ModWorldGen implements IWorldGenerator {
​	
	// ...

	private void generateOre(IBlockState ore, World world, Random random, int x, int z, int minY, int maxY, int size, int chances) {
		int deltaY = maxY - minY;
	
		for (int i = 0; i < chances; i++) {
			BlockPos pos = new BlockPos(x + random.nextInt(16), minY + random.nextInt(deltaY), z + random.nextInt(16));
	
			WorldGenMinable generator = new WorldGenMinable(ore, size);
			generator.generate(world, random, pos);
		}
	}

}
{% endhighlight %}

This method does a couple of things:

1. Calculate the difference between the maximum Y and minimum Y values.
2. Create a `BlockPos` with X, minimum Y, and Z values passed into the method and offset by:
   1. A random number from 0 to 15
   2. A random number from 0 to the difference between the min and max Y values (so that the ore is generated somewhere in between)
   3. A random number from 0 to 15
3. Creates a new `WorldGenMinable` instance.
4. Calls the `generate` method on it to generate our ore in the world.
5. Repeats steps 2 through 4 `chances` times.

This results in our ore being generated `chanes` times per chunk with each chance having a different position inside the chunk and in between the specificed Y values.

{% highlight java linenos %}
// ...
public class ModWorldGen implements IWorldGenerator {
​	
	// ...

	private void generateOverworld(Random random, int chunkX, int chunkZ, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider) {
		generateOre(ModBlocks.oreCopper.getDefaultState(), world, random, chunkX * 16, chunkZ * 16, 16, 64, 4 + random.nextInt(4), 6);
	}
	
	private void generateOre(IBlockState ore, World world, Random random, int x, int z, int minY, int maxY, int size, int chances) {
		// ...
	}

}
{% endhighlight %}

We call the `generateOre` method with:

1. The block state we want to generate (the default block state of our copper ore block).
2. The world we want generate in (the `World` we've been passed).
3. The random we want to use to generate (the `Random` we've been passed).
4. The X position we want to generate at (the `chunkX` value multipled by 16, because chunks are 16x16).
5. The Z position we want to generate at (the `chunkZ` value multiplied by 16, because chunks are 16x16).
6. The minimum Y position we want to generate at (16).
7. The maximum Y position we want to generate at (64).
8. The size of the vein to generate (a random number from 4 to 7).
9. The number of times per chunk to generate (6).

If you create a new world and search around for a bit, you'll bet able to find a deposit of our Copper Ore!

You may want to play around with the vein size and chances settings until you achieve the desired concentration of ore per chunk.

![Copper Ore generating in the world](http://i.imgur.com/jfeYvi0.png)
