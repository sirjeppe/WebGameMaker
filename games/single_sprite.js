function SingleSprite() {
  var game = new Game();
  var sprite = new SpritePlugin();
  sprite.move(10, 10);
  game.addPluginInstance(sprite);
  return game;
}

SingleSprite.prototype.name = "SingleSprite";

WebGameMaker.Games.registerGame(SingleSprite);
