<%@ Page Title="" Language="C#" MasterPageFile="~/masterpage/MasterPage.master" AutoEventWireup="true" CodeFile="TenantsPageSettings.aspx.cs" Inherits="MTAUIComponents_TenantsPageSettings" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <link href="../assets/jtable.2.4.0/themes/lightcolor/blue/jtable.css" rel="stylesheet" />
    <script src="../assets/jtable.2.4.0/external/json2.js"></script>
    <script src="../assets/jtable.2.4.0/jquery.jtable.js"></script>
    <script src="../assets/jtable.2.4.0/extensions/jquery.jtable.aspnetpagemethods.js"></script>
    <script src="../js/moment.min.js"></script>
    <h1 id="hTname"></h1>

    <h2>請選擇多租戶使用者:<select id="tenant-user-select" class="form-control input-lg"></select></h2>
    <hr>
    <asp:HiddenField ID="hid_tenant_id" runat="server" />
    <asp:HiddenField ID="hid_user_id" runat="server" />

    <div id="TenantsPageTableContainer"></div>

    <script type="text/javascript">

        var MTAServiceURL = 'http://192.168.1.109:8080/MTAServiceResful/';

        $(function () {

            configTenantSelectData();

            configSelectChangeAction();


        });


        function configTenantsPageTableContainer() {
            $('#TenantsPageTableContainer').jtable({
                title: '多租戶客製化頁面列表',
                actions: {
                    //線上測試版
                    listAction: '/MTAUIStudio/MTAUIComponents/TenantsPageSettings.aspx/TenantsPageList',
                    createAction: '/MTAUIStudio/MTAUIComponents/TenantsPageSettings.aspx/CreateTenantsPage',
                    updateAction: '/MTAUIStudio/MTAUIComponents/TenantsPageSettings.aspx/UpdateTenantsPage',
                    deleteAction: '/MTAUIStudio/MTAUIComponents/TenantsPageSettings.aspx/DeleteTenantsPage'
                    //本機測試版
                   // listAction: '/MTAUIComponents/TenantsPageSettings.aspx/TenantsPageList',
                   //createAction: '/MTAUIComponents/TenantsPageSettings.aspx/CreateTenantsPage',
                   //updateAction: '/MTAUIComponents/TenantsPageSettings.aspx/UpdateTenantsPage',
                   //deleteAction: '/MTAUIComponents/TenantsPageSettings.aspx/DeleteTenantsPage'
                },
                fields: {
                    PageId: {
                        key: true,
                        create: false,
                        edit: false,
                        list: false,
                    },
                    PageName: {
                        title: '頁面名稱',
                        width: '40%'
                    },
                    PageType: {
                        title: '類型',
                        width: '10%',
                        options: { '0': '系統樣版', '1': '自建樣版' }
                    },
                    PhysicalFileName: {
                        title:'頁面檔名(路徑)',
                        create: false,
                        edit: false,
                        list: true
                    },
                    FileContent: {
                        create: false,
                        edit: false,
                        list: false
                    },
                    CreateDateTime: {
                        width: '15%',
                        type: 'date',
                        displayFormat: 'yy-mm-dd',
                        list: false,
                        create: false,
                        edit: false,
                        sorting: false //This column is not sortable!
                    },
                    UpdateDateTime: {
                        title: '更新日期',
                        width: '15%',
                        sorting: false,
                        display: function (data) {
                            return moment(data.record.DateAdded).format('YYYY/MM/DD HH:mm:ss');
                        }
                    },
                    CreateUserID: {
                        create: true,
                        edit: true,
                        list: false,
                        defaultValue: $("#ContentPlaceHolder1_hid_user_id").val(),
                        input: function (data) {

                            return '<input type="hidden" name="CreateUserID"  value="' + $("#ContentPlaceHolder1_hid_user_id").val() + '" />';

                        }
                    },
                    TenantId: {
                        create: true,
                        edit: true,
                        list: false,
                        defaultValue: $("#ContentPlaceHolder1_hid_tenant_id").val(),
                        input: function (data) {

                            return '<input type="hidden" name="TenantId"  value="' + $("#ContentPlaceHolder1_hid_tenant_id").val() + '" />';

                        }
                    },
                    Other: {
                        title: '編輯網頁版型',
                        display: function (data) {
                            return "<a target='_blank' href='http://192.168.1.109/MTALayoutit/index.html?pageid="+data.record.PageId+">編輯版型</a>";
                        },
                        create: false,
                        edit: false

                    }

                }
            });

            $('#TenantsPageTableContainer').jtable('load', {
                TenantId: $("#ContentPlaceHolder1_hid_tenant_id").val()
            });

        }


        function configSelectChangeAction() {
            $("#tenant-user-select").on('change', function () {
                $("#ContentPlaceHolder1_hid_user_id").val($(this).val());
                $("#ContentPlaceHolder1_hid_tenant_id").val($("#tenant-user-select > option[value='" + $("#tenant-user-select").val() + "']").attr("tenantId"));

                $("#ContentPlaceHolder1_hid_user_id").val($("#tenant-user-select").val());
                $("#ContentPlaceHolder1_hid_tenant_id").val($("#tenant-user-select > option[value='" + $("#tenant-user-select").val() + "']").attr("tenantId"));

                configTenantsPageTableContainer();

            });
        }

        function configTenantSelectData() {


            var userlistUrl = MTAServiceURL + 'ulist';

            $.ajax({
                type: "GET",
                url: userlistUrl,
                cache: false,
                dataType: 'jsonp',
                jsonpCallback: 'processData',
                success: function (data) {
                    $("#tenant-user-select").empty();

                    $.each(data, function (index, item) {
                        $("#tenant-user-select").append('<option value = "' + item.id + '"  tenantId ="' + item.tenantId + '">' + item.tenantName + '</option>');

                    });

                    $("#ContentPlaceHolder1_hid_user_id").val($("#tenant-user-select").val());
                    $("#ContentPlaceHolder1_hid_tenant_id").val($("#tenant-user-select > option[value='" + $("#tenant-user-select").val() + "']").attr("tenantId"));

                    configTenantsPageTableContainer();

                }, error: function (jqXHR, exception) {
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

    </script>
</asp:Content>

