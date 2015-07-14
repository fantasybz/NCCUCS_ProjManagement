using dao;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// RepositorySesssion 的摘要描述
/// </summary>
public class RepositorySesssion
{
	public RepositorySesssion()
	{
		//
		// TODO: 在這裡新增建構函式邏輯
		//
	}

  
    public static IRepositoryContainer CreateRepository()
    {
      
        return new EFRepositoryContainer(new utbEntities());
    }
}