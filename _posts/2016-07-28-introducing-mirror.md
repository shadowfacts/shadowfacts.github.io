---
layout: post
title: "Introducing Mirror"
date: 2016-07-28 16:45:00 -0400
category: java
---

Allow me to introduce my latest project, Mirror. Mirror is a [reflection][] library for Java designed to take advantage of the streams, lambdas, and optionals introduced in Java 8.

The source code is publicly available on [GitHub][source] under the MIT license and the JavaDocs are viewable [here][docs].

## Installation

All version of Mirror are [available on my Maven][maven].

### Maven
{% highlight xml linenos %}
<repositories>
	<repository>
		<id>shadowfacts</id>
		<url>http://mvn.rx14.co.uk/shadowfacts/</url>
	</repository>
</repositories>

<dependency>
	<groupId>net.shadowfacts</groupId>
	<artifactId>Mirror</artifactId>
	<version>1.0.0</version>
</dependency>
{% endhighlight %}

### Gradle
{% highlight groovy linenos %}
repositories {
	maven {
		name "shadowfacts"
		url "http://mvn.rx14.co.uk/shadowfacts/"
	}
}

dependencies {
	compile group: "net.shadowfacts", name: "Mirror", version: "1.0.0"
}
{% endhighlight %}

## Usage
A couple of simple examples for getting started with Mirror.

For more complex examples of everything possible with Mirror, you can look at the [unit tests][tests].

### General Overview
The `Mirror.of` methods are used to retrieve mirrors on which operations can be performed. The types of mirrors are:

- [`MirrorClass`][class]
- [`MirrorEnum`][enum]
- [`MirrorConstructor`][constructor]
- [`MirrorMethod`][method]
- [`MirrorField`][field]

The `Mirror.ofAll` methods are used to create mirror stream wrappers for a given stream/collection/array of reflection objects or mirrors.

These examples will use the following classes:

{% highlight java linenos %}
public class Test {
	public static String name = "Mirror";
	public static String author;

	public static String reverse(String str) {
		return new StringBuilder(str).reverse().toString();
	}
}

public class Test2 {
	public static String name = "Test 2";

	public static void doSomething() {
	}
}
{% endhighlight %}

### Getting Fields
{% highlight java linenos %}
// get the field
Optional<MirrorField> optional = Mirror.of(Test.class).field("name");
// unwrap the optional
MirrorField field = optional.get();
// get the value of the field
// we pass null as the instance because the field is static
field.get(null); // "Mirror"
{% endhighlight %}

### Setting Fields
{% highlight java linenos %}
// get the field
Optional<MirrorField> optional = Mirror.of(Test.class).field("author");
// unwrap the optional
MirrorField field = optional.get();
// set the value of the field
// we once again pass null as the instance because the field is static
field.set(null, "Shadowfacts");
{% endhighlight %}

### Invoking Methods
{% highlight java linenos %}
// get the method using the name and the types of the arguments it accepts
Optional<MirrorMethod> optional = Mirror.of(Test.class).method("reverse", String.class);
// unwrap the optional
MirrorMethod method = optional.get();
// invoke the method
method.invoke(null, "Mirror"); // "rorriM";
{% endhighlight %}

### Class Streams
{% highlight java linenos %}
Mirror.ofAllUnwrapped(Test.class, Test2.class) // create the stream of classes
	.unwrap() // map the MirrorClasses to their Java versions
	.toArray(); // [Test.class, Test2.class]
{% endhighlight %}

### Field Streams
{% highlight java linenos %}
Mirror.ofAllUnwrapped(Test.class, Test2.class) // create the stream of classes
	.flatMapToFields() // flat map the classes to their fields
	.get(null) // get the value of the fields on null
	.toArray(); // ["Mirror", "Shadowfacts", "Tesst 2"]
{% endhighlight %}

### Method Streams
{% highlight java linenos %}
Mirror.ofAllUnwrapped(Test.class, Test2.class)  // create the stream of classes
	.flatMapToMethods() // flat map the classes to their methods
	.filter(m -> Arrays.equals(m.parameterTypes(), new MirrorClass<?>[]{Mirror.of(String.class)})) // filter the methods by which accept only a String
	.invoke(null, "Shadowfacts") // invoke them all on nothing, passing in "Shadowfacts"
	.toArray(); // ["stcafwodahS"]
{% endhighlight %}


[reflection]: https://en.wikipedia.org/wiki/Reflection_(computer_programming)
[source]: https://github.com/shadowfacts/Mirror/
[docs]: https://shadowfacts.net/Mirror/
[maven]: http://mvn.rx14.co.uk/shadowfacts/net/shadowfacts/Mirror
[tests]: https://github.com/shadowfacts/Mirror/tree/master/src/test/java/net/shadowfacts/mirror
[class]: https://shadowfacts.net/Mirror/net/shadowfacts/mirror/MirrorClass.html
[enum]: https://shadowfacts.net/Mirror/net/shadowfacts/mirror/MirrorEnum.html
[constructor]: https://shadowfacts.net/Mirror/net/shadowfacts/mirror/MirrorConstructor.html
[method]: https://shadowfacts.net/Mirror/net/shadowfacts/mirror/MirrorMethod.html
[field]: https://shadowfacts.net/Mirror/net/shadowfacts/mirror/MirrorField.html