"use client";

import { useState } from "react";
import { ContentsGroup, ContentsRow } from "./contents-list";
import WorkshopNotify from "./workshop-notify";

/* The workshop catalogue as a contents page, grouped by topic. One
   filter, then the list; each row carries its own "email me the date". */
export default function WorkshopContents({ total, groups }) {
  const [topic, setTopic] = useState("all");
  const shown = groups.filter((group) => topic === "all" || group.id === topic);
  return (
    <>
      <div className="hub-chips" role="group" aria-label="Filter workshops by topic">
        <button type="button" aria-pressed={topic === "all"} onClick={() => setTopic("all")}>All workshops <span>{total}</span></button>
        {groups.map((group) => (
          <button key={group.id} type="button" aria-pressed={topic === group.id} onClick={() => setTopic(group.id)}>{group.title} <span>{group.items.length}</span></button>
        ))}
      </div>
      <div className="toc">
        {shown.map((group, groupIndex) => (
          <ContentsGroup key={group.id} title={group.title} aside={group.items.length === 1 ? "1 workshop" : group.items.length + " workshops"}>
            {group.items.map((workshop, index) => (
              <ContentsRow
                key={workshop.slug}
                title={workshop.title}
                line={workshop.text}
                figure={"$" + workshop.price.toLocaleString("en-US")}
                sub={"Up to " + workshop.capacity + " seats"}
                facts={[["Format", workshop.format + ", in person in Phoenix"], ["Date", "To be announced"]]}
                link={{ href: "/workshops/" + workshop.slug, label: "See the full workshop" }}
                open={groupIndex === 0 && index === 0}
              >
                <WorkshopNotify slug={workshop.slug} name={workshop.title} startOpen />
              </ContentsRow>
            ))}
          </ContentsGroup>
        ))}
      </div>
    </>
  );
}
