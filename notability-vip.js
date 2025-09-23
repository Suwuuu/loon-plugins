// Notability VIP修改插件 - 增强完整版
(function() {
    'use strict';
    
    console.log("[Notability VIP] 脚本开始执行");
    
    // 检查是否是目标请求
    if ($request.body && !$request.body.includes("associateAppStoreTransactions")) {
        console.log("[Notability VIP] 不是目标请求，跳过处理");
        $done({});
        return;
    }
    
    if ($response.status !== 200 || !$response.body) {
        console.log("[Notability VIP] 响应无效，跳过处理");
        $done({});
        return;
    }
    
    try {
        let body = JSON.parse($response.body);
        
        // 配置VIP类型
        const targetTier = "plus"; // 可选: "plus", "lite", "pro"
        
        // 修改VIP信息
        if (body.data && body.data.associateAppStoreTransactions) {
            const vipData = body.data.associateAppStoreTransactions;
            const originalTier = vipData.tier;
            
            console.log(`[Notability VIP] 原始等级: ${originalTier}`);
            
            // 修改主等级
            vipData.tier = targetTier;
            
            // 修改当前订阅信息
            if (vipData.current === null) {
                vipData.current = {
                    "__typename": "Subscription",
                    "tier": targetTier,
                    "status": "active",
                    "expiresDate": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                    "isTrial": false,
                    "isCancelled": false
                };
            } else if (vipData.current.tier) {
                vipData.current.tier = targetTier;
                vipData.current.status = "active";
            }
            
            // 修改历史订阅信息
            if (vipData.prior === null) {
                vipData.prior = {
                    "__typename": "Subscription",
                    "tier": "starter",
                    "status": "expired",
                    "expiresDate": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                };
            }
            
            console.log(`[Notability VIP] 修改成功: ${originalTier} → ${targetTier}`);
            
            const newBody = JSON.stringify(body);
            $done({body: newBody});
            
        } else {
            console.log("[Notability VIP] 不是目标响应格式");
            $done({});
        }
        
    } catch (error) {
        console.log("[Notability VIP] 错误: " + error);
        $done({});
    }
})();
