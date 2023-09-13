module.exports = {
  pkgRoot: "dist/ngx-resgridlib/",
  branches: ["release", { name: "release", prerelease: false }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/git",
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["projects/ngx-resgrid-apps-shared/package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
