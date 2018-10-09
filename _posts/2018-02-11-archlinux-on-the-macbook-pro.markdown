---
layout: post
title:  "Arch Linux on the Macbook Pro (Retina, 13-inch, Early 2015)"
date:   2018-02-11 12:00:00 -0600
categories: keyboards
---



I have been playing Whac-A-Mole with Arch Linux issues on my early-2015 Macbook Pro with Retina display since moving to it from Ubuntu-GNOME a month ago. That is not to say I'm complaining about this distro. A lot of these fires have been put out for good and I'm enjoying Arch. I’ll just be summarizing most of what I’ve come across as solutions to these issues in addition to providing my own notes.  

![screenshot]({{ site.url }}/{{ site.baseurl }}/assets/img/archlinux_notes-screenshot.png)

# WiFi

You need either an ethernet-thunderbolt adapter or a tethered mobile network to jumpstart connectivity in order to download the necessary drivers for your network card. Once you have that, thankfully, you only need the single `brcmfmac` driver which you can get via `sudo pacman -S brcm80211`.  

You can use a variety of programs at this point to handle network detection and configuration. I started out using `wicd` and `wicd-curses`, but found that `NetworkManager` was the most robust service. You can install it via `sudo pacman -S networkmanager` and configure your network via the gui `nmtui`.  

Afterwards, the following script at startup takes care of everything.  

```
#! /bin/sh
sudo modprobe brcmfmac
sudo NetworkManager
```

# HiDPI

HiDPI works out of the box. I have been experimenting with `AwesomeWM` and `i3WM`, both window managers for X. As such, I have to fiddle with `XRandR` often and I find that `ARandR` makes life easier. I work with `2560x1600` by default and `1920x1200` when my old-man eyes get tired.

# Disabling Keyboard  

`xinput disable "Apple Inc. Apple Internal Keyboard / Trackpad"`

# Natural Scrolling

`sudo xinput set-prop bcm5974 275 1`

# Yaourt

I like not having to type in passwords, not having to type in exact package names, and auto-compilation. Install `yaourt` via adding

```
[archlinuxfr]
SigLevel = Never
Server = http://repo.archlinux.fr/$arch
```

to `/etc/pacman.conf`
and then `sudo pacman -Sy yaourt`. Afterwards, you can `yaourt -s <vague-package-name or some-keyword>` to install things stress free.  

# Bluetooth

`yaourt -s bluez` and use `blueman-manager` for out-of-the-box success. Use `bluetoothctl` cli as a fallback solution for finnicky devices. Works flawlessly with my custom keyboards and my bluetooth LSTN Bolt earphones.  

# High Fidelity Playback (A2DP) on Bluetooth

Bluetooth audio sounds like shit for the first time on any pair of headphones/earphones. It’s most likely that the device sink is set to HSP/HFP (Headset Head Unit). To get around this, use `bluetoothctl` cli and `connect <mac-address>` instead of going through something like `blueman-manager`. If you use `pavucontrol`, the device will auto-appear afterwards and you can select A2DP for the sink.  

# Media Keys

Play/Pause and Next/Prev don’t magically work without binding them to commands in your environment. I don’t know of any popular CLIs, but [playerctl](https://github.com/acrisci/playerctl) has worked very well for me. I use it with Spotify and QMPlay2. Example of usage:  

```
playerctl play-pause
playerctl next
playerctl previous
```

# Webcam

Nope, doesn’t work out of the box. This [experimental driver](https://github.com/patjak/bcwc_pcie/wiki/Get-Started) works pretty well for me. Make sure you unload `bdc_pci` before inserting the kernel module via `modprobe -r bdc_pci`.

# Urxvt and Ranger

Images can’t be previewed if `preview_images_method` is set in addition to `preview_images`. I keep my config a one-liner: `set preview_images true`

# Urxvt vs Vim Colors

If you are facing this common issue (which has a million misleading solutions online) you can fix all your problems by adhering to the community that uses base16. So far, I default to using `.Xdefaults` and `.Xresources` with base16-xresources and vim reads its colors from that as well. If you stick with base16, you won’t end up with unexpected colors that result from mixed offsets. I currently use the Base16 Material Theme which looks like:

![vim_screenshot]({{ site.url }}/{{ site.baseurl }}/assets/img/archlinux_notes-vim.png)

You can demo a bunch of base16 themes [here](http://chriskempson.com/projects/base16/).

# My Dotfiles and Autosetup

You can find my configs here.

Basic setup for new machines:

`pacman -S git htop fzf fd-rs bc ntfs-3g sudo tmux zsh zsh-syntax-highlighting rofi feh firefox awesome imagemagick networkmanager rsync scrot thunar ranger`

