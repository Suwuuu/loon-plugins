/*
 小红书首页过滤短视频、直播、广告，只保留图文
 2024-12 Updated
*/

let body = $response.body;

try {
  // 尝试解析 JSON
  let obj = JSON.parse(body);

  if (obj && obj.data && Array.isArray(obj.data)) {
    const originalLength = obj.data.length;
    
    obj.data = obj.data.filter(item => {
      // 1. 过滤标准视频 (video)
      if (item.type === "video") return false;
      
      // 2. 过滤沉浸式视频流 (video_feed)
      if (item.type === "video_feed") return false;
      
      // 3. 过滤直播 (live)
      if (item.model_type === "live") return false;
      
      // 4. 过滤广告 (ads_info 存在即为广告)
      if (item.ads_info) return false;
      if (item.is_ads === true) return false;

      // 保留其他内容 (通常是 images)
      return true;
    });
    
    console.log(`小红书过滤: ${originalLength} -> ${obj.data.length} 条`);
  }

  // 重新打包回 JSON 字符串
  $done({ body: JSON.stringify(obj) });

} catch (e) {
  // 如果解析失败（通常是因为 Header 重写没生效，返回了 Protobuf），打印日志并返回原数据
  console.log("XHS Filter Error: " + e);
  console.log("可能原因: Header重写未生效，响应体为非JSON格式");
  $done({});
}
