'use strict';

export class Games {

  #registeredGames = [];

  constructor() {
    // TODO: läs in alla js-filer från ../games och lägg i this.registeredGames
  }

  #registerGame(game) {
    this.#registeredGames.push(game);
  }

  getGames() {
    return this.#registeredGames;
  }

  getGameByName(name) {
    for (const game of this.#registeredGames) {
      if (game.name == name) {
        return game;
      }
    }
    throw Error('Could not find the requested game: ' + name);
  }

  #parseHTMLFileList(gamesFolder, fileListHTML) {
    // Match all href="<something>.js"
    const matches = [...fileListHTML.matchAll(/href=\"([^\"]+\.js)\"/g)];
    const fileList = [];
    for (const match of matches) {
      fileList.push(match[1].split('/').pop());
    }
    // Make sure folder name is present
    for (var i in fileList) {
      fileList[i] = `../${gamesFolder}/${fileList[i]}`;
    }
    return fileList;
  }

  findAndRegisterSavedGames(gamesFolder, callback) {
    const cls = this;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = async (xhr) => {
      if (xhr.target.status == 200 && xhr.target.readyState == 4) {
        const fileList = this.#parseHTMLFileList(gamesFolder, xhr.target.responseText);
        for (const gameFile of fileList) {
          let module = await import(gameFile);
          cls.#registerGame(module[Object.keys(module)[0]]);
        }
        if (callback) {
          callback();
        }
      }
    };
    xhr.open('GET', gamesFolder, true);
    xhr.send();
  }
}
