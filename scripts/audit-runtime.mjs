import { spawnSync } from "node:child_process";

const knownExceptions = new Map([
  [
    "@prisma/config",
    {
      advisories: new Set(),
      transitivePackages: new Set(["deepmerge-ts"]),
    },
  ],
  [
    "deepmerge-ts",
    {
      advisories: new Set(["GHSA-ggr8-5vv4-36mx"]),
      transitivePackages: new Set(),
    },
  ],
  [
    "fast-uri",
    {
      advisories: new Set([
        "GHSA-5jgf-p345-68v8",
        "GHSA-f65p-4m7j-42xc",
        "GHSA-fph4-wmhf-6fwf",
        "GHSA-jqff-g426-hqxp",
      ]),
      transitivePackages: new Set(),
    },
  ],
  [
    "mysql2",
    {
      advisories: new Set([
        "GHSA-3f6p-5ww8-9rcr",
        "GHSA-rgwj-5xj2-c3m3",
      ]),
      transitivePackages: new Set(),
    },
  ],
]);

const auditArguments = [
  "audit",
  "--omit=dev",
  "--omit=peer",
  "--audit-level=high",
  "--json",
];
const npmCliPath = process.env.npm_execpath;
const command = npmCliPath ? process.execPath : process.platform === "win32" ? "npm.cmd" : "npm";
const commandArguments = npmCliPath
  ? [npmCliPath, ...auditArguments]
  : auditArguments;
const result = spawnSync(command, commandArguments, {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});

if (result.error) {
  console.error(`Unable to run npm audit: ${result.error.message}`);
  process.exit(1);
}

let report;

try {
  report = JSON.parse(result.stdout);
} catch {
  console.error("npm audit did not return valid JSON.");
  if (result.stderr) {
    console.error(result.stderr.trim());
  }
  process.exit(1);
}

function advisoryId(via) {
  if (!via || typeof via !== "object" || typeof via.url !== "string") {
    return null;
  }

  return via.url.match(/GHSA-[a-z0-9-]+$/i)?.[0] ?? null;
}

function isKnownException(name, vulnerability) {
  const exception = knownExceptions.get(name);

  if (!exception || !Array.isArray(vulnerability.via) || vulnerability.via.length === 0) {
    return false;
  }

  return vulnerability.via.every((via) => {
    if (typeof via === "string") {
      return exception.transitivePackages.has(via);
    }

    const id = advisoryId(via);
    return Boolean(id && exception.advisories.has(id));
  });
}

const vulnerabilities = Object.entries(report.vulnerabilities ?? {}).filter(
  ([, vulnerability]) =>
    vulnerability?.severity === "high" || vulnerability?.severity === "critical",
);
const unapproved = vulnerabilities.filter(
  ([name, vulnerability]) => !isKnownException(name, vulnerability),
);

if (unapproved.length > 0) {
  console.error("Unapproved high or critical dependency alerts found:");
  for (const [name, vulnerability] of unapproved) {
    const ids = vulnerability.via
      .map((via) => (typeof via === "string" ? via : advisoryId(via)))
      .filter(Boolean)
      .join(", ");
    console.error(`- ${name} (${vulnerability.severity}): ${ids || "unidentified advisory"}`);
  }
  process.exit(1);
}

const acceptedNames = vulnerabilities.map(([name]) => name);

if (acceptedNames.length > 0) {
  console.log(
    `No unapproved high or critical alerts. Accepted Prisma tooling exceptions: ${acceptedNames.join(", ")}.`,
  );
} else {
  console.log("No high or critical dependency alerts found.");
}
