# Netlify Deployment Instructions

The "Page not found" error usually happens because Netlify is looking in the wrong directory or cannot find `index.html`.

I have applied two fixes to your code:
1.  **Added `homepage": "."` to `package.json`**: This ensures assets (JS/CSS) are loaded correctly regardless of the path.
2.  **Added `public/_redirects`**: This ensures that Netlify handles routing correctly for your Single Page Application.

## Critical Step: Netlify Configuration

Since your project is in a subdirectory (`medplus-customer-dasboard`), you **MUST** configure the "Base directory" in Netlify.

1.  Go to your **Netlify Dashboard** > **Site Settings** > **Build & deploy**.
2.  Click **Edit settings**.
3.  Set the following:
    *   **Base directory**: `medplus-customer-dasboard`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `build`
4.  Click **Save**.
5.  **Trigger a new deploy** (e.g., by pushing a commit or manually in the Deploys tab).

If you are using **Drag and Drop**:
*   Make sure you drag the **`build` folder** (created inside `medplus-customer-dasboard`), NOT the source folder.
