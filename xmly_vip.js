let body = $response.body;
console.log("Original body: " + body);
try {
  let obj = JSON.parse(body);
  obj.data.isVip = true;
  console.log("Modified to VIP: true");
  $done({body: JSON.stringify(obj)});
} catch (e) {
  console.log("Error: " + e);
  $done({body: body}); // 出错时返回原响应
}
