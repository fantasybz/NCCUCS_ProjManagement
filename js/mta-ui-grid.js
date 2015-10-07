/**
 * Created by fantasybz on 2015/3/14.
 */


(function () {

    var MTAServiceURL = 'http://192.168.1.103:8080/MTAServiceResful/';

    function setRelationValue(field) {

        if (field != null && field.length == 1) {
            var valarray = _.pluck(field[0].customFields, 'value');
            return valarray.join("-");
        } else {

            return "";
        }
    }


    function loadCustomObjects(objclass, tenantId, objectId) {

        var olistUrl = MTAServiceURL + 'colist?tid=' + tenantId + "&oid=" + objectId;


        $.ajaxq("MTAQueue", {
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

                /*
                            applyPrjRowFunc();
                */
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

        if (defaultCells.length == 0) {
            return "";
        }

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

        cnStr += '"","objectId",';

        cmStr += '{"name": "edit", "index": "edit", "align": "center", "sortable": false },';
        cmStr += '{"name": "objectId", "index": "objectId", "hidden": true},';

        _.each(defaultCells, function (cellname) {
            var fielditem = _.find(obj.customFields, function (item) { return item.name == cellname; });

            if (_.isUndefined(fielditem) == false) {

                if (fielditem.type.value != 5) {
                    cnStr += '"' + fielditem.name + '",';
                    cmStr += '{"index":"' + fielditem.name + '","name":"' + fielditem.name + '","search":false' + setCustomFieldColor([], fielditem.name) + '},'
                }

                if (fielditem.type.value == 5) {

                    cnStr += '"' + fielditem.name + '",';
                    cmStr += '{"index":"' + fielditem.name + '","name":"' + fielditem.name + '","search":false,"classes":"relationField"},'
                }

            }

        });

        cnStr = cnStr.substring(0, cnStr.length - 1) + ']';
        cmStr = cmStr.substring(0, cmStr.length - 1) + ']';

        return { colNamesStr: cnStr, colModelStr: cmStr };

        /*  $.each(obj.customFields, function (i, item) {
      
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
      
          return {colNamesStr: cnStr, colModelStr: cmStr};*/


    }


    angular.module('MTAUIDirective', [])
        .factory('MtaDataLayer', function () {
            return {

                getMTAObjMeta: function (tenantId, objectId, cols, success) {
                    var objMeta;
                    var pUrl = MTAServiceURL + 'comd?tid=' + tenantId + "&oid=" + objectId;

                    $.ajaxq("MTAQueue", {
                        url: pUrl,
                        type: 'GET',
                        dataType: "jsonp",
                        jsonpCallback: 'processData',
                        success: function (data) {
                            var defaultFields = cols;
                            objMeta = generateJqGridModel(defaultFields, data);
                            success(objMeta);
                        },
                        error: function (jqXHR, exception) {
                        }
                    });

                }



            }
        })
        .controller('Controller', ['$scope', function ($scope, MtaDataLayer) {

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

                            MtaDataLayer.getMTAObjMeta(iAttrs.tenantid, iAttrs.objectid, JSON.parse(iAttrs.cols.replace(/'+/g, '"')), function (data) {

                                setjqGrid("#" + id, data);

                                loadCustomObjects("#" + id, iAttrs.tenantid, iAttrs.objectid);


                            });


                        },
                        post: function (scope, iElem, iAttrs) {
                            console.log(name + ': post link => ' + iElem.html());
                        }
                    }
                }

            };
        })
        .directive('mtaEditor', function (MtaDataLayer) {
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

                            MtaDataLayer.getMTAObjMeta(iAttrs.tenantid, iAttrs.objectid, JSON.parse(iAttrs.cols.replace(/'+/g, '"')), function (data) {

                                setjqGrid("#" + id, data);

                                loadCustomObjects("#" + id, iAttrs.tenantid, iAttrs.objectid);


                            });


                        },
                        post: function (scope, iElem, iAttrs) {
                            console.log(name + ': post link => ' + iElem.html());
                        }
                    }
                }

            };

        });
})();