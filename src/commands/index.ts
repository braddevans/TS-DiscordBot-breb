import {glob} from "glob";

// eslint-disable-next-line
let modules: Promise<any[]>;

// eslint-disable-next-line
export async function import_commands() : Promise<any> {
    try {
        const res = await glob(__dirname + "/**/*.ts");
        modules = Promise.all(
            res.map((file) => {
                const import_File = file.replace(__dirname, ".").replace(".ts", "");
                console.log(`Importing File: ${import_File}`);
                import(import_File);
            })
        );
    } catch (err) {
        console.log(err);
    }

    return modules;
}

export const commands = import_commands();