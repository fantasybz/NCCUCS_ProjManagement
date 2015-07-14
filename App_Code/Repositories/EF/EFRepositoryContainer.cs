using dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// EFRepositoryContainer 的摘要描述
/// </summary>
public class EFRepositoryContainer : IRepositoryContainer
{

    private utbEntities _dataSource;

    public EFRepositoryContainer(utbEntities dataSource)
    {
        _dataSource = dataSource;
    }

    public ITenantsPageRepository TenantsPageRepository
    {
        get { return new EFTenantsPageRepository(_dataSource); }
    }
}