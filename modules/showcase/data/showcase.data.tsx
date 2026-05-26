'use client';
export type { ShowcaseVariant, ShowcaseComponent } from './showcase.types';
import { buildAtomsData } from './sections/ui-atoms.showcase';
import { buildMoleculesData } from './sections/ui-molecules.showcase';
import { buildOrganismsData } from './sections/ui-organisms.showcase';
import { buildAppPatternsData } from './sections/app-patterns.showcase';
import { buildCommonDomainData } from './sections/domain-common.showcase';
import { buildBlogDomainData } from './sections/domain-blog.showcase';
import { buildEventDomainData } from './sections/domain-event.showcase';
import { buildMapData } from './sections/ui-molecule-map.showcase';
import { buildApiDocDomainData } from './sections/domain-api-doc.showcase';
import { buildLandingDomainData } from './sections/domain-landing.showcase';
import { buildJobsDomainData } from './sections/domain-jobs.showcase';
import { buildFintechDomainData } from './sections/domain-fintech.showcase';
import { buildCommerceDomainData } from './sections/domain-commerce.showcase';
import { buildMediaDomainData } from './sections/domain-media.showcase';
import { buildForumDomainData } from './sections/domain-forum.showcase';
import { buildRealEstateDomainData } from './sections/domain-real-estate.showcase';
import { buildFoodDomainData } from './sections/domain-food.showcase';
import { buildTravelDomainData } from './sections/domain-travel.showcase';
import { buildAIDomainData } from './sections/domain-ai.showcase';
import { buildSocialDomainData } from './sections/domain-social.showcase';
import { buildIoTDomainData } from './sections/domain-iot.showcase';
import { buildNftDomainData } from './sections/domain-nft.showcase';
import { buildReviewsDomainData } from './sections/domain-reviews.showcase';
import { buildPrimitiveChartsData } from './sections/ui-primitive-charts.showcase';
import { buildAppKanbanBoardData } from './sections/app-kanban-board.showcase';
import { buildAppCalendarData } from './sections/app-calendar.showcase';
import { buildMoleculeDiffViewerData } from './sections/ui-molecule-diff-viewer.showcase';

export function buildShowcaseData() {
  return [
    ...buildAtomsData(),
    ...buildMoleculesData(),
    ...buildMoleculeDiffViewerData(),
    ...buildPrimitiveChartsData(),
    ...buildOrganismsData(),
    ...buildAppPatternsData(),
    ...buildAppKanbanBoardData(),
    ...buildAppCalendarData(),
    ...buildCommonDomainData(),
    ...buildBlogDomainData(),
    ...buildEventDomainData(),
    ...buildMapData(),
    ...buildApiDocDomainData(),
    ...buildLandingDomainData(),
    ...buildJobsDomainData(),
    ...buildFintechDomainData(),
    ...buildCommerceDomainData(),
    ...buildMediaDomainData(),
    ...buildForumDomainData(),
    ...buildRealEstateDomainData(),
    ...buildFoodDomainData(),
    ...buildTravelDomainData(),
    ...buildAIDomainData(),
    ...buildSocialDomainData(),
    ...buildIoTDomainData(),
    ...buildNftDomainData(),
    ...buildReviewsDomainData(),
  ];
}
