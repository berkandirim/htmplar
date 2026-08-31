import { readdir, mkdir, writeFile, rm } from 'fs/promises';
import { join, extname, basename } from 'path';
import chalk from 'chalk';
import ora from 'ora';

interface BuildOptions {
  output: string;
  clean: boolean;
}

export async function buildEmails(options: BuildOptions) {
  const spinner = ora('Finding email files...').start();
  const cwd = process.cwd();
  const outputDir = join(cwd, options.output);

  try {
    // Clean output directory if requested
    if (options.clean) {
      spinner.text = 'Cleaning output directory...';
      try {
        await rm(outputDir, { recursive: true, force: true });
      } catch {
        // Directory might not exist, that's okay
      }
    }

    // Create output directory
    spinner.text = 'Creating output directory...';
    await mkdir(outputDir, { recursive: true });

    // Find all email files (*.tsx, *.jsx)
    spinner.text = 'Scanning for email files...';
    const srcDir = join(cwd, 'src');
    const files = await findEmailFiles(srcDir);

    if (files.length === 0) {
      spinner.warn('No email files found in src/');
      console.log(chalk.yellow('  Create email files in src/ with .tsx or .jsx extension'));
      return;
    }

    spinner.succeed(`Found ${files.length} email file(s)`);

    // Build each email
    console.log('');
    for (const file of files) {
      const name = basename(file, extname(file));
      const buildSpinner = ora(`Building ${name}...`).start();

      try {
        // For now, just create a placeholder
        // TODO: Actually render the emails
        const outputPath = join(outputDir, `${name}.html`);
        await writeFile(
          outputPath,
          `<!DOCTYPE html>
<html>
<head>
  <title>${name}</title>
</head>
<body>
  <p>Email: ${name}</p>
  <p>TODO: Implement actual rendering</p>
</body>
</html>`
        );

        buildSpinner.succeed(chalk.green(`${name}.html`));
      } catch (error) {
        buildSpinner.fail(chalk.red(`Failed to build ${name}`));
        console.error(error);
      }
    }

    console.log('');
    console.log(chalk.green(`✅ Built ${files.length} email(s) to ${options.output}/`));
  } catch (error) {
    spinner.fail('Build failed');
    throw error;
  }
}

async function findEmailFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await findEmailFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (ext === '.tsx' || ext === '.jsx') {
          files.push(fullPath);
        }
      }
    }
  } catch {
    // Directory might not exist
  }

  return files;
}
