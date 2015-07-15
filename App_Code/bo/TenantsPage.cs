using dao;
using System;

/// <summary>
/// TenantsPage 的摘要描述
/// </summary>

[Serializable]
public class TenantsPage
{
    public TenantsPage()
    {
        this.UpdateDateTime = DateTime.Now;
        this.CreateDateTime = DateTime.Now;

    }

    public TenantsPage(tenantspage tp)
    {
        this.PageId = tp.PageId;
        this.PageName = tp.PageName;
        this.PageType = tp.PageType;
        this.PhysicalFileName = tp.PhysicalFileName;
        this.TenantId = tp.TenantId;
        this.UpdateDateTime = (DateTime)tp.UpdateDateTime;
        this.CreateDateTime = (DateTime)tp.CreateDateTime;
        this.CreateUserID = (int)tp.CreateUserID;
        this.FileContent = tp.FileContent;

    }

    public int PageId { get; set; }

    public string PageName { get; set; }

    public int TenantId { get; set; }

    public int PageType { get; set; }

    public String PhysicalFileName { get; set; }

    public String FileContent { get; set; }

    public DateTime CreateDateTime { get; set; }

    public DateTime UpdateDateTime { get; set; }

    public int CreateUserID { get; set; }
}