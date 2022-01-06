module.exports = {
    pkgRoot: 'dist/ngx-resgridlib/',
    branches: ['master', { name: 'beta', prerelease: true }],
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        "@semantic-release/gitlab",
        "@semantic-release/npm",
        [
          "@semantic-release/git",
          {
            "assets": ["projects/ngx-resgrid-apps-shared/package.json"],
            "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
          }
        ]
      ]
  };