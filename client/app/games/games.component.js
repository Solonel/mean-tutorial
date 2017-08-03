'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './games.routes';

export class GamesComponent {

  games = [];
  gamesNoFiltrer = [];
  newGame = {};
  filter = 'none';

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.loadGame();
  }

  addGame() {

    var games = this.games
    var newGame = this.newGame;

    console.log('addGame');
    if (this.newGame) {
      console.log('addGame');
      this.$http.post('/api/games', {
        name: this.newGame.name,
        platform: this.newGame.platform,
        genre: this.newGame.genre
      }).then(response => {

        // Reload des datas, peut-être possible de rafraichir la collection en ajoutant uniquement notre nouvel Game
        this.loadGame();

        this.newGame = {};
      });
    }
  }

  loadGame() {
    this.$http.get('/api/games')
      .then(response => {
        this.gamesNoFiltrer = response.data;
        this.games = response.data;
      });
  }

  deleteGame(game) {
    this.$http.delete(`/api/games/${game._id}`).then(response => {

      // Reload des datas, peut-être possible de rafraichir la collection en supprimant uniquement notre nouvel Game
      this.loadGame();

    });
  }

  saveGame(game) {
    this.$http.put(`/api/games/${game._id}`, game).then(response => {
      this.loadGame();
    });;
  }

  toggleEdit(game) {
    game.edit = !game.edit
  }

  resetGames() {
    this.games = this.gamesNoFiltrer;
    this.filter = 'none';
  }

  filterByGenre(genre) {
    this.resetGames();
    this.games = this.games.filter(function(game) {
      return game.genre === genre;
    });
    this.filter = 'Genre: ' + genre;
  };

  filterByPlatform(platform) {
    this.resetGames();
    this.games = this.games.filter(function(game) {
      return game.platform === platform;
    });
    this.filter = 'Platform: ' + platform;
  };

}


export default angular.module('meanTutorialApp.games', [uiRouter])
  .config(routes)
  .component('games', {
    template: require('./games.html'),
    controller: GamesComponent,
    controllerAs: 'gamesCtrl'
  })
  .name;
