/*
 * Loon a rewrite script for GuGa App
 *
 * @supported ^https:\/\/www\.guga\.co\/api-base\/v2\/state$
 *
 * It is recommended to use the MIT license agreement, but you can use other agreements.
 */
(function() {
    'use strict';
    // 打印日志，表示脚本已加载
    console.log('🎯 GUGA会员修改脚本已加载');

    // 检查是否有响应体
    if ($response && $response.body) {
        try {
            // 解析响应体为JSON对象
            let body = JSON.parse($response.body);

            // 检查响应码和数据是否存在
            if (body.code === 200 && body.data) {
                // 打印原始会员等级
                console.log('📊 原始会员等级: ' + body.data.level);

                // 修改会员等级为1 (通常1代表VIP)
                body.data.level = 1;

                // 如果试用日期不存在，则设置为当前时间戳
                body.data.trialDate = body.data.trialDate || Math.floor(Date.now() / 1000);

                // 打印修改后的会员等级
                console.log('✨ 修改后会员等级: ' + body.data.level);

                // 将修改后的body打包成字符串，返回给Loon
                $done({body: JSON.stringify(body)});
            } else {
                // 如果响应码或数据不符合预期，则不进行任何修改
                $done({});
            }
        } catch (error) {
            // 捕获并打印JSON解析或其他错误
            console.log('❌ 错误: ' + error);
            $done({});
        }
    } else {
        // 如果没有响应体，则不进行任何修改
        $done({});
    }
})();
