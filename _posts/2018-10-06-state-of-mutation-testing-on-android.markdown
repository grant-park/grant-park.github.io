---
layout: post
title:  "State of Mutation Testing on Android"
date:   2018-10-07 12:34:17 -0600
categories: keyboards
---
Mutation testing is unit test testing. If your unit tests are full of false-positives, meaning that there are pointless or absent assertions, and your test coverage is misleadingly high; it is probably time for you to maintain your test suite with mutation testing.

This is how it works:  
* Take a piece of code along with its unit tests.  
* Mutate the code in a fundamental way, e.g. change a `<` to `>`.  
* If your unit tests still _pass_\*, then the mutation test has failed.  
* Otherwise, try the above steps exhaustively until all possible mutations are tested.
* If your unit tests _kill_\* all the mutations, then your code coverage result for the tested piece of code is accurate and meaningful.  

\* _If the units test pass without having reached the changed code, the mutated code behaves similarly to the original code despite all different inputs, or if the propogated symptoms of the mutated code are never acknowledged by the unit tests, then the mutation test is considered failed. Otherwise, the unit tests will have "killed" the mutants and pass the mutation test._
  
Here is a simple example of some code and a test suite that passes mutation testing:  

```
boolean sampleCode(x, y) {
    if (x < y) {
        return 1;
    } else {
        return 2;
    }
}
```

```
assertTrue(sampleCode(1,2).equals(1));
assertTrue(sampleCode(2,1).equals(2));
assertTrue(sampleCode(1,1).equals(2));
```
The above code would produce mutants in which `<` is replaced with one of `>`, `==`, `>=`, or `<=`. The test suite would have a unique result consisting of at least one failed assertion for each mutant case, acknowledging the different state produced by each mutant via `.equals()`. Thus, the test suite would pass mutation testing.

A couple of months ago at work, I was introduced to the Gradle code coverage tool and its use case in our development cycle and CI. I really questioned it after having figured out that coverage means nothing if you game the assertions in tests. You can effectively call code and make unnecessary or absolutely no assertions in your unit tests, still achieving coverage for that code.  

Such a possibility for abuse indicates that it is important for my team to scrutinize unit tests in each code review, which is not always the case (given that there is an informal assumption that no one would try to game the tests). I think there is a lot of time, trust, and comfort to be gained from mutation testing -- and I imagine that in some industries, it is an unquestionable
requirement for large teams.

Unfortunately, mutation testing is not in high demand for Android development. There is a [popular mutation testing library called PIT](http://pitest.org/) which happens to have a great Gradle plugin -- but because of how different Google's Java environment is from the "standard", it is not easy to port over to Android. There is an [experimental fork](https://github.com/koral--/gradle-pitest-plugin) of the Gradle plugin by @koral--, which works for basic tests using [Roboelectric](http://robolectric.org/), but it is not yet up to speed for enterprise testing. I also hear rumors of certain large companies having their own internal tools for mutation testing on Android but are too stingy to share such a power with the rest of the world.  

The only solution I can think of to address the limitations for Android, is to decouple all environmental implementations from business logic. That is, ensure that all code to be tested can be compiled without the ADK. This strategy has saved my ass many times when I couldn't figure out how to mock things like Android's `Handler` or `Bundles`. My team, for this very reason of environment independent code, has been avoiding the use of Roboelectric like the plague. Ironically, there are a number of components in our project that do not have tests because it would be a pain to mock the environmental requirements -- so tech debt's a thing.
