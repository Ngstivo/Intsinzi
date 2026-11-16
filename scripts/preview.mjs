import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url)).replace(/[\\/]$/, "");
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8",
  ".js":"text/javascript; charset=utf-8", ".svg":"image/svg+xml",
  ".xml":"application/xml; charset=utf-8", ".txt":"text/plain; charset=utf-8",
  ".json":"application/json", ".woff2":"font/woff2", ".png":"image/png",
};
const server = createServer(async (request,response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, {Allow:"GET, HEAD"}).end();
    return;
  }
  let file;
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep)) throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    if (!(await stat(file)).isFile()) throw new Error("Missing file");
  } catch {
    file = resolve(root,"404.html");
    response.statusCode = 404;
  }
  response.setHeader("Content-Type",contentTypes[extname(file)] ?? "application/octet-stream");
  if (request.method === "HEAD") return response.end();
  createReadStream(file).on("error",()=>response.end("File unavailable")).pipe(response);
});
await stat(resolve(root,"index.html")).catch(()=>{throw new Error("Build the static export first with npm run build.");});
server.listen(port,"127.0.0.1",()=>console.log(`Local preview: http://127.0.0.1:${server.address().port}/`));
