//'use strict';

var Myapp = angular.module('taskAssignments', ['ngRoute', 'ui.bootstrap'])
    .controller('navCtrl', function($scope, $route, $routeParams, $location) {
        $scope.isActive = function (viewLocation) {
            var active = (viewLocation === $location.path());
            return active;
        };
    })
    .controller('ListCtrl', [ '$scope', 'utils', 'remote', function($scope, utils, remote) {
        remote.getTasks().then( function(resp) {
            $scope.tasks = utils.checkResp(resp);
            $scope.filteredTasks = angular.copy($scope.tasks);
        });

        $scope.summary = { task: 0, people: 0, days: 0 };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.dateDisabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.dpStartOpen = function( $event ) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.dpStartOpened = true;
        };

        $scope.dpEndOpen = function( $event ) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.dpEndOpened = true;
        };

        $scope.dpStartMinDate = new Date();
        $scope.dpEndMinDate = new Date();

        $scope.dpFormat = 'yyyy-MM-dd';

        $scope.$watch('filteredTasks', function() {
            var totalPeople = {},
                totalDays = 0,
                totalTask = {},
                i = 0,
                totalTaskCount = $scope.filteredTasks ? $scope.filteredTasks.length : 0;


            for ( i =0 ; i < totalTaskCount; i++ ) {
                var task = $scope.filteredTasks[i];
                totalPeople[ task.assignTo ] = 1;
                totalTask[ task.name ] = 1;
                totalDays += utils.dateStrDiff(task.dueTo, task.startFrom);
            }

            $scope.summary = {
                task: Object.keys( totalTask ).length,
                people: Object.keys( totalPeople ).length,
                days: totalDays
            };
        });

        $scope.filterTasks = function() {
            $scope.filteredTasks = [];
            for(var i = 0; i < $scope.tasks.length; i++) {
                var task = $scope.tasks[i];
                var startFrom = new Date(task.startFrom);
                var dueTo = new Date(task.dueTo);
                if (( startFrom <= $scope.dtStart && dueTo >= $scope.dtStart )
                    || ( startFrom >= $scope.dtStart && startFrom <= $scope.dtEnd )
                   ) {
                       var tmp = angular.copy(task);
                       $scope.filteredTasks.push(tmp);
                   }
            }
        };
    }])

    .controller('CreateCtrl', function($scope, remote, $http, utils) {
        remote.getTasks().then( function(resp) {
            $scope.tasks = utils.checkResp(resp);
        });

        remote.getPMs().then( function(resp) {
            $scope.pms = utils.checkResp(resp);
        });

        $scope.currentTask = { no: '', name: '', pm:  {} };
        $scope.assignTo = {};

        remote.getPeoples().then( function(resp) {
            $scope.peoples = utils.checkResp(resp);
        });

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.dateDisabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.dpStartOpen = function( $event ) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.dpStartOpened = true;
        };

        $scope.dpEndOpen = function( $event ) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.dpEndOpened = true;
        };

        $scope.dpStartMinDate = new Date();
        $scope.dpEndMinDate = new Date();

        $scope.dpFormat = 'yyyy-MM-dd';


        $scope.selectTask = function(task) {
            $scope.currentTask = { id: task.id, no: task.no, name: task.name, pm: task.pm};
            remote.getHasAssigned( task.id ).then( function(resp) {
                $scope.hasAssigned = utils.checkResp(resp);
            });
        };

        $scope.selectPM = function(pm) {
            $scope.currentTask.pm = pm;
        };

        $scope.selectAssignTo = function(people) {
            $scope.assignTo = people;
        };

        $scope.addToAssigned = function() {
            if ( $scope.mainForm.assignForm.$valid ) {
                $scope.assignFormStyle = '';
                var tmp = {
                    people: $scope.assignTo,
                    startFrom: $scope.dtStart.toString("yyyy-MM-dd"),
                    dueTo: $scope.dtEnd.toString("yyyy-MM-dd")
                };

                $scope.hasAssigned.push(tmp);
            } else {
                //alert msg
                $scope.assignFormStyle = 'has-error';
            }
        };

        $scope.saveAll = function() {
            var taskFormValid = $scope.mainForm.taskForm.$valid;

            if ( taskFormValid
                 && $scope.hasAssigned ) {
                     // clear error msg
                     $scope.assignFormStyle = '';
                     $scope.taskFormStyle = '';

                     console.log($scope.currentTask);
                     console.log($scope.hasAssigned);

                     remote.saveTask($scope.currentTask, $scope.hasAssigned).then(
                         function(resp) {
                             var a = utils.checkResp(resp);
                             console.log(resp);
                         }
                     );
            } else {
                if ( !$scope.hasAssigned ) {
                    $scope.assignFormStyle = 'has-error';
                }
                if ( !taskFormValid ) {
                    $scope.taskFormStyle = 'has-error';
                }
            }
        };
    })
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/tasklists', {
                title: 'Task lists',
                controller:'ListCtrl',
                templateUrl:'task_lists.html'
            })
            .when('/new', {
                title: 'Create or edit task',
                controller:'CreateCtrl',
                templateUrl:'task_create.html'
            })
            .otherwise({
                redirectTo:'/tasklists'
            });
        // $locationProvider.html5Mode(true);
    })
    .run(function ($rootScope) {
        $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            document.title = currentRoute.title;
        });
    });
;
