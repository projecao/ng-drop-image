(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    factory(require('angular'));
    module.exports = 'ngDropImage';
  } else {
    // Browser globals (root is window), we don't register it.
    factory(root.angular);
  }
}(window , function (angular) {
    'use strict';

    var directive = function($q, $localStorage) {
        return {
            require: '^ngModel',
            restrict: 'A',
            scope: { 'ngModel': '=' },
            link: ($scope, $element, $attrs, $ngModel) => {

                $scope.$storage = $localStorage.$default({
                        image: $scope.ngModel
                });

                $ngModel.$setViewValue($scope.$storage.image);

                $($element[0]).on('dragover dragenter dragleave', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                });

                $($element[0]).on('drop', e => {
                    e.stopPropagation();
                    e.preventDefault();

                    var files = e.originalEvent.dataTransfer.files;

                    if(files.length){
                        readFile(files[0]).then((value) => {
                                $ngModel.$setViewValue(value);
                                storage(value);
                        });
                    } else {
                        var url = e.originalEvent.dataTransfer.getData('url');
                        $ngModel.$setViewValue(url);
                        storage(url);
                    }

                    $scope.$apply();

                    return false;

                })

                function storage(value){
                    $scope.$storage.image = value;
                };

                function readFile(file) {

                    var deferred = $q.defer();

                    var reader = new FileReader();

                    reader.onload = event => {
                        deferred.resolve(event.target.result);
                    };

                    reader.onerror = event => {
                        deferred.reject(e);
                    };

                    reader.readAsDataURL(file);

                    return deferred.promise;
                }
            }
        }
    }

    directive.$inject = ['$q', '$localStorage'];

    angular.module('ngDropImage', [])
        .config(['$localStorageProvider', s => {
            s.setKeyPrefix('ng-drop-image-');
        }])
        .directive('ngDropImage', directive);
}))
