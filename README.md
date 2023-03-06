![spaaace](https://cloud.githubusercontent.com/assets/3951311/21784604/ffc2d282-d6c4-11e6-97f0-0ada12c4fab7.gif)

# Spaaace

An online HTML5 multiplayer space shooter built with [Lance](http://lance.gg) game server

[Play now!](http://spaaace.herokuapp.com)

# MetaverseCloud SDK

This integrates the [MetaverseCloud SDK](https://github.com/metaversecloud-com/mc-sdk-js), which makes it possible to use it within topia.io worlds.

Key features:

* Room created based on assetId in query param.  So can have multiple games in single world and they are each their own game
* Only visitors in a private zone where the asset has an embedded link to this game will be able to join.
* If a visitor is in the world, but not in the private zone - they can spectate.  This also means can set privateZone to 10 to limit game participants to 10... but others can spectate.
* If someone goes to the game URL that is not embedded as an iFrame within the world, it won't let them spectate or join.
* Your 'ship' gets your in-world username.

# To Run on Heroku

Make sure you have added the environmental variables to Config Vars in Heroku
