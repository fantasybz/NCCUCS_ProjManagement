﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class MTAUIComponents_TenantsPageSettings : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    [WebMethod]
    public static object TenantsPageList(int TenantId)
    {
        return TenantsPageService.TenantsPageListByTenantId(TenantId);
    }

    [WebMethod]
    public static object CreateTenantsPage(TenantsPage record)
    {
        return TenantsPageService.CreateTenantsPage(record);
    }

    [WebMethod]
    public static object UpdateTenantsPage(TenantsPage record)
    {
        return TenantsPageService.UpdateTenantsPage(record);
    }

    [WebMethod]
    public static object DeleteTenantsPage(int PageId)
    {
        return TenantsPageService.DeleteTenantsPage(PageId);
    }
}