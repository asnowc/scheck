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

  let process = 0;
  const startTime = Date.now();
  const formS = 2;
  const toS = 5;

  const form = formS * 1000;
  const to = toS * 1000 + form;
  console.log(`${formS} s 后开始统计, 统计总时长 ${toS - formS} s`);

  let csize = 0; //开始统计时已传输的大小
  for await (const chunk of data.body) {
    process += chunk.byteLength;
    let current = Date.now();
    if (current - startTime > form) {
      if (csize === 0) {
        console.log("开始统计", autoUnit.byte(process));
        csize = process;
      }
      if (current - startTime > to) {
        console.log("结束", autoUnit.byte(process));

        break;
      }
    }
  }
  console.log(autoUnit.byte((process - csize) / (toS - formS)) + "/s");
}
