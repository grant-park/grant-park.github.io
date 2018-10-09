---
layout: post
title:  "Swift Callback Pattern"
date:   2016-01-31 11:00:00 -0600
categories: programming
---

If you want an alternative to the protocol/delegate pattern, you can use callbacks. Here’s an example: 

Example.swift

```
class Example {
  var onCompletion: ((result:String) -> Void)?
  func doSomething() {
    onCompletion(result:"here's the callback!")
  }
}
```

ViewController.swift

```
class ViewController: UIViewController {
  override viewDidLoad {
    Example.onCompletion = { result in
      print(result)
    }
    Example.doSomething()
  }
}
```

Once ViewController loads, “here’s the callback!” should show up in the console.  

That’s it! You can use this pattern to get things done without having to abide by the strict “contract” logic of protocols.

