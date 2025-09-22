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
// guga_check_body.js
(function() {
  'use strict';
  // 基本安全检查
  if (typeof $response === 'undefined') {
    console.log('❌ $response 未定义（脚本可能未被加载）');
    $done({});
    return;
  }
  console.log('📥 收到响应，status:', $response.status || 'unknown');
  // 尝试打印部分 body（如果过大，可注释）
  if ($response.body) {
    console.log('body 长度:', $response.body.length);
    try {
      let body = JSON.parse($response.body);
      console.log('解析后 code=', body.code, ' level=', body.data && body.data.level);
      if (body && body.code === 200 && body.data) {
        body.data.level = 1;
        body.data.trialDate = body.data.trialDate || Math.floor(Date.now() / 1000);
        console.log('✅ 已修改 level ->', body.data.level);
        $done({ body: JSON.stringify(body) });
        return;
      }
    } catch (e) {
      console.log('⚠️ JSON 解析失败：', e.message);
    }
  } else {
    console.log('⚠️ $response.body 为空或未提供');
  }
  // 未修改则原样放行（或根据需要返回原body）
  $done({});
})();
