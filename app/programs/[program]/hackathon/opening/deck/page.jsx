import { notFound } from 'next/navigation';
import HackathonOpeningDeck from '../../../../../../components/hackathon-opening-deck';
import { hackathonDeckMetadata } from '../../../../../../lib/hackathon-deck-metadata';
import { OPENING_DECK } from '../../../../../../lib/hackathon-opening';
import { publicSponsors } from '../../../../../../lib/stats';
import '../../../../../../app/deck.css';
import '../../../../../../app/hackathon-opening.css';

export const metadata = hackathonDeckMetadata('Build Your AI Organization — Opening Ceremony | Ship AI','Kick off Zero to Launch in Phoenix. Meet your AI organization, choose a breakout, register your team, and get the agenda, judging and prize details.',OPENING_DECK);
export const revalidate = 300;

export default async function Page({ params }) {
  const { program } = await params;
  if (program !== 'zero-to-launch') notFound();
  return <HackathonOpeningDeck sponsors={await publicSponsors()} />;
}
