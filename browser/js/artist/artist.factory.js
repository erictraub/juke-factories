'use strict'


juke.factory('ArtistFactory', function($log, $http) {

	return {
		fetchAll: function() {
			return $http.get('/api/artists')
				.then(function(artists) {
					return artists.data;
				})
				.catch($log.error);
		},

		fetchById: function(artistId) {
			return $http.get('/api/artists/' + artistId)
				.then(function(artist) {
					return artist.data;
				})
				.catch($log.error);
		}
	}
});