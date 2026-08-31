import { renderToEmail, getBaseStyles } from '@htmplar/renderer';
import type { ReactElement } from 'react';

interface RenderEmailOptions {
  includeBaseStyles?: boolean;
  minify?: boolean;
}

export async function renderEmailFromFile(
  filePath: string,
  options: RenderEmailOptions = {}
): Promise<string> {
  const { includeBaseStyles = true } = options;

  try {
    // Dynamically import the email component
    const module = await import(filePath);
    const Component = module.default || module;

    if (typeof Component !== 'function') {
      throw new Error(`File ${filePath} does not export a valid React component`);
    }

    // Create element
    const element = Component({}) as ReactElement;

    // Render to email HTML
    const html = renderToEmail(element, {
      styles: includeBaseStyles ? getBaseStyles() : '',
      includeDoctype: true,
    });

    return html;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to render ${filePath}: ${error.message}`);
    }
    throw error;
  }
}
