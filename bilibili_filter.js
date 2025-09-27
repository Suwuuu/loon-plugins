/*
 小红书首页过滤短视频，只保留图文
*/

let body = $response.body;

try {
  let obj = JSON.parse(body);

  if (obj && obj.data && Array.isArray(obj.data.items)) {
    // 过滤，只保留图文 note
    console.log(obj.data.items[0])
    console.log(obj.data.items.length)
    obj.data.items = obj.data.items.filter(item => !item.hasOwnProperty('rcmd_reason'))
    console.log(obj.data.items.length)
    console.log("1111111")
  }
// 1111
  body = JSON.stringify(obj);
} catch (e) {
  console.log("xhs_filter parse error: " + e);
}

$done({ body });
