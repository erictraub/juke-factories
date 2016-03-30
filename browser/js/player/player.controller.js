'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory) {

  $scope.toggle = function (song) {
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      PlayerFactory.pause();
    } else PlayerFactory.resume();
  };

  $scope.next = function() {
    PlayerFactory.next();
  };

  $scope.prev = function() {
    PlayerFactory.previous();
  };

  $scope.currentSong = PlayerFactory.getCurrentSong;
  $scope.playing = PlayerFactory.isPlaying;
  $scope.progress = PlayerFactory.getProgress;    
});
