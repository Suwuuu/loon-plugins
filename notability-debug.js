// Notability 调试脚本 - 用于查看实际响应结构
(function() {
    'use strict';
    
    console.log("=== Notability 调试信息 ===");
    console.log("请求URL: " + $request.url);
    console.log("请求方法: " + $request.method);
    console.log("响应状态: " + $response.status);
    console.log("响应头: " + JSON.stringify($response.headers));
    
    if ($response.body) {
        try {
            const body = JSON.parse($response.body);
            console.log("响应体结构: " + JSON.stringify(body, null, 2));
            
            // 保存到持久化存储以便分析
            $persistentStore.write($response.body, "notability_debug_response");
            console.log("响应体已保存到持久化存储");
            
        } catch (e) {
            console.log("响应体(原始): " + $response.body.substring(0, 1000));
        }
    }
    
    $done({});
})();
