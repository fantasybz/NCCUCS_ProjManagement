/**
 * Created by fantasybz on 2015/3/14.
 */




function loadProjectRequirementObjects(objclass, tenantId, projectid) {
    var olistUrl = 'http://localhost:8080/MTAServiceResful/requirement/reqlistbyprj?pid=' + projectid + '&tid=' + tenantId;
    //var olistUrl = 'http://localhost:8080/MTAServiceResful/requirement/reqlist?tid=' + $("#tenantId").val();
    jQuery.ajax({
        type: "GET",
        url: olistUrl,
        dataType: 'jsonp',
        jsonpCallback: 'processData',
        success: function (data) {

            $.each(data, function (i, item) {
                //var newRowData = '[{"delete":"delete",';
                var newRowData = '[{';
                $.each(item.customFields, function (i, field) {
                    if (field.type.value == 5) {

                        newRowData += '"' + field.name + '":"' + setRelationValue(field.values) + '",'

                    } else {

                        newRowData += '"' + field.name + '":"' + Encoder.htmlDecode(field.value) + '",'
                    }

                });

                newRowData += '"objectId":"' + item.objectId + '",';
                newRowData = newRowData.substring(0, newRowData.length - 1) + '}]';
                $(objclass).jqGrid('addRowData', 1, jQuery.parseJSON(newRowData));
            });


            applyReqRowFunc();
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });

}

function loadProjectObjects(objclass, tenantId) {

    var olistUrl = 'http://localhost:8080/MTAServiceResful/project/prjlist?tid=' + tenantId;

    jQuery.ajax({
        type: "GET",
        url: olistUrl,
        dataType: 'jsonp',
        jsonpCallback: 'processData',
        success: function (data) {


            $.each(data, function (i, item) {
                //var newRowData = '[{"delete":"delete",';
                var newRowData = '[{';
                $.each(item.customFields, function (i, field) {
                    if (field.type.value == 5) {

                        newRowData += '"' + field.name + '":"' + setRelationValue(field.values) + '",'

                    } else {

                        newRowData += '"' + field.name + '":"' + field.value + '",'
                    }

                });

                newRowData += '"objectId":"' + item.objectId + '",';
                newRowData = newRowData.substring(0, newRowData.length - 1) + '}]';
                $(objclass).jqGrid('addRowData', 1, jQuery.parseJSON(newRowData));
            });

            applyPrjRowFunc();
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('Requested JSON parse failed.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });

}

function setGridCrlID() {

    return "mtagrid-" + $(".mtagrid").length;

};

function setjqGrid(objclass, projObjMeta) {
    jQuery(objclass).jqGrid({
        //url: olistUrl,
        datatype: "jsonstring",
        jsonReader: {
            repeatitems: false
        },
        height: 350,
        width: null,
        shrinkToFit: false,
        forceFit: true,
        autowidth: true,
        colNames: jQuery.parseJSON(projObjMeta.colNamesStr),
        colModel: jQuery.parseJSON(projObjMeta.colModelStr),

        pager: "#jqGridPager01",
        viewrecords: true,
        caption: "",
        hidegrid: false,
        altRows: false,


        afterInsertRow: function (id, currentData, jsondata) {
            var button = "<button type='button' class='btn btn-xs btn-success load-detail-act' style='margin-right: 5px'>展開</button>";
            button += "<button type='button' class='btn btn-xs btn-info edit-row-act' style='margin-right: 5px'>編輯</button>";
            button += "<button type='button' class='btn btn-xs btn-danger delete-row-act'>刪除</button>";
            $(this).setCell(id, "edit", button);


        },
        loadComplete: function (data) {
            $(".gridbutton").button().on('click', function (e) {
                e.preventDefault();
                alert('Edit id: ' + $(this).data("id"));
            });
        }

    });

}

function setCustomFieldColor(defaultCells, fieldName) {

    var findResult = _.find(defaultCells, function (dfcell) {
        return dfcell == fieldName;
    });


    if (_.isUndefined(findResult)) {

        return ',"classes":"customField"';

    } else {


        return "";

    }


}

function generateJqGridModel(defaultCells, mtaObjMeta) {
    var obj = mtaObjMeta;
    var cnStr = '[';
    var cmStr = '[';

    $.each(obj.customFields, function (i, item) {

        if (i == 0) {

            cnStr += '"","objectId",';

            cmStr += '{"name": "edit", "index": "edit", "align": "center", "sortable": false },';
            cmStr += '{"name": "objectId", "index": "objectId", "hidden": true},';
        }

        if (item.type.value != 5) {
            cnStr += '"' + item.name + '",';
            cmStr += '{"index":"' + item.name + '","name":"' + item.name + '","search":false' + setCustomFieldColor(defaultCells, item.name) + '},'
        }

        if (item.type.value == 5) {

            cnStr += '"' + item.name + '",';
            cmStr += '{"index":"' + item.name + '","name":"' + item.name + '","search":false,"classes":"relationField"},'
        }

    });
    cnStr = cnStr.substring(0, cnStr.length - 1) + ']';
    cmStr = cmStr.substring(0, cmStr.length - 1) + ']';

    return {colNamesStr: cnStr, colModelStr: cmStr};

}


angular.module('MTAUIDirective', [])
    .factory('MtaDataLayer', function () {
        return {
            getProjaObjMeta: function (tenantId, success) {
                var projObjMeta;
                var pUrl = 'http://localhost:8080/MTAServiceResful/project/rprojs?tid=' + tenantId;


                jQuery.ajax({
                    type: "GET",
                    url: pUrl,
                    dataType: 'jsonp',
                    jsonpCallback: 'processData',
                    success: function (data) {
                        var defaultFields = ['ProjectId', 'ProjectName', 'Unit'];
                        projObjMeta = generateJqGridModel(defaultFields, data);
                        success(projObjMeta);
                    },
                    error: function (jqXHR, exception) {
                    }

                });
            },
            getReqObjMeta: function (tenantId, success) {
                var reqObjMeta;
                var pUrl = 'http://localhost:8080/MTAServiceResful/requirement/rreqmeta?tid=' + tenantId;


                jQuery.ajax({
                    type: "GET",
                    url: pUrl,
                    dataType: 'jsonp',
                    jsonpCallback: 'processData',
                    success: function (data) {
                        var defaultFields = ['ReqId', 'ProjectId', 'ReqType', 'ReqDescription', 'ReqFuncFlag', 'ReqRemark'];

                        reqObjMeta = generateJqGridModel(defaultFields, data);

                        success(reqObjMeta);


                    },
                    error: function (jqXHR, exception) {
                    }
                });
            }


        }
    })
    .controller('Controller', ['$scope', function ($scope, MtaDataLayer) {
        /* MtaDataLayer.getLocations(function(data){
         $scope.locations = data;
         });*/
    }])
    .directive('mtaGrid', function (MtaDataLayer) {
        return {
            restrict: 'E',
            replace: true,

            compile: function (tElem, tAttrs) {
                console.log(name + ': compile => ' + tElem.html());
                return {
                    pre: function (scope, iElem, iAttrs) {
                        console.log(name + ': pre link => ' + iElem.html());
                        var id = setGridCrlID();

                        angular.element(iElem).append("<table id=" + id + " class='mtagrid'></table>");
                        if (iAttrs.source == "project") {

                            MtaDataLayer.getProjaObjMeta(iAttrs.tenantid, function (data) {

                                setjqGrid("#" + id, data);

                                loadProjectObjects("#" + id, iAttrs.tenantid);


                            });
                        } else if (iAttrs.source == "requirement") {

                            MtaDataLayer.getReqObjMeta(iAttrs.tenantid, function (data) {

                                setjqGrid("#" + id, data);

                                loadProjectRequirementObjects("#" + id, iAttrs.tenantid, iAttrs.projectid)

                            });

                        }
                    },
                    post: function (scope, iElem, iAttrs) {
                        console.log(name + ': post link => ' + iElem.html());
                    }
                }
            }
            /*link: function (scope, element, attrs) {
             if (attrs.source == "project") {
             var id = setGridCrlID();

             angular.element(element).append("<table id="+id+" class='mtagrid'></table>");
             MtaDataLayer.getProjaObjMeta(attrs.tenantid,function(data){

             setjqGrid("#"+id,data);

             });
             }

             }*/
        };
    });
