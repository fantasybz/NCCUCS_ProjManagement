using dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// EF 的摘要描述
/// </summary>
public class EFTenantsPageRepository : ITenantsPageRepository
{
    private utbEntities _datasource;

    public EFTenantsPageRepository(utbEntities datasource)
    {
        _datasource = datasource;
    }

    public List<TenantsPage> GetAllTenantsPageByTenantId(int TenantId)
    {
        var q = (from tp in _datasource.tenantspage
                 where tp.TenantId == TenantId
                 select new TenantsPage
                 {
                     PageId = tp.PageId,
                     PageName = tp.PageName,
                     PageType = tp.PageType,
                     PhysicalFileName = tp.PhysicalFileName,
                     TenantId = tp.TenantId,
                     UpdateDateTime = (DateTime)tp.UpdateDateTime,
                     CreateDateTime = (DateTime)tp.CreateDateTime,
                     CreateUserID = (int)tp.CreateUserID,
                     FileContent = tp.FileContent,
                 }).ToList<TenantsPage>();

        return q;
    }

    public TenantsPage AddTenantsPage(TenantsPage _tp)
    {
        tenantspage efTP = new tenantspage();
        efTP.PageName = _tp.PageName;
        efTP.PageType = _tp.PageType;
        efTP.PhysicalFileName = _tp.PhysicalFileName;
        efTP.TenantId = _tp.TenantId;
        efTP.UpdateDateTime = _tp.UpdateDateTime;
        efTP.CreateUserID = _tp.CreateUserID;
        efTP.CreateDateTime = _tp.CreateDateTime;
        efTP.FileContent = _tp.FileContent;

        _datasource.tenantspage.Add(efTP);
        _datasource.SaveChanges();

        return new TenantsPage(efTP);
    }

    public void UpdateTenantsPage(TenantsPage _tp)
    {
        tenantspage efTP = _datasource.tenantspage.Where(tp => tp.PageId == _tp.PageId).FirstOrDefault();

        if (efTP != null)
        {
            efTP.PageName = _tp.PageName;
            efTP.PageType = _tp.PageType;
            efTP.PhysicalFileName = _tp.PhysicalFileName;
            efTP.TenantId = _tp.TenantId;
            efTP.UpdateDateTime = _tp.UpdateDateTime;
            efTP.CreateUserID = _tp.CreateUserID;
            efTP.FileContent = _tp.FileContent;

            _datasource.SaveChanges();
        }
    }

    public void DeleteTenantsPage(int pageId)
    {
        tenantspage efTP = _datasource.tenantspage.Where(tp => tp.PageId == pageId).FirstOrDefault();

        _datasource.tenantspage.Remove(efTP);

        _datasource.SaveChanges();
    }
}