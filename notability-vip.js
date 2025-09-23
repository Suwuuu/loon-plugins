// Notability VIP全面修改插件
(function() {
    'use strict';
    
    console.log("[Notability VIP] 全面修改脚本开始");
    console.log("请求URL: " + $request.url);
    console.log("请求体包含associateAppStoreTransactions: " + $request.body.includes("associateAppStoreTransactions"));
    
    const targetTier = "plus"; // 可选: "plus", "pro", "lite"
    
    try {
        let body = JSON.parse($response.body);
        let modified = false;
        
        console.log("原始响应: " + JSON.stringify(body));
        
        // 方法1: 修改 associateAppStoreTransactions
        if (body.data && body.data.associateAppStoreTransactions) {
            const original = body.data.associateAppStoreTransactions.tier;
            body.data.associateAppStoreTransactions.tier = targetTier;
            
            // 完善订阅信息
            if (body.data.associateAppStoreTransactions.current === null) {
                body.data.associateAppStoreTransactions.current = {
                    "__typename": "Subscription",
                    "tier": targetTier,
                    "status": "active",
                    "expiresDate": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                    "isTrial": false,
                    "isCancelled": false
                };
            }
            console.log(`修改associateAppStoreTransactions: ${original} → ${targetTier}`);
            modified = true;
        }
        
        // 方法2: 修改 processAppleReceipt（第一个请求）
        if (body.data && body.data.processAppleReceipt) {
            if (body.data.processAppleReceipt.subscription === null) {
                body.data.processAppleReceipt.subscription = {
                    "__typename": "Subscription",
                    "tier": targetTier,
                    "status": "active"
                };
                console.log("添加processAppleReceipt订阅信息");
                modified = true;
            }
        }
        
        // 方法3: 修改用户信息相关字段
        if (body.data && body.data.me) {
            if (body.data.me.subscription) {
                body.data.me.subscription.tier = targetTier;
                body.data.me.subscription.status = "active";
                console.log("修改用户信息订阅等级");
                modified = true;
            }
        }
        
        // 方法4: 直接添加顶级VIP字段
        if (!body.tier && !body.subscription) {
            body.subscription = {
                "tier": targetTier,
                "status": "active",
                "isActive": true,
                "expiresDate": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            };
            console.log("添加顶级订阅字段");
            modified = true;
        }
        
        if (modified) {
            const newBody = JSON.stringify(body);
            console.log("修改后的响应: " + newBody);
            console.log("✅ VIP修改完成");
            $done({body: newBody});
        } else {
            console.log("⚠️ 未找到可修改的VIP字段，但尝试添加");
            
            // 强制添加VIP信息
            body.vipInfo = {
                "tier": targetTier,
                "status": "active",
                "level": "premium"
            };
            
            const newBody = JSON.stringify(body);
            console.log("强制添加VIP信息后的响应: " + newBody);
            $done({body: newBody});
        }
        
    } catch (error) {
        console.log("❌ 处理错误: " + error);
        $done({});
    }
})();
