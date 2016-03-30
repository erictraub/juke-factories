'use strict';

juke.controller('AlbumCtrl', function($scope, $http, $rootScope, $log, StatsFactory, AlbumFactory, PlayerFactory) {

  $scope.toggle = function (song) {
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      PlayerFactory.pause();
    } else if (PlayerFactory.currentSong){
      PlayerFactory.resume();
    } else {
      PlayerFactory.start(song, $scope.album.songs);
    }
  };

  $scope.playing = PlayerFactory.isPlaying;
  $scope.currentSong = PlayerFactory.getCurrentSong;

  $scope.next = function() {
    PlayerFactory.next();
  };

  $scope.prev = function() {
    PlayerFactory.previous();
  };

  $scope.showAlbums = true;
  $scope.showAlbum = false;

  $rootScope.$on('showAllAlbums', function() {
    $scope.showAlbums = true;
    $scope.showAlbum = false;

  });

  $rootScope.$on('ShowAllArtists', function() {
    $scope.showAlbums = false;
    $scope.showAlbum = false;
  });

  $rootScope.$on('ShowArtist', function() {
    $scope.showAlbums = false;
    $scope.showAlbum = false;
  });

  $rootScope.$on('showAlbum', function(event, data) {
    AlbumFactory.fetchById(data.albumID)
    .then(function (album) {
      album.imageUrl = '/api/albums/' + album._id + '.image';
      album.songs.forEach(function (song, i) {
        song.audioUrl = '/api/songs/' + song._id + '.audio';
        song.albumIndex = i;
      });
      $scope.album = album;
      return album;
    })
    .then(function(album) {
      return StatsFactory.totalTime(album);
    })
    .then(function(totalTime) {
      totalTime = String((totalTime / 60).toFixed(2)) + ' minutes';
      $scope.album.totalTime = totalTime;
      $scope.showAlbum = true;
      $scope.showAlbums = false;
    })
    .catch($log.error);
  })


});


juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});

juke.factory('AlbumFactory', function($http) {
  return {
    fetchAll: function() {
      return $http.get('/api/albums')
      .then(function(response) {
        return response.data;
      })
    },
    fetchById: function(_id) {
      return $http.get('/api/albums/' + _id)
      .then(function(response) {
        return response.data;
      })
    }
  }
})


juke.controller('AlbumsController', function($log, $scope, AlbumFactory, $rootScope) {
  AlbumFactory.fetchAll().then(function(albums) {
    albums.forEach(function(album) {
      album.numSongs = album.songs.length;
      album.imageUrl = '/api/albums/' + album._id + '.image';
    });
    $scope.albums = albums;
  }).catch($log.error);

  $scope.showAlbum = function(albumId) {
    console.log('Album ID:', albumId);
    $rootScope.$broadcast('showAlbum', {
      albumID: albumId
    });
  };
});



















