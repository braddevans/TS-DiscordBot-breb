import moment from "moment";

export const log = (message : string) => {
    const time = moment().format("DD/MM/YYYY_hh:mm:ss");
    console.log(`[${time}] [LOG]: ${message}`);
};

export const error = (message : string) => {
    const time = moment().format("DD/MM/YYYY_hh:mm:ss");
    console.log(`[${time}] [ERR]: ${message}`);
};

export function delay(ms: number) {
    return new Promise( (resolve) => setTimeout(resolve, ms) );
}