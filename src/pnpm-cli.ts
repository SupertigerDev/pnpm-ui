const child_process = require("child_process")


outdated("E:\\Nerimity\\nerimity-web\\").then(console.log)

async function outdated (dirname) {

    const rawOutdated = await runOutdated(dirname);
    return parsedOutdated(rawOutdated)
}


function runOutdated (dirname) {
    return new Promise(response => {
        const result = child_process.exec(`pnpm outdated`, {cwd: dirname})
        result.stdout.on("data", (data) => {
            response(data)
        })
    })
}

/**
 * Parse the outdated package information from a string.
 *
 * @param {string} str - The input string containing outdated package information.
 * @return {{package: string, current: string, latest: string, type: "dev" | undefined}[]} An array of objects containing package, current version, and latest version.
 */
function parsedOutdated (str) {
    const lines = str.split("\n")
    let result = [] 
    for (let index = 2; index < lines.length; index++) {
        const line = lines[index];
        const split = line.split("│").map(x => x.trim()).filter(x => x)
        if (split.length <= 1) continue;

        const package = split[0].split(" ");
        const type = package[1]?.substring(1, package[1].length - 1);

        result.push({
            package: package[0],
            type,
            current: split[1],
            latest: split[2]
        });
    }
    
    return result;
}