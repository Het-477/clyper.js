import * as clack from '@clack/prompts';
import { homedir } from 'os';
import { join } from 'path';
import chalk from 'chalk';
import { log } from 'console';
import { writeFile, mkdir, readFile, access } from 'fs/promises';
import { constants } from 'fs';

const dataDir = join(homedir(), 'clyper_data');
const dataFile = join(dataDir, 'clyper_data.json');

clack.intro(`${chalk.red.bgCyan(' CLIPPY ')}`)

function checkProcessCancel(value) {
	if (clack.isCancel(value)) {
		log("Entry cancelled")
		process.exit();
	}
}

const key = await clack.text({
	message: 'Enter a key for the text:',
	validate: value => value.trim() === '' ? 'Key is required.' : undefined
});

checkProcessCancel(key)

const text = await clack.text({
	message: 'Enter the text to copy:',
	validate: value => value.trim() === '' ? 'Text is required.' : undefined
});

checkProcessCancel(text)

const rawDescription = await clack.text({
	message: 'Enter a description (optional):',
	initialValue: '',
});

checkProcessCancel(rawDescription);

const description =
	typeof rawDescription === 'string' && rawDescription.trim() !== ''
		? rawDescription.trim()
		: 'No description provided.';

// Ensure directory exists before reading/writing
await mkdir(dataDir, { recursive: true });

let existingData = {};
try {
	const raw = await readFile(dataFile, 'utf8');
	existingData = JSON.parse(raw);
} catch {
	existingData = {};
}

// Add or update the key entry
existingData[key] = { text, description };
await writeFile(dataFile, JSON.stringify(existingData, null, 2), 'utf8');

clack.outro(` You'r Done! `)