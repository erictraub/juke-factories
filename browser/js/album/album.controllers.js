'use strict';

juke.controller('AlbumCtrl', function($scope, $http, $rootScope, $log, StatsFactory, AlbumFactory) {

AlbumFactory.fetchById("56f98cbb27ad88a4f83d6685")
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
  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing && song === $scope.currentSong) {
      $rootScope.$broadcast('pause');
    } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  $scope.$on('pause', pause);
  $scope.$on('play', play);
  $scope.$on('next', next);
  $scope.$on('prev', prev);

  // functionality
  function pause () {
    $scope.playing = false;
  }
  function play (event, song) {
    $scope.playing = true;
    $scope.currentSong = song;
  };

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; };

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  };
  function next () { skip(1); };
  function prev () { skip(-1); };

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


juke.controller('AlbumsController', function($log, $scope, AlbumFactory) {
  AlbumFactory.fetchAll().then(function(albums) {
    albums.forEach(function(album) {
      album.numSongs = album.songs.length;
      album.imageUrl = '/api/albums/' + album._id + '.image';
    });
    $scope.albums = albums;
  }).catch($log.error);
});

// TEST THIS ^ AND ADD INTERPOLATION FOR IT IN HTML


















