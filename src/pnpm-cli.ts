const child_process = window.require("child_process") as typeof import("child_process");

const getCache = (dir: string) => JSON.parse(localStorage.getItem("outdated-cache-" + dir) || "null") as Record<string, Outdated> | null;

const setCache = (dir: string, data: string) => localStorage.setItem("outdated-cache-" + dir, data)

export interface Outdated {
    current: string,
    latest: string,
    wanted: string,
    isDeprecated: boolean,
    dependencyType: "devDependencies" | "dependencies"
}

export async function fetchOutdated (dirname: string) {
    const cache = getCache(dirname)
    if (cache) return cache;

    const rawOutdated = await runOutdated(dirname);
    setCache(dirname, rawOutdated);
    return JSON.parse(rawOutdated) as Record<string, Outdated>
}


function runOutdated (dirname: string) {
    return new Promise<string>(response => {
        const result = child_process.exec(`pnpm outdated --format json`, {cwd: dirname})
        result.stdout?.on("data", (data) => {
            response(data)
        })
    })
}