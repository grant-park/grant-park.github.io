---
layout: post
title:  "How to Make Your Terminal an IDE"
date:   2016-08-20 12:00:00 -0600
categories: programming
---


Toss Sublime, WebStorm, Atom, or whatever you’re using. I’m going to teach you the way of terminal IDE-ing in a bash environment (with fuzzy file finding and goto function searching). 

As a concession, I only use my terminal as an IDE for small projects. If I’m dealing with a lot of code (i.e. frameworks and other large codebases), I use dedicated software.  

You should be using a terminal based editor for this to work. If not, I recommend that you dive into one before trying to make your terminal an IDE.   
My ingredients (asterisked means optional):

1. Vim/Emacs/Nano, or any other terminal based text editor
2. Zsh Shell (for plugins galore and tabbed autocompletion)
3. Tmux (split your terminal into a dozen windows especially for those node projects)
4. iTerm2 (pretty UI and scattered candies)
5. fzf (fuzzy file searching)
6. ack (easy grepping for finding any text)
7. Exuberant Ctags (goto function functionality)

We’ll use Homebrew to install our tools, save for Zsh. If you don’t have it already, just run the following line and restart your shell and terminal for good measure.  

`/usr/bin/ruby -e “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`

To install Zsh, run this curl:

`sh -c “$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`

For Tmux:
`brew install tmux`

For iTerm2, install the application from their website: http://www.iterm2.com/

For fzf:
`brew install fzf`

For ack:
`brew install ack`

For Exuberant Ctags:
`brew install ctags`

Create and save in your ~/.ctags file the following:

```
recurse=yes
exclude=.git
exclude=vendor/*
exclude=node_modules/*
exclude=db/*
exclude=log/*
```

You can create a ctags file by running ctags along with the directory you want. For example, the following will make a ctags file for your current directory: `ctags .`  

You’ll have to manually updated your ctags for every new file, method, or variable name you want indexed unless you use automatic indexing. I personally use https://github.com/craigemery/vim-autotag.  

Make sure to update your editor’s configuration file to recognize your ctags file. For example, my vim configuration file, ~/.vimrc, contains the following line:  

`set tag =./tags,tags;$HOME`

The next step is figuring out the key bindings for goto functionality. For Vim, the following bindings are available by default:
Jump to definition: `^]`  

Jump back from definition: `^t`  

Preview definition: `^w }`  

See all definitions: `g]`  

And that’s it. You’ve got the essentials for IDEing on the terminal. Happy hacking!

