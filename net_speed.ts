import { Command } from "npm:commander@11";

const clientCmd = new Command("client").argument("<link>").action(async function (link: string) {
  const { startTestDownloadSpeed } = await import("./src/net_speed/client.ts"); //allow-net
  return startTestDownloadSpeed(link);
});

const serverCmd = new Command("server")
  .option("--port <port>", "指定监听端口", "8080")
  .action(async function (opts: { port: number }) {
    const { startTestUploadSpeedServer } = await import("./src/net_speed/server.ts");
    const server = startTestUploadSpeedServer(+opts.port);
    return server.finished;
  });

const cmd = new Command("").version("0.0.3");

cmd.addCommand(clientCmd);
cmd.addCommand(serverCmd);

cmd.parseAsync(["", "", ...Deno.args]);
