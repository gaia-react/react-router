import type {Preview} from '@storybook/react-vite';
import {setProjectAnnotations} from '@storybook/react-vite';
import * as globalStorybookConfig from '../.storybook/preview';
import '@testing-library/jest-dom/vitest';
import './test.server';

setProjectAnnotations(globalStorybookConfig as Preview);
