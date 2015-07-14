using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// ITenantsPageRepository 的摘要描述
/// </summary>
public interface ITenantsPageRepository
{

    List<TenantsPage> GetAllTenantsPageByTenantId(int TenantId);
    TenantsPage AddTenantsPage(TenantsPage tp);
    void UpdateTenantsPage(TenantsPage tp);
    void DeleteTenantsPage(int pageId);

}