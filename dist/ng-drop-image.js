'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        factory(require('angular'));
        module.exports = 'ngDropImage';
    } else {
        // Browser globals (root is window), we don't register it.
        factory(root.angular);
    }
})(window, function (angular) {
    'use strict';

    var directive = function directive($q, $localStorage) {
        return {
            require: '^ngModel',
            restrict: 'A',
            scope: { 'ngModel': '=' },
            link: function link($scope, $element, $attrs, $ngModel) {

                $scope.$storage = $localStorage.$default({
                    image: $scope.ngModel
                });

                $ngModel.$setViewValue($scope.$storage.image);

                $($element[0]).on('dragover dragenter dragleave', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                $($element[0]).on('drop', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var files = e.originalEvent.dataTransfer.files;

                    if (files.length) {
                        readFile(files[0]).then(function (value) {
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
                });

                function storage(value) {
                    $scope.$storage.image = value;
                }

                function readFile(file) {

                    var deferred = $q.defer();

                    var reader = new FileReader();

                    reader.onload = function (event) {
                        deferred.resolve(event.target.result);
                    };

                    reader.onerror = function (event) {
                        deferred.reject(e);
                    };

                    reader.readAsDataURL(file);

                    return deferred.promise;
                }
            }
        };
    };

    directive.$inject = ['$q', '$localStorage'];

    angular.module('ngDropImage', ['ngStorage']).config(['$localStorageProvider', function (s) {
        s.setKeyPrefix('ng-drop-image-');
    }]).directive('ngDropImage', directive);
});
//# sourceMappingURL=ng-drop-image.js.map
