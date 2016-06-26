angular.module('starter.controllers', ['ngCordova'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, $http) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.directionService = {};
    $scope.directionsDisplay = {};

    var storage = (function () {
      var ldb = window.localStorage || localStorage;

      function write(ob) {
        ldb.setItem('rows', JSON.stringify(ob));
      }

      function read() {
        raw = ldb.getItem('rows');
        if (!raw)
          return [];

        return JSON.parse(raw);
      }

      function clear() {
        ldb.clear();
      }

      return {
        'write': write,
        'read': read,
        'clear': clear
      }
    })();

    $scope.clearHistory = function () {
      storage.clear();
    };

    $scope.history = storage.read();

    $scope.addToHistory = function (id, city, address, latitude, longitude) {
      var row = {
        'id': id,
        'city': city,
        'address': address,
        'latitude': latitude,
        'longitude': longitude
      };
      var rows = storage.read(); //из хранилища читаем всё
      var id = rows.length;
      rows.push(row);
      storage.write(rows);     //записываем всё обратно
    };


    $http({
      // method: 'JSONP',
      method: 'GET',
      url: '/points.json'
      // url: 'http://all.tk-ug.ru/?act=returnserviceinfo&action=pospoints&s=YReunvnHJHJDF887qweyEYAWuiuwe313123123?callback=testCallback'
    }).then(function successCallback(response) {
      // console.log(response.data.rows);
      // response.data.rows.forEach(function(row) {
      //
      // });

      $scope.rows = response.data.rows; // Это то, что позволяет нам выводить города, улицы и другие объекты из JSON в текстовой форме
    }, function errorCallback(response) {
      console.log('error');
    });

  })










  /*Контроллер для AZS_near - строит маршрут от точки А (местоположение) к точке Б*/
  .controller('MapCtrl', function ($scope, $ionicLoading, $compile, $state, $cordovaGeolocation) {
    function initialize() {
      var options = {timeout: 10000, enableHighAccuracy: true};
     // var myLatlng = new google.maps.LatLng(47.22866735, 39.71574092);

      // Взятое из документации ГУГЛ для построения маршрута //
      /**/

      // конец //


      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        $scope.directionService = new google.maps.DirectionsService;
        $scope.directionsDisplay = new google.maps.DirectionsRenderer;

        var Latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: Latlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        /*=========================================*/
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var map = new google.maps.Map(document.getElementById("map"),
          mapOptions);  // Добавить это после запятой сюда же mapOptionsTwo и раскоментить код выше. но ничего не изменится

       /* - этот код просто выводит маркер на местоположении и точки, которой мы задали координаты
        var marker1 = new google.maps.Marker({ // Моё местоположение
          position: Latlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });
        var marker2 = new google.maps.Marker({ // Точка, которую я сам рисую
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });
      */

        // Вывод всех АЗС
        /*
        $scope.rows.forEach(function (item) {
          var myLatlng = new google.maps.LatLng(item.latitude, item.longitude);

          var marker_AZS = new google.maps.Marker({ // Точка, которую я сам рисую
            position: myLatlng,
            map: map,
            title: 'AZS'
          });
        });
        */

        $scope.map = map;
        $scope.directionsDisplay.setMap(map);


        var self = $scope.directionsDisplay;
        $scope.directionService.route(
          {
            //  origin: currentLocation,
            //  origin: mapOptions,
            origin: Latlng,
            // destination: new google.maps.LatLng(toalet.latitude, toalet.longitude),
            destination: new google.maps.LatLng(47.22866735, 39.71574092),
            // destination: new google.maps.LatLng($scope.cur.coords.latitude, $scope.cur.coords.longitude),
            travelMode: google.maps.TravelMode.DRIVING
          },
          function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {

              $scope.directionsDisplay.setDirections(result);
              //directionRendered.setDirections(result);
            } else {

            }

          }
        );


      }, function (error) {
        console.log("Could not get location");
      });

    }

    // google.maps.event.addListener(window, 'load', initialize, marker, 'click', function() {
    //   infowindow.open(map,marker);
    // });

    /*===То, что по умолчанию в каждом контройлеер=====================================================================*/
    $scope.centerOnMe = function () {
      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function (pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading.hide();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    };

    if (document.readyState === "complete") {
      initialize();
    } else {
      google.maps.event.addDomListener(window, 'load', initialize);
    }

    $scope.clickTest = function () {
      alert('Ваше местоположение')
    };

  })













// Второй контройлер для All_AZS_map - выводит все точки автозаправки
  .controller('MapCtrltwo', function ($scope, $ionicLoading, $compile, $state, $cordovaGeolocation) {
    function initialize() {
      var options = {timeout: 10000, enableHighAccuracy: true};

      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

        var Latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: Latlng,
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        /*=========================================*/
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var map = new google.maps.Map(document.getElementById("map"),
          mapOptions);  // Добавить это после запятой сюда же mapOptionsTwo и раскоментить код выше. но ничего не изменится

        var marker1 = new google.maps.Marker({ // Моё местоположение
          position: Latlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        // Вывод всех АЗС
        $scope.rows.forEach(function (item) {
          var myLatlng = new google.maps.LatLng(item.latitude, item.longitude);

          var marker_AZS = new google.maps.Marker({ // Точка, которую я сам рисую
            position: myLatlng,
            map: map,
            title: 'AZS'
          });
        });

        $scope.map = map;

      }, function (error) {
        console.log("Could not get location");
      });

    }

    // google.maps.event.addListener(window, 'load', initialize, marker, 'click', function() {
    //   infowindow.open(map,marker);
    // });

    /*===То, что по умолчанию в каждом контройлеер=====================================================================*/
    $scope.centerOnMe = function () {
      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function (pos) {
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading.hide();
      }, function (error) {
        alert('Unable to get location: ' + error.message);
      });
    };

    if (document.readyState === "complete") {
      initialize();
    } else {
      google.maps.event.addDomListener(window, 'load', initialize);
    }

    $scope.clickTest = function () {
      alert('Ваше местоположение')
    };

  })
