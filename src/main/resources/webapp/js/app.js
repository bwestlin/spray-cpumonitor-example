var appModule = angular.module('app', ['ngRoute', 'angular-websocket', 'n3-line-chart']);

appModule.config(['$httpProvider', 'WebSocketProvider', function($httpProvider, WebSocketProvider) {

    // Handling of null responses from backend
    $httpProvider.defaults.transformResponse.push(function(data){
        if (data === "null") {
            data = null;
        }
        return data;
    });

    var wsUrl = "ws://" + location.hostname + (location.port ? ":" + location.port : "") + "/";

    WebSocketProvider.prefix('').uri(wsUrl);
}]);

appModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/dashboard', {
            templateUrl: '/fragments/dashboard.html',
            controller: 'DashboardCtrl'
        })
        .otherwise({
            redirectTo: '/dashboard'
        });
}]);

appModule.controller('DashboardCtrl', ['$scope', '$q', '$filter', '$routeParams', 'WebSocket', function($scope, $q, $filter, $routeParams, WebSocket) {

    $scope.cpuUsage = [];

    var displayNSeconds = 120;

    function addCpuUsage(cpuUsage) {
        $scope.cpuUsage.push(cpuUsage);
        if ($scope.cpuUsage.length > displayNSeconds) $scope.cpuUsage = $scope.cpuUsage.slice($scope.cpuUsage.length - displayNSeconds);

        var xStart = displayNSeconds - $scope.cpuUsage.length;
        for (var idx in $scope.cpuUsage) {
            $scope.cpuUsage[idx].x = xStart + parseInt(idx);
        }
    }

    $scope.options = {
        stacks: [{axis: "y", series: ["user", "system"]}],
        lineMode: "cardinal",
        series: [
            {
                id: "system",
                y: "system",
                label: "System",
                type: "area",
                color: "#ff7f0e",
                axis: "y",
                thickness: "2px",
                drawDots: false
            },
            {
                id: "user",
                y: "user",
                label: "User",
                type: "area",
                color: "#1f77b4",
                axis: "y",
                thickness: "2px",
                drawDots: false
            }
        ],
        axes: {
            x: {
                type: "linear",
                key: "x",
                min: 0,
                max: displayNSeconds,
                labelFunction: function (x) {
                    return (displayNSeconds - x) + "s";
                }
            },
            y: {
                type: "linear",
                min: 0.0,
                max: 1.0,
                labelFunction: function (y) {
                    return parseInt(y * 100) + "%";
                }
            }
        },
        tension: 0.7,
        tooltip: {
            mode: "scrubber",
            formatter: function (x, y, series) {
                return $scope.options.axes.x.labelFunction(x) + " : " + $scope.options.axes.y.labelFunction(y);
            }
        },
        drawLegend: true,
        drawDots: true,
        columnsHGap: 5
    };

    WebSocket.onmessage(function(event) {
        var cpuUsage = JSON.parse(event.data);
        addCpuUsage(cpuUsage);
    });

}]);
