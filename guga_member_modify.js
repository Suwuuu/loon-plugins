// (function() {
//     'use strict';
//     console.log('🎯 GUGA会员修改脚本已加载');
//     if ($response && $response.body) {
//         try {
//             // 打印原始响应体，看是否是乱码
//             console.log('原始内容:', $response.body);

//             let body = JSON.parse($response.body);
//             // 打印解析后的对象
//             console.log('解析后的对象:', JSON.stringify(body));

//             if (body.code === 200 && body.data) {
//                 console.log('📊 原始会员等级: ' + body.data.level);
//                 body.data.level = 1;
//                 body.data.trialDate = body.data.trialDate || Math.floor(Date.now() / 1000);
//                 console.log('✨ 修改后会员等级: ' + body.data.level);
//                 $done({body: JSON.stringify(body)});
//             } else {
//                 console.log('⚠️ 响应码或数据不符合预期，未修改。');
//                 $done({});
//             }
//         } catch (error) {
//             console.log('❌ 错误: ' + error.message);
//             $done({});
//         }
//     } else {
//         console.log('❌ 无响应体。');
//         $done({});
//     }
// })();
(function() {
'use strict';
// 检查响应体是否存在
if ($response && $response.body && $response.body.length > 0) {
console.log('🎉🎉🎉 成功获取到响应体！');
// 可选：打印响应体内容以便确认
// console.log($response.body);
} else {
console.log('❌ 仍然没有获取到响应体。');
}
// 不做任何修改，直接返回
$done({});
})();
