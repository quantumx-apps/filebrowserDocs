// scripts/translate-content-smart.js
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as glob from 'glob';
import * as deepl from 'deepl-node';
import crypto from 'crypto';

// Parse command line arguments
const args = process.argv.slice(2);
const checkOnly = args.includes('--check') || args.includes('-c');

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../content');
const masterContentDir = path.join(contentDir, 'en', 'docs');
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;

if (!checkOnly && !DEEPL_API_KEY) {
  console.error("❌ Missing DEEPL_API_KEY in environment.");
  process.exit(1);
}

const translator = checkOnly ? null : new deepl.Translator(DEEPL_API_KEY);

// Language configuration from hugo.toml - simplified set
const languages = {
  'de': { name: 'German', deepl: 'DE' },
  'es': { name: 'Spanish', deepl: 'ES' },
  'fr': { name: 'French', deepl: 'FR' },
  'zh-cn': { name: 'Chinese (Simplified)', deepl: 'ZH-HANS' }
};

// --- Hash function for content comparison ---
function getContentHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// --- Check if file needs translation ---
const needsTranslation = async (masterPath, targetPath, targetLang) => {
  // If target doesn't exist, it needs translation
  if (!await fs.pathExists(targetPath)) {
    return { needsTranslation: true, reason: 'File does not exist' };
  }

  // If force flag is set, always translate
  if (force) {
    return { needsTranslation: true, reason: 'Force flag enabled' };
  }

  try {
    // Read both files
    const masterContent = await fs.readFile(masterPath, 'utf8');
    const targetContent = await fs.readFile(targetPath, 'utf8');

    // Compare content hashes
    const masterHash = getContentHash(masterContent);
    const targetHash = getContentHash(targetContent);

    // Check if master has changed
    if (masterHash !== targetHash) {
      return { needsTranslation: true, reason: 'Master content has changed' };
    }

    // Check if target has a translation marker
    if (!targetContent.includes('<!-- TRANSLATED -->')) {
      return { needsTranslation: true, reason: 'No translation marker found' };
    }

    return { needsTranslation: false, reason: 'Up to date' };
  } catch (error) {
    return { needsTranslation: true, reason: `Error checking file: ${error.message}` };
  }
};

