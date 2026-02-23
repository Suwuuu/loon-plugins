let body = $response.body;

try {
    let obj = JSON.parse(body);
    // 判断是否有 data 字段
    if (obj && obj.data) {
        // 清空不同接口可能返回的列表字段
        if (obj.data.list) obj.data.list = [];
        if (obj.data.items) obj.data.items = [];
        if (obj.data.related) obj.data.related = [];
        if (obj.data.awemes) obj.data.awemes = [];
        
        // 可选：修改提示语，让你知道脚本生效了
        if (obj.data.toast) {
            obj.data.toast = "已开启防沉迷：看完请退出";
        }
    }
    body = JSON.stringify(obj);
} catch (e) {
    console.log("B站竖屏防沉迷脚本解析异常: " + e);
}

$done({ body: body });
