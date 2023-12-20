import { glob } from "glob";
import * as path from "path";

// eslint-disable-next-line
export const commands : Record<string,any> = {};

// eslint-disable-next-line
export async function import_commands(): Promise<void> {
    try {
        const res = await glob(__dirname + "/**/*.ts", { ignore: "**/**/index.ts" });
        res.map((file) => {
            const import_File = file.replace(__dirname, ".").replace(".ts", "");
            const moduleName = String(import_File.split(path.sep)[import_File.split(path.sep).length-1]);
            console.log(`Importing File [${moduleName}]: ${import_File}`);
            import(import_File).then((i) => (commands[moduleName] = i));
        });
    } catch (err) {
        console.log(err);
    }
}

