import {composeStory} from '@storybook/react';
import {within} from '@storybook/test';
import userEvent from '@testing-library/user-event';
import {render, screen} from 'test/rtl';
import {describe, expect, test} from 'vitest';
import Meta, {Default} from './index.stories';

const YearMonthDay = composeStory(Default, Meta);

describe('YearMonthDay', () => {
  test('February date constraint works', async () => {
    render(<YearMonthDay />);

    const {selectOptions} = userEvent.setup();
    const [year, month, date] = screen.getAllByRole('combobox');
    await selectOptions(
      month,
      within(month).getByRole('option', {name: 'Mar'})
    );
    await selectOptions(date, within(date).getByRole('option', {name: '31'}));

    await selectOptions(
      month,
      within(month).getByRole('option', {name: 'Feb'})
    );
    expect(date).toHaveValue('29');

    await selectOptions(year, within(year).getByRole('option', {name: '2001'}));
    expect(date).toHaveValue('28');
  });

  test('30 day month constraint works', async () => {
    render(<YearMonthDay />);

    const {selectOptions} = userEvent.setup();
    const [, month, date] = screen.getAllByRole('combobox');
    await selectOptions(date, within(date).getByRole('option', {name: '31'}));
    await selectOptions(
      month,
      within(month).getByRole('option', {name: 'Apr'})
    );
    expect(date).toHaveValue('30');
  });
});
