import { work, mediaBlock, textBlock, spacerBlock } from "./work";
import { story, storyMediaModule, storyTwoColImageModule, storyTextModule, storyHeroModule } from "./story";
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

  // Object types — Story modules
  storyMediaModule,
  storyTwoColImageModule,
  storyTextModule,
  storyHeroModule,
];
