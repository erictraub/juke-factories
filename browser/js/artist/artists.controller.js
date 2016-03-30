juke.controller('ArtistsController', function($log, $scope, $rootScope, ArtistFactory) {
	$scope.showArtists = false;

	$rootScope.$on('ShowAllArtists', function() {
		ArtistFactory.fetchAll().
			then(function(artists) {
				$scope.artists = artists;
			})
			.catch($log.error);
		$scope.showArtists = true;
	});

	$rootScope.$on('ShowArtist', function() {
		$scope.showArtists = false;
	});

	$scope.showArtist = function(artistId) {
		$rootScope.$broadcast('ShowArtist', {
			artistId: artistId
		})
	}

});


juke.controller('ArtistController', function($scope, ArtistFactory, $rootScope, $log) {
	$scope.showArtist = false;

	$rootScope.$on('ShowArtist', function(event, dataObj) {

		ArtistFactory.fetchById(dataObj.artistId)
		.then(function(artist) {
			$scope.artist = artist;
			$scope.showArtist = true;
		})
		.catch($log.error)
	});
});