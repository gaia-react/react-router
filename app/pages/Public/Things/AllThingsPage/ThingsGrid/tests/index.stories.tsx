import {useTranslation} from 'react-i18next';
import type {Meta, StoryFn} from '@storybook/react-vite';
import database from 'test/mocks/database';
import stubs from 'test/stubs';
import {ThingsProvider} from '~/services/gaia/things/state';
import type {Things} from '~/services/gaia/things/types';
import {toCamelCase} from '~/utils/object';
import ThingsGrid from '../index';

const meta: Meta = {
  component: ThingsGrid,
  decorators: [
    stubs.reactRouter({
      action: async ({request}) => {
        const formData = await request.formData();

        if (request.method === 'DELETE') {
          if (formData.get('id') === '1') {
            return {storyId: 'components-thingsgrid--one-thing'};
          }

          return {storyId: 'components-thingsgrid--no-things'};
        }

        return null;
      },
      path: '/things',
      routes: [{path: '/things/1', storyId: 'components-thingedit--default'}],
    }),
  ],
  parameters: {
    chromatic: {viewports: [1280, 412]},
    controls: {hideNoControlsWarning: true},
    wrap: 'p-4',
  },
  title: 'Components/ThingsGrid',
};

export default meta;

export const Default: StoryFn = () => {
  const things = database.things.getAll().map(toCamelCase) as Things;

  return (
    <ThingsProvider things={things}>
      <ThingsGrid />
    </ThingsProvider>
  );
};

export const LongStrings: StoryFn = () => {
  const {
    i18n: {language},
  } = useTranslation();

  const things: Things =
    language === 'en' ?
      [
        {
          createdAt: '2024-01-01T12:00:00Z',
          description:
            'Aliquam eget scelerisque est. Aliquam sit amet elit quam. Maecenas vel eros semper, blandit lacus eget, ullamcorper nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas',
          id: '1',
          name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse nec tellus elementum, commodo ex et, vehicula dui.',
        },
      ]
    : [
        {
          createdAt: '2024-01-01T12:00:00Z',
          description:
            '楽しだうお将視7聞練チマミエ器本コ同備ウテアヤ投北そさ整谷せふ人展ゆまラろ作真身レウオ図斉でうラ札催布そも方筋ゃ核集ユ旅代タ記将アス毎帳ひ。公ヒシ置造ちげ際廃談な黒百禁よかフた能健モセウ約81立ウノヘ極書せこでど連彦イす像写ネモレ測突げド属民時事ケムワレ面枠告ツヲ布椅トラ。',
          id: '1',
          name: '面かへしン動産いよば補現スぞ育国ヒチモ港廃フくち好94授ロノチカ真補くきト半東紙ロヌウ提宝ソヲステ給悩ざイが配自寄クヘラワ記驚ぽす際希熊べぽ受38免ぴげ',
        },
      ];

  return (
    <ThingsProvider things={things}>
      <ThingsGrid />
    </ThingsProvider>
  );
};

export const OneThing: StoryFn = () => {
  const things = database.things.getAll().map(toCamelCase) as Things;

  return (
    <ThingsProvider things={things.slice(1)}>
      <ThingsGrid />
    </ThingsProvider>
  );
};

export const NoThings: StoryFn = () => (
  <ThingsProvider things={[]}>
    <ThingsGrid />
  </ThingsProvider>
);
