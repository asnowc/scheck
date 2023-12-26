import { autoUnit } from "npm:evlib@1.3.x/math";
// const link = "https://down.dhqqs.cc/syg/windows_10_professional_x64_2023.iso";
export async function startTestDownloadSpeed(link: string) {
  console.log("fetch " + link);

  const data = await fetch(link);
  if (!data.body) {
    console.error("没有http主体");
    Deno.exit(1);
  }
  const length = data.headers.get("content-length");
  console.log("总大小：" + autoUnit.byte(+length!));

  const startTime = Date.now();
  const formS = 2;
  const toS = 5;

  console.log(`${formS} s 后开始统计, 统计总时长 ${toS} s`);

  let formTime = formS * 1000 + startTime;
  let toTime = toS * 1000 + formTime;
  let process = 0;

  let csize = 0; //开始统计时已传输的大小
  for await (const chunk of data.body) {
    process += chunk.byteLength;
    let current = Date.now();
    if (current >= formTime) {
      if (csize === 0) {
        console.log("开始统计", autoUnit.byte(process));
        csize = process;
        formTime = current;
      }
      if (current > toTime) {
        console.log("结束", autoUnit.byte(process));
        toTime = current;

        break;
      }
    }
  }
  const downloadTime = (toTime - formTime) / 1000;
  const downloadSize = process - csize;
  console.log(`期间下载：${autoUnit.byte(downloadSize)}. 计算时间：${downloadTime}ms`);

  console.log(autoUnit.byte(downloadSize / downloadTime) + "/s");
}
