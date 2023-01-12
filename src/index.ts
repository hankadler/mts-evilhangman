import { fileURLToPath } from "url";
import EvilHangman from "./EvilHangman";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await EvilHangman.start();
}
