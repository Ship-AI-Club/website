import { notFound } from 'next/navigation';
import ProductTeamDeck from '../../../../../../../components/hackathon-product-team-deck';
import { BREAKOUTS } from '../../../../../../../lib/hackathon-opening';
import { hackathonDeckMetadata } from '../../../../../../../lib/hackathon-deck-metadata';
import '../../../../../../../app/hackathon-product-team.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return BREAKOUTS.map(item => ({ program: 'zero-to-launch', breakout: item.slug }));
}

async function selectedBreakout(params) {
  const { program, breakout } = await params;
  const selected = BREAKOUTS.find(item => item.slug === breakout);
  if (program !== 'zero-to-launch' || !selected) notFound();
  return selected;
}

export async function generateMetadata({ params }) {
  const selected = await selectedBreakout(params);
  return hackathonDeckMetadata(selected.shareTitle, selected.description, selected.href);
}

export default async function Page({ params }) {
  const selected = await selectedBreakout(params);
  return <ProductTeamDeck breakout={selected.number} />;
}
