export function printServerBanner(port: number | string, env: string): void {
  const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    yellow: '\x1b[38;2;247;185;40m',
    gold: '\x1b[38;2;234;179;8m',
    cyan: '\x1b[38;2;56;189;248m',
    green: '\x1b[38;2;52;211;153m',
    dim: '\x1b[38;2;148;163;184m',
    white: '\x1b[37;1m',
    orange: '\x1b[38;2;251;146;60m',
  };

  const asciiLogo = [
    `${c.gold}${c.bold}  ____             _   _                 '       ____  _ _            ${c.reset}`,
    `${c.gold}${c.bold} | __ ) _ __ ___ | |_| |__   ___ _ __   ___    | __ )(_) |_ ___  ___ ${c.reset}`,
    `${c.gold}${c.bold} |  _ \\| '__/ _ \\| __| '_ \\ / _ \\ '__| / __|   |  _ \\| | __/ _ \\/ __|${c.reset}`,
    `${c.gold}${c.bold} | |_) | | | (_) | |_| | | |  __/ |    \\__ \\   | |_) | | ||  __/\\__ \\${c.reset}`,
    `${c.gold}${c.bold} |____/|_|  \\___/ \\__|_| |_|\\___|_|    |___/   |____/|_|\\__\\___||___/${c.reset}`,
  ].join('\n');

  const tagLine = ` ${c.orange}${c.bold}🍗 BITES${c.reset} ${c.dim}•${c.reset} ${c.cyan}${c.bold}🥤 SIPS${c.reset} ${c.dim}•${c.reset} ${c.yellow}${c.bold}🤝 BROTHERHOOD${c.reset} ${c.dim}•${c.reset} ${c.green}${c.bold}🌊 COX'S BAZAR${c.reset}`;

  const line = `${c.dim}──────────────────────────────────────────────────────────────────────${c.reset}`;

  const info = [
    `  ${c.green}●${c.reset} ${c.bold}Status${c.reset}       : ${c.green}${c.bold}Live & Operational${c.reset} [${env.toUpperCase()}]`,
    `  ${c.cyan}⚡${c.reset} ${c.bold}API Gateway${c.reset}  : ${c.cyan}http://localhost:${port}/${c.reset}`,
    `  ${c.yellow}🌐${c.reset} ${c.bold}Client App${c.reset}   : ${c.yellow}http://localhost:3000/${c.reset}`,
    `  ${c.white}🛡️${c.reset} ${c.bold}Admin Panel${c.reset}  : ${c.white}http://localhost:3000/admin/dashboard${c.reset}`,
    `  ${c.cyan}📊${c.reset} ${c.bold}Analytics${c.reset}    : ${c.cyan}http://localhost:3000/admin/analytics${c.reset}`,
    `  ${c.green}🍃${c.reset} ${c.bold}Database${c.reset}     : ${c.green}MongoDB Atlas Cloud (Connected)${c.reset}`,
    `  ${c.orange}📍${c.reset} ${c.bold}Location Node${c.reset}: ${c.dim}Marine Drive, Sonar Para Beach, Inani, Cox's Bazar${c.reset}`,
  ].join('\n');

  console.log(`\n${asciiLogo}\n\n${tagLine}\n\n${line}\n${info}\n${line}\n`);
}
