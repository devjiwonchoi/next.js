const agentName = require('next/dist/telemetry/agent-name')
// Use fixture agents so this preview cannot run a real upgrade.
require.cache[require.resolve('next/dist/telemetry/agent-name')].exports = { getAgentName: async () => null }
const { handoffUpgrade } = require('next/dist/lib/upgrade/harness')
console.log('▲ old-app / npx next@canary upgrade --agent=latest')
console.log('  Upgrade: Next.js 15.5.27 → 16.3.8')
handoffUpgrade('Preview fixture: do not upgrade a project.', '/tmp/upgrade-check', null).then(() => process.exit(process.exitCode || 0))
