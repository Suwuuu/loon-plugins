/*
Loon 脚本：小红书去视频
逻辑：对应你提供的过滤需求，移除 type 为 video 或 model_type 为 video/vlog 的内容
*/

let body = $response.body;

try {
    let obj = JSON.parse(body);

    // 检查是否存在 data 数组
    if (obj.data && Array.isArray(obj.data)) {
        obj.data = obj.data.filter(item => {
            // 只要满足以下任一条件，就移除（返回 false）
            // 1. type 是 video
            if (item.type === "video") return false;
            
            // 2. model_type 是 video 或 vlog (对应你的第二行需求)
            if (item.model_type === "video" || item.model_type === "vlog") return false;
            
            // 保留其他内容
            return true;
        });
    }

    $done({ body: JSON.stringify(obj) });

} catch (e) {
    // 如果解析出错，直接返回原数据，不影响使用
    console.log("XHS Filter Error: " + e);
    $done({});
}
