using dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Services;

/// <summary>
/// TenantsPageWebService 的摘要描述
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// 若要允許使用 ASP.NET AJAX 從指令碼呼叫此 Web 服務，請取消註解下列一行。
[System.Web.Script.Services.ScriptService]
public class TenantsPageWebService : System.Web.Services.WebService
{

    private TenantsPageService tps;
    JavaScriptSerializer JSONSerializer;

    public TenantsPageWebService()
    {

        tps = new TenantsPageService();
        JSONSerializer = new JavaScriptSerializer();

    }

    [WebMethod]
    public String getTenantsPageJSONByPageId(int pageId)
    {
        tenantspage efTP = tps.getTenantsPageByPageId(pageId);
        return JSONSerializer.Serialize(new TenantsPage(efTP));
    }

    [WebMethod]
    public TenantsPage getTenantsPageByPageId(int pageId)
    {
        tenantspage efTP = tps.getTenantsPageByPageId(pageId);
        return new TenantsPage(efTP);
    }

    [WebMethod]
    public String updateTenantsPageFileContent(int pageId, string fileContent)
    {
        string appPath = HttpContext.Current.Request.ApplicationPath;
        string physicalPath = HttpContext.Current.Request.MapPath(appPath);

        string MTAPageRoot = physicalPath + Resources.Resource.MTAUIPageDir;
       
        WSResultObj wsro = tps.updateTenantsPageFileContent(MTAPageRoot, pageId, fileContent);

        return JSONSerializer.Serialize(wsro);
    }

}
