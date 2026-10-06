import os, pty, fcntl, termios, struct, subprocess, select, time, json
from pathlib import Path

out = Path('/workspace/artifacts/upgrade-cli')
out.mkdir(parents=True, exist_ok=True)
node = '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/bin/node'
captures = []

def run(name, agent=0, model=0, effort=0, permission=0, worktree=0, stages=False):
    master, slave = pty.openpty()
    fcntl.ioctl(slave, termios.TIOCSWINSZ, struct.pack('HHHH', 55, 120, 0, 0))
    env = dict(os.environ, TERM='xterm-256color', FORCE_COLOR='1', PATH='/tmp/upgrade-check/agents:'+os.environ['PATH'])
    env.pop('NO_COLOR', None)
    proc = subprocess.Popen([node, '/tmp/upgrade-check/cli.cjs'], stdin=slave, stdout=slave, stderr=slave, env=env, start_new_session=True)
    os.close(slave)
    raw = b''
    def drain(expected=None):
        nonlocal raw
        deadline = time.monotonic()+8
        while time.monotonic() < deadline:
            ready, _, _ = select.select([master], [], [], .15)
            if ready:
                try: chunk = os.read(master, 65536)
                except OSError: break
                if not chunk: break
                raw += chunk
            elif expected is None or expected.encode() in raw:
                return
        if expected and expected.encode() not in raw:
            raise RuntimeError(f'Missing {expected}: {raw!r}')
    def save(label):
        file = out / (label+'.ansi')
        file.write_bytes(raw)
        captures.append(label)
    steps = [
        ('01-agent', 'Multiple coding agents detected.', agent),
        ('02-model', 'model should run the upgrade?', model),
        ('03-effort', 'Which reasoning effort', effort),
        ('04-permission', 'Use Auto permission mode', permission),
        ('05-worktree', 'Open the upgrade in a separate Git worktree?', worktree),
    ]
    try:
        for label, question, index in steps:
            drain(question)
            if index:
                os.write(master, b'\x1b[B'*index)
                drain()
            if stages: save(label)
            os.write(master, b'\r')
        drain('Preview complete.')
        save(name)
        proc.wait(timeout=5)
        if proc.returncode: raise RuntimeError(f'CLI failed: {proc.returncode}')
    finally:
        if proc.poll() is None: proc.kill()
        os.close(master)

run('06-completed-codex', model=1, effort=3, stages=True)
for i, effort in enumerate(['default', 'low', 'medium', 'high', 'xhigh', 'max', 'ultra']):
    run('effort-'+effort, model=1, effort=i, permission=1, worktree=1)
for i, model in enumerate(['sonnet', 'opus', 'fable']):
    run('claude-'+model, agent=1, model=i, effort=3, permission=1, worktree=1)
(out / 'captures.json').write_text(json.dumps(captures))
print(f'Captured {len(captures)} real CLI terminal states')
