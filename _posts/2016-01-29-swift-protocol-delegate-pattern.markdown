---
layout: post
title:  "Swift Protocol/Delegate Pattern"
date:   2016-01-29 12:00:00 -0600
categories: programming
---


Let’s say you have view controllers A and B. Your main view controller is A and it segues to B. Following this logic, it‘s reasonable to assume B will get back to A via dismissing itself; but how does B pass data to A in the process? In other words, how do you pass back data between view controllers?  

There are three ways I can think of doing this (and only two of them are widely considered best practices and safe). 

1. Use the protocol/delegate pattern.
2. Use callbacks.
3. Use a singleton. (This one can be dangerous if abused!)

Today, I’ll teach you how to work with protocols and delegates to achieve this purpose. Let’s get started with an example:  

ViewControllerA.swift *Look at ViewControllerB.swift first before wrapping your head around ViewControllerA.swift*

```swift
class ViewControllerA: UIViewController, DataProtocol {
  //Arbitrary segue; you could also use the segue identifier method
  //Just make sure that you set the delegate of the destination controller as self!
  func aSegue() {
    let aStoryboard = UIStoryboard(name:"Main", bundle:nil)
    let vcb: UIViewController = aStoryboard.instantiateViewControllerWithIdentifier("ViewControllerB")
    vcb.delegate = self
  }
  
  //DataProtocol requires this function to be included
  func dataFunction(result: String) {
    print(result)
  }
}
```

ViewControllerB.swift

```swift
protocol DataProtocol {
  func dataFunction(result: String)
}

class ViewControllerB: UIViewController {
  var delegate: DataProtocol? = nil
  
  override func viewDidLoad() {
    super.viewDidLoad()
    delegate!.dataFunction("this string has been passed back!")
  }
}
```

Looking at ViewControllerB.swift first, we can observe that there is a protocol defined right above the class itself. Remember that protocols are like “contracts.” Protocols bind whoever adopts them to agree upon using all the required functions inside of them. The adopter is known as the “delegate.” Anyone can make use of the protocol to take advantage of the delegate.  

In this case, ViewControllerA is adopting DataProtocol (therefore becoming the delegate of DataProtocol), as shown at the top of the file next to “UIViewController.” As a result, ViewControllerA must have a function called “dataFunction” defined somewhere in its class.  

In addition, ViewControllerA is segueing to ViewControllerB. Before the actual segue happens, we ensure that the variable “delegate” defined in ViewControllerB is set to ViewControllerA.  

After the segue happens, the viewDidLoad function in ViewControllerB is called shortly, passing back the data via the protocol method. The console should then display “this string has been passed back!”  

We’re done! You can now use this design pattern to pass back data between view controllers.

