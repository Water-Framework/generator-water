import Generator from '../WaterBaseGenerator.js';
import fs from 'fs';
import path from 'path';

export default class extends Generator {

    constructor(args, opts) {
        super(args, opts);
        this._initSuccess = false;
    }

    async initializing() {
        super.printSplash();
        this.log.info('Initializing Water Framework Claude configuration in current directory...');
    }

    async writing() {
        const cwd = process.cwd();
        const currentDir = path.dirname(new URL(import.meta.url).pathname);

        // Copy CLAUDE.md from templates/claude/CLAUDE.md to current directory
        const templateClaudeMd = path.join(currentDir, '..', '..', 'templates', 'claude', 'CLAUDE.md');
        const destClaudeMd = path.join(cwd, 'CLAUDE.md');

        if (fs.existsSync(destClaudeMd)) {
            this.log.info('CLAUDE.md already exists in current directory, skipping copy.');
        } else {
            fs.copyFileSync(templateClaudeMd, destClaudeMd);
            this.log.ok('CLAUDE.md copied to current directory.');
        }

        // Create .claude directory
        const claudeDir = path.join(cwd, '.claude');
        if (!fs.existsSync(claudeDir)) {
            fs.mkdirSync(claudeDir, { recursive: true });
            this.log.ok('.claude/ directory created.');
        } else {
            this.log.info('.claude/ directory already exists.');
        }
    }

    async install() {
        const cwd = process.cwd();
        const claudeDir = path.join(cwd, '.claude');

        // Clone Water Framework Claude knowledge base into .claude
        const existingContent = fs.readdirSync(claudeDir);
        if (existingContent.length > 0) {
            this.log.info('.claude/ is not empty, skipping git clone.');
            this._initSuccess = true;
            return;
        }

        this.log.info('Cloning Water Framework Claude knowledge base...');
        this.log.info('Repository: https://github.com/Water-Framework/claude.git');

        const result = await this.spawn('git', ['clone', 'https://github.com/Water-Framework/claude.git', '.'], {
            cwd: claudeDir,
            stdio: ['pipe', 'inherit', 'inherit']
        });

        if (result.exitCode === 0) {
            this._initSuccess = true;
            this.log.ok('Water Framework Claude knowledge base cloned successfully into .claude/');
        } else {
            this.log.error('Failed to clone repository (exit code: ' + result.exitCode + ').');
            this.log.error('Please check your internet connection and try again.');
        }
    }

    end() {
        this.log('');
        if (this._initSuccess) {
            this.log('Claude initialization complete!');
            this.log('');
            this.log('Created:');
            this.log('  CLAUDE.md    - Water Framework Claude instructions for this project');
            this.log('  .claude/     - Water Framework Claude knowledge base (cloned from GitHub)');
            this.log('');
            this.log('Claude Code is now configured as a Water Framework expert in this directory.');
        } else {
            this.log('Initialization completed with errors. Check messages above and retry if needed.');
        }
        this.log('');
    }
}
