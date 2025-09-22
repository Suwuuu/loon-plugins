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
// debug_guga_body.js
(function () {
  'use strict';

  // 如果 $response 未定义说明脚本根本没被运行
  if (typeof $response === 'undefined') {
    console.log('❌ $response 未定义 —— 脚本可能未被正确加载或规则未命中');
    $done({});
    return;
  }

  // 打印 headers（方便确认服务器到底返回了什么 header）
  try {
    console.log('📥 收到响应 (debug)');
    if ($response.status) console.log('status:', $response.status);
    if ($response.statusCode) console.log('statusCode:', $response.statusCode);

    // 有些环境里 headers 在 $response.headers / $response.rawHeaders
    console.log('headers:', JSON.stringify($response.headers || $response.rawHeaders || {}, null, 2));
  } catch (e) {
    console.log('⚠️ 打印 headers 出错:', e.message);
  }

  // 检查各种可能的 body 来源
  try {
    if ($response.body) {
      console.log('✅ $response.body 存在，长度:', $response.body.length);
      // 只打印前 300 字符，避免日志塞爆
      console.log('body preview:', $response.body.slice(0, 300));
    } else {
      console.log('⚠️ $response.body 为空或未提供');
    }

    // 有些运行环境提供 rawBody（Base64）或 buffer 字段
    if (typeof $response.rawBody !== 'undefined') {
      console.log('info: $response.rawBody 存在 (长度):', ($response.rawBody && $response.rawBody.length) || 0);
    }
    if (typeof $response.data !== 'undefined') {
      console.log('info: $response.data 存在 (可能非文本):', typeof $response.data);
    }
  } catch (e) {
    console.log('⚠️ 访问 body 出错:', e.message);
  }

  // 临时直接返回原响应体（调试用）——如果收不到 body 将在客户端看到 "EMPTY_BODY_DEBUG"
  try {
    if ($response && $response.body) {
      // 尝试解析并修改（如果想直接测试修改，把下面注释取消）
      /*
      let obj = JSON.parse($response.body);
      if (obj && obj.code === 200 && obj.data) {
        obj.data.level = 1;
        obj.data.trialDate = obj.data.trialDate || Math.floor(Date.now() / 1000);
        $done({ body: JSON.stringify(obj) });
        return;
      }
      */
      $done({ body: $response.body });
      return;
    } else {
      // 没有 body：返回一个容易识别的调试 body 给客户端
      $done({ body: JSON.stringify({ debug: 'EMPTY_BODY_DEBUG', timestamp: Date.now() }) });
      return;
    }
  } catch (e) {
    console.log('❌ 在 $done 时出错：', e.message);
    $done({});
  }
})();

