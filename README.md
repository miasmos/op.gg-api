op.gg-api
=========
Converts live op.gg pages into json endpoints  
  
  
Getting Started  
==========  
```
npm install
```  
  
Endpoints
==========
/:region/live => http://:region.op.gg/spectate/pro/  
Fetches pro players currently playing.

/:region/pro => http://:region.op.gg/spectate/list  
Fetches pro players registered with op.gg.

/:region/amateur => http://:region.op.gg/spectate/list  
Fetches amateur players registered with op.gg.

/:region/summoner/:summoner => http://:region.op.gg/summoner/userName=:summoner  
Fetches the specified summoner's 15 most recent games data.

/:region/summoner/:summoner/champions => http://:region.op.gg/summoner/champions/userName=:summoner  
Fetches the specified summoner's top 75 played champions in order of most played to least played.

/:region/summoner/:summoner/league => http://:region.op.gg/summoner/league/userName=:summoner  
Fetches the specified summoner's standing in their league as well as the top 200 players in that league.

/:region/league => http://:region.op.gg/ranking/ladder  
Fetches the top 200 players in the specified region.

/:region/spectate/download/:gameID => http://:region.op.gg/match/observer/id=:gameID  
Fetches the spectator bat file associated with the specified game ID  

/:region/refresh/:summonerId => http://:region.op.gg/summoner/ajax/update.json/?summonerId=:summonerId  
Refreshes the specified summoner Id's data.
  
Dependencies
==========
cheerio  
request  
express  
http  
  
Licence  
==========  
Copyright (c) 2015 Stephen Poole

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
