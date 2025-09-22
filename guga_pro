// guga_check_body.js
(function () {
  let body = '';

  if ($response.body && typeof $response.body === 'string' && $response.body.length > 0) {
    body = $response.body;
  } else if ($response.rawBody) {
    let bin = atob($response.rawBody);
    let arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    body = new TextDecoder('utf-8').decode(arr);
  }

  try {
    let obj = JSON.parse(body);
    if (obj.code === 200 && obj.data) {
      obj.data.level = 1;
      obj.data.trialDate = obj.data.trialDate || Math.floor(Date.now() / 1000);
      $done({ body: JSON.stringify(obj) });
      return;
    }
  } catch (e) {}

  $done({ body });
})();
