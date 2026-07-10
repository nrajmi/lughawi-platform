import { spawn } from 'child_process';
import { runWatchdog } from './watchdog.js';

console.log("[\x1b[36mDev Manager\x1b[0m] Starting development environment...");

// 1. Start the Vite Dev Server
const viteProcess = spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['vite', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// 2. Start the Auto-Healing Watchdog Daemon natively in this process
console.log("[\x1b[35mWatchdog Daemon\x1b[0m] Started in background mode. Listening for localization leaks...");
const watchdogInterval = setInterval(() => {
  runWatchdog(true).catch(err => {
    console.error("[\x1b[31mWatchdog Daemon Error\x1b[0m]", err);
  });
}, 5000); // Check every 5 seconds

const cleanup = () => {
  console.log("\n[\x1b[36mDev Manager\x1b[0m] Shutting down environment...");
  clearInterval(watchdogInterval);
  viteProcess.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

viteProcess.on('close', (code) => {
  console.log(`[\x1b[36mDev Manager\x1b[0m] Vite process exited with code ${code}`);
  cleanup();
});
