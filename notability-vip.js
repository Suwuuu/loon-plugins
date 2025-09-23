// Notability VIP修改插件
// 功能：将starter等级修改为plus或lite

(function() {
    'use strict';
    
    // 配置：选择要修改成的VIP类型 - "plus" 或 "lite"
    const targetTier = "plus"; // 可以改为 "lite"
    
    // 检查是否是目标请求
    if ($response.status === 200 && 
        $request.method === "POST" && 
        $request.url.includes("/global")) {
        
        try {
            // 解析响应体
            let body = JSON.parse($response.body);
            
            // 检查是否是associateAppStoreTransactions响应
            if (body.data && body.data.associateAppStoreTransactions) {
                const originalTier = body.data.associateAppStoreTransactions.tier;
                
                // 修改VIP等级
                if (originalTier === "starter") {
                    body.data.associateAppStoreTransactions.tier = targetTier;
                    
                    console.log(`Notability VIP修改成功: starter → ${targetTier}`);
                    
                    // 更新响应体
                    $done({body: JSON.stringify(body)});
                } else {
                    console.log(`当前VIP等级已是: ${originalTier}, 无需修改`);
                    $done({});
                }
            } else {
                console.log("不是目标响应，跳过处理");
                $done({});
            }
        } catch (error) {
            console.log("JSON解析错误: " + error);
            $done({});
        }
    } else {
        $done({});
    }
})();
