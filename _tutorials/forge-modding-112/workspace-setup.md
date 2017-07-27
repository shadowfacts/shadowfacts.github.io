---
date: 2016-05-06 11:16:00 -0400
title: "Setting up the Development Environment"
type: 'tutorial'
series: 'forge-modding-112'
series-name: 'Making a Forge Mod for 1.12'
layout: tutorial
---

### Java
This series does not cover learning Java or installing the JDK. You should have the Java 8 JDK installed already.

### IntelliJ IDEA
I will be using [IntelliJ IDEA](https://jetbrains.com/idea/) throughout this series as it is my IDE of choice. You can download the free community version of IDEA [here](https://www.jetbrains.com/idea/). It is possible to use [Eclipse](https://www.eclipse.org/) if you prefer.

### Forge MDK
From the [Forge files site](http://files.minecraftforge.net/maven/net/minecraftforge/forge/index_1.12.html), download the latest MDK for 1.12. (Click the button with the floppy disk icon labeled `MDK` on the left.) After download, unzip the MDK to a new folder wherever you like. After unzipping the MDK, we can delete a number of extraneous files that are part of the MDK. You can delete every file in the folder thats not one of these:

- `src/`
- `build.gradle`
- `gradle/`
- `gradle.properties`
- `gradlew`
- `gradlew.bat`

### Forge
Now, to setup Forge and create the IDEA configurations we will need, run this command. (Replace `idea` with `eclipse` if you are using Eclipse and remove the leading `./` if you are using Windows)

{% highlight bash %}
./gradlew setupDecompWorkspace idea
{% endhighlight %}

**Note:** This may take a while to run, depending on the speed of your computer. 

Now, if everything ran sucessfully, you should have a file that has the `.ipr` extension in your mod folder. Launch IDEA and after doing so, click the Import Project button and open the `.ipr` file in your mod folder and wait a moment for IDEA to reconfigure itself for the project.

**Note:** If you have not launched IDEA before, you may need to go through some first time setup options beforehand.

Now that you've got IDEA setup, check out [how to setup the main mod class](/tutorials/forge-modding-1102/main-mod-class/).