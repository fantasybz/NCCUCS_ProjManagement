using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// WSResultObj 的摘要描述
/// </summary>
[Serializable]
public class WSResultObj
{
    public WSResultObj()
    {
        //
        // TODO: 在這裡新增建構函式邏輯
        //
    }

    public string Result { get; set; }

    public string Message { get; set; }
}