var appModule = angular.module('app', ['ngRoute', 'ngWebSocket', 'n3-line-chart']);

appModule.config(['$httpProvider', function($httpProvider) {

    // Handling of null responses from backend
    $httpProvider.defaults.transformResponse.push(function(data){
        if (data === "null") {
            data = null;
        }
        return data;
    });
}]);

appModule.factory('CpuUsage', ['$websocket', function ($websocket) {

    var wsUrl = "ws://" + location.hostname + (location.port ? ":" + location.port : "") + "/";
    var dataStream = $websocket(wsUrl);

    var cpuUsageData = [];
    var keepNSeconds = 120;

    function addCpuUsage(cpuUsage) {
        cpuUsageData.push(cpuUsage);
        if (cpuUsageData.length > keepNSeconds) {
            cpuUsageData = cpuUsageData.slice(cpuUsageData.length - keepNSeconds);
        }

        var xStart = keepNSeconds - cpuUsageData.length;
        for (var idx = 0; idx < cpuUsageData.length; idx++) {
            cpuUsageData[idx].x = xStart + parseInt(idx);
        }
    }

    dataStream.onMessage(function(message) {
        var cpuUsage = JSON.parse(message.data);
        addCpuUsage(cpuUsage);
    });

    return {
        data: cpuUsageData,
        keepNSeconds: keepNSeconds
    };

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

appModule.controller('DashboardCtrl', ['$scope', '$q', '$filter', '$routeParams', 'CpuUsage', function($scope, $q, $filter, $routeParams, CpuUsage) {

    $scope.cpuUsage = CpuUsage.data;

    $scope.options = {
        lineMode: "cardinal",
        series: [
            {
                id: "system",
                y: "system",
                label: "System",
                type: "area",
                color: "#1f77b4",
                axis: "y",
                thickness: "2px",
                drawDots: false
            },
            {
                id: "process",
                y: "process",
                label: "Process",
                type: "area",
                color: "#ff7f0e",
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
                max: CpuUsage.keepNSeconds,
                labelFunction: function (x) {
                    return (CpuUsage.keepNSeconds - x) + "s";
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

}]);
