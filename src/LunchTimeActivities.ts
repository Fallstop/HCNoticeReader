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

let lunchtimeActivities: LunchtimeActivity[][][] = [
    [
        [{
            title: "Quiz/Music",
            names: ["Rohit Rajaraman", "Nate Owens", "Alex Horwood", "Evan Hostad"],
            room: "OB's room (H6)"
        }],
        [{
            title: "Games in gym",
            names: ["Carl Mauer-Mclaine", "Zac Groshinski", "Riley Syers"],
            room: "the Gym"
        }],
        [{
            title: "Quiz/Films",
            names: ["Runyararo Manjala", "Danae Segessenmann", "Abby Lunn"],
            room: "Mrs Koning's room (U2)"
        }],
        [
            {
                title: "Film",
                names: ["Helena Newman", "Taron Snowsill", "Emily Merry", "Seamus Howard"],
                room: "Mr OB's Room (H6)"
            },
            {
                title: "Quiz/Films",
                names: ["Lucy Nichols", "Sinead Gordon", "Oliver Heswall"],
                room: "Mrs Koning's Room"
            }
        ],
        [
            {
                title: "Boardgames/Crafts",
                names: ["Ayana Dagan", "Mutsawashe Mugutso", "Clara Isles", "Isabela Cameron"],
                room: "Mr OB's Room (H6)"
            }
        ]
    ],
    [
        [{
            title: "Chess",
            names: ["Ryan Jones", "Rome Hepi", "Isaac Xie", "Ethan Williams"],
            room: "Mr Pollard's Room (U6)"
        }],
        [
            {
                title: "Boardgames/Crafts",
                names: ["Junghyun Lim", "Isabella Welford", "Madison Diamond"],
                room: "Mrs Churcher's room (H13)"
            },
            {
                title: "Acting Class",
                names: ["The Arts Committee"],
                room: "Mrs Hunt's room (H4)"
            },
        ],
        [{
            title: "Music Sessions",
            names: ["Tobias Grove", "Mataariki Aplin", "Rohit Rajaraman", "Evan Hostad"],
            room: "the Music room"
        },
        {
            title: "Colouring in + Origami",
            names: ["The Arts Committee"],
            room: "the Art room (A1)"
        },],
        [{
            title: "Film",
            names: ["Giverney Miedema", "Takaimaania Ngata-henare", "Hannah Campi"],
            room: "Mrs Cook's room (H1)"
        },
        {
            title: "Karaoke",
            names: ["The Arts Committee"],
            room: "Matua Henry's (H4)"
        },
    ],
        [
            {
                title: "Games in gym",
                names: ["Craven Whithead", "Eunwoo Lee", "Niko Firth", "Justus Huneke"],
                room: "the Gym"
            },
            {
                title: "Film",
                names: ["Ariya Naidoo", "Esther Wiegesma", "Daniel Barton"],
                room: ""
            },
            {
                title: "Tie-dying (BYO white shirt)",
                names: ["The Arts Committee"],
                room: "Matua Henry's (H4)"
            },
            
        ]
    ]
];

export function lookupLunchtimeActivity(index: LunchtimeActivityIndex | null): LunchtimeActivity[] | null {
    if (!index) { return null }
    if (index.weekDay === null || index.weekDay === null) return []
    return lunchtimeActivities[index.weekRotation][index.weekDay] || [];
}