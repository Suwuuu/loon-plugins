// guga_request_fix.js
(function () {
  'use strict';
  if (typeof $request === 'undefined') {
    $done({});
    return;
  }

  // 只针对目标 URL 生效（可省略，如果通过规则限定）
  // if (!/^https?:\/\/www\.guga\.co\/api-base\/v2\/state/.test($request.url)) { $done({}); return; }

  try {
    // 移除 Accept-Encoding，让服务器返回未压缩内容
    if ($request.headers && $request.headers['Accept-Encoding']) {
      delete $request.headers['Accept-Encoding'];
    }
    // 或者显式设置为身份编码（identity）
    // $request.headers['Accept-Encoding'] = 'identity';

    // 可选：强制 Accept 为 application/json
    $request.headers['Accept'] = 'application/json';

    $done({ request: $request });
  } catch (e) {
    console.log('request-fix error:', e.message);
    $done({});
  }
})();

