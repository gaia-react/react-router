import {composeStory} from '@storybook/react-vite';
import userEvent from '@testing-library/user-event';
import {describe, expect, test} from 'vitest';
import {render, screen} from 'test/rtl';
import Meta, {Default} from './index.stories';

const InputText = composeStory(Default, Meta);

describe('InputText', () => {
  test('typing works', async () => {
    const {type} = userEvent.setup();
    render(<InputText />);

    const input = screen.getByRole('textbox', {
      name: /^text input$/i,
    });
    await type(input, 'helloworld');
    expect(input).toHaveValue('helloworld');
  });

  test('maxLength works', async () => {
    const {clear, type} = userEvent.setup();
    render(<InputText />);

    const input = screen.getByRole('textbox', {
      name: /^text input max length$/i,
    });
    await type(
      input,
      [
        'This is a long string!',
        'This is a long string!',
        'This is a long string!',
      ].join('')
    );
    expect(input).toHaveValue('This is a long strin');

    await clear(input);
    await type(input, 'hello world');
    expect(input).toHaveValue('hello world');
  });
});
