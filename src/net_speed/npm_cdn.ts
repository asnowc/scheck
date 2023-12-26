import { autoUnit } from "npm:evlib/math";
import { toErrorStr } from "npm:evlib";

async function download(link: string, count = 1): Promise<{ response: number; finish: number; size: number }> {
  const startTime = Date.now();

  const res = {
    response: 0,
    finish: 0,
    size: 0,
  };

  for (let i = 0; i < count; i++) {
    const resp = await fetch(link);
    const responseTimeStrap = Date.now();
    res.response += responseTimeStrap - startTime;
    if (!resp.body) continue;
    let size = 0;
    for await (const chunk of resp.body) {
      size += chunk.byteLength;
    }
    res.finish += Date.now() - responseTimeStrap;
    res.size += size;
  }

  return res;
}

/**
 * 检测 CDN 速度
 */
async function checkCDN() {
  const linkMap: Record<string, string> = {
    "esm.sh": "https://esm.sh/v135/echarts@5.4.3/es2022/echarts.mjs",
    unpkg: "https://unpkg.com/echarts@5.4.3/dist/echarts.esm.min.js",
    jsdelivr: "https://cdn.jsdelivr.net/npm/echarts/+esm",
  };
  for (const [k, v] of Object.entries(linkMap)) {
    try {
      const res = await download(v, 10);
      console.table({
        name: k,
        响应时间: res.response + " ms",
        下载时间: res.finish + " ms",
        速度: autoUnit.byte((res.size / res.finish) * 1000) + "/s",
        文件大小: autoUnit.byte(res.size),
      });
    } catch (error) {
      console.log(k);
      toErrorStr(error);
    }
  }
}
