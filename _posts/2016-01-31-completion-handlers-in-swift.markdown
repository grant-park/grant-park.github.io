---
layout: post
title:  "Completion Handlers in Swift"
date:   2016-01-31 13:00:00 -0600
categories: programming
---

I’m currently learning the MVVM design pattern and I’ve noticed that a lot of asynchronous code manipulation/organization requires the basic creation of completion handling functions.  

Before, I always made messy code in my view controllers that looked sort of like this:  

```
let kidQuery = PFQuery(className: “_User”)
let theseKids = kidQuery.whereKey(“parent”, containsString: (PFUser.currentUser()?.objectId!)! as String)
theseKids.findObjectsInBackgroundWithBlock { (result, error) -> Void in

  if error == nil {

    self.kidArray = result! as [PFObject] ?? []
    Kids.sharedData.array = self.kidArray as! [PFObject]
    if self.kidArray == [] {
        print(“empty!!”)
    }
    self.tableView.reloadData()
    self.refreshCtrl.endRefreshing()

  } else {

    dispatch_async(dispatch_get_main_queue(), { () -> Void in
    let alert = UIAlertController(title: “Error”, message: error?.localizedDescription, preferredStyle: .Alert)
    let cancel = UIAlertAction(title: “Close”, style: .Default, handler: nil)
    alert.addAction(cancel)
    self.presentViewController(alert, animated: true, completion: nil)

    })
  }
}
```

After I moved my code around, the same function in my view controller looks a lot cleaner:  

`Tools.kidQuery(self, senderTableView: theTableView, senderRefresh: refreshCtrl, completionHandler: nil)`

Essentially, I went from 20 lines of code to just 1 for this function, making my view controller less cluttered. I also have all of my data logic contained in their own separate classes. This makes debugging, testing, and adding new app features much easier for me. More importantly, it improves the readability of my project.  

To make a lot of these changes to my code, I ran into creating functions with completion handlers. Now I’ll show you how to make your own.  

Create a new .swift file. Let’s call it Toolbox.swift and put inside the following function:  

```
func testCompletionHandler(input: String?, completionHandler: ((result: String?) -> Void)?) {}

Note that the “input” and “completionHandler” arguments in this function are optional; you could call this function with nil for both arguments and it could still do something (or do nothing at all). The “completionHandler” argument is actually a Swift block that can execute something along with a parameter called “result.” Right now, this function does nothing, so let’s add some logic:

func testCompletionHandler(input: String?, completionHandler: ((result: String?) -> Void)?) {

  if let aString = input {
    if aString == “I want a completion handler!” {
      if let aHandler = completionHandler {
        aHandler(result: “Here is the completion handler!”)
      }
    } else {
      if let aHandler = completionHandler {
        aHandler(result: nil)
      }
    }
  }
}
```

The moment “aHandler” is called inside of this function, the caller of this function will receive the completion block and can do anything they want with “result” unless it’s nil of course.  

As an example, let’s look at ViewController.swift (a different source file):  

```
class ViewController: UIViewController {

  var myToolbox = Toolbox()

  viewDidLoad() {
      super.viewDidLoad()
      myToolbox.testCompletionHandler("I want a completion handler!") { (result) -> Void in 
        if let aString = result { print(aString) }
      }
    }
  }
}
```

When we call our created completion handler function in viewDidLoad, we should receive “Here is the completion handler!” in the console. We’ve successfully created a completion handler function and now you can use this same pattern to move all your asynchronous logic to specialized classes for ultimately cleaner, more readable code!

