(function() {
    'use strict';
    console.log('🎯 GUGA会员修改脚本已加载');
    
    if ($response && $response.body) {
        try {
            let body = JSON.parse($response.body);
            if (body.code === 200 && body.data) {
                console.log('📊 原始会员等级: ' + body.data.level);
                body.data.level = 1;
                body.data.trialDate = body.data.trialDate || Math.floor(Date.now() / 1000);
                console.log('✨ 修改后会员等级: ' + body.data.level);
                $done({body: JSON.stringify(body)});
            } else {
                $done({});
            }
        } catch (error) {
            console.log('❌ 错误: ' + error);
            $done({});
        }
    } else {
        $done({});
    }
})();
