// modifyVip.js
let body = $response.body;
let obj = JSON.parse(body);

// 修改 VIP 状态
obj.data.isVip = true;

$done({body: JSON.stringify(obj)});
