let body = $response.body;
console.log("Original body: " + body);
try {
  let obj = JSON.parse(body);
  if (obj.context && obj.context.currentUser) {
    obj.context.currentUser.isVip = true;
    console.log("Modified isVip: true");
  }
  if (obj.data && obj.data.url) {
    obj.data.url = obj.data.url.replace(/&isAdopt=false/, '&isAdopt=true');
    console.log("Modified isAdopt: true");
  }
  // 可选：如果status=0是非VIP标志，试试改成1（根据实际测试）
  // if (obj.data && obj.data.status === 0) {
  //   obj.data.status = 1;
  // }
  $done({body: JSON.stringify(obj)});
} catch (e) {
  console.log("Error: " + e);
  $done({body: body});
}
