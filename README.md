#### LiveJournal Reader

Lightweight reader for LiveJournal.

```bash
git clone git@github.com:agentcooper/livejournal-reader.git
cd livejournal-reader

npm install
cd public
bower install
cd ..
grunt

node app.js
```

Use 'grunt --production' to build for production.

Features:
* Scroll position is saved when switching between top and selected post
* Infinite scrolling friends feed with inline comments
* Easy to read text (no custom fonts or colors)

<img src="https://github.com/agentcooper/livejournal-reader/blob/master/public/images/top.png?raw=true">

<img src="https://github.com/agentcooper/livejournal-reader/blob/master/public/images/feed.png?raw=true">
