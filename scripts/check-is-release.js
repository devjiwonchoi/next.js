const { execSync } = require('child_process')

const checkIsRelease = async () => {
  let commitId = process.argv[2] || ''
  const commitIdArg = commitId ? ` ${commitId}` : ''

  // parse only the last string which should be version if
  // it's a publish commit
  const commitMsg = execSync(`git log -n 1 --pretty='format:%B'${commitIdArg}`)
    .toString()
    .trim()

  const commitAuthor = execSync(
    `git log -n 1 --pretty='format:%ae'${commitIdArg}`
  )
    .toString()
    .trim()

  const publishMsgRegex = /^Version Packages \(Patch\/Minor\)$/
  const isGithubBot =
    // TODO: vercel-release-bot
    commitAuthor === 'github-actions[bot]@users.noreply.github.com'

  if (publishMsgRegex.test(commitMsg) && isGithubBot) {
    console.log(commitMsg)
    process.exit(0)
  } else {
    console.log('not publish commit', { commitId, commitMsg, commitAuthor })
    process.exit(1)
  }
}

checkIsRelease()
