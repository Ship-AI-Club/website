import {notFound,permanentRedirect} from 'next/navigation';
import ProductTeamDeck from '../../../../../components/hackathon-product-team-deck';
import {BREAKOUTS,HACKATHON_PATH} from '../../../../../lib/hackathon-opening';
import {hackathonDeckMetadata} from '../../../../../lib/hackathon-deck-metadata';
import '../../../../../app/hackathon-product-team.css';

export const metadata=hackathonDeckMetadata('Build Your AI Organization — Workshop Decks | Ship AI','Four Zero to Launch breakouts: positioning, productization, design and engineering, and marketing. Set up your bots with one prompt per breakout.',`${HACKATHON_PATH}/deck`);

export default async function Page({params,searchParams}){
  const {program}=await params;
  if(program!=='zero-to-launch') notFound();
  const query=await searchParams;
  const value=Number(query?.breakout);
  const selected=BREAKOUTS.find(item=>item.number===value);
  if(selected) permanentRedirect(selected.href);
  return <ProductTeamDeck/>;
}
