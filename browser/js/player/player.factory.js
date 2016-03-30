'use strict';



juke.factory('PlayerFactory', function($rootScope){

	var audio = document.createElement('audio');
	var playing = false;
	var currentSong = null;
	var arrayOfSongs = null;
	var progress = 0;
  	var playerFactory = {

	  	start: function(song, songArray) {
		    // stop existing audio (e.g. other song) in any case
		    if (songArray) arrayOfSongs = songArray;
		    this.pause();
		    playing = true;
		    // resume current song
		    if (song === currentSong) return audio.play();
		    // enable loading new song
		    currentSong = song;
		    audio.src = song.audioUrl;
		    audio.load();
		    audio.play();
	  	},

	    pause: function() {
    		audio.pause();
    		playing = false;
 		},

 		resume: function() {
 			audio.play();
 			playing = true;
 		},

 		isPlaying: function() {
 			return playing;
 		},

 		getCurrentSong: function() {
 			return currentSong;
 		},

 		next: function() {
 			return this.skip(1);
 		},

 		skip: function(interval) {
		    if (!currentSong) return;
		    var index = arrayOfSongs.indexOf(currentSong);
		    var result = interval + index;
		    if (result >= 0 && result < arrayOfSongs.length) {
		    	this.start(arrayOfSongs[result], arrayOfSongs);
		    } else if (result === arrayOfSongs.length) {
		    	this.start(arrayOfSongs[0], arrayOfSongs);
		    } else {
		    	this.start(arrayOfSongs[arrayOfSongs.length -1 ], arrayOfSongs);
		    }
		},

		previous: function() {
			return this.skip(-1);
		},

		getProgress: function() {
			return progress;
		}
	};

	audio.addEventListener('timeupdate', function () {
		progress = audio.currentTime / audio.duration;
		$rootScope.$evalAsync();
  	});

	audio.addEventListener('ended', function () {
		playerFactory.next();
		$rootScope.$evalAsync();
	});

	return playerFactory;
});

  //


  // jump `interval` spots in album (negative to go back, default +1)
  // function skip (interval) {
  //   if (!$scope.currentSong) return;
  //   var index = $scope.currentSong.albumIndex;
  //   index = mod( (index + (interval || 1)), $scope.album.songs.length );
  //   $scope.currentSong = $scope.album.songs[index];
  //   if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  // };
  // function next () { skip(1); };
  // function prev () { skip(-1); };
