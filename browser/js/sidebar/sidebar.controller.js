'use strict';

juke.controller('SidebarCtrl', function ($scope, $rootScope, PlayerFactory, ArtistFactory) {

	$scope.viewAlbums = function() {
		$rootScope.$broadcast('showAllAlbums');
	};

	$scope.viewAllArtists = function() {
		$rootScope.$broadcast('ShowAllArtists');
	};

});

