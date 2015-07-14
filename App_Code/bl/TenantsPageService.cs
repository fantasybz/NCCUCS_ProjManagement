using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// TenantsPageService 的摘要描述
/// </summary>
public static class TenantsPageService
{



    private static IRepositoryContainer _repository { get { return RepositorySesssion.CreateRepository(); } }



    public static object TenantsPageListByTenantId(int TenantId)
    {
        try
        {
            List<TenantsPage> tpList = _repository.TenantsPageRepository.GetAllTenantsPageByTenantId(TenantId);
            return new { Result = "OK", Records = tpList };
        }
        catch (Exception ex)
        {
            return new { Result = "ERROR", Message = ex.Message };
        }
    }

    public static object CreateTenantsPage(TenantsPage record)
    {
        try
        {
            var addedTenantsPage = _repository.TenantsPageRepository.AddTenantsPage(record);
            return new { Result = "OK", Record = addedTenantsPage };
        }
        catch (Exception ex)
        {
            return new { Result = "ERROR", Message = ex.Message };
        }
    }

    public static object UpdateTenantsPage(TenantsPage record)
    {
        try
        {
            _repository.TenantsPageRepository.UpdateTenantsPage(record);
            return new { Result = "OK" };
        }
        catch (Exception ex)
        {
            return new { Result = "ERROR", Message = ex.Message };
        }
    }

    public static object DeleteTenantsPage(int TenantsPageId)
    {
        try
        {
            _repository.TenantsPageRepository.DeleteTenantsPage(TenantsPageId);
            return new { Result = "OK" };
        }
        catch (Exception ex)
        {
            return new { Result = "ERROR", Message = ex.Message };
        }
    }
}