---
date: 2016-11-27 09:48:42 -0400
title: "Updating to 1.11.2"
type: 'tutorial'
series: 'forge-modding-1112'
series-name: 'Making a Forge Mod for 1.11.2'
layout: tutorial
---

If you're updating from 1.10.2 to 1.11.2, there are a couple of things you need to be aware of:

## `ItemStack`s are _never_ `null`
Starting in 1.11, `ItemStack`s can _never, ever_ be `null`. Instead of checking for `null`-ness, you use the `ItemStack.isEmpty` method to make sure the stack contains something. 

## `ItemStack` private fields
In 1.11, the `ItemStack.stackSize` field was made private. Instead of directly modifying this field like before, there are getter, setter, and mutator methods available.

- `getCount`: equivalent to simply retrieving the field.
- `setCount`: equivalent to setting the field
- `grow`: equivalent to increasing the field.
	`stack.grow(1)` is equivalent to `stack.stackSize++`.
- `shrink`: equivalent to decreasing the field.
	`stack.shrink(1)` is equivalent to `stack.stackSize--`.

**Note:** The default Forge MDK comes with older MCP mappings in which the new `ItemStack` methods aren't named. You'll need to change the mappings version from `snapshot_20161111` to the latest (`snapshot_20170330` as of this post).

## Resources
In 1.11.2, Minecraft enforces all resource file names being completely lowercase. This practically enforces `snake_case` instead of `camelCase`. You'll need to rename all your resource files (blockstates, models, textures, etc.) and change all the corresponding uses of their old names in code.

## Other
Aside from those major changes, there are a couple of minor things:

- `CreativeTabs.getTabIconItem` returns an `ItemStack`, not an `Item` now.
- Various mapping changes throughout the MC codebase. You can search on [here](https://github.com/ModCoderPack/MCPBot-Issues/issues) to see mapping changes in 1.11.2.