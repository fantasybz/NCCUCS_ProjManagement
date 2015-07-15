using System;
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
        return TenantsPageJTableCRUDService.TenantsPageListByTenantId(TenantId);
    }

    [WebMethod]
    public static object CreateTenantsPage(TenantsPage record)
    {
        return TenantsPageJTableCRUDService.CreateTenantsPage(record);
    }

    [WebMethod]
    public static object UpdateTenantsPage(TenantsPage record)
    {
        record.UpdateDateTime = DateTime.Now;
        return TenantsPageJTableCRUDService.UpdateTenantsPage(record);
    }

    [WebMethod]
    public static object DeleteTenantsPage(int PageId)
    {
        return TenantsPageJTableCRUDService.DeleteTenantsPage(PageId);
    }
}