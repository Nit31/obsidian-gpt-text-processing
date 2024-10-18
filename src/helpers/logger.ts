import { promises as fs } from 'fs';
import { resolve } from 'path';


// Create the directory if it does not exist
async function ensureFolderExists(folderPath: string): Promise<void> {
	try {
		const fullPath = resolve(folderPath);
		const stats = await fs.stat(fullPath);

		// Check if it's a directory
		if (!stats.isDirectory()) {
			new Error(`${fullPath} exists but is not a folder`);
		}
		// console.log('Folder already exists');
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
			// Folder does not exist, so create it
			await fs.mkdir(folderPath, { recursive: true });
			console.log('Log directory created');
		} else {
			throw error;
		}
	}
}


// Function to log topic processing
export async function topicProcessingLog(block: string, processedBlock: string, id: number): Promise<void> {
	const folderPath = resolve('./.obsidian/logs/');
	const logFilePath = resolve(folderPath, `topic_processing_log.md`);

	// Ensure the log directory exists
	await ensureFolderExists(folderPath);

	// Create the log message
	const timestamp = new Date().toISOString();
	const logMessage = `
<p>${timestamp}</p>
<h2 style="color: red;">Block ${id}</h2>

${block}

<p>${timestamp}</p>
<h2 style="color: red;">Processed Block ${id}</h2>

${processedBlock}

`;

	// Write the log message to the log file
	try {
		await fs.appendFile(logFilePath, logMessage, 'utf8');
		console.log('Log entry written to:', logFilePath);
	} catch (error) {
		console.error('Error writing log entry:', error);
	}
}


// Function to log summarization data
export async function summarizationLog(blocks: string[], processedBlocks: string[], iteration: number): Promise<void> {
	const folderPath = resolve('./.obsidian/logs/');
	const logFilePath = resolve(folderPath, `summarization_log.md`);

	// Ensure the log directory exists
	await ensureFolderExists(folderPath);

	// Get the current timestamp
	const timestamp = new Date().toISOString();

	// Create the log message for this iteration
	let logMessage = `
<p>${timestamp}</p>
<h2 style="color: red;">Iteration ${iteration} Before</h2>
<hr>
`;

	// Append all blocks
	blocks.forEach((block, index) => {
		logMessage += `<p>Block ${index + 1}:</p>\n${block}\n<hr>\n`;
	});

	// Add the processed blocks
	logMessage += `
<h2 style="color: red;">Iteration ${iteration} After</h2>
<hr>
`;

	processedBlocks.forEach((processedBlock, index) => {
		logMessage += `<p>Processed Block ${index + 1}:</p>\n${processedBlock}\n<hr>\n`;
	});

	// Write the log message to the log file
	try {
		await fs.appendFile(logFilePath, logMessage, 'utf8');
		console.log('Log entry written to:', logFilePath);
	} catch (error) {
		console.error('Error writing log entry:', error);
	}
}
