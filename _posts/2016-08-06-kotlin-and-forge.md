---
layout: post
title: "Kotlin and Minecraft Forge"
date: 2016-08-06 16:45:30 -0400
category: forge
---

So, you wanna use [Kotlin][] in your Forge mod? Well there's good news, I've just released [Forgelin][], a fork of [Emberwalker's Forgelin][EWForgelin], a library that provides utilities for using Kotlin with Minecraft/Forge. 

Forgelin provides a Kotlin langauge adapter that allows your main-mod class to be a [`object`][KotlinObject]. In order to use the language adapter, you must specify the `modLanguageAdapter` property in your `@Mod` annotation to be `net.shadowfacts.forgelin.KotlinAdapter`.

Additionally, Forgelin repackages the Kotlin standard library, reflect library, and runtime so that you don't have to, and so that end users don't have to download the 3 megabytes of Kotlin libraries multiple times.

~~Additionally, Forgelin provides a number of [extensions][KotlinExtensions] (which are viewable [here][ExtensionsList]) for working with Minecraft/Forge.~~

~~While you can shade Forgelin, it is not recommended to do so. It will increase your jar size by approximately 3 megabytes (as Forgelin itself includes the entire Kotlin, standard lib, reflect lib, and runtime) and may cause issues with other mods that shade Kotlin or Forgelin. It is recommended that you have your users download Forgelin from [CurseForge][].~~

**Update Feb 17, 2017:** 

1. As of Forgelin 1.1.0, the extensions have been moved from Forgelin to [ShadowMC][].
2. As of Forgelin 1.3.0, Forgelin includes an `@Mod` annotated object. This means:
   1. **Forgelin can no longer be shaded.**
   2. `required-after:forgelin;` can now be used in the `dependencies` field of your `@Mod` annotation for a nicer error message when Forgelin isn't installed.


A bare-bones example mod using Forgelin is available [here][example].

[Kotlin]: https://kotlinlang.org/
[Forgelin]: https://github.com/shadowfacts/Forgelin
[EWForgelin]: https://github.com/Emberwalker/Forgelin
[KotlinObject]: https://kotlinlang.org/docs/reference/object-declarations.html
[KotlinExtensions]: https://kotlinlang.org/docs/reference/extensions.html
[ExtensionsList]: https://github.com/shadowfacts/Forgelin/tree/master/src/main/kotlin/net/shadowfacts/forgelin/extensions
[ShadowMC]: https://github.com/shadowfacts/ShadowMC/tree/1.11.2/src/main/kotlin/net/shadowfacts/forgelin/extensions
[CurseForge]: https://minecraft.curseforge.com/projects/shadowfacts-forgelin
[example]: https://github.com/shadowfacts/ForgelinExample
