class FixedLenReadable extends ReadableStream<Uint8Array> {
  static chunk = new Uint8Array(128 * 1024);
  /**
   * @param max - 单位 kb
   */
  constructor(max: number) {
    max *= 1024;
    let transferred = 0;
    super({
      pull: (ctrl) => {
        if (transferred > max) ctrl.close();
        else {
          ctrl.enqueue(FixedLenReadable.chunk);
          transferred += FixedLenReadable.chunk.byteLength;
        }
      },
    });
  }
}

/**
 *  启动一个 http 服务器，用于检测出网速度（只是传输速度，并非代表真正的出网速度）
 */
export function startTestUploadSpeedServer(port: number) {
  console.log("监听端口：" + port);

  return Deno.serve({ port }, async function (req) {
    if (req.url.endsWith("download")) {
      console.log("req accept");
      const body = new FixedLenReadable(100 * 1024); //100MB
      return new Response(body, { status: 200 });
    } else {
      console.log("req reject");
      return new Response(null, { status: 403 });
    }

    //   return fetch(link);
  });
}
