'use strict';

KylinApp.controller('AdminCtrl', function ($scope,AdminService, CacheService, TableService, MessageService, $modal,SweetAlert) {
    $scope.configStr = "";
    $scope.envStr = "";

    $scope.getEnv = function(){
        AdminService.env({}, function(env){
            $scope.envStr = env.env;
            MessageService.sendMsg('Server environment get successfully', 'success', {});
//            SweetAlert.swal('Success!', 'Server environment get successfully', 'success');
        },function(e){
            if(e.data&& e.data.exception){
                var message =e.data.exception;
                var msg = !!(message) ? message : 'Failed to take action.';
                SweetAlert.swal('Oops...', msg, 'error');
            }else{
                SweetAlert.swal('Oops...', "Failed to take action.", 'error');
            }
        });
    }

    $scope.getConfig = function(){
        AdminService.config({}, function(config){
            $scope.configStr = config.config;
            MessageService.sendMsg('Server config get successfully', 'success', {});
        },function(e){
            if(e.data&& e.data.exception){
                var message =e.data.exception;
                var msg = !!(message) ? message : 'Failed to take action.';
                SweetAlert.swal('Oops...', msg, 'error');
            }else{
                SweetAlert.swal('Oops...', "Failed to take action.", 'error');
            }
        });
    }

    $scope.reloadMeta = function(){
        SweetAlert.swal({
            title: '',
            text: 'Are you sure to reload metadata and clean cache?',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: "Yes",
            closeOnConfirm: true
        }, function(isConfirm) {
            if(isConfirm){
                CacheService.clean({}, function () {
                    SweetAlert.swal('Success!', 'Cache reload successfully', 'success');
                },function(e){
                    if(e.data&& e.data.exception){
                        var message =e.data.exception;
                        var msg = !!(message) ? message : 'Failed to take action.';
                        SweetAlert.swal('Oops...', msg, 'error');
                    }else{
                        SweetAlert.swal('Oops...', "Failed to take action.", 'error');
                    }
                });
            }

        });
    }

    $scope.calCardinality = function (tableName) {
        $modal.open({
            templateUrl: 'calCardinality.html',
            controller: CardinalityGenCtrl,
            resolve: {
                tableName: function () {
                    return tableName;
                },
                scope: function () {
                    return $scope;
                }
            }
        });
    }

    $scope.cleanStorage = function(){
        SweetAlert.swal({
            title: '',
            text: 'Are you sure to clean up unused HDFS and HBase space?',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: "Yes",
            closeOnConfirm: true
        }, function(isConfirm) {
            if(isConfirm){
            AdminService.cleanStorage({}, function () {
                SweetAlert.swal('Success!', 'Storage cleaned successfully!', 'success');
            },function(e){
                if(e.data&& e.data.exception){
                    var message =e.data.exception;
                    var msg = !!(message) ? message : 'Failed to take action.';
                    SweetAlert.swal('Oops...', msg, 'error');
                }else{
                    SweetAlert.swal('Oops...', "Failed to take action.", 'error');
                }
            });
            }
        });
    }

    $scope.disableCache = function(){
        SweetAlert.swal({
            title: '',
            text: 'Are you sure to disable query cache?',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: "Yes",
            closeOnConfirm: true
        }, function(isConfirm) {
            if(isConfirm){
            AdminService.updateConfig({}, {key: 'kylin.query.cache.enabled',value:false}, function () {
                SweetAlert.swal('Success!', 'Cache disabled successfully!', 'success');
            },function(e){
                if(e.data&& e.data.exception){
                    var message =e.data.exception;
                    var msg = !!(message) ? message : 'Failed to take action.';
                    SweetAlert.swal('Oops...', msg, 'error');
                }else{
                    SweetAlert.swal('Oops...', "Failed to take action.", 'error');
                }
            });
            }

        });

    }

    $scope.toSetConfig = function(){
        $modal.open({
            templateUrl: 'updateConfig.html',
            controller: updateConfigCtrl,
            resolve: {
            }
        });
    }

    var CardinalityGenCtrl = function ($scope, $modalInstance, tableName, MessageService) {
        $scope.tableName = tableName;
        $scope.delimiter = 0;
        $scope.format = 0;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.calculate = function () {
            $modalInstance.dismiss();
            SweetAlert.swal('Success!', 'A cardinality task has been submitted', 'success');
            TableService.genCardinality({tableName: $scope.tableName}, {delimiter: $scope.delimiter, format: $scope.format}, function (result) {
//                MessageService.sendMsg('Cardinality job was calculated successfully. Click Refresh button ...', 'success', {});
                SweetAlert.swal('Success!', 'Cardinality job was calculated successfully. . Click Refresh button ...', 'success');
            },function(e){
                if(e.data&& e.data.exception){
                    var message =e.data.exception;
                    var msg = !!(message) ? message : 'Failed to take action.';
                    SweetAlert.swal('Oops...', msg, 'error');
                }else{
                    SweetAlert.swal('Oops...', "Failed to take action.", 'error');
                }
            });
        }
    };

    var updateConfigCtrl = function ($scope, $modalInstance, AdminService, MessageService) {
        $scope.state = {
            key:null,
            value:null
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.update = function () {

            SweetAlert.swal({
                title: '',
                text: 'Are you sure to update config?',
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: "Yes",
                closeOnConfirm: true
            }, function(isConfirm) {
                if(isConfirm){
                AdminService.updateConfig({}, {key: $scope.state.key, value: $scope.state.value}, function (result) {
                    SweetAlert.swal('Success!', 'Config updated successfully!', 'success');
                    $modalInstance.dismiss();
                },function(e){
                    if(e.data&& e.data.exception){
                        var message =e.data.exception;
                        var msg = !!(message) ? message : 'Failed to take action.';
                        SweetAlert.swal('Oops...', msg, 'error');
                    }else{
                        SweetAlert.swal('Oops...', "Failed to take action.", 'error');
                    }
                });
                }

            });

        }
    };

    $scope.getEnv();
    $scope.getConfig();
});