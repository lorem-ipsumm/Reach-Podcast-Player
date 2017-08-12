# Reach Podcast Player


Reach Podcast Player is a RSS-based podcast player, meaning that in order to listen to your favorite podcasts, all you have to do is copy and paste the RSS feed from the podcast.


# Who Is This For?

This application is for all podcast listeners. Itunes, Spotify, and whereever you get your podcasts, have a ton of available podcast but every once in a while you will hear about a new podcast and search for it on your favorite podcast provider and they won't have it! with Reach, all you need is the RSS feed and you're good to go. No need to listen to podcasts accross different programs.


# What's Under The Hood?

This was made with electron and angularjs. This is my first time using both of these items so some parts of the program are not perfectly optomized, but I plan on continuing to work on both the program itself, and my angular and electron skills in order to fuilly optimize the program.


![Main Window](/github-images/main-window.png)

![Podcast View](/github-images/podcast-view.png)



# Small Demo
[![Video](/github-images/video-preview.png)](https://www.youtube.com/watch?v=X1V-xz1itjA&t "Video Title")



# TODO:
* Make listening queue
* Scale better
  * With generic window sizes the program looks fine, but at smaller than average sizes, things get bad
* Redo podcast-view UI
  * When a user clicks a podcast, the current UI is for the old theme, and needs to be updated
* ~~Have the podcasts actually get the latest episodes when the user opens up the app~~
* Make a wiki page, or release distributions
  * If I can figure out how, I'd like to be able to give the users notifications when a new update is available
* The Play/Pause button is very dodgy at the moment in terms of click detection, so I gotta fix that
* Put that data structure and algorithm class to good use
* Add comments everywhere
 
 


## Run

In the project directory:

```bash
npm start
```

## Make Executable

To make a build for your OS:


for use in npm scripts
```bash
npm install electron-packager --save-dev
```
for use from cli
```bash
sudo npm install electron-packager -g
```
For Linux :
```bash
electron-packager . --overwrite --platform=linux --arch=x64 --prune=true --out=release-builds
```
For Mac :
```bash
electron-packager . --overwrite --platform=darwin --arch=x64 --prune=true --out=release-builds
```

For Windows :
```bash
electron-packager . --overwrite --platform=win32 --arch=x64 --prune=true --out=release-builds
```


# Support

I'm a college student looking for cash and I didn't want to riddle this program with ads, so if you'd like to support me and this project donating is an option. Feel free to donate as little as $1, because honestly anything counts.

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQZ6VEAGUQRGW)

[![PayPal](https://www.paypalobjects.com/en_US/i/scr/pixel.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQZ6VEAGUQRGW)

If you're a hip cool kid and use those new cryptocurrencies:
 * Bitcoin Address: 15pKN3XAomW8f1TNLzFyhoKJgLekDP5yXe
 * Ethereum Address: 0xF9caC43d666249b619b7B4909759F3CD097800b1
 * Litecoin Address: LYUxGtdYrWvfFoDvaPpXRr9eSWzLx4uFUN

Another way to support, but don't want to spend any money (which is fine), is by subscribing to my youtube channel where I will be uploading update videos for the project
Youtube Channel: www.youtube.com/user/Sonicmanqaz/
