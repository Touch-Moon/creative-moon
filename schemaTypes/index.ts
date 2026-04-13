import { work, mediaBlock, textBlock, spacerBlock } from "./work";
import { story, storyMediaBlock, storyTextBlock, storySpacerBlock, storyHeroModule } from "./story";
import { category } from "./category";

export const schemaTypes = [
  // Documents
  work,
  story,
  category,

  // Object types — Work modules (리팩토링: 3 모듈 체계)
  mediaBlock,
  textBlock,
  spacerBlock,

  // Object types — Story / Insight modules
  storyMediaBlock,
  storyTextBlock,
  storySpacerBlock,
  storyHeroModule,
];
