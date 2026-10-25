// One transaction holds the inventory row until the seat insert commits.
// Both unique indexes remain a second line of defense against duplicates.
export async function allocateWorkshopSeat(q, workshop, userId, amount) {
  const results = await q.transaction([
    q`select workshop from workshop_inventory where workshop=${workshop} for update`,
    q`insert into workshop_bookings (workshop,user_id,seat,amount,expires_at)
      select ${workshop},${userId}::uuid,n,${amount},now()+interval '35 minutes'
      from generate_series(1,10) n where not exists
      (select 1 from workshop_bookings where workshop=${workshop} and seat=n and status in ('pending','paid'))
      and not exists (select 1 from workshop_bookings where workshop=${workshop} and user_id=${userId}::uuid and status in ('pending','paid'))
      order by n limit 1 returning *`
  ]);
  return results[1][0] || null;
}
