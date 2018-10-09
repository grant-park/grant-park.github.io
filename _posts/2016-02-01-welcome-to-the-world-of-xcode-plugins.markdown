---
layout: post
title:  "Welcome to the World of Xcode Plugins"
date:   2016-02-01 12:00:00 -0600
categories: programming
---

Prior to using Alcatraz, I didn’t realize how much of my productivity was going to waste. I mean, I always knew there were Xcode plugins that could make life easier; it’s just that I didn’t realize how much easier. Please don’t make the same mistake I did. Take advantage of plugins.  

Alcatraz is a popular package manager for Xcode. It’s easy to install and it has a very nice GUI window for picking/downloading a variety of cool plugins.  

I’m only using two plugins right now, and they’re amazing: Fuzzy Autocomplete and XVim.  

Fuzzy Autocomplete extends the functionality of Xcode’s default autocompletion when you type in prefixes of certain keywords.  

e.g. Say you’re writing methods for UITableViewDataSource; by default, Xcode’s autocomplete will show you the following ONLY if you type in “func tableView…”:  

`func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell`

However, with Fuzzy Autocomplete, you can type in “cellForRow…” and it will recognize the same function for you. No more scrolling endlessly through Xcode’s autocompletions!  

![screenshot]({{ site.url }}/{{ site.baseurl }}/assets/img/welcome_to_the_world_of_xcode_plugins-screenshot.png)

XVim is a plugin to simulate the Vim interface on Xcode. It’s totally badass and I never thought I could achieve this functionality before. If you’re into Vim, this is definitely the plugin for you.  

Additionally, I’m running a custom script from SwiftLint that’s improved my coding style via providing warnings whenever my code seems messy or dangerous. I never knew about this sort of on-the-fly linting until SwiftLint, so it’s made my coding experience a lot more interesting.  

You can say for sure that I’m really happy with my development environment right now :) If you’re comfortable and bored with the Xcode environment, go spice it up with plugins!

