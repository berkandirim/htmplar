/**
 * @htmplar/core - React component library for email development
 * @packageDocumentation
 */

export const version = '2.0.0-alpha.0';

// Export components
export { Block } from './components/Block';
export type { BlockProps } from './components/Block';

export { Text } from './components/Text';
export type { TextProps } from './components/Text';

export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Image } from './components/Image';
export type { ImageProps } from './components/Image';

console.log(`@htmplar/core v${version} loaded`);
