using dao;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;


/// <summary>
/// TenantsPageS 的摘要描述
/// </summary>
public class TenantsPageService
{

    private utbEntities utbEF;
    public TenantsPageService()
    {
        utbEF = new utbEntities();
    }


    public tenantspage getTenantsPageByPageId(int pageId)
    {
        tenantspage efTP = utbEF.tenantspage.Where(tp => tp.PageId == pageId).FirstOrDefault();

        return efTP;

    }

    public WSResultObj updateTenantsPageFileContent(string MTAPageRoot, int pageId, string fileContent)
    {

        try
        {
            tenantspage efTP = getTenantsPageByPageId(pageId);
            efTP.FileContent = fileContent;
            efTP.PhysicalFileName = getTenantsPageFileName(efTP);
            efTP.UpdateDateTime = DateTime.Now;
            utbEF.SaveChanges();

            configPhyicalFilePage(MTAPageRoot, efTP);
            return new WSResultObj { Result = "OK" };
        }
        catch (Exception ex)
        {
            return new WSResultObj { Result = "ERROR", Message = ex.Message };
        }


    }

    public void configPhyicalFilePage(string MTAPageRoot, tenantspage tp)
    {

        string directoryPath = getMTATenantsDir(MTAPageRoot, tp);
        string filePath = getTenantsPageFileName(tp);
        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }

        try
        {

            using (StreamWriter sw = new StreamWriter(Path.Combine(directoryPath, filePath), false))
            {
                sw.Write(tp.FileContent);
                sw.Flush();
                sw.Close();
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }

    }

    private string getTenantsPageFileName(tenantspage tp)
    {
        return "tenant_" + tp.TenantId + "-page_" + tp.PageId + ".html";
    }

    private string getMTATenantsDir(string MTAPageRoot, tenantspage tp)
    {
        return MTAPageRoot + "\\" + tp.TenantId + "\\";
    }

    private string getTenantsPageFilePhysicalPath(string MTAPageRoot, tenantspage tp)
    {
        return getMTATenantsDir(MTAPageRoot, tp) + getTenantsPageFileName(tp);
    }

}