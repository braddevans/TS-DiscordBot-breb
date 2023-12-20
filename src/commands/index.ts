import {glob} from "glob";

// eslint-disable-next-line
export const commands : Record<string,any> = {};

// eslint-disable-next-line
export async function import_commands(): Promise<void> {
    try {
        const res = await glob(__dirname + "/**/*.ts", { ignore: "/**/index.ts" });
        res.map((file) => {
            const import_File = file.replace(__dirname, ".").replace(".ts", "");
            console.log(`Importing File: ${import_File}`);
            import(import_File).then((i) => (commands[String(import_File.split("/")[import_File.split("/").length-1])] = i));
        });
    } catch (err) {
        console.log(err);
    }
}

