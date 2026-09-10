import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Layers, Palette, Sparkles, FolderArchive, ArrowRight, ShieldCheck } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ELEMENTOR_PAGE_TEMPLATE_JSON } from '../../data/elementorJsonTemplate';
import { WORDPRESS_CUSTOMIZER_CSS } from '../../data/wordpressCustomizerCss';
import { ELEMENTOR_CONVERSION_DATA } from '../../data/mockData';

interface ElementorExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ElementorExportModal: React.FC<ElementorExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'json' | 'css' | 'mapping'>('instructions');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(ELEMENTOR_PAGE_TEMPLATE_JSON, null, 2);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Download standalone JSON
  const handleDownloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, 'elementor-serenity-salon-template.json');
  };

  // Download complete WordPress Package ZIP
  const handleDownloadZIP = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // 1. Elementor Template JSON
      zip.file('elementor-serenity-salon-template.json', jsonString);

      // 2. Customizer CSS
      zip.file('customizer-additional-css.css', WORDPRESS_CUSTOMIZER_CSS);

      // 3. Step-by-step Readme instructions
      const readmeContent = `# Serenity Salon - WordPress & Elementor Import Package

This package allows you to import the complete Serenity Salon boutique website directly into WordPress Elementor using only native Elementor widgets.

## Package Contents:
1. \`elementor-serenity-salon-template.json\` - The Elementor Template file containing all page sections (Hero, Categories, Dual Banners, Story, Summer Glow, Testimonials, FAQs, Trust Badges).
2. \`customizer-additional-css.css\` - The stylesheet for your WordPress Customizer.
3. \`README-ELEMENTOR-IMPORT-INSTRUCTIONS.md\` - This setup guide.

---

## 3-Minute Quick Setup Guide:

### STEP 1: Paste the Additional CSS into WordPress Customizer
1. In your WordPress Admin Dashboard, navigate to **Appearance > Customize**.
2. Click on **Additional CSS** (bottom of the left panel).
3. Open \`customizer-additional-css.css\`, copy its entire content, and paste it into the editor.
4. Click **Publish** at the top.

### STEP 2: Import the Elementor Template
1. In WordPress Admin Dashboard, go to **Templates > Saved Templates**.
2. Click the **Import Templates** button at the very top.
3. Choose \`elementor-serenity-salon-template.json\` and click **Import Now**.
4. The template will now appear in your saved templates list as **"Serenity Salon - Homepage Template"**.

### STEP 3: Insert into Any Page
1. Go to **Pages > Add New Page** (or edit an existing homepage).
2. Click **Edit with Elementor**.
3. Click the **Folder Icon (Add Template)** in the Elementor canvas.
4. Navigate to the **My Templates** tab.
5. Find **"Serenity Salon - Homepage Template"** and click **Insert**.
6. Enjoy full visual editing directly in Elementor!

---

### Design System Tokens:
- **Primary Green:** \`#1F3A26\`
- **Accent Gold/Ochre:** \`#C9A66B\`
- **Canvas Cream:** \`#F7F5F1\`
- **Heading Font:** \`Jost\`
- **Body Font:** \`Plus Jakarta Sans\`
- **Artisanal Script:** \`Caveat\`
`;
      zip.file('README-ELEMENTOR-IMPORT-INSTRUCTIONS.md', readmeContent);

      // Generate zip
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'elementor-serenity-salon-wordpress-package.zip');
    } catch (err) {
      console.error('Error creating ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-[28px] max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#1F3A26]/10 z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 sm:p-7 bg-[#1F3A26] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9A66B] text-[#1F3A26] flex items-center justify-center shadow-md">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-xl text-white">
                  Elementor WordPress Export Package
                </h2>
                <span className="text-[10px] bg-white/20 text-[#C9A66B] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Native Widgets Only
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                Ready-to-upload ZIP package for WordPress Elementor Library with zero raw HTML widgets.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-[#C9A66B] hover:text-[#1F3A26] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Action Bar & Tabs */}
        <div className="bg-[#F7F5F1] px-6 py-3 border-b border-[#1F3A26]/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'instructions'
                  ? 'bg-[#1F3A26] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              3-Step Import Guide
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-[#1F3A26] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Elementor JSON</span>
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'css'
                  ? 'bg-[#1F3A26] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Customizer CSS</span>
            </button>
            <button
              onClick={() => setActiveTab('mapping')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'mapping'
                  ? 'bg-[#1F3A26] text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Widget Mapping</span>
            </button>
          </div>

          {/* Quick ZIP Download Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZIP}
              disabled={isZipping}
              className="px-4 py-1.5 rounded-full bg-[#1F3A26] hover:bg-[#4F7358] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
              <span>{isZipping ? 'Creating ZIP...' : 'Download WordPress ZIP'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm text-[#1A1A1A]">
          
          {/* TAB 1: INSTRUCTIONS */}
          {activeTab === 'instructions' && (
            <div className="space-y-6">
              <div className="bg-[#FDF1E4] border border-[#C9A66B]/30 rounded-2xl p-5 flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-[#1F3A26] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-heading font-bold text-base text-[#1F3A26] mb-1">
                    100% Native Elementor Widgets Verified
                  </h4>
                  <p className="text-xs text-[#6E6E6E] leading-relaxed">
                    This template contains zero raw HTML widgets. All sections use native Elementor Flexbox Containers, Headings, Text Editors, Buttons, Counters, Image Boxes, Testimonials, and Accordions so you have complete drag-and-drop visual editing control.
                  </p>
                </div>
              </div>

              {/* 3 Step Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Step 1 */}
                <div className="bg-[#F7F5F1] rounded-2xl p-5 border border-gray-200/60 flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#1F3A26] text-[#C9A66B] font-bold text-xs flex items-center justify-center mb-3">
                      1
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#1F3A26] mb-1.5">
                      Paste Additional CSS
                    </h5>
                    <p className="text-xs text-[#6E6E6E] leading-relaxed mb-4">
                      Go to <strong>Appearance &gt; Customize &gt; Additional CSS</strong> in WordPress and paste the customizer styles.
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(WORDPRESS_CUSTOMIZER_CSS, 'css-step')}
                    className="w-full py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#1F3A26] hover:bg-[#1F3A26] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedType === 'css-step' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'css-step' ? 'CSS Copied!' : 'Copy CSS'}</span>
                  </button>
                </div>

                {/* Step 2 */}
                <div className="bg-[#F7F5F1] rounded-2xl p-5 border border-gray-200/60 flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#1F3A26] text-[#C9A66B] font-bold text-xs flex items-center justify-center mb-3">
                      2
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#1F3A26] mb-1.5">
                      Upload Template JSON
                    </h5>
                    <p className="text-xs text-[#6E6E6E] leading-relaxed mb-4">
                      In WordPress, go to <strong>Templates &gt; Saved Templates &gt; Import Templates</strong> and upload the JSON file.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadJSON}
                    className="w-full py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-[#1F3A26] hover:bg-[#1F3A26] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Download .JSON</span>
                  </button>
                </div>

                {/* Step 3 */}
                <div className="bg-[#F7F5F1] rounded-2xl p-5 border border-gray-200/60 flex flex-col justify-between">
                  <div>
                    <div className="w-7 h-7 rounded-full bg-[#1F3A26] text-[#C9A66B] font-bold text-xs flex items-center justify-center mb-3">
                      3
                    </div>
                    <h5 className="font-heading font-bold text-sm text-[#1F3A26] mb-1.5">
                      Insert Into Any Page
                    </h5>
                    <p className="text-xs text-[#6E6E6E] leading-relaxed mb-4">
                      Create a new page, click <strong>Edit with Elementor</strong>, click the <strong>Folder Icon</strong>, and insert from <em>My Templates</em>.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadZIP}
                    className="w-full py-2 rounded-xl bg-[#1F3A26] text-white text-xs font-bold hover:bg-[#4F7358] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <FolderArchive className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Download All in .ZIP</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: JSON PREVIEW */}
          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  File: <code className="text-[#1F3A26] font-bold">elementor-serenity-salon-template.json</code>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(jsonString, 'json-full')}
                    className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'json-full' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'json-full' ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadJSON}
                    className="px-3 py-1.5 rounded-lg bg-[#1F3A26] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C9A66B]" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              <pre className="bg-[#1A1A1A] text-gray-100 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[380px]">
                {jsonString}
              </pre>
            </div>
          )}

          {/* TAB 3: CUSTOMIZER CSS */}
          {activeTab === 'css' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  Destination: <strong>Appearance &gt; Customize &gt; Additional CSS</strong>
                </span>
                <button
                  onClick={() => handleCopy(WORDPRESS_CUSTOMIZER_CSS, 'css-full')}
                  className="px-4 py-1.5 rounded-lg bg-[#1F3A26] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedType === 'css-full' ? <Check className="w-3.5 h-3.5 text-[#C9A66B]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedType === 'css-full' ? 'Copied to Clipboard!' : 'Copy Additional CSS'}</span>
                </button>
              </div>

              <pre className="bg-[#1A1A1A] text-green-400 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[380px]">
                {WORDPRESS_CUSTOMIZER_CSS}
              </pre>
            </div>
          )}

          {/* TAB 4: WIDGET MAPPING REFERENCE */}
          {activeTab === 'mapping' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6E6E6E]">
                Reference breakdown of how every section translates into native Elementor controls:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {ELEMENTOR_CONVERSION_DATA.elementorWidgetsMapping.map((item, idx) => (
                  <div key={idx} className="bg-[#F7F5F1] p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-heading font-bold text-xs text-[#1F3A26]">{item.section}</span>
                    </div>
                    <p className="text-[11px] text-gray-700 font-mono bg-white p-2 rounded-lg border border-gray-100">{item.elementorWidget}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
