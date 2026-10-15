/**
 * X (Twitter) 视频固定最高画质 —— Loon http-response 脚本。
 *
 * 原理：video.twimg.com 返回的 HLS 主播放列表里会列出多个码率分支
 * （#EXT-X-STREAM-INF），播放器按自适应码率（ABR）自行挑一个，弱网或
 * 起播阶段常被挑成低画质。这里把主播放列表改写成"只剩码率最高的那一个
 * 分支"，播放器便没有任何可降级的选项。
 *
 * 失败处理（刻意不做静默兜底）：
 *   - /pu/pl/ 下的分片级播放列表本就没有 #EXT-X-STREAM-INF，属正常情况，静默放行；
 *   - 主播放列表里解析不到分支时，视为异常：写入 Loon 脚本日志并原样放行，
 *     不伪造成功，也不悄悄降级。
 */

const LOG_PREFIX = "[XVideoHQ]";
const VARIANT_TAG = "#EXT-X-STREAM-INF:";
const MEDIA_PLAYLIST_PATH = /\/pu\/pl\//;

function log(message) {
  console.log(`${LOG_PREFIX} ${message}`);
}

function parseIntegerAttribute(attributes, name) {
  const matched = new RegExp(`(?:^|,)\\s*${name}=(\\d+)`).exec(attributes);
  return matched ? Number.parseInt(matched[1], 10) : -1;
}

function parseVariant(tagLine) {
  const attributes = tagLine.slice(VARIANT_TAG.length);
  const resolution = /(?:^|,)\s*RESOLUTION=(\d+)x(\d+)/.exec(attributes);

  return {
    bandwidth: parseIntegerAttribute(attributes, "BANDWIDTH"),
    averageBandwidth: parseIntegerAttribute(attributes, "AVERAGE-BANDWIDTH"),
    pixels: resolution
      ? Number.parseInt(resolution[1], 10) * Number.parseInt(resolution[2], 10)
      : -1,
    resolution: resolution ? `${resolution[1]}x${resolution[2]}` : "未知分辨率",
  };
}

// 按 BANDWIDTH 排序（HLS 规范中必有）；并列时看 AVERAGE-BANDWIDTH，再并列看分辨率。
function isBetterVariant(candidate, current) {
  if (candidate.bandwidth !== current.bandwidth) {
    return candidate.bandwidth > current.bandwidth;
  }
  if (candidate.averageBandwidth !== current.averageBandwidth) {
    return candidate.averageBandwidth > current.averageBandwidth;
  }
  return candidate.pixels > current.pixels;
}

function collectVariantBlocks(lines) {
  const blocks = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].indexOf(VARIANT_TAG) !== 0) {
      continue;
    }

    let uriIndex = index + 1;
    while (uriIndex < lines.length && lines[uriIndex].trim() === "") {
      uriIndex += 1;
    }
    if (uriIndex >= lines.length || lines[uriIndex].indexOf("#") === 0) {
      continue;
    }

    blocks.push(
      Object.assign(parseVariant(lines[index]), {
        tagIndex: index,
        uriIndex,
      }),
    );
    index = uriIndex;
  }

  return blocks;
}

function selectBestVariant(variants) {
  return variants.reduce((best, variant) => (isBetterVariant(variant, best) ? variant : best));
}

function rewriteToHighestVariant(body, url) {
  const eol = body.includes("\r\n") ? "\r\n" : "\n";
  const endsWithEol = body.endsWith(eol);
  const lines = body.split(/\r?\n/);
  if (endsWithEol) {
    lines.pop();
  }

  const variants = collectVariantBlocks(lines);
  if (variants.length === 0) {
    log(`异常：主播放列表解析不到任何 ${VARIANT_TAG} 分支，未做任何修改：${url}`);
    return null;
  }
  if (variants.length === 1) {
    log(`该播放列表本身就只有一个分支，无需修改：${url}`);
    return null;
  }

  const best = selectBestVariant(variants);
  const droppedIndexes = new Set();
  variants.forEach((variant) => {
    if (variant === best) {
      return;
    }
    droppedIndexes.add(variant.tagIndex);
    droppedIndexes.add(variant.uriIndex);
  });

  log(
    `已固定为最高画质 ${best.resolution} / ${best.bandwidth} bps，移除 ${
      variants.length - 1
    } 个低码率分支`,
  );
  return lines.filter((line, index) => !droppedIndexes.has(index)).join(eol) + (endsWithEol ? eol : "");
}

const requestUrl = $request.url;
const requestBody = $response.body;
let rewrittenBody = null;

if (typeof requestBody !== "string" || requestBody.length === 0) {
  log(`响应体为空或非文本，原样放行：${requestUrl}`);
} else if (requestBody.indexOf(VARIANT_TAG) === -1) {
  if (!MEDIA_PLAYLIST_PATH.test(requestUrl)) {
    log(`异常：该主播放列表没有 ${VARIANT_TAG}，原样放行：${requestUrl}`);
  }
} else {
  rewrittenBody = rewriteToHighestVariant(requestBody, requestUrl);
}

if (rewrittenBody === null || rewrittenBody === requestBody) {
  $done({});
} else {
  $done({ body: rewrittenBody });
}
