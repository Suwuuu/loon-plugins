let body = $response.body;

try {
    let obj = JSON.parse(body);
    
    // 判断是否存在 data 字段
    if (obj && obj.data) {
        // B站竖屏下滑通常使用 list 或 awemes 字段来返回新视频
        if (obj.data.list) {
            obj.data.list = [];
        }
        if (obj.data.awemes) {
            obj.data.awemes = [];
        }
        if (obj.data.items) {
            obj.data.items = [];
        }
        
        // 加上一个小提示，当你下滑时如果有 Toast 提示，会显示这段话
        if (obj.data.toast) {
            obj.data.toast = "防沉迷生效：请退出当前视频";
        }
    }
    
    body = JSON.stringify(obj);
} catch (e) {
    console.log("B站竖屏防沉迷脚本解析异常: " + e);
}

$done({ body: body });
