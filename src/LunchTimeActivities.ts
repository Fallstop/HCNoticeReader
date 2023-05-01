import type { LunchtimeActivityIndex } from "$lib/api";

export interface LunchtimeActivity {
    title: string,
    names: string[],
    room: string
}
// Week 1:,Activities:,Room:,People:,,,
// Monday,Quiz/Music,OB,Rohit Rajaraman,Nate Owens,Alex Horwood,Evan Hostad 
// Tuesday,Games in gym,Gym,Carl Mauer-Mclaine,Zac Groshinski,Riley Syers,
// Wednesday,Quiz/Films,Mrs Koning,Runyararo Manjala,Danae Segessenmann,Abby Lunn,
// Thursday,Film,,Helena Newman,Taron Snowsill,Emily Merry,Seamus Howard 
// Thursday,Quiz/Films,,Lucy Nichols,Sinead Gordon,Oliver Heswall,
// Friday,Boardgames/Crafts,,Ayana Dagan,Mutsawashe Mugutso,Clara Isles,Isabela Cameron
// Week 2:,Activities:,Room:,People:,,,
// Monday,Chess,,Ryan Jones,Rome Hepi,Isaac Xie,Ethan Willimas
// Tuesday,Boardgames/Crafts,A1,Junghyun Lim,Isabella Welford,Madison Diamond,
// Wednesday,Music Sessions,Music Room,Tobias Grove,Mataariki Aplin,Rohit Rajaraman,Evan Hostad
// Thursday,Film,,Giverney Miedema,Takaimaania Ngata-henare,Hannah Campi,
// Friday,Games in gym ,,Craven Whithead,Eunwoo Lee,Niko Firth,Justus Huneke
// Friday,Film,,Ariya Naidoo,Esther Wiegesma,Daniel Barton,

let lunchtimeActivities: LunchtimeActivity[][] = [
    [
        {
            title: "Quiz/Music",
            names: ["Rohit Rajaraman", "Nate Owens", "Alex Horwood", "Evan Hostad"],
            room: "OB's room"
        },
        {
            title: "Games in gym",
            names: ["Carl Mauer-Mclaine", "Zac Groshinski", "Riley Syers"],
            room: "the Gym"
        },
        {
            title: "Quiz/Films",
            names: ["Runyararo Manjala", "Danae Segessenmann", "Abby Lunn"],
            room: "Mrs Koning's room"  
        },
        {
            title: "Film",
            names: ["Helena Newman", "Taron Snowsill", "Emily Merry", "Seamus Howard"],
            room: ""
        },
        {
            title: "Quiz/Films",
            names: ["Lucy Nichols", "Sinead Gordon", "Oliver Heswall"],
            room: ""
        },
        {
            title: "Boardgames/Crafts",
            names: ["Ayana Dagan", "Mutsawashe Mugutso", "Clara Isles", "Isabela Cameron"],
            room: ""
        }
    ],
    [
        {
            title: "Chess",
            names: ["Ryan Jones", "Rome Hepi", "Isaac Xie", "Ethan Williams"],
            room: ""
        },
        {
            title: "Boardgames/Crafts",
            names: ["Junghyun Lim", "Isabella Welford", "Madison Diamond"],
            room: "A1"
        },
        {
            title: "Music Sessions",
            names: ["Tobias Grove", "Mataariki Aplin", "Rohit Rajaraman", "Evan Hostad"],
            room: "the Music Room"
        },
        {
            title: "Film",
            names: ["Giverney Miedema", "Takaimaania Ngata-henare", "Hannah Campi"],
            room: ""
        },
        {
            title: "Games in gym",
            names: ["Craven Whithead", "Eunwoo Lee", "Niko Firth", "Justus Huneke"],
            room: ""
        },
        {
            title: "Film",
            names: ["Ariya Naidoo", "Esther Wiegesma", "Daniel Barton"],
            room: ""
        }
    ]
];

export function lookupLunchtimeActivity(index: LunchtimeActivityIndex | null): LunchtimeActivity | null {
    if (!index || index.weekDay === null || index.weekDay === null) {return null}
    return lunchtimeActivities[index.weekRotation][index.weekDay];
}