class Games {

    registeredGames = [];

    registerGame(game) {
        this.registeredGames.push(game);
    }

    getGames(index) {
        return this.registeredGames;
    }

    getGameByName(name) {
        console.log('looking for game: ' + name);
        for (var g in this.registeredGames) {
            if (this.registeredGames[g].prototype.name == name) {
                console.log('Found the game, name = ' + name);
                return this.registeredGames[g];
            }
        }
        throw Error('Could not find the requested game: ' + name);
    }
}

WebGameMaker.Games = new Games;
