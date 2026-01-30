# Zeek Safari Extension — Installation Guide

## Prerequisites
- macOS 12 (Monterey) or later
- Safari 16.4 or later
- Xcode 14 or later (free from the Mac App Store)

## Steps

1. **Download the extension folder**
   Download or clone the `zeek-extension-safari` folder to your computer.

2. **Convert to an Xcode project**
   Open Terminal and run:
   ```
   xcrun safari-web-extension-converter /path/to/zeek-extension-safari
   ```
   This generates a native macOS app project containing the extension. Follow any on-screen prompts to choose a save location.

3. **Open the project in Xcode**
   The converter will offer to open the project automatically. If not, open the generated `.xcodeproj` file in Xcode.

4. **Set a signing team**
   In Xcode, select the project in the sidebar, go to the **Signing & Capabilities** tab, and choose your **Team** under each target (the app and the extension). A free Apple ID works for local development.

5. **Build and run**
   Press **Cmd+R** or click the **Run** button. This builds the app and installs the extension into Safari.

6. **Enable the extension in Safari**
   Open **Safari > Settings > Extensions** and check the box next to **Zeek — RSVP Speed Reader**.

7. **Grant permissions**
   When prompted, allow the extension to run on websites. You can choose **Always Allow on Every Website** or grant access per-site.

## Usage

- **Popup**: Click the Zeek icon in the Safari toolbar to paste or type text, then click **Zeek** to open the reader window.
- **Context menu**: Select text on any page, right-click, and choose **Read with Zeek**.
- **Keyboard shortcut**: Select text and press **Alt+Z** to send it to the reader.

## Troubleshooting

- If the extension doesn't appear in Safari, go to **Safari > Settings > Advanced** and enable **Show features for web developers**. Then check **Develop > Allow Unsigned Extensions** (this resets each time Safari restarts).
- If the reader window doesn't open, make sure you granted the extension permission to access the current website.
- If the context menu item is missing, try disabling and re-enabling the extension in Safari settings.
