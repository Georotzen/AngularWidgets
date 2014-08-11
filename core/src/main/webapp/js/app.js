/**
 */
'use strict';

/**
 * The main angularWidgets demo app module.
 *
 * @type {angular.Module}
 */

var demo = angular.module('demo', ['ngRoute', 'angular.widgets', 'demo.controllers', 'demo.services']);

demo.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/main', {
        templateUrl: 'partials/main.html',
        controller: 'Ctrl'
    });
    $routeProvider.when('/license', {
        templateUrl: 'partials/license.html',
        controller: 'Ctrl'
    });

    $routeProvider.when('/planned', {
        templateUrl: 'partials/planned.html',
        controller: 'Ctrl'
    });
    /*
    $routeProvider.when('/puiButton/overview', {
        templateUrl: 'partials/puiButton/overview.html',
        controller: 'Ctrl'
    });
    */

    $routeProvider.otherwise({ redirectTo: '/main' });

}]);


demo.run(function(Configuration, $route) {
    var getRouteData = function (data) {
        var result = [];
        angular.forEach(data, function(info) {
            angular.forEach(info.subPages, function (subpage) {
                this.push({label : subpage.label, path : subpage.path, controller : info.controller} );
            }, this);
        }, result);
        return result;
    };

    var configureRoutes = function (routesInfo) {
        angular.forEach(routesInfo, function (routeInfo) {
                $route.routes['/' + routeInfo.path] =
                {controller: routeInfo.controller,
                    keys: [],
                    originalPath: '/' + routeInfo.path,
                    regexp: new RegExp('^/' + routeInfo.path + '$',  ''),
                    reloadOnSearch: true,
                    templateUrl: 'partials/' + routeInfo.path + '.html'
                }
            }
        )
        ;

    };


    var data = Configuration.loadWidgetData();
    data.then(function(widgetData) {
        configureRoutes(getRouteData(widgetData));
    });

});


/*
myApp.controller('MyCtrl', function($scope, $route) {
    $scope.defineRoute = function() {
        $route.routes['/dynamic'] = {templateUrl: 'dynamic.tpl.html'};
    };
});
*/

demo.directive('prettyPrint', function () {
    return {
        restrict: 'A',
        priority: 1001,
        terminal: true,
        compile: function (element, attrs) {
            var content = element.html();
            var encoded = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                .replace(/_[a-z]/g, function(s) {return s.charAt(1).toUpperCase()});
            element.html(prettyPrintOne(encoded, attrs.prettyPrint));
        }
    }
});

demo.directive('version', function () {
    return {
        restrict: 'A',
        compile: function (element, attrs) {
            element.html('<img src="demo/'+attrs.version+'.png" style="margin-left:10px"/>');
        }
    }
});