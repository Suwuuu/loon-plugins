/*
 小红书首页过滤短视频，只保留图文
*/

let body = $response.body;

try {
  let obj = JSON.parse(body);

  if (obj && obj.data && Array.isArray(obj.data)) {
    // 过滤，只保留图文 note
    obj.data = obj.data.filter(item => {
      return item.model_type === "note" && item.images_list && item.images_list.length > 0;
    });
  }

  body = JSON.stringify(obj);
} catch (e) {
  console.log("xhs_filter parse error: " + e);
}

$done({ body });
