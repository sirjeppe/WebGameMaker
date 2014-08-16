function Games() {

    var registeredGames = [];

    this.registerGame = function(game) {
        registeredGames.push(game);
    }

    this.getGames = function(index) {
        return registeredGames;
    }

    this.getGameByName = function(name) {
        console.log('looking for game: ' + name);
        for (var g in registeredGames) {
            if (registeredGames[g].prototype.name == name) {
                console.log('Found the game, name = ' + name);
                return registeredGames[g];
            }
        }
        throw Error('Could not find the requested game: ' + name);
    }
}

WebGameMaker.Games = new Games;
