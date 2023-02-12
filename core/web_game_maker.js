'use strict';

import { Game } from "./game.js";
import { Games } from "./games.js";
import { UI } from "./ui.js";
import { PluginManager } from "./plugin_manager.js";
import { AudioMixer } from "./audio_mixer.js";

export class WGM {
  UI;
  PluginManager;
  Games;
  Game;
  AudioMixer;
  Settings;

  // Global settings (setup)
  #setup = {
    'pluginsFolder': 'plugins',
    'gamesFolder': 'games'
  }

  constructor() {
    this.UI = new UI(this);
    this.PluginManager = new PluginManager(this);
    this.Games = new Games();
    this.AudioMixer = new AudioMixer();
    this.Settings = {};
  }

  init() {
    let canvas = null;
    try {
      canvas = document.getElementById('canvas');
    } catch (err) {
      alert(err);
      return false;
    }
    this.Settings.canvas = {
      'element': canvas,
      'context': canvas.getContext('2d'),
      'width': canvas.width,
      'height': canvas.height,
      'top': 0,
      'left': 0,
    };

    this.UI.positionCanvas();
    this.UI.initTopMenu();

    const callbackCount = 2;
    let callbacksCalled = 0;
    const finalizeCallback = function() {
      this.Game = new Game();
      this.update();
    }.bind(this);

    // Find and register plugins
    this.PluginManager.findAndRegisterPlugins(this.#setup.pluginsFolder, function() {
      callbacksCalled++;
      this.initPlugins();

      if (callbacksCalled === callbackCount) {
        finalizeCallback();
      }
    }.bind(this));

    // Find and register saved games
    this.Games.findAndRegisterSavedGames(this.#setup.gamesFolder, function() {
      callbacksCalled++;
      this.initGames();

      if (callbacksCalled === callbackCount) {
        finalizeCallback();
      }
    }.bind(this));
  }

  /**
   * The initPlugins method is responsible for retrieving information about the
   * currently installed plugins and letting the UI know about them.
   */
  initPlugins() {
    const plugins = this.PluginManager.getPlugins();
    for (const plugin of plugins) {
      this.UI.addPluginButton(plugin, function(evt) {
        const plugin = this.PluginManager.getPluginByName(
          evt.srcElement.name
        );
        this.UI.showSettingsBox(new plugin());
      }.bind(this));
    }
  }

  initGames() {
    const storedGames = this.Games.getGames();
    for (const storedGame of storedGames) {
      this.UI.addStoredGame(storedGame.name);
    }
  }

  loadGame(game) {
    this.Game = new game();
    this.UI.reloadActivePluginsList();
  }

  update() {
    let drawInfo = {
      'canvasContext': this.Settings.canvas.context,
    }

    drawInfo['canvasContext'].clearRect(
      0,
      0,
      this.Settings.canvas.width,
      this.Settings.canvas.height
    );

    this.Game.draw(drawInfo);
    window.requestAnimationFrame(this.update.bind(this));
  }
}

window.WebGameMaker = new WGM();
document.addEventListener('DOMContentLoaded', window.WebGameMaker.init.bind(window.WebGameMaker));
