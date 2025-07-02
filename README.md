# JaMoveo
The task was to build a live song application that lets an admin choose a song and broadcast its lyrics (with optional chords) to every connected in real time.

## Requirements and how they were met:

1.	Real-time broadcast: Implemented with Socket.IO. The admin emits songSelected or quitSession. all players receive currentSong or quit instantly.
2.	Role separation: JWT-based auth (Express + MongoDB). Only one admin account may exist, the rest are regular users with an instrument choice. React-Router guards enforce access: `/admin, /player, /live`.
3.	Live lyrics view:  A React page that auto-scrolls. Chords display only for non-vocal instruments. Hebrew characters trigger automatic RTL layout so the same code supports English and Hebrew songs.
4.	Song library:  Each .json file under `server/songs/` is imported at startup.
5.	Per-tab sessions: Tokens live in sessionStorage, meaning a new browser tab always starts at the login page and closing the tab logs the user out.


## Technology used
* Frontend:  React, Vite, TailwindCSS
* Backend: Node.js, Express, MongoDB (Mongoose)
* Real time:  Socket.IO

## How to use the app
* Create a regular player:
1. Navigate to :   https://jamoveo-neta.netlify.app/
2. Click signup button
3. Fill in username, password, and pick an instrument
4. Press signup. You'll be redirected to `/player` and automatically logged in.
* Create the (single) admin:
1. Navigate to :   https://jamoveo-neta.netlify.app/admin-signup
2. Fill in username, password, and click create admin
3. You'll be redirected to `/Admin`
4. Search a song you would like and choose one song from the results
5. The song will be played to everyone logged in


### Special songs
1. shalom aleichem – Song in hebrew with image and author
2. epic test song – Long song to test the scrolling down feature
3. שיר בדיקה - song with hebrew name

[MIT](https://choosealicense.com/licenses/mit/)