// --- Translation Function ---
async function translateText(text, targetLanguage) {
  if (checkOnly) {
    return text;
  }

  if (!text || typeof text !== 'string' || text.trim() === '') {
    return text;
  }

  // Skip translation for certain patterns
  if (text.match(/^#+\s*$/) || // Empty headers
      text.match(/^```/) || // Code blocks
      text.match(/^\|/) || // Tables
      text.match(/^```[\s\S]*?```$/m)) { // Code blocks
    return text;
  }

  try {
    const deeplLang = languages[targetLanguage]?.deepl || targetLanguage.toUpperCase();
    const result = await translator.translateText(text, 'en', deeplLang);
    
    // Delay to avoid rate-limiting
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return result.text;
  } catch (err) {
    console.error(`⚠️ Translation failed for "${text.substring(0, 50)}...":`, err?.message || err);
    return text; // Return original text if translation fails
  }
}

// --- Process Markdown File ---
async function processMarkdownFile(filePath, targetLang) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const translatedLines = [];
  
  let inCodeBlock = false;
  let inFrontMatter = false;
  let frontMatterEnded = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle front matter
    if (line === '---' && !frontMatterEnded) {
      if (inFrontMatter) {
        inFrontMatter = false;
        frontMatterEnded = true;
      } else {
        inFrontMatter = true;
      }
      translatedLines.push(line);
      continue;
    }
    
    // Skip front matter content
    if (inFrontMatter) {
      translatedLines.push(line);
      continue;
    }
    
    // Handle code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      translatedLines.push(line);
      continue;
    }
    
    // Skip code blocks
    if (inCodeBlock) {
      translatedLines.push(line);
      continue;
    }
    
    // Skip empty lines, headers without content, and special markdown
    if (line.trim() === '' || 
        line.match(/^#+\s*$/) ||
        line.match(/^\|/) ||
        line.match(/^```/) ||
        line.match(/^---/) ||
        line.match(/^<!--/) ||
        line.match(/^\[/) && line.match(/\]\(/)) {
      translatedLines.push(line);
      continue;
    }
    
    // Translate the line
    const translatedLine = await translateText(line, targetLang);
    translatedLines.push(translatedLine);
  }
  
  return translatedLines.join('\n');
}

// --- Create Directory Structure ---
async function createLanguageDirectories() {
  for (const [langCode, langInfo] of Object.entries(languages)) {
    const langDir = path.join(contentDir, langCode, 'docs');
    await fs.ensureDir(langDir);
    console.log(`Created directory: ${langDir}`);
  }
}

// --- Get All Markdown Files ---
async function getAllMarkdownFiles() {
  const pattern = path.join(masterContentDir, '**/*.md');
  return glob.sync(pattern);
}

// --- Copy Directory Structure ---
async function copyDirectoryStructure(sourceDir, targetDir) {
  const items = await fs.readdir(sourceDir, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const targetPath = path.join(targetDir, item.name);
    
    if (item.isDirectory()) {
      await fs.ensureDir(targetPath);
      await copyDirectoryStructure(sourcePath, targetPath);
    }
  }
}

// --- Main Translation Function ---
async function syncAllContentTranslations() {
  if (checkOnly) {
    console.log("--- Checking for content translation changes (no translations will be performed) ---");
  } else {
    console.warn("--- Using DeepL API for content translation ---");
  }

  // Create language directories
  await createLanguageDirectories();

  // Get all markdown files
  const markdownFiles = await getAllMarkdownFiles();
  console.log(`Found ${markdownFiles.length} markdown files to process`);

  let meaningfulChanges = 0;
  let hasMeaningfulChanges = false;

  for (const langCode of Object.keys(languages)) {
    if (!languages[langCode]) {
      console.warn(`Unknown language: ${langCode}`);
      continue;
    }

    console.log(`\nProcessing target language: ${langCode} (${languages[langCode].name})`);
    const langDir = path.join(contentDir, langCode, 'docs');
    
    // Copy directory structure first
    await copyDirectoryStructure(masterContentDir, langDir);
    
    let translatedCount = 0;
    let skippedCount = 0;
    let upToDateCount = 0;
    
    for (const filePath of markdownFiles) {
      const relativePath = path.relative(masterContentDir, filePath);
      const targetPath = path.join(langDir, relativePath);
      
      try {
        // Check if translation is needed
        const translationCheck = await needsTranslation(filePath, targetPath, langCode);
        const shouldTranslate = translationCheck.needsTranslation;
        const reason = translationCheck.reason;
        
        if (shouldTranslate) {
          if (checkOnly) {
            console.log(`Would translate: ${relativePath} (${reason})`);
            meaningfulChanges++;
            hasMeaningfulChanges = true;
          } else {
            const translatedContent = await processMarkdownFile(filePath, langCode);
            // Add translation marker
            const finalContent = translatedContent + '\n\n<!-- TRANSLATED -->';
            await fs.writeFile(targetPath, finalContent, 'utf8');
            console.log(`Translated: ${relativePath} (${reason})`);
            translatedCount++;
          }
        } else {
          if (checkOnly) {
            // Don't print up-to-date files in check mode
          } else {
            console.log(`Skipped: ${relativePath} (${reason})`);
            upToDateCount++;
          }
        }
      } catch (error) {
        console.error(`Error processing ${relativePath}:`, error.message);
        skippedCount++;
      }
    }
    
    if (checkOnly) {
      if (meaningfulChanges > 0) {
        console.log(`Found ${meaningfulChanges} meaningful changes needed for ${langCode}`);
      }
    } else {
      console.log(`Language ${langCode}: ${translatedCount} translated, ${upToDateCount} up-to-date, ${skippedCount} skipped`);
    }
  }

  if (checkOnly) {
    if (hasMeaningfulChanges) {
      console.log(`\n⚠️  Found ${meaningfulChanges} meaningful content translation changes needed.`);
      return 1; // Exit code 1 for meaningful changes needed
    } else {
      console.log('\n✅ No meaningful content translation changes needed.');
      return 0; // Exit code 0 for no meaningful changes
    }
  } else {
    console.log('\n✅ Content translation synchronization complete (via DeepL).');
    return 0;
  }
}

syncAllContentTranslations()
  .then(exitCode => {
    process.exit(exitCode);
  })
  .catch(error => {
    console.error("\n❌ An error occurred during content translation synchronization:", error);
    process.exit(1);
  });
