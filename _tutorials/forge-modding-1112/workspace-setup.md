---
date: 2016-05-06 11:16:00 -0400
title: "Setting up the Development Environment"
type: 'tutorial'
series: 'forge-modding-1112'
series-name: 'Making a Forge Mod for 1.11.2'
layout: tutorial
---

### Java
This series does not cover learning Java or installing the JDK. You should have the Java 8 JDK installed already.

### IntelliJ IDEA
I will be using [IntelliJ IDEA](https://jetbrains.com/idea/) throughout this series as it is my IDE of choice. You can download the free community version of IDEA [here](https://www.jetbrains.com/idea/). It is possible to use [Eclipse](https://www.eclipse.org/) if you prefer.

### Forge MDK
From the [Forge files site](http://files.minecraftforge.net/maven/net/minecraftforge/forge/index_1.11.2.html), download the latest MDK for 1.10.2. (Click the button with the floppy disk icon labeled `MDK` on the left.) After download, unzip the MDK to a new folder wherever you like. After unzipping the MDK, we can delete a number of extraneous files that are part of the MDK. You can delete every file in the folder thats not one of these:

- `src/`
- `build.gradle`
- `gradle/`
- `gradlew`
- `gradlew.bat`

### Gradle
Before we setup Forge and IDEA, we need to configure Gradle (the build system Forge mods use) to have more RAM available, otherwise we will not be able to decompile and deobfuscate Minecraft. Open the file at `~/.gradle/gradle.properties` (where `~` is your user directory) and create it if it does not exist. Add this to the file to instruct Gradle to use at most 3 gigabytes of memory:

{% highlight properties %}
org.gradle.jvmargs=-Xmx3G
{% endhighlight %}

We'll need to make a couple of additions to the `build.gradle` file that is part of the Forge MDK. This will configure IDEA and Gradle to use Java 8 to compile our project, allowing us to use the [shiny new Java 8 features](http://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html).

{% highlight properties %}
sourceCompatibility = JavaVersion.VERSION_1_8
targetCompatibility = JavaVersion.VERSION_1_8
{% endhighlight %}

### Forge
Now, to setup Forge and create the IDEA configurations we will need, run this command. (Replace `idea` with `eclipse` if you are using Eclipse and remove the leading `./` if you are using Windows)

{% highlight bash %}
./gradlew setupDecompWorkspace idea
{% endhighlight %}

**Note:** This may take a while to run, depending on the speed of your computer. 

Now, if everything ran sucessfully, you should have a file that has the `.ipr` extension in your mod folder. Launch IDEA and after doing so, click the Import Project button and open the `.ipr` file in your mod folder and wait a moment for IDEA to reconfigure itself for the project.

**Note:** If you have not launched IDEA before, you may need to go through some first time setup options beforehand.

Now that you've got IDEA setup, check out [how to setup the main mod class](/tutorials/forge-modding-1102/main-mod-class/).