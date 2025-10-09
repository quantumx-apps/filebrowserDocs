// scripts/convert-to-doclink.js
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as glob from 'glob';

// Parse command line arguments
const args = process.argv.slice(2);
const checkOnly = args.includes('--check') || args.includes('-c');
const dryRun = args.includes('--dry-run') || args.includes('-d');

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = path.resolve(__dirname, '../content');

// --- Link Conversion Functions ---
function convertRelativeToDoclink(content, filePath) {
  // Pattern to match relative markdown links: [text](../path/to/file)
  const relativeLinkPattern = /\[([^\]]+)\]\((\.\.?\/[^)]+)\)/g;
  
  let convertedContent = content;
  let conversions = [];
  
  // Find all relative link matches
  let match;
  while ((match = relativeLinkPattern.exec(content)) !== null) {
    const [fullMatch, linkText, relativePath] = match;
    
    // Convert relative path to doclink shortcode
    const doclinkPath = convertRelativePathToDoclink(relativePath, filePath);
    const shortcode = `{{< doclink path="${doclinkPath}" text="${linkText}" />}}`;
    
    conversions.push({
      original: fullMatch,
      converted: shortcode,
      type: 'relative-to-doclink',
      path: relativePath,
      text: linkText
    });
  }
  
  // Apply conversions
  conversions.forEach(conversion => {
    convertedContent = convertedContent.replace(conversion.original, conversion.converted);
  });
  
  return {
    content: convertedContent,
    conversions: conversions
  };
}

function convertHardcodedDocsLinks(content) {
  // Pattern to match hardcoded /docs/ links: [text](/docs/path)
  const hardcodedLinkPattern = /\[([^\]]+)\]\(\/docs\/([^)]+)\)/g;
  
  let convertedContent = content;
  let conversions = [];
  
  // Find all hardcoded /docs/ matches
  let match;
  while ((match = hardcodedLinkPattern.exec(content)) !== null) {
    const [fullMatch, linkText, docPath] = match;
    const shortcode = `{{< doclink path="${docPath}" text="${linkText}" />}}`;
    
    conversions.push({
      original: fullMatch,
      converted: shortcode,
      type: 'hardcoded-to-doclink',
      path: docPath,
      text: linkText
    });
  }
  
  // Apply conversions
  conversions.forEach(conversion => {
    convertedContent = convertedContent.replace(conversion.original, conversion.converted);
  });
  
  return {
    content: convertedContent,
    conversions: conversions
  };
}

function convertAbsoluteDocsLinks(content) {
  // Pattern to match absolute /en/docs/ links: [text](/en/docs/path)
  const absoluteLinkPattern = /\[([^\]]+)\]\(\/[a-z-]+\/docs\/([^)]+)\)/g;
  
  let convertedContent = content;
  let conversions = [];
  
  // Find all absolute /en/docs/ matches
  let match;
  while ((match = absoluteLinkPattern.exec(content)) !== null) {
    const [fullMatch, linkText, docPath] = match;
    const shortcode = `{{< doclink path="${docPath}" text="${linkText}" />}}`;
    
    conversions.push({
      original: fullMatch,
      converted: shortcode,
      type: 'absolute-to-doclink',
      path: docPath,
      text: linkText
    });
  }
  
  // Apply conversions
  conversions.forEach(conversion => {
    convertedContent = convertedContent.replace(conversion.original, conversion.converted);
  });
  
  return {
    content: convertedContent,
    conversions: conversions
  };
}

function convertRelativePathToDoclink(relativePath, filePath) {
  // Remove leading ./ or ../
  let cleanPath = relativePath.replace(/^\.\.?\//, '');
  
  // Remove any remaining ../ patterns
  cleanPath = cleanPath.replace(/\.\.\//g, '');
  
  // Ensure it doesn't start with /
  cleanPath = cleanPath.replace(/^\//, '');
  
  return cleanPath;
}

// --- Process Markdown File ---
async function processMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Convert relative links to doclink shortcodes
    const relativeResult = convertRelativeToDoclink(content, filePath);
    
    // Convert hardcoded /docs/ links to doclink shortcodes
    const hardcodedResult = convertHardcodedDocsLinks(relativeResult.content);
    
    // Convert absolute /en/docs/ links to doclink shortcodes
    const absoluteResult = convertAbsoluteDocsLinks(hardcodedResult.content);
    
    const allConversions = [...relativeResult.conversions, ...hardcodedResult.conversions, ...absoluteResult.conversions];
    
    if (allConversions.length > 0) {
      if (checkOnly || dryRun) {
        console.log(`\n📄 ${path.relative(contentDir, filePath)}:`);
        allConversions.forEach(conv => {
          console.log(`  - [${conv.type}] "${conv.original}" → "${conv.converted}"`);
        });
      } else {
        await fs.writeFile(filePath, absoluteResult.content, 'utf8');
        console.log(`✅ Converted ${allConversions.length} links in ${path.relative(contentDir, filePath)}`);
      }
      return allConversions.length;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// --- Get All Markdown Files ---
async function getAllMarkdownFiles() {
  const pattern = path.join(contentDir, '**/*.md');
  return glob.sync(pattern);
}

// --- Main Conversion Function ---
async function convertAllLinks() {
  if (checkOnly) {
    console.log("--- Checking for doclink conversion needs (no conversions will be performed) ---");
  } else if (dryRun) {
    console.log("--- Dry run: showing what would be converted to doclink shortcodes ---");
  } else {
    console.log("--- Converting all links to doclink shortcodes ---");
  }

  const markdownFiles = await getAllMarkdownFiles();
  console.log(`Found ${markdownFiles.length} markdown files to process`);

  let totalConversions = 0;
  let filesWithConversions = 0;

  for (const filePath of markdownFiles) {
    const conversions = await processMarkdownFile(filePath);
    if (conversions > 0) {
      totalConversions += conversions;
      filesWithConversions++;
    }
  }

  if (checkOnly || dryRun) {
    if (totalConversions > 0) {
      console.log(`\n📊 Summary: ${totalConversions} links in ${filesWithConversions} files need conversion`);
      console.log(`\nTo apply these changes, run: node scripts/convert-to-doclink.js`);
    } else {
      console.log('\n✅ No links need conversion');
    }
  } else {
    console.log(`\n✅ Conversion complete: ${totalConversions} links converted in ${filesWithConversions} files`);
  }

  return totalConversions;
}

// --- CLI Usage ---
convertAllLinks()
  .then((conversions) => {
    if (checkOnly || dryRun) {
      process.exit(conversions > 0 ? 1 : 0);
    } else {
      process.exit(0);
    }
  })
  .catch(error => {
    console.error("\n❌ An error occurred during link conversion:", error);
    process.exit(1);
  });
