const fs = require('fs');
const path = require('path');

// Files that need to be updated (from our search results)
const filesToUpdate = [
  'src/app/(app)/earnings/page.tsx',
  'src/app/(app)/feedback/page.tsx',
  'src/app/(app)/promotions/page.tsx',
  'src/app/(app)/orders/page.tsx',
  'src/app/(app)/profile/page.tsx',
  'src/app/(app)/branches/page.tsx',
  'src/app/(app)/takeaway/page.tsx',
  'src/app/(app)/offers/page.tsx',
  'src/app/(app)/dashboard/page.tsx',
  'src/app/(app)/bookings/page.tsx',
  'src/app/(app)/menu/page.tsx',
  'src/app/(app)/order-history/page.tsx',
  'src/app/(app)/subscription/page.tsx',
  'src/app/(app)/settings/page.tsx',
  'src/app/(app)/staff/page.tsx',
  'src/app/(app)/refunds/page.tsx',
  'src/app/(app)/analytics/page.tsx',
  'src/components/prep-time-dialog.tsx',
  'src/components/takeaway-dinein-order-details.tsx',
  'src/components/order-details-dialog.tsx',
  'src/components/delivery-order-details.tsx',
  'src/components/countdown-timer.tsx',
  'src/components/order-card.tsx',
  'src/components/pro-feature-wrapper.tsx',
  'src/components/kot-dialog.tsx',
  'src/app/(app)/profile/restaurant-information/page.tsx',
  'src/app/(app)/profile/owner-information/page.tsx',
  'src/app/(app)/profile/services/page.tsx',
  'src/app/(app)/profile/facilities/page.tsx',
  'src/app/(app)/profile/documents/page.tsx',
  'src/app/(app)/profile/bank-account/page.tsx',
  'src/app/(app)/subscription/checkout/page.tsx',
  'src/app/(app)/earnings/withdraw/page.tsx',
  'src/app/(app)/help-support/page.tsx',
  'src/app/(app)/help-support/community-forum/page.tsx',
  'src/app/(app)/help-support/knowledge-base/page.tsx',
  'src/app/(app)/help-support/chat/page.tsx',
  'src/app/(app)/store/page.tsx',
  'src/app/(app)/order-tracking/page.tsx',
  'src/app/(app)/dine-in-takeaway/page.tsx'
];

function updateFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let updated = false;

    // Replace import statements
    if (content.includes('from "@/context/AppContext"') || content.includes("from '@/context/AppContext'")) {
      content = content.replace(
        /import\s*{\s*([^}]*)\s*}\s*from\s*["']@\/context\/AppContext["']/g,
        (match, imports) => {
          // Remove AppProvider from imports if present
          const cleanImports = imports
            .split(',')
            .map(imp => imp.trim())
            .filter(imp => imp !== 'AppProvider')
            .join(', ');
          
          if (cleanImports.includes('useAppContext')) {
            return `import { useAppStore } from "@/context/useAppStore"`;
          }
          return match;
        }
      );
      updated = true;
    }

    // Replace useAppContext with useAppStore
    if (content.includes('useAppContext')) {
      content = content.replace(/useAppContext/g, 'useAppStore');
      updated = true;
    }

    // Remove AppProvider wrapper if present
    if (content.includes('<AppProvider>')) {
      content = content.replace(/<AppProvider>\s*/g, '');
      content = content.replace(/\s*<\/AppProvider>/g, '');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🚀 Starting migration from Context API to Zustand...\n');

filesToUpdate.forEach(updateFile);

console.log('\n✨ Migration completed!');
console.log('\n📝 Next steps:');
console.log('1. Test the application to ensure everything works');
console.log('2. Remove the AppContext.tsx file');
console.log('3. Remove this migration script');