---
layout: post
title: "Kotlin and Minecraft Forge"
date: 2016-08-06 16:45:30 -0400
category: forge
---

So, you wanna use [Kotlin][] in your Forge mod? Well there's good news, I've just released [Forgelin][], a fork of [Emberwalker's Forgelin][EWForgelin], a library that provides utilities for using Kotlin with Minecraft/Forge. 

Primarily Forgelin provides a Kotlin langauge adapter that allows your main-mod class to be a [`object`][KotlinObject]. In order to use the language adapter, you must specify the `modLanguageAdapter` property in your `@Mod` annotation to be `net.shadowfacts.forgelin.KotlinAdapter`.

Additionally, Forgelin provides a number of [extensions][KotlinExtensions] (which are viewable [here][ExtensionsList]) for working with Minecraft/Forge.

While you can shade Forgelin, it is not recommended to do so. It will increase your jar size by approximately 3 megabytes (as Forgelin itself includes the entire Kotlin, standard lib, reflect lib, and runtime) and may cause issues with other mods that shade Kotlin or Forgelin. It is recommended that you have your users download Forgelin from [CurseForge][].

A bare-bones example mod using Forgelin is available [here][example].

[Kotlin]: https://kotlinlang.org/
[Forgelin]: https://github.com/shadowfacts/Forgelin
[EWForgelin]: https://github.com/Emberwalker/Forgelin
[KotlinObject]: https://kotlinlang.org/docs/reference/object-declarations.html
[KotlinExtensions]: https://kotlinlang.org/docs/reference/extensions.html
[ExtensionsList]: https://github.com/shadowfacts/Forgelin/tree/master/src/main/kotlin/net/shadowfacts/forgelin/extensions
[CurseForge]: https://minecraft.curseforge.com/projects/shadowfacts-forgelin
[example]: https://github.com/shadowfacts/ForgelinExample