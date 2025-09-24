/*
 小红书首页过滤短视频，只保留纯图文笔记
*/
let body = $response.body;

try {
  let obj = JSON.parse(body);

  if (obj && obj.data && Array.isArray(obj.data)) {
    obj.data = obj.data.filter(item => {
      // 保留条件：是note && 有images_list && note_attributes 不含 "video"
      const isNote = item.model_type === "note";
      const hasImages = item.images_list && item.images_list.length > 0;
      const isVideoNote = item.note_attributes && item.note_attributes.includes("video");
      return isNote && hasImages && !isVideoNote;
    });
  }

  body = JSON.stringify(obj);
} catch (e) {
  console.log("xhs_filter parse error: " + e);
}

$done({ body });
