module.exports = {
  rootDir: '/workspace/next.js',
  testMatch: ['<rootDir>/test/unit/agentic-upgrade-prompts.test.ts'],
  moduleDirectories: ['/tmp/upgrade-check/node_modules', 'node_modules'],
  moduleNameMapper: { '^next/(.*)$': '/tmp/upgrade-check/node_modules/next/$1' },
  transform: { '^.+\\.tsx?$': '/tmp/upgrade-check/transform.cjs' },
}
