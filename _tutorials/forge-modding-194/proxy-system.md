---
date: 2016-05-07 15:41:00 -0400
title: "Proxy System"
type: 'tutorial'
series: 'forge-modding-194'
series-name: 'Making a Forge Mod for 1.9.4'
layout: page
---

Minecraft (and therefore Forge) are split up between the client and the server, so certain things can only be done on the client. Because some classes only exist on the client, we'll be using Forge's proxy system to access those classes without having to worry about crashes on dedicated servers.

We'll need to create a pair of classes to act as the proxy. One will contain code common to both sides, and the other will contain client-specific code. Create two new classes, `CommonProxy` and `ClientProxy` (I usually use a `proxy` package to keep this contained from the rest of the code) and have `ClientProxy` extend `CommonProxy`. You'll see specifically how we'll be using this proxy structure when we get to custom items and blocks.

In order to have Forge load the correct proxy class for the correct side, we'll need to use the `@SidedProxy` annotation. Add this (replacing my package with yours) to your main mod class.

{% highlight java linenos %}
@SidedProxy(serverSide = "net.shadowfacts.tutorial.proxy.CommonProxy", clientSide = "net.shadowfacts.tutorial.proxy.ClientProxy")
public static CommonProxy proxy;
{% endhighlight %}

At runtime, Forge will detect which side our mod is running on and inject the correct proxy into our `proxy` field using reflection.