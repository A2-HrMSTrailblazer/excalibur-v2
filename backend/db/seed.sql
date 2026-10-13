-- Excalibur v2 seed data, converted from SE262 mysql-init/init.sql
-- Seed logins: alice.gamer@gmail.com / P@ssw0rd!Alice, bob.plays2024@gmail.com / B0bSecure#2024, admin@excalibur.com / admin1234
BEGIN;
INSERT INTO users (username, email, password_hash, role, total_spend, register_date) VALUES
('alice_g',   'alice.gamer@gmail.com',   '$2b$10$hSBfiRPsMRlCHxyASyJq8.tBhCfBCJgwt1UpjgbZAiI//4mZSPFrq', 'customer', 350.00, '2024-01-05 09:00:00'),
('bob_plays', 'bob.plays2024@gmail.com', '$2b$10$HZUJnbZs89iY6YLEac/oieeUyn8GNPu472TENjsEKr2xqjqLh9/wu', 'customer',  75.50, '2024-01-12 10:30:00'),
('admin',     'admin@excalibur.com',     '$2b$10$Zi1NDEdiz/lMGS6goZMOAumCU2WSYMN1RLC6FRnObNoesFiwtjNYG', 'admin',      0.00, '2024-01-01 00:00:00');

INSERT INTO categories (category_id, name, icon) VALUES
(1,  'Steam',            'Steam-Logo'),
(2,  'Xbox Live',        'Xbox-Logo'),
(3,  'Origin Games',     'Origin-Logo'),
(4,  'Ubisoft Connect',  'Ubisoft-Logo'),
(5,  'Epic Games',       'Epic_Games-Logo'),
(6,  'EA App',           'EA-Logo'),
(7,  'Windows Store',    'Windows_Store-Logo'),
(8,  'Rockstar Games',   'Rockstar-Logo'),
(9,  'Battle.net',       'battle_net-Logo'),
(10, 'Nintendo',         'Nintendo-Logo');

INSERT INTO games (title, img, release_date, avg_rating, description, category_id) VALUES

-- G01
('Elden Ring', 'elden_ring.jpg', '2022-02-25', 4.90,
'Elden Ring is an action RPG developed by FromSoftware and published by Bandai Namco Entertainment, released on February 25, 2022.
Set in the Lands Between, players explore a vast open world filled with towering legacy dungeons, hidden catacombs, and breathtaking landscapes.
The game features a deep lore co-created by game director Hidetaka Miyazaki and fantasy novelist George R. R. Martin.
Players choose from a range of character classes and customize their builds through weapons, armor, spells, and sacred incantations.
Combat is challenging and methodical, demanding patience, observation, and mastery of timing and positioning.
The open-world design allows unprecedented freedom to explore and tackle content in almost any order.
Elden Ring won numerous Game of the Year awards in 2022 and is considered one of the greatest games ever made.',
1),

-- G02
('Cyberpunk 2077', 'cyberpunk.jpg', '2020-12-10', 4.40,
'Cyberpunk 2077 is an open-world action RPG developed by CD Projekt Red, set in the dystopian Night City in the year 2077.
Players take on the role of V, a mercenary who becomes entangled in a conspiracy involving a legendary cybernetic implant.
The game features a deeply branching narrative with multiple endings shaped by player choices and relationships.
Night City is a dense, layered metropolis with six distinct districts, each with its own culture, gangs, and power structures.
The game was notoriously troubled at launch but received major updates including the Phantom Liberty expansion in 2023.
Combat can be approached through stealth, hacking the environment and enemies, or direct aggressive gunplay.
The world-building, writing, and soundtrack are widely praised as some of the best in the RPG genre.',
1),

-- G03 FIXED: Hollow Knight → Steam (it is on Steam, NOT Epic exclusive)
('Hollow Knight', 'hollow_knight.jpg', '2017-02-24', 4.85,
'Hollow Knight is a challenging 2D action-adventure game developed by Team Cherry, released in 2017.
Set in the vast underground kingdom of Hallownest, players control a small silent knight exploring ancient ruins populated by insects and monsters.
The game features over 40 hours of content with intricate hand-drawn artwork and fluid, precise combat mechanics.
Players collect Charms that allow deep customization of playstyle, ranging from aggressive offense to defensive utility builds.
Hallownest is packed with hidden lore, secret areas, and memorable boss encounters that have become iconic in the genre.
The atmospheric soundtrack by Christopher Larkin is frequently cited as one of the best in indie game history.
Hollow Knight received critical acclaim for its art direction, world design, tight controls, and extraordinary value for its price.',
1),

-- G04
('Hades', 'hades.jpg', '2020-09-17', 4.95,
'Hades is a rogue-like dungeon crawler developed and published by Supergiant Games, released in full on September 17, 2020.
Players control Zagreus, immortal son of Hades, as he attempts to escape the Underworld against his father`s wishes.
The game is notable for weaving narrative progression directly into its rogue-like structure — every run advances the story.
Six distinct weapons called Infernal Arms each have radically different playstyles and can be upgraded with Daedalus Hammers.
Boons from Olympian gods like Zeus, Athena, and Dionysus allow massive build variety across each escape attempt.
The voice acting and character writing are widely celebrated, with each NPC having hundreds of unique contextual lines.
Hades launched as an Epic Games Store exclusive before releasing on other platforms, and won the Hugo Award for Best Video Game.',
5),

-- G05
('Counter-Strike 2', 'cs2.jpg', '2023-09-27', 4.30,
'Counter-Strike 2 is the latest installment in Valve`s legendary tactical first-person shooter franchise, released in September 2023.
Built on the Source 2 engine, it brings significant visual and technical upgrades over its predecessor CS:GO.
The game introduces sub-tick servers that precisely record player actions between server ticks for more accurate hit registration.
Smoke grenades now volumetrically interact with the environment, being pushed by explosions and clearing when shot through.
The classic bomb defusal gameplay remains at the core — two teams of five compete across competitively balanced maps.
Counter-Strike 2 is free-to-play and Steam exclusive, carrying forward skins and items from CS:GO.
Its competitive scene is one of the most established in esports, with major tournaments held globally every year.',
1),

-- G06 FIXED: Stardew Valley → Steam (primary platform is Steam, not Nintendo)
('Stardew Valley', 'stardew.jpg', '2016-02-26', 4.88,
'Stardew Valley is a farming simulation RPG developed entirely by solo developer Eric Barone, known as ConcernedApe.
Players inherit a dilapidated farm from their grandfather and must restore it while building relationships in the town of Pelican Town.
The game features extensive farming, animal husbandry, fishing, mining, and combat in procedurally generated caves.
A rich relationship system allows players to befriend and marry from a cast of twelve eligible villagers, each with full backstories.
Stardew Valley supports up to four-player online co-op, allowing friends to run the farm together.
The game has received numerous free content updates since launch, adding new festivals, items, areas, and storylines.
Originally launched on Steam in 2016, it has since expanded to all major platforms including Nintendo Switch.',
1),

-- G07
('The Witcher 3: Wild Hunt', 'witcher3.jpg', '2015-05-19', 4.93,
'The Witcher 3: Wild Hunt is an open-world action RPG developed by CD Projekt Red, based on the fantasy book series by Andrzej Sapkowski.
Players control Geralt of Rivia, a professional monster hunter called a Witcher, as he searches for his adopted daughter Ciri.
The game world is massive, spanning multiple regions from the war-ravaged Velen to the colorful Skellige Isles and the city of Novigrad.
Its side quests are legendary for their quality — many are considered better than entire main storylines of other games.
The two major expansions, Hearts of Stone and Blood and Wine, add dozens of hours of content that rivals or surpasses the base game.
A complex choices-and-consequences system means decisions made early can have dramatic, unexpected outcomes much later.
The Witcher 3 won over 250 Game of the Year awards and is widely considered one of the greatest RPGs ever created.',
1),

-- G08 FIXED: Minecraft → Windows Store (owned by Microsoft/Mojang; PC version sold via Microsoft Store)
('Minecraft', 'minecraft.jpg', '2011-11-18', 4.75,
'Minecraft is a sandbox survival and creative game developed by Mojang Studios, originally created by Markus Notch Persson.
Players explore procedurally generated worlds made of blocks, gathering resources, crafting tools, and building structures of any scale.
The game features multiple modes including Survival, where players must manage health and hunger, and Creative, which grants unlimited resources.
An extensive Redstone system allows players to build working computers, logic gates, and automated machines within the game.
Regular major updates over more than a decade have continuously expanded the game with new biomes, mobs, items, and mechanics.
Minecraft has sold over 300 million copies across all platforms, making it the best-selling video game of all time.
The PC Java and Bedrock editions are distributed through the official Minecraft/Microsoft ecosystem.',
7),

-- G09 FIXED: Resident Evil 4 Remake → Steam (Capcom title, sold on Steam)
('Resident Evil 4 Remake', 're4.jpg', '2023-03-24', 4.80,
'Resident Evil 4 Remake is a survival horror action game developed and published by Capcom, released in March 2023.
It is a reimagining of the groundbreaking 2005 original, maintaining the core story while expanding and modernizing every element.
Leon S. Kennedy is sent to rural Spain to rescue the U.S. President`s daughter Ashley from a mysterious cult called Los Illuminados.
The over-the-shoulder camera and action-oriented gameplay of the original are enhanced with modern controls and fluidity.
The game expands on Ashley`s character and deepens the backstories of side characters like Luis Serra.
A Mercenaries mode returns after the main game, offering high-score arcade-style combat with multiple playable characters.
The remake was praised as one of the best remakes ever made and is sold on Steam for PC.',
1),

-- G10 FIXED: Celeste → Steam (indie game by Maddy Thorson, sold on Steam)
('Celeste', 'celeste.jpg', '2018-01-25', 4.92,
'Celeste is a precision platformer developed by Maddy Thorson and Noel Berry, released in January 2018.
Players control Madeline, a young woman climbing the fictional Celeste Mountain while confronting her own inner doubts and anxiety.
The game is celebrated for seamlessly blending tight, demanding gameplay with a heartfelt narrative about mental health and self-acceptance.
Each screen is a self-contained puzzle requiring precise jumps, dashes, and climbs with a very short learning loop encouraging retry.
Assist Mode allows players to slow time, add extra dashes, or enable invincibility, making the game accessible at any skill level.
Over 700 screens of main content are complemented by extremely difficult B-Side and C-Side cassette levels for hardcore players.
Celeste is sold on Steam and won multiple Game of the Year awards in 2018.',
1),

-- G11 Red Dead Redemption 2 ✓ Rockstar Games Launcher
('Red Dead Redemption 2', 'rdr2.jpg', '2018-10-26', 4.90,
'Red Dead Redemption 2 is an open-world action-adventure game developed and published by Rockstar Games, released in October 2018.
Set in a fictionalized version of the American frontier in 1899, players follow Arthur Morgan, an outlaw member of the Van der Linde gang.
The game features one of the most richly detailed open worlds ever created, with dynamic weather, wildlife ecosystems, and NPC routines.
Its story is a sweeping, emotional narrative about loyalty, honor, and the inevitable end of the outlaw era.
Players can engage in hunting, fishing, gambling, bounty hunting, and a wide variety of side activities across a massive map.
A detailed honor system tracks moral choices and affects how the world reacts to Arthur, shaping the story`s ending.
The PC version requires the Rockstar Games Launcher and is distributed through Rockstar`s own platform.',
8),

-- G12
('God of War Ragnarok', 'gow_ragnarok.jpg', '2022-11-09', 4.88,
'God of War Ragnarok is an action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment.
It serves as the direct sequel to the 2018 God of War, continuing the Norse mythology saga of Kratos and his son Atreus.
The game opens three years after the events of the first game, with Fimbulwinter already underway and Ragnarok approaching.
Players travel to all Nine Realms of Norse mythology, each with distinct visual design, lore, and environmental puzzles.
The relationship between Kratos and Atreus is at the emotional core, exploring themes of identity, fatherhood, and destiny.
Combat builds on the previous game`s foundation with new weapons, abilities, and a wider variety of enemy encounters.
The PC version was released on Steam in 2024, receiving widespread critical acclaim.',
1),

-- G13
('Dark Souls III', 'ds3.jpg', '2016-03-24', 4.75,
'Dark Souls III is an action RPG developed by FromSoftware and published by Bandai Namco, released in March 2016.
It is the third and final entry in the Dark Souls trilogy, concluding the story of the Age of Fire and the undead curse.
Set in the kingdom of Lothric, players must link the fire once more by defeating Lords of Cinder across haunting environments.
The combat system refines the series formula with faster pacing while retaining the methodical, punishing difficulty the series is known for.
Weapon Arts add unique special attacks to each weapon type, greatly expanding build variety and combat expression.
The game features two major DLCs, Ashes of Ariandel and The Ringed City, both highly regarded for their design and boss encounters.
Dark Souls III is sold on Steam and has sold over 10 million copies.',
1),

-- G14
('Sekiro: Shadows Die Twice', 'sekiro.jpg', '2019-03-22', 4.80,
'Sekiro: Shadows Die Twice is an action-adventure game developed by FromSoftware, set in a fictionalized late Sengoku-era Japan.
Players control Wolf, a shinobi tasked with rescuing his lord and seeking revenge against a powerful samurai clan.
Unlike other FromSoftware games, Sekiro features a fixed protagonist with a defined backstory and a unique posture-based combat system.
Combat revolves around deflecting enemy attacks to fill their Posture meter rather than depleting a health bar directly.
The grappling hook enables fast vertical traversal, and the prosthetic arm can be equipped with various shinobi tools.
The game is widely considered to have some of the most refined sword combat mechanics in gaming history.
Sekiro is sold on Steam and won Game of the Year at The Game Awards 2019.',
1),

-- G15
('Baldur`s Gate 3', 'bg3.jpg', '2023-08-03', 4.95,
'Baldur`s Gate 3 is a role-playing game developed and published by Larian Studios, released in full in August 2023.
Based on the Dungeons and Dragons 5th Edition ruleset, it offers one of the most faithful and expansive TTRPG adaptations ever made.
Players and up to three co-op friends create characters and navigate a story beginning with a tadpole infection from a Mind Flayer.
The game features twelve playable classes, each with multiple subclasses, and extensive dialogue-driven interactions with companions.
Nearly every problem in the game has multiple solutions — combat, stealth, persuasion, or creative environmental interaction.
The narrative spans three acts with thousands of branching paths shaped by player choices with real, lasting consequences.
Baldur`s Gate 3 is sold exclusively on Steam and won Game of the Year at The Game Awards 2023.',
1),

-- G16
('Horizon Zero Dawn', 'hzd.jpg', '2017-02-28', 4.60,
'Horizon Zero Dawn is an action RPG developed by Guerrilla Games and published by Sony Interactive Entertainment in 2017.
Set in a post-apocalyptic Earth overrun by robotic creatures, players control Aloy, a young hunter seeking her origins.
The game`s central mystery — how mechanical animals came to dominate Earth — unfolds through environmental storytelling.
Combat requires players to study each machine`s weaknesses and use a variety of traps, elemental arrows, and tools strategically.
The open world is lush and varied, ranging from dense forests and snowy mountains to ancient ruins and tribal settlements.
The lore is exceptionally well-crafted, offering a satisfying science-fiction explanation for the state of the world.
The PC version of Horizon Zero Dawn is sold on Steam, where it sold over 20 million copies across all platforms.',
1),

-- G17
('Death Stranding', 'death_stranding.jpg', '2019-11-08', 4.20,
'Death Stranding is an action game directed by Hideo Kojima and developed by Kojima Productions, released in November 2019.
Players control Sam Porter Bridges, a courier tasked with reconnecting isolated cities across a post-apocalyptic America.
The game introduces the Strand genre — a social gameplay loop where infrastructure built by players appears in others` worlds.
A mysterious event called the Death Stranding has caused the living and dead to coexist, with ghostly BT creatures haunting the landscape.
Gameplay focuses on traversal, cargo management, and careful route planning across stunning but treacherous terrain.
The cast includes Norman Reedus, Mads Mikkelsen, Lea Seydoux, and Guillermo del Toro in major roles.
The PC version of Death Stranding is sold on Steam.',
1),

-- G18
('Persona 5 Royal', 'p5r.jpg', '2019-10-31', 4.88,
'Persona 5 Royal is a JRPG developed by Atlus, originally released in Japan in 2019 as an expanded version of Persona 5.
Players control a high school student known as Joker who awakens the power of Persona and leads the Phantom Thieves of Hearts.
The group enters the Metaverse — a cognitive realm — to steal the corrupt desires of adults and spark a change of heart.
The game blends daily life simulation with dungeon crawling, requiring players to balance social bonds, studies, and heists.
Confidant relationships with a cast of over twenty characters unlock story content and powerful Persona abilities.
The vibrant visual style, unforgettable soundtrack by Shoji Meguro, and stylish UI are considered benchmarks of game presentation.
Persona 5 Royal arrived on Steam in October 2022, becoming one of the platform`s highest-rated games.',
1),

-- G19
('Monster Hunter World', 'mhw.jpg', '2018-01-26', 4.70,
'Monster Hunter World is an action RPG developed and published by Capcom, marking the series` first major entry on modern home consoles.
Players take on the role of a Hunter tasked with tracking and slaying or capturing enormous monsters across a living ecosystem.
The New World is a seamless open environment where monsters hunt prey, engage each other, and react to weather and time of day.
Fourteen weapon types each have entirely unique movesets, requiring dedicated mastery and offering radically different playstyles.
Crafting gear from monster materials is the core progression loop, with each hunt providing resources for stronger equipment.
The Iceborne expansion doubles the game`s content, adding a new snowy region, a new flagship monster, and the Master Rank difficulty.
Monster Hunter World is sold on Steam and introduced the series to a global mainstream audience.',
1),

-- G20
('Divinity: Original Sin 2', 'dos2.jpg', '2017-09-14', 4.85,
'Divinity: Original Sin 2 is a turn-based RPG developed by Larian Studios, released in September 2017.
Set on the fantasy world of Rivellon, players control one of six pre-made characters or a custom one, each with a unique origin story.
The game is celebrated for its deeply systemic gameplay — nearly any interaction can be solved with creative elemental combinations.
Up to four players can play through the entire campaign in co-op, with the story dynamically adapting to each character`s choices.
The Game Master mode lets one player design custom campaigns for others, effectively turning it into a digital tabletop experience.
Combat is deeply tactical, rewarding knowledge of terrain, status effects, and ability synergies between party members.
Divinity: Original Sin 2 is sold on Steam and directly inspired the creation of Baldur`s Gate 3.',
1),

-- G21
('Disco Elysium', 'disco_elysium.jpg', '2019-10-15', 4.80,
'Disco Elysium is a narrative RPG developed by ZA/UM, released in October 2019 and fully voiced in its Final Cut edition in 2021.
Players control a detective with amnesia investigating a murder in the decaying harbor city of Revachol.
The game features no traditional combat — all interactions are resolved through skill checks from a pool of 24 psyche attributes.
The detective`s personality is shaped by which skills are developed, leading to wildly different playthroughs and dialogue options.
Political ideology plays a major role, with the game satirizing communism, fascism, liberalism, and moralism through its world-building.
The writing is universally praised as some of the finest in video game history, blending dark humor with genuine philosophical depth.
Disco Elysium is sold on Steam and won multiple Game of the Year awards.',
1),

-- G22
('DOOM Eternal', 'doom_eternal.jpg', '2020-03-20', 4.65,
'DOOM Eternal is a first-person shooter developed by id Software and published by Bethesda Softworks, released in March 2020.
Players return as the DOOM Slayer, battling demonic hordes across a devastated Earth and the planes of Hell itself.
The game introduces a dramatically expanded resource management system — enemies must be killed in specific ways to earn health, armor, or ammo.
Combat arenas are designed as intricate puzzles requiring constant movement, weapon switching, and prioritization of enemy types.
A wide arsenal includes the Super Shotgun with its Meat Hook attachment for aggressive close-range engagements.
The Master Levels and two expansion chapters, The Ancient Gods Parts 1 and 2, add substantial additional campaign content.
DOOM Eternal is available on Steam and is considered one of the finest first-person shooters ever made.',
1),

-- G23
('Terraria', 'terraria.jpg', '2011-05-16', 4.80,
'Terraria is a 2D sandbox action-adventure game developed by Re-Logic, first released in May 2011 and continuously updated since.
Players explore a procedurally generated world, mining resources, crafting items, building structures, and fighting hundreds of unique enemies.
The game features over 400 enemies, 20+ bosses, and thousands of items, offering enormous depth despite its simple pixel-art presentation.
Progression is gated by defeating bosses that unlock new tiers of materials, tools, and gameplay possibilities.
A dedicated building system allows players to construct elaborate bases, arenas, and architectural works of incredible complexity.
The 1.4 Journey`s End update is considered the definitive version, adding vast amounts of content and quality-of-life improvements.
Terraria is sold on Steam and has sold over 44 million copies, making it one of the greatest value games ever released.',
1),

-- G24
('Path of Exile', 'poe.jpg', '2013-10-23', 4.50,
'Path of Exile is a free-to-play action RPG developed by Grinding Gear Games, released in October 2013.
Set in the dark fantasy world of Wraeclast, players control exiles banished to a brutal continent and must fight to survive.
The game is renowned for its astronomically large passive skill tree containing over 1,500 nodes for deep character customization.
A unique currency system replaces traditional gold with orbs that directly modify item properties, enabling a complex player economy.
New leagues release every three to four months, each introducing a fresh mechanic and resetting the economy for a level playing field.
The game is genuinely free-to-play with cosmetic-only microtransactions and is distributed through Steam.
Path of Exile 2, a sequel with refined systems, entered Early Access in December 2024.',
1),

-- G25
('Factorio', 'factorio.jpg', '2020-08-14', 4.95,
'Factorio is a construction and management simulation game developed by Wube Software, released in full in August 2020.
Players crash-land on an alien planet and must build and automate increasingly complex factories to eventually launch a rocket into space.
The game begins simply with hand-crafting basic items but evolves into an enormous automated production network.
A deep research tree expands available technologies, enabling more efficient production methods and better defenses against alien attacks.
Multiplayer allows friends to collaborate on factory construction, dividing the enormous task of building an industrial civilization.
The Space Age expansion, released in 2024, adds a post-rocket phase sending players to multiple unique planets.
Factorio is sold exclusively on Steam and holds an extraordinary 98% positive rating.',
1),

-- G26
('Subnautica', 'subnautica.jpg', '2018-01-23', 4.78,
'Subnautica is an open-world survival game developed by Unknown Worlds Entertainment, released in January 2018.
Players crash-land on an ocean-covered alien planet and must survive by exploring the depths, gathering resources, and building underwater bases.
The ocean is divided into distinct biomes ranging from shallow safe reefs to terrifyingly deep trenches filled with massive leviathan creatures.
A compelling narrative unfolds through environmental storytelling — scanning alien flora, fauna, and listening to survivor data logs.
Base building allows players to construct pressurized underwater habitats with power, storage, and fabrication rooms.
Submersibles of increasing size and capability are crafted to reach deeper and more dangerous zones of the ocean.
Subnautica was distributed as a free Epic Games Store exclusive during its promotion and remains available on Epic.',
5),

-- G27
('Outer Wilds', 'outer_wilds.jpg', '2019-05-28', 4.88,
'Outer Wilds is an exploration mystery adventure game developed by Mobius Digital, released in May 2019.
Players control a new member of a small space program on an alien world, exploring a solar system trapped in a 22-minute time loop.
The game contains no combat, no XP, and no upgrades — the only progression is knowledge gained about the mysteries of the solar system.
Each planet has a unique gimmick tied to real physics concepts, such as a world whose ocean is draining into space.
The central mystery concerns an ancient alien civilization called the Nomai and what happened to them 280,000 years ago.
Outer Wilds launched as an Epic Games Store timed exclusive for one year before releasing on Steam.
It is frequently praised as one of the most emotionally resonant and intellectually satisfying games ever created.',
5),

-- G28 FIXED: Return of the Obra Dinn → Steam (indie, sold on Steam)
('Return of the Obra Dinn', 'obra_dinn.jpg', '2018-10-18', 4.85,
'Return of the Obra Dinn is a puzzle adventure game developed by Lucas Pope, released in October 2018.
Players take on the role of an insurance investigator tasked with determining the fate of a ghost ship`s crew.
Using a magical pocket watch called the Memento Mortem, players witness the exact moment of each crew member`s death.
The puzzle requires piecing together identities and causes of death for all 60 crew members using context clues.
The game uses a distinctive 1-bit monochrome visual style inspired by early Macintosh graphics.
Deductions are entered into a ledger, and the game only locks in correct answers when three fates are conclusively identified.
Return of the Obra Dinn is sold on Steam and won numerous awards including Best Indie Game.',
1),

-- G29
('Disco Elysium: The Final Cut', 'disco_fc.jpg', '2021-03-30', 4.82,
'Disco Elysium: The Final Cut is the definitive edition of ZA/UM`s acclaimed narrative RPG, released in March 2021.
This version adds full voice acting for every character in the game, bringing the dense and literary dialogue to vivid life.
Four new quests expand the political vision questline, adding significant new content and deeper explorations of the game`s themes.
New side characters add context to Revachol`s fractured political landscape and its history of failed revolution.
The writing remains among the finest ever produced in the video game medium, blending absurdist humor with genuine pathos.
Players shape their detective through 24 skill attributes that argue with each other internally.
The Final Cut is sold on Steam and brought the game to consoles and new audiences.',
1),

-- ---- XBOX LIVE (Cat 2) — 10 new games (G51-G60) ----
-- G51
('Halo Infinite', 'halo_infinite.jpg', '2021-12-08', 4.30,
'Halo Infinite is a first-person shooter developed by 343 Industries and published by Xbox Game Studios, released in December 2021.
It is the sixth mainline entry in the legendary Halo franchise and features an open-world campaign for the first time in the series.
Players return as Master Chief on the ring world Zeta Halo to stop the Banished faction from using the ring as a weapon.
The grappleshot is a new equipment item that revolutionizes traversal and combat, attaching to enemies, vehicles, and surfaces.
Halo Infinite includes a free-to-play multiplayer component with seasonal content updates and a classic arena feel.
The game was praised for bringing Halo back to its roots in terms of sandbox gunplay and memorable enemy encounters.
It is available via Xbox Game Pass and Xbox Live on Xbox consoles.',
2),

-- G52
('Gears 5', 'gears5.jpg', '2019-09-10', 4.25,
'Gears 5 is a third-person cover shooter developed by The Coalition and published by Xbox Game Studios, released in September 2019.
Players control Kait Diaz, uncovering the dark history of her family`s connection to the Locust horde.
The game introduces open-world exploration segments between linear campaign chapters, a first for the franchise.
Jack, the team`s flying robot companion, can be upgraded throughout the campaign with new abilities and upgrades.
The multiplayer suite includes Versus, Horde mode, and the new Escape mode, which supports up to three players cooperatively.
Gears 5 was praised for its stunning visuals and polished cooperative gameplay across all its modes.
It is available via Xbox Live and Xbox Game Pass as an Xbox Game Studios title.',
2),

-- G53
('Forza Motorsport (2023)', 'forza_moto.jpg', '2023-10-10', 4.10,
'Forza Motorsport is a racing simulation game developed by Turn 10 Studios and published by Xbox Game Studios, released in October 2023.
It is a full reboot of the Forza Motorsport franchise, built from the ground up on a new engine with completely reworked physics.
The game features over 500 meticulously modeled cars racing across 20 real-world and fictional circuits with dynamic weather.
A career mode built around leveling individual cars through racing encourages players to deeply master a specific vehicle class.
Online multiplayer features structured racing with safety ratings and skill ratings to match drivers of similar ability.
The Forza Motorsport series is the benchmark for console racing simulation alongside Gran Turismo.
Available exclusively via Xbox Live and Xbox Game Pass on Xbox and Windows.',
2),

-- G54
('Sea of Thieves', 'sea_of_thieves.jpg', '2018-03-20', 4.20,
'Sea of Thieves is an action-adventure game developed by Rare and published by Xbox Game Studios, released in March 2018.
Players are pirates sailing the seas, completing quests, hunting treasure, and engaging in ship combat with other player crews.
The game is designed entirely around emergent multiplayer — no two sessions play out the same way.
A rich cosmetic system allows players to customize every aspect of their ship, clothing, and equipment with rare vanity items.
Seasonal updates have continuously added new story content, events, factions, and quality-of-life improvements since launch.
The game grew dramatically from a thin launch to a beloved live-service title with over 40 million registered players.
Sea of Thieves is available via Xbox Live and Xbox Game Pass.',
2),

-- G55
('Grounded', 'grounded.jpg', '2022-09-27', 4.35,
'Grounded is a survival adventure game developed by Obsidian Entertainment and published by Xbox Game Studios, released in 2022.
Players are shrunk to the size of an ant and must survive in a suburban backyard filled with insects, spiders, and environmental hazards.
The game blends base building, crafting, and exploration in a world where everyday objects become massive obstacles and resources.
Up to four players can explore and build together in cooperative multiplayer, sharing the same persistent world.
Different areas of the backyard present different biomes with unique insects, materials, and challenges.
A light narrative mystery runs through the game, explaining how the players were shrunk and who is responsible.
Grounded is available via Xbox Live and Xbox Game Pass.',
2),

-- G56
('Psychonauts 2', 'psychonauts2.jpg', '2021-08-25', 4.70,
'Psychonauts 2 is a platformer adventure game developed by Double Fine Productions and published by Xbox Game Studios, released in August 2021.
Players control Razputin Aquato, a psychic spy agent, as he investigates a conspiracy inside the Psychonauts organization.
The game is played largely inside the mental worlds of characters — each level is a bizarre, imaginative representation of someone`s psyche.
Themes of mental illness, trauma, and recovery are handled with surprising sensitivity and nuance for a colorful action platformer.
The humor and writing from Tim Schafer are sharp and inventive, maintaining the beloved tone of the original 2005 game.
Psychonauts 2 received widespread critical acclaim for its creativity, design, and emotional storytelling.
It is available via Xbox Live and Xbox Game Pass.',
2),

-- G57
('Ori and the Will of the Wisps', 'ori_wisps.jpg', '2020-03-11', 4.85,
'Ori and the Will of the Wisps is a platform adventure game developed by Moon Studios and published by Xbox Game Studios, released in 2020.
It is the direct sequel to Ori and the Blind Forest, continuing the story of Ori and the owlet Ku.
The game expands every element of the original — movement abilities, combat, and art direction are all dramatically improved.
A new combat system gives Ori a variety of weapon-like Spirit Shards for engaging enemies directly, unlike the first game.
The emotional narrative, hand-painted visuals, and orchestral soundtrack by Gareth Coker are considered masterclasses of the genre.
Ori and the Will of the Wisps received universal critical acclaim and is considered one of the finest platformers ever made.
It is available via Xbox Live and Xbox Game Pass.',
2),

-- G58
('Fable Anniversary', 'fable.jpg', '2014-09-12', 4.00,
'Fable Anniversary is a remaster of the original Fable developed by Lionhead Studios, published by Microsoft Studios.
Players control the Hero of Oakvale in the land of Albion, making choices that affect their appearance and the world around them.
The game pioneered the moral choice system in action RPGs, with good and evil actions visibly transforming the protagonist.
Combat, magic, and ranged attacks can all be developed independently, allowing varied builds from pacifist to pure warrior.
The Anniversary remaster adds upgraded visuals, achievements, and Smart Glass support across all content including the Lost Chapters expansion.
The Fable series remains one of Microsoft`s most beloved RPG franchises and a defining title for the Xbox platform.
Available on Xbox Live.',
2),

-- G59
('State of Decay 2', 'sod2.jpg', '2018-05-22', 3.90,
'State of Decay 2 is a survival horror game developed by Undead Labs and published by Xbox Game Studios, released in May 2018.
Players manage a community of survivors in a zombie apocalypse, building a base and scavenging resources across an open world.
Each survivor has unique skills, traits, and relationships that affect their usefulness and morale in the community.
Permadeath applies to survivors — when a character dies, they are gone forever, giving every decision genuine stakes.
Up to four players can play in cooperative multiplayer, helping each other scavenge and defend against zombie threats.
The Juggernaut Edition released in 2020 overhauled the game with significant improvements and content additions.
Available via Xbox Live and Xbox Game Pass.',
2),

-- G60
('Rare Replay', 'rare_replay.jpg', '2015-08-04', 4.40,
'Rare Replay is a compilation of 30 games developed by Rare, spanning from 1983 to 2008, published by Microsoft in August 2015.
The collection includes iconic titles such as Battletoads, Banjo-Kazooie, Conker`s Bad Fur Day, Perfect Dark, and Viva Pinata.
Each game is presented with optional Snapshots — short challenge scenarios that teach game mechanics in bite-sized segments.
The collection celebrates Rare`s extraordinary legacy and preserves titles that are otherwise difficult to access legally.
A behind-the-scenes documentary series provides rare developer commentary and historical footage from within the studio.
Rare Replay represents extraordinary value, offering 30 complete games for the price of a single title.
Available exclusively via Xbox Live.',
2),

-- ---- ORIGIN GAMES (Cat 3) — 10 new games (G61-G70) ----
-- G61
('The Sims 4', 'sims4.jpg', '2014-09-02', 4.10,
'The Sims 4 is a life simulation game developed by Maxis and published by Electronic Arts, originally released in September 2014.
Players create and control virtual people called Sims, guiding them through daily life including careers, relationships, and creative pursuits.
The game went free-to-play in October 2022, dramatically expanding its player base while monetizing through expansion packs.
Over 50 expansion packs, game packs, and stuff packs have been released, adding new worlds, careers, and gameplay systems.
The Create-A-Sim and Build Mode tools offer extraordinary detail and flexibility for players who enjoy customization.
Despite criticism of its piecemeal DLC model, The Sims 4 remains the dominant life simulation game on the market.
It is distributed through the EA App, formerly known as Origin.',
3),

-- G62
('Dragon Age: Origins', 'dao.jpg', '2009-11-03', 4.60,
'Dragon Age: Origins is a dark fantasy RPG developed by BioWare and published by Electronic Arts, released in November 2009.
Players create a character from one of six origin stories that each provide a unique beginning and context for the main narrative.
The game is set in the land of Ferelden, which is threatened by a Blight — a corruption spreading across the world through darkspawn creatures.
A deep tactical combat system allows players to pause and issue precise commands to their party in the heat of battle.
Companion characters each have deep personal storylines that unfold through gifts, approval ratings, and dedicated quests.
Dragon Age: Origins is widely considered one of BioWare`s greatest achievements and a high point of the CRPG genre.
It is distributed through Origin / EA App.',
3),

-- G63
('Mass Effect 2', 'me2.jpg', '2010-01-26', 4.90,
'Mass Effect 2 is an action RPG developed by BioWare and published by Electronic Arts, released in January 2010.
Set two years after the first game, Commander Shepard investigates the disappearance of human colonies across the galaxy.
The game assembles a crew of twelve unique specialists for a suicide mission against the Collectors, a mysterious alien threat.
Each crew member has a dedicated loyalty mission that deepens their backstory and improves their performance in the finale.
The Suicide Mission finale is widely considered one of the finest endings in gaming history, with every choice mattering.
Combat was significantly streamlined from the original game, making it faster and more satisfying in third-person cover shooting.
Mass Effect 2 is considered one of the greatest games ever made and is distributed through the EA App.',
3),

-- G64
('Dragon Age: Inquisition', 'dai.jpg', '2014-11-18', 4.40,
'Dragon Age: Inquisition is an open-world action RPG developed by BioWare and published by Electronic Arts, released in November 2014.
Players lead the Inquisition, a powerful organization, in a fractured world torn apart by a cataclysmic explosion called the Breach.
The game features vast open regions to explore, each with its own quests, resources, and political dynamics.
A war table mechanic allows the player to send agents on missions around the world, managing the Inquisition`s growing influence.
Companion characters return with full approval systems, personal quests, and relationship storylines, a hallmark of BioWare RPGs.
The Trespasser DLC significantly expands the ending and sets up events for future entries in the franchise.
Dragon Age: Inquisition won Game of the Year at The Game Awards 2014 and is distributed through Origin / EA App.',
3),

-- G65
('Battlefield 1', 'bf1.jpg', '2016-10-21', 4.35,
'Battlefield 1 is a first-person shooter developed by DICE and published by Electronic Arts, released in October 2016.
Set during World War I, it is widely praised for depicting the conflict with unusual gravity and emotional weight.
The single-player War Stories anthology tells the stories of six different soldiers across distinct WWI theaters and fronts.
The multiplayer supports large-scale battles across iconic WWI locations with up to 64 players and a variety of vehicles.
Operations mode strings multiple maps together into a dynamic campaign where one team attacks and the other defends over several rounds.
The period-authentic weapons, vehicles, aircraft, and environments give Battlefield 1 a distinctive visual and mechanical identity.
It is distributed through the EA App.',
3),

-- G66
('Battlefield V', 'bfv.jpg', '2018-11-20', 4.00,
'Battlefield V is a first-person shooter developed by DICE and published by Electronic Arts, set during World War II.
The game emphasizes squad-based play with a revamped attrition system that limits ammunition and encourages teamwork.
War Stories returns with several single-player narratives set in lesser-explored theaters of World War II.
Grand Operations is a multiplayer mode spanning multiple maps and rounds, simulating extended historical military operations.
Fortification building allows squads to construct defenses, supply stations, and spawn points directly on the battlefield.
Battlefield V received a mixed reception at launch but improved significantly through post-launch content updates.
It is distributed through the EA App.',
3),

-- G67
('Need for Speed Heat', 'nfs_heat.jpg', '2019-11-08', 4.00,
'Need for Speed Heat is a racing game developed by Ghost Games and published by Electronic Arts, released in November 2019.
Set in the fictional Palm City, the game splits between a licensed daytime race circuit and illegal underground street racing at night.
During the day, players earn money through sanctioned events to purchase and upgrade cars.
At night, players earn reputation through illegal races while evading increasingly aggressive police pursuit.
A deep car customization system covers both visual modifications and performance upgrades with hundreds of parts and options.
The neon-lit open world of Palm City is one of the more visually striking environments in recent Need for Speed history.
Distributed through the EA App.',
3),

-- G68
('Star Wars: Jedi Fallen Order', 'jedi_fo.jpg', '2019-11-15', 4.50,
'Star Wars Jedi: Fallen Order is an action-adventure game developed by Respawn Entertainment and published by Electronic Arts.
Set five years after Order 66, players control Cal Kestis, a young Padawan in hiding who must restore a lost Jedi holocron.
The game blends soulslike combat with Metroidvania exploration across multiple planets in the Star Wars universe.
Cal`s Force abilities and lightsaber skills grow throughout the game, unlocking new areas previously inaccessible.
BD-1, Cal`s droid companion, provides utility, lore entries, and a significant emotional narrative role.
The game was widely praised for its tight design, excellent combat feel, and respectful treatment of Star Wars lore.
Distributed through the EA App and Origin.',
3),

-- G69
('Apex Legends', 'apex.jpg', '2019-02-04', 4.20,
'Apex Legends is a free-to-play battle royale hero shooter developed by Respawn Entertainment and published by Electronic Arts.
Released without prior announcement in February 2019, it reached 50 million players in its first month.
Players form squads of three, choosing from a roster of unique Legends each with distinct passive, tactical, and ultimate abilities.
The ping communication system is widely regarded as the best non-verbal communication tool in any multiplayer game.
Maps are updated seasonally with new areas, mechanics, and a rotating pool of locations keeping the environment fresh.
Apex Legends is free-to-play with cosmetic-only purchases and is distributed through the EA App.',
3),

-- G70
('A Way Out', 'a_way_out.jpg', '2018-03-23', 4.30,
'A Way Out is a co-op action-adventure game developed by Hazelight Studios and published by Electronic Arts, released in March 2018.
The game is exclusively designed for two players — either locally or online — and cannot be played solo under any circumstances.
Players control Leo and Vincent, two prisoners who must work together to break out of prison and pursue their own agendas.
The split-screen presentation is always active regardless of whether players are online or local, keeping both characters visible.
The gameplay shifts dramatically between genres — stealth, action, driving, and even mini-games — throughout the story.
A Way Out was the spiritual predecessor to Hazelight`s smash hit It Takes Two and explores similar themes of partnership.
Distributed through the EA App with a Friend Pass allowing one buyer to invite any friend for free.',
3),

-- ---- UBISOFT CONNECT (Cat 4) — 10 new games (G71-G80) ----
-- G71
('Assassin`s Creed Odyssey', 'ac_odyssey.jpg', '2018-10-05', 4.35,
'Assassin`s Creed Odyssey is an action RPG developed and published by Ubisoft, released in October 2018.
Set in ancient Greece during the Peloponnesian War, players control either Alexios or Kassandra, a mercenary descended from Leonidas.
The game is the largest Assassin`s Creed entry ever made, featuring a massive recreation of ancient Greece spanning dozens of islands.
A full dialogue system allows players to shape their character`s personality and pursue multiple romantic relationships.
Combat evolved significantly into a full action RPG system with abilities, equipment stats, and a deep skill tree.
Naval combat returns from Black Flag, allowing players to sail the Aegean Sea and engage in ship-to-ship battles.
Distributed through Ubisoft Connect.',
4),

-- G72
('Assassin`s Creed Valhalla', 'ac_valhalla.jpg', '2020-11-10', 4.20,
'Assassin`s Creed Valhalla is an action RPG developed and published by Ubisoft, released in November 2020.
Players control Eivor, a Viking raider who leads their clan from Norway to establish a settlement in Dark Ages England.
The game features one of the largest maps in the series, covering England, Norway, and several mythological realms.
A settlement system allows Eivor to develop Ravensthorpe, the Viking village, by completing raids and building new structures.
Orlog, a unique dice game within Valhalla, became so popular it was produced as a real-world physical game.
The game features extensive post-launch content with multiple major expansions including Wrath of the Druids and Dawn of Ragnarok.
Distributed through Ubisoft Connect.',
4),

-- G73
('Far Cry 5', 'fc5.jpg', '2018-03-27', 4.20,
'Far Cry 5 is a first-person shooter developed by Ubisoft Montreal and published by Ubisoft, released in March 2018.
Set in fictional Hope County, Montana, players must dismantle a doomsday cult called Eden`s Gate led by the charismatic Joseph Seed.
The open world is divided into three regions, each controlled by one of Joseph`s siblings and liberated through separate storylines.
Companions called Guns for Hire can accompany the player, each with unique abilities and personalities.
A full co-op mode allows a second player to join the campaign at any point, completing missions together in the open world.
Far Cry 5 was praised for its striking setting, strong villain, and consistently engaging open-world design.
Distributed through Ubisoft Connect.',
4),

-- G74
('Far Cry 6', 'fc6.jpg', '2021-10-07', 4.00,
'Far Cry 6 is a first-person shooter developed by Ubisoft Toronto and published by Ubisoft, released in October 2021.
Set on the fictional Caribbean island of Yara, players join a guerrilla revolution against dictator Anton Castillo, played by Giancarlo Esposito.
Players control Dani Rojas, a local soldier who becomes the face of the revolution`s fight against the regime.
The game introduces a new weapon customization system called Resolver that allows improvised modifications to any firearm.
Amigos are animal companions replacing the Guns for Hire system, including a crocodile, a dog, and a rooster.
Far Cry 6 was praised for its production values, performances, and variety of activities across its large open world.
Distributed through Ubisoft Connect.',
4),

-- G75
('Rainbow Six Siege', 'r6siege.jpg', '2015-12-01', 4.30,
'Rainbow Six Siege is a tactical first-person shooter developed by Ubisoft Montreal and published by Ubisoft, released in December 2015.
Players choose from over 60 unique Operators, each with a distinct gadget and role in the highly destructible environments.
The game is built entirely around small-scale tactical multiplayer with no campaign, focusing on 5v5 competitive matches.
Destructibility is central — walls, floors, and ceilings can be breached, barricaded, or reinforced to shape engagements.
A continuous release of new Operators and maps through seasonal updates has sustained the game for nearly a decade.
Siege has one of the highest skill ceilings of any shooter, rewarding communication, map knowledge, and mechanical precision.
Distributed through Ubisoft Connect.',
4),

-- G76
('Watch Dogs 2', 'wd2.jpg', '2016-11-15', 4.15,
'Watch Dogs 2 is an action-adventure game developed by Ubisoft Montreal and published by Ubisoft, released in November 2016.
Set in a colorful recreation of the San Francisco Bay Area, players control Marcus Holloway, a hacker and member of DedSec.
The game greatly improved on its predecessor with a more likable protagonist, a more vibrant world, and refined hacking mechanics.
Marcus can hack nearly any connected device in the environment — phones, cars, cameras, and infrastructure — to approach missions creatively.
A new seamless online mode blurs the line between single-player and multiplayer as other players can invade or assist at any time.
The game`s commentary on surveillance capitalism, tech culture, and social media remains relevant and surprisingly sharp.
Distributed through Ubisoft Connect.',
4),

-- G77
('For Honor', 'for_honor.jpg', '2017-02-14', 4.00,
'For Honor is an action fighting game developed by Ubisoft Montreal and published by Ubisoft, released in February 2017.
Players battle as medieval warriors from three factions — Knights, Vikings, and Samurai — in a variety of multiplayer modes.
The Art of Battle system is the core mechanic, a directional combat system where players read and block enemy attacks in real time.
The game features both a single-player story campaign and a robust suite of competitive and cooperative multiplayer modes.
New factions, heroes, and seasons have been added continuously since launch through a live-service model.
For Honor is praised for its deep, unique combat system that rewards genuine mastery over reflexive button pressing.
Distributed through Ubisoft Connect.',
4),

-- G78
('Immortals Fenyx Rising', 'immortals.jpg', '2020-12-03', 4.10,
'Immortals Fenyx Rising is an open-world action-adventure game developed by Ubisoft Quebec and published by Ubisoft, released in December 2020.
Set in a mythological Greek world, players control Fenyx, a mortal hero tasked with saving the Greek gods from the Titan Typhon.
The game draws obvious inspiration from The Legend of Zelda: Breath of the Wild with its climbing, gliding, and puzzle design.
Greek mythology is presented with a comedic tone, with Zeus and Prometheus narrating the adventure in a bickering double-act.
Exploration is rewarded with cosmetic upgrades, weapons, and abilities gathered across five distinct divine regions.
Immortals Fenyx Rising was praised for its playful personality and satisfying open-world design despite its familiar structure.
Distributed through Ubisoft Connect.',
4),

-- G79
('The Crew 2', 'crew2.jpg', '2018-06-29', 3.90,
'The Crew 2 is an open-world racing game developed by Ivory Tower and published by Ubisoft, released in June 2018.
Set across a massive recreation of the United States, the game allows players to race using cars, motorcycles, boats, and aircraft.
The ability to switch between vehicle types at any time on the fly is the game`s defining feature, enabled by a single button press.
A variety of motorsport disciplines from street racing and rally to powerboat racing and stunt flying are all represented.
A social system allows players to invite friends to join their session at any time, completing events cooperatively.
The Crew Motorfest, released in 2023, serves as a spiritual successor set in Hawaii with similar multi-vehicle gameplay.
Distributed through Ubisoft Connect.',
4),

-- G80
('Ghost Recon Wildlands', 'gr_wildlands.jpg', '2017-03-07', 4.05,
'Ghost Recon Wildlands is a tactical third-person shooter developed by Ubisoft Paris and published by Ubisoft, released in March 2017.
Players lead a four-person special forces squad in Bolivia, tasked with dismantling the Santa Blanca drug cartel.
The game features a vast open world recreation of Bolivia with diverse biomes from jungles and mountains to salt flats and deserts.
Up to four players can play the entire campaign in online co-op, coordinating synchronized strikes on enemy outposts.
Missions can be approached with stealth, aggressive tactics, or any combination, with the open world reacting to player choices.
A Predator crossover mission and other special events were added post-launch, keeping the community engaged.
Distributed through Ubisoft Connect.',
4),

-- ---- EA APP (Cat 6) — keep G34, G40 + 10 new (G81-G90) ----
-- G30
('Ori and the Blind Forest', 'ori_bf.jpg', '2015-03-11', 4.82,
'Ori and the Blind Forest is a platform adventure game developed by Moon Studios and published by Microsoft Studios, released in 2015.
Players control Ori, a white guardian spirit, navigating a lush and dying forest while searching for a way to restore it.
The game is universally praised for its stunning hand-painted art style and emotionally affecting opening sequence.
Gameplay involves precise platforming through a Metroidvania-style map with abilities unlocked through exploration and upgrades.
The Soul Link mechanic allows players to create save points using collectible energy at any time.
An orchestral soundtrack by Gareth Coker is considered one of the finest in gaming.
Ori and the Blind Forest is available on Xbox and Windows Store.',
7),

-- G31
('Cuphead', 'cuphead.jpg', '2017-09-29', 4.70,
'Cuphead is a run-and-gun action game developed by Studio MDHR, released in September 2017.
The game is hand-drawn in the style of 1930s Fleischer Studios cartoons, with every frame of animation drawn on paper.
Players control Cuphead or Mugman as they battle a series of boss encounters after losing a bet to the Devil himself.
The gameplay is focused almost entirely on challenging multi-phase boss fights with intricate bullet patterns.
A two-player local co-op mode allows a second player to join as Mugman and take on the bosses together.
The Delicious Last Course DLC adds a substantial new island with new bosses and a new playable character.
Cuphead is available on Xbox and Windows Store.',
7),

-- G32 FIXED: Shovel Knight → Steam (indie by Yacht Club Games, on Steam)
('Shovel Knight', 'shovel_knight.jpg', '2014-06-26', 4.75,
'Shovel Knight: Treasure Trove is an action platformer developed by Yacht Club Games, inspired by classic NES-era games.
The original campaign follows Shovel Knight on a quest to defeat the evil Enchantress and rescue his lost partner Shield Knight.
The game features tight, satisfying controls with a bounce mechanic off enemies using the shovel that rewards skilled play.
Additional campaigns released over several years follow other knights including Plague Knight, Specter Knight, and King Knight.
A dedicated battle mode for local multiplayer and a co-op mode round out an extraordinary package of content.
The pixel art, chiptune soundtrack by Jake Kaufman, and level design are all considered masterclasses in retro-inspired design.
Shovel Knight is sold on Steam.',
1),

-- G33 FIXED: Undertale → Steam (indie by Toby Fox, sold on Steam)
('Undertale', 'undertale.jpg', '2015-09-15', 4.85,
'Undertale is an indie RPG developed entirely by Toby Fox, released in September 2015, in which you never need to kill anyone.
Players fall into the Underground, a realm beneath the Earth where monsters were banished after a war with humans.
The game subverts RPG conventions by offering a Pacifist route where every enemy can be spared through unique puzzle-like interactions.
A Genocide route is also available, changing the game dramatically and resulting in a uniquely grim and confrontational experience.
The combat system uses bullet-hell mechanics where players must dodge enemy attacks in real time while selecting actions.
The writing is sharp, funny, and genuinely moving, with a twist-laden narrative that rewards multiple playthroughs.
Undertale is sold on Steam and its soundtrack, composed by Toby Fox, is considered iconic.',
1),

-- G34
('Titanfall 2', 'tf2.jpg', '2016-10-28', 4.88,
'Titanfall 2 is a first-person shooter developed by Respawn Entertainment and published by Electronic Arts, released in October 2016.
It features a single-player campaign widely regarded as one of the finest in any shooter, full of creative time-manipulation mechanics.
Players alternate between agile wall-running pilot combat and commanding a massive Titan mech, with both modes being deeply polished.
The campaign tells the story of Rifleman Jack Cooper who bonds with the titan BT-7274, exploring themes of partnership and sacrifice.
The multiplayer is celebrated for its exceptional movement system — wall-running, double-jumping, and sliding flow together seamlessly.
A variety of Titan chassis offer radically different playstyles, from aggressive brawlers to defensive zone controllers.
Titanfall 2 is distributed through the EA App.',
6),

-- G35
('Doom (2016)', 'doom2016.jpg', '2016-05-13', 4.75,
'DOOM (2016) is a first-person shooter developed by id Software that relaunched the legendary franchise for a modern audience.
The game follows the DOOM Slayer, an ancient warrior of incredible power, unleashed on a Mars facility overrun by demonic forces.
The Glory Kill system rewards aggressive play — stunned enemies can be executed for health, encouraging constant forward momentum.
The level design brilliantly marries modern open arenas with classic secrets and exploration reminiscent of the original 1993 game.
A heavy metal soundtrack by Mick Gordon is perfectly synchronized with the combat, dynamically escalating with player aggression.
The game completely reversed the declining perception of the DOOM franchise and revitalized it as a premier action series.
DOOM (2016) is sold on Steam.',
1),

-- G36
('Star Wars Jedi: Survivor', 'jedi_survivor.jpg', '2023-04-28', 4.55,
'Star Wars Jedi: Survivor is an action-adventure game developed by Respawn Entertainment, released in April 2023.
It is the direct sequel to Jedi: Fallen Order, continuing the story of Cal Kestis five years after the events of the first game.
Cal now leads the Mantis crew in resisting the Galactic Empire while searching for a mythical planet beyond Imperial reach.
Combat offers five different lightsaber stances at launch, each with distinct mechanics for different enemy types and playstyles.
A greatly expanded open world with rideable mounts and deep traversal options rewards exploration with story and lore.
Iconic Star Wars locations and characters appear throughout, with new characters like Bode Akuna and Dagan Gera.
Available on Steam and EA App.',
1),

-- G37
('Mass Effect Legendary Edition', 'me_legendary.jpg', '2021-05-14', 4.82,
'Mass Effect Legendary Edition is a remaster of the original Mass Effect trilogy developed by BioWare and released in May 2021.
The collection remastered all three games — Mass Effect, Mass Effect 2, and Mass Effect 3 — with improved visuals and unified gameplay.
Players control Commander Shepard across a science-fiction saga spanning multiple star systems and alien races.
The series is celebrated for its relationship-driven narrative, with companion characters that react meaningfully to player choices.
Mass Effect 2 in particular is widely considered one of the greatest RPGs ever made.
The remaster brought visual upgrades, better facial animations, and quality-of-life changes to weapons and movement.
The Legendary Edition is distributed through the EA App.',
1),

-- G38
('Spiritfarer', 'spiritfarer.jpg', '2020-08-18', 4.75,
'Spiritfarer is a cozy management game about death, developed by Thunder Lotus Games and released in August 2020.
Players control Stella, a Spiritfarer who takes over from Charon and must ferry spirits of the dead to the Everdoor.
Each spirit is a fully realized character with a personal story, representing grief, loss, and the complex emotions of saying goodbye.
Gameplay involves farming, cooking, crafting, and building on an ever-expanding boat as Stella fulfills each spirit`s final wishes.
The game features optional two-player local co-op where a second player controls Stella`s cat, Daffodil.
The art style is hand-drawn and strikingly beautiful, and the game`s emotional weight is compared to a Pixar film.
Spiritfarer was distributed as an Epic Games Store exclusive at launch.',
5),

-- G39 FIXED: Vampire Survivors → Steam (sold on Steam)
('Vampire Survivors', 'vampire_survivors.jpg', '2022-10-20', 4.80,
'Vampire Survivors is a rogue-lite auto-shooter developed by Luca Galante, originally released in Early Access in 2021.
Players control a character who attacks automatically and must survive waves of increasingly overwhelming enemy hordes.
Progression comes from choosing weapon upgrades and passive items that can evolve into powerful evolved forms.
The game features dozens of characters, weapons, and stages, with story content hidden behind achievements.
Legacy of the Moonspell and Tides of the Foscari are major paid DLC expansions adding new characters and stages.
Despite its simple presentation, the game has enormous depth in min-maxing optimal upgrade paths and build synergies.
Vampire Survivors is sold on Steam and won Best Debut Indie at The Game Awards 2022.',
1),

-- G40
('It Takes Two', 'it_takes_two.jpg', '2021-03-26', 4.85,
'It Takes Two is a co-op action-adventure game developed by Hazelight Studios and published by Electronic Arts, released in March 2021.
Players control Cody and May, a couple on the brink of divorce who are magically shrunken down and must work together to return to normal.
The game is exclusively designed for co-op and cannot be played solo — every section requires coordination between both players.
What sets it apart is the astonishing variety of gameplay — each chapter introduces completely new mechanics that are never reused.
Segments include space combat, platforming, time manipulation, music rhythm sections, and a full shooter sequence.
The narrative deals honestly with relationship breakdown while maintaining humor and genuine emotional resolution.
It Takes Two is distributed through the EA App and won Game of the Year at The Game Awards 2021.',
6),

-- G41
('Tunic', 'tunic.jpg', '2022-03-16', 4.72,
'Tunic is an action-adventure game developed by Andrew Shouldice, inspired by classic Zelda games with a modern indie sensibility.
Players control a small fox exploring a mysterious ruined world filled with forgotten technology and dangerous enemies.
The game`s central mechanic involves collecting pages of an in-game instruction manual written in an indecipherable fictional language.
Players must decode the manual`s mysteries themselves, learning game mechanics and lore through patient observation.
Combat is deliberate and challenging, requiring careful use of a limited stamina-based dodge and shield system.
Hidden beneath the surface is an extraordinary collection of puzzles that fundamentally alter understanding of the game world.
Tunic launched as an Epic Games Store timed exclusive.',
5),

-- G42
('Sifu', 'sifu.jpg', '2022-02-08', 4.60,
'Sifu is an action game developed by Sloclap, released in February 2022, featuring a revenge story rooted in Pak Mei kung fu.
Players control a young martial artist pursuing the five assassins responsible for murdering their father.
The core mechanic involves aging — each death adds years to the protagonist`s age, with increased age granting power at the cost of maximum lifespan.
If the player ages past 70 and dies again, the run ends permanently.
Environments are filled with interactive objects that can be used as weapons or obstacles.
The combat system is deeply layered with parries, counters, structure damage, and focus techniques.
Sifu launched as an Epic Games Store timed exclusive before releasing on Steam.',
5),

-- G43
('Deathloop', 'deathloop.jpg', '2021-09-14', 4.50,
'Deathloop is an action-shooter developed by Arkane Lyon and published by Bethesda Softworks, released in September 2021.
Players control Colt, an assassin trapped on the island of Blackreef in a time loop he must break by killing eight targets in one day.
The game blends immersive sim elements with a puzzle structure — players gather information across loops to optimize assassination runs.
Colt can acquire supernatural powers called Slabs from targets he kills, combining abilities for creative approaches.
A second player can invade as Julianna, a rival assassin, adding an unpredictable multiplayer element.
The 1960s retrofuturist aesthetic, sharp writing, and distinctive visual identity set it apart from other first-person games.
Deathloop is sold on Steam.',
1),

-- G44 FIXED: Ghostrunner → Steam (sold on Steam)
('Ghostrunner', 'ghostrunner.jpg', '2020-10-27', 4.65,
'Ghostrunner is a cyberpunk action game developed by One More Level, released in October 2020.
Players control Jack, a cybernetic warrior with a blade navigating a dystopian mega-structure called the Dharma Tower.
The game is an extreme one-hit-kill experience — enemies die in one strike, but Jack also dies in one hit from any attack.
A slow-motion ability called Sensory Boost allows brief moments of bullet-time to navigate through projectile barrages.
Wall-running, grappling, and precise aerial movement are combined into fluid traversal sequences.
The cyberpunk setting is brought to life through striking neon visuals and a driving synthwave soundtrack.
Ghostrunner is sold on Steam.',
1),

-- G45
('Valheim', 'valheim.jpg', '2021-02-02', 4.72,
'Valheim is a survival and exploration game developed by Iron Gate AB, released in Early Access in February 2021.
Players are slain Viking warriors sent to the tenth Norse world to prove their worth by defeating Odin`s ancient enemies.
The game blends survival mechanics — building, crafting, farming — with exploration of a vast procedurally generated world.
Each biome is home to a powerful boss, and defeating them unlocks new progression tiers of materials and tools.
A dedicated sailing system allows players to build longships and navigate open oceans between the game`s many islands.
The building system is physics-based, requiring structural support and encouraging players to think architecturally.
Valheim is sold on Steam and sold over 12 million copies in its first year.',
1),

-- G46
('Deep Rock Galactic', 'drg.jpg', '2020-05-13', 4.90,
'Deep Rock Galactic is a co-op first-person shooter developed by Ghost Ship Games, released in May 2020.
Players are space dwarves working for a mining corporation, dropped into procedurally generated caves on the hostile planet Hoxxes IV.
Four distinct classes — Scout, Driller, Gunner, and Engineer — each have unique tools and weapons designed to complement each other.
Missions range from mining for minerals to defending a machine to rescuing lost equipment, all against waves of alien bugs.
The cave generation system creates entirely unique layouts every run, and the terrain is fully destructible.
A strong community culture has developed around the motto Rock and Stone, shouted between players as a battle cry.
Deep Rock Galactic is sold on Steam.',
1),

-- G47
('Phasmophobia', 'phasmophobia.jpg', '2020-09-18', 4.55,
'Phasmophobia is a cooperative horror investigation game developed by Kinetic Games, released in Early Access in September 2020.
Players work in teams of up to four as paranormal investigators entering haunted locations to identify the type of ghost present.
Each ghost type has distinct behaviors and evidence patterns that must be identified using tools like EMF readers and spirit boxes.
The ghost actively hunts players if sanity drops too low, creating genuine tension as teams balance evidence gathering with survival.
Voice recognition technology allows the ghost to respond to players speaking its name or certain keywords aloud.
The game has been continuously updated with new ghost types, equipment, and a major visual overhaul since launch.
Phasmophobia is sold on Steam.',
1),

-- G48
('Forza Horizon 5', 'fh5.jpg', '2021-11-09', 4.75,
'Forza Horizon 5 is an open-world racing game developed by Playground Games and published by Xbox Game Studios, released in November 2021.
Set in a richly detailed recreation of Mexico, the game features over 500 licensed cars across a massive and varied environment.
The map includes active volcanoes, dense jungle, ancient ruins, colonial cities, and coastal beaches across different climate zones.
Dynamic seasons change the entire map every week in real time, altering available events, road conditions, and environmental hazards.
The EventLab feature allows players to create custom races, stunt events, and entirely new game modes shared with the community.
Forza Horizon 5 launched as the biggest Xbox Game Studios release ever, with over 28 million players in its first year.
Available on Windows Store and Xbox Game Pass.',
7),

-- G49
('Slay the Spire', 'slay_the_spire.jpg', '2019-01-23', 4.85,
'Slay the Spire is a roguelike deck-building game developed by MegaCrit, released in full in January 2019.
Players choose one of four characters and ascend a procedurally generated spire, building a card deck through combat encounters.
Each character begins with a small set of cards and acquires new ones after each fight, creating powerful card combinations.
Relics collected throughout a run provide passive bonuses that interact with the deck, enabling game-breaking synergies.
Three boss encounters await across the three acts, each requiring distinct strategic preparation to defeat effectively.
An Ascension system adds twenty difficulty modifiers for players who have mastered the base game.
Slay the Spire created the roguelike deckbuilder genre and is sold on Steam.',
1),

-- G50 FIXED: Neon White → Steam (available on Steam)
('Neon White', 'neon_white.jpg', '2022-06-16', 4.78,
'Neon White is a first-person card-based action game developed by Angel Matrix and published by Annapurna Interactive, released in June 2022.
Players control White, an assassin pulled from Hell given a chance to earn a place in Heaven by eliminating demons.
The game is built around speedrunning — every level has a par time and a gold medal time that demands creative routing.
Soul Cards serve as both weapons and movement abilities; discarding a card sacrifices its weapon to perform a traversal move.
Learning to discard cards for movement instead of using them offensively is the central skill expression of the game.
A visual novel narrative features surprisingly deep character writing and an engaging cast of heaven`s assassins.
Neon White is sold on Steam and won Best Independent Game at The Game Awards 2022.',
1),

-- ---- EA APP additional games to reach 10+ (Cat 6) ----
-- G81
('FIFA 23', 'fifa23.jpg', '2022-09-30', 3.80,
'FIFA 23 is an association football simulation game developed by EA Sports and published by Electronic Arts, released in September 2022.
It was the final entry in the FIFA-branded series before EA rebranded to EA Sports FC in 2023.
The game features HyperMotion2 technology, using motion capture from real professional matches to animate player movements.
Ultimate Team returns as the flagship mode, allowing players to build squads from thousands of real-world players.
Women`s club football is playable in Ultimate Team for the first time, representing a significant step for the mode.
Career Mode, Volta Football, and a comprehensive Pro Clubs mode round out the full game package.
Distributed through the EA App.',
6),

-- G82
('NHL 24', 'nhl24.jpg', '2023-10-06', 3.70,
'NHL 24 is an ice hockey simulation game developed and published by EA Sports, released in October 2023.
The game introduces the Exhaust Engine, which makes physically draining the opponent a viable defensive strategy.
Skill-based one-timers allow for timing-based shooting with contextual animations tied to body positioning.
Hockey Ultimate Team continues as the primary mode, featuring player chemistry systems and seasonal challenges.
Franchise Mode receives updates to the scouting system, making player recruitment more strategic and realistic.
The game captures the speed, physicality, and skill of real NHL hockey with over 700 authentically reproduced players.
Distributed through the EA App.',
6),

-- G83
('F1 23', 'f123.jpg', '2023-06-16', 4.00,
'F1 23 is a Formula One racing simulation game developed by Codemasters and published by Electronic Arts, released in June 2023.
The game includes all 20 circuits from the 2023 Formula One World Championship season with authentic team and driver rosters.
Braking Point 2 continues the cinematic story mode introduced in F1 2021, following the fictional Konnersport team.
A new sprint challenge format mirrors real-world F1 Sprint weekends, adding variety to the race weekend structure.
My Team career mode allows players to create and manage their own F1 team from the ground up over multiple seasons.
Safety car and formation lap features add authenticity to race starts and incident management.
Distributed through the EA App.',
6),

-- G84
('Madden NFL 24', 'madden24.jpg', '2023-08-18', 3.60,
'Madden NFL 24 is an American football simulation game developed and published by EA Sports, released in August 2023.
The game features SAPIEN technology, which creates more realistic player body types and movement animations.
Franchise Mode receives improvements including mini-games for training camp and an updated scouting system.
The FieldSENSE gameplay system improves collision detection, skill-based passing, and blocking mechanics.
Ultimate Team mode returns with new programs, challenges, and card sets based on current NFL season events.
Madden NFL remains the only officially licensed NFL video game and has a dedicated competitive gaming scene.
Distributed through the EA App.',
6),

-- ---- WINDOWS STORE additional games (Cat 7) ----
-- G85
('Age of Empires IV', 'aoe4.jpg', '2021-10-28', 4.30,
'Age of Empires IV is a real-time strategy game developed by Relic Entertainment and published by Xbox Game Studios, released in October 2021.
It is the fourth major entry in the legendary Age of Empires franchise, bringing the series into the modern era of strategy gaming.
The game features eight unique civilizations, each with distinct architectural styles, unit compositions, and special abilities.
A documentary-style presentation system teaches actual historical context through short films embedded in campaign missions.
Multiplayer supports up to eight players with a full ranked ladder and observer mode for competitive play.
The game was praised for respectfully evolving the RTS formula while remaining accessible to series newcomers.
Available on Windows Store and Xbox Game Pass.',
7),

-- G86
('Microsoft Flight Simulator 2020', 'msfs.jpg', '2020-08-18', 4.60,
'Microsoft Flight Simulator 2020 is a flight simulation game developed by Asobo Studio and published by Xbox Game Studios.
The game uses real-world satellite data from Bing Maps and Azure AI to recreate the entire planet Earth as a flyable environment.
Over 37,000 airports are represented, alongside accurate weather data pulled in real-time from actual meteorological services.
Players can fly over 30 aircraft types ranging from small propeller planes to wide-body airliners with full systems modeling.
The simulation accuracy scales from casual tourist mode to hardcore study-level realism catering to real student pilots.
Regular World Updates have expanded handcrafted detail to additional regions including Japan, the UK, and the Nordics.
Available on Windows Store and Xbox Game Pass.',
7),

-- G87
('Halo: The Master Chief Collection', 'mcc.jpg', '2019-12-03', 4.55,
'Halo: The Master Chief Collection is a compilation of the first four mainline Halo games, developed and published by 343 Industries.
The collection includes Halo: Combat Evolved Anniversary, Halo 2 Anniversary, Halo 3, and Halo 4, all updated for modern hardware.
Players experience the complete story of Master Chief from the original 2001 game through to Halo 4 in a seamless package.
All multiplayer modes from all four games are accessible, with a combined matchmaking system and full cross-play support.
The Anniversary editions of Combat Evolved and Halo 2 feature optional remastered graphics toggled in real time.
The Master Chief Collection represents thousands of hours of campaign and multiplayer content at a single price.
Available on Windows Store and Xbox Game Pass.',
7),

-- G88
('Gears of War 4', 'gow4.jpg', '2016-10-11', 4.20,
'Gears of War 4 is a third-person cover shooter developed by The Coalition and published by Xbox Game Studios, released in October 2016.
Set 25 years after the events of Gears of War 3, players control JD Fenix, son of the series protagonist Marcus Fenix.
A new enemy faction called the Swarm emerges from the ground, threatening the rebuilt human civilization of Sera.
The campaign supports full co-op for two players and introduces dynamic environmental hazards called Windflares.
Horde 3.0 mode introduces a base-building element to the co-op wave defense mode, adding strategic depth.
Gears of War 4 modernized the franchise with updated controls and visuals while maintaining its iconic feel.
Available on Windows Store and Xbox Game Pass.',
7),

-- G89
('Minecraft Dungeons', 'mc_dungeons.jpg', '2020-05-26', 3.90,
'Minecraft Dungeons is an action dungeon crawler developed by Mojang Studios and published by Xbox Game Studios, released in May 2020.
Set in the Minecraft universe, players fight through procedurally generated levels to stop the Arch-Illager, a villain wielding the Orb of Dominance.
The game supports up to four-player local and online co-op, making it ideal for families and younger players.
Unlike mainline Minecraft, Dungeons has no crafting or building — progression comes from collecting and equipping gear found in each level.
Enchantments on gear allow meaningful customization of playstyle, from ranged builds to tanky melee specialists.
DLC expansions add new biomes, missions, and gear from the broader Minecraft universe.
Available on Windows Store and Xbox Game Pass.',
7),

-- ---- ROCKSTAR additional games (Cat 8) ----
-- G90
('Grand Theft Auto V', 'gtav.jpg', '2013-09-17', 4.65,
'Grand Theft Auto V is an action-adventure game developed and published by Rockstar Games, released on September 17, 2013.
Set in the fictional state of San Andreas, the game follows three protagonists — Michael, Trevor, and Franklin — across an interwoven story.
The ability to switch between three playable characters in real time, even during missions, was a revolutionary design decision.
Los Santos, a recreation of Los Angeles, is one of the most detailed and lived-in open worlds ever created in gaming.
GTA Online, the multiplayer component, has been continuously updated since 2013 and remains hugely popular.
The game has sold over 195 million copies across all platforms, making it one of the best-selling games in history.
The PC version requires the Rockstar Games Launcher.',
8),

-- G91
('Max Payne 3', 'max_payne3.jpg', '2012-05-15', 4.40,
'Max Payne 3 is a third-person shooter developed and published by Rockstar Games, released in May 2012.
Set many years after the original games, the story follows a burned-out Max Payne working as private security in Sao Paulo, Brazil.
The game`s bullet-time mechanic returns, allowing Max to dive in slow motion and fire with pinpoint accuracy mid-air.
The narrative is gritty and cinematic, with seamless transitions between cutscenes and gameplay that blur the line between them.
The Sao Paulo setting is vividly realized, moving from sun-drenched favelas to nightclubs, stadiums, and rooftop firefights.
Max Payne 3 is considered Rockstar`s most polished third-person shooter and a high point of the cover shooter genre.
The PC version requires the Rockstar Games Launcher.',
8),

-- G92
('L.A. Noire', 'la_noire.jpg', '2011-05-17', 4.20,
'L.A. Noire is a neo-noir detective game developed by Team Bondi and published by Rockstar Games, released in May 2011.
Set in 1947 Los Angeles, players control Cole Phelps, a decorated WWII veteran working his way up through the LAPD ranks.
The game uses MotionScan technology, capturing actors` facial performances with 32 cameras to enable lie-detection gameplay.
Players interrogate suspects, reading facial microexpressions to determine whether they are telling the truth, lying, or withholding.
Cases span multiple divisions — patrol, traffic, homicide, vice, and arson — each with distinct mysteries and investigative styles.
The recreation of postwar Los Angeles is meticulous, with period-authentic music, fashion, architecture, and vehicles.
The PC version requires the Rockstar Games Launcher.',
8),

-- G93
('Bully: Scholarship Edition', 'bully.jpg', '2008-10-21', 4.30,
'Bully: Scholarship Edition is an action-adventure game developed by Rockstar Vancouver and published by Rockstar Games, released in 2008.
Players control Jimmy Hopkins, a rebellious teenager navigating the social hierarchies of Bullworth Academy boarding school.
The game applies Grand Theft Auto`s open-world design to a school setting, with classes that unlock abilities and moves.
Jimmy must work to unite the school`s rival cliques — jocks, nerds, preppies, greasers, and bullies — under his leadership.
Mini-games, pranks, and school classes create a varied gameplay loop distinct from any other Rockstar title.
Bully has developed a cult following over the years and fans have long called for a sequel.
The PC version requires the Rockstar Games Launcher.',
8),

-- G94
('Midnight Club: Los Angeles', 'mc_la.jpg', '2008-10-31', 4.10,
'Midnight Club: Los Angeles is an open-world racing game developed by Rockstar San Diego and published by Rockstar Games, released in 2008.
Players compete in illegal street races across a detailed recreation of Los Angeles, winning cars and unlocking new races.
A vast garage of cars and motorcycles can be upgraded with performance parts and visual customizations.
The open world is always live — traffic flows, pedestrians walk, and police respond to illegal racing at all times.
The game`s physics model, handling differences between vehicle classes, and traffic AI were praised for their polish.
Midnight Club: LA is considered one of the finest open-world racing games of its generation.
Distributed through the Rockstar Games Launcher.',
8),

-- ---- BATTLE.NET (Cat 9) — 10 new games (G95-G104) ----
-- G95
('Overwatch 2', 'ow2.jpg', '2022-10-04', 3.90,
'Overwatch 2 is a team-based hero shooter developed and published by Blizzard Entertainment, released in October 2022.
It replaced the original Overwatch with a free-to-play model, transitioning all players and their cosmetics to the new game.
Teams of five compete in objective-based modes — Push, Escort, Assault, and Control — across a global roster of maps.
Over 40 heroes across Damage, Tank, and Support roles each have unique ability kits requiring distinct playstyles.
A seasonal model delivers new heroes, maps, cosmetics, and limited-time events on a regular content cadence.
Competitive play features a six-tier rank system from Bronze to Grandmaster with dedicated role queue.
Overwatch 2 is distributed through Battle.net.',
9),

-- G96
('World of Warcraft', 'wow.jpg', '2004-11-23', 4.30,
'World of Warcraft is a massively multiplayer online RPG developed and published by Blizzard Entertainment, released in November 2004.
Set in the high fantasy world of Azeroth, millions of players have adventured together across two decades of expansions and updates.
Players choose from 13 races and 13 classes, developing characters through questing, raiding, PvP, and crafting.
The Mythic+ dungeon system provides infinitely scaling challenge for small groups, while 20-player raid instances test the largest guilds.
World of Warcraft Classic servers offer the original 2004-era experience alongside the modern game, catering to both audiences.
The game defined the modern MMORPG genre and remains one of the most culturally significant games ever created.
Available exclusively through Battle.net.',
9),

-- G97
('Diablo IV', 'd4.jpg', '2023-06-06', 4.25,
'Diablo IV is an action RPG developed and published by Blizzard Entertainment, released in June 2023.
Set in a dark, gothic version of Sanctuary, players battle the forces of Hell and investigate the return of the demon Lilith.
Five playable classes — Barbarian, Sorceress, Druid, Rogue, and Necromancer — each with extensive skill tree customization.
An open world shared with other players allows for organic encounters, world bosses, and dynamic events across five distinct regions.
The endgame features Nightmare Dungeons, Helltides, and a seasonal content model that keeps the game fresh with new mechanics.
Diablo IV represents a return to the darker tone of Diablo II while incorporating modern open-world design sensibilities.
Available exclusively through Battle.net.',
9),

-- G98
('StarCraft II', 'sc2.jpg', '2010-07-27', 4.50,
'StarCraft II is a real-time strategy game developed and published by Blizzard Entertainment, with its Wings of Liberty campaign released in 2010.
The game is the sequel to the original StarCraft, continuing the conflict between three distinct alien races — Terran, Zerg, and Protoss.
Each race has a completely unique playstyle, unit roster, and strategic identity that require entirely different approaches to master.
The esports scene built around StarCraft II is one of the most prestigious in gaming, particularly in South Korea.
Three separate campaign expansions follow each race`s storyline — Heart of the Swarm, Legacy of the Void, and Nova Covert Ops.
StarCraft II transitioned to free-to-play in 2017, making the Wings of Liberty campaign and multiplayer fully accessible.
Available exclusively through Battle.net.',
9),

-- G99
('Hearthstone', 'hearthstone.jpg', '2014-03-11', 3.95,
'Hearthstone is a digital collectible card game developed and published by Blizzard Entertainment, released in March 2014.
Based on the Warcraft universe, players build decks from over 3,000 unique cards featuring iconic Warcraft characters and spells.
Matches are played 1v1, with each player starting with 30 cards and 30 health points, drawing and playing cards each turn.
Multiple game modes include Standard, Wild, Classic, Twist, Battlegrounds, and Duels, offering variety beyond the core format.
Expansions release three times per year, introducing hundreds of new cards with new mechanics and meta-shaping archetypes.
Hearthstone is free-to-play with cosmetic and card pack purchases and has maintained a large playerbase since launch.
Available exclusively through Battle.net.',
9),

-- G100
('Heroes of the Storm', 'hots.jpg', '2015-06-02', 3.85,
'Heroes of the Storm is a multiplayer online battle arena game developed and published by Blizzard Entertainment, released in June 2015.
Players choose from a roster of over 90 heroes drawn from Blizzard`s franchises — Warcraft, StarCraft, Diablo, Overwatch, and more.
Unlike traditional MOBAs, the game focuses on team objectives and map variety, with 14 unique battlegrounds each with distinct mechanics.
All heroes are free to play on a rotation, with permanent unlocks available through gold or real money.
A Talent system at level milestones allows players to customize each hero`s abilities within a match without items.
Heroes of the Storm is praised for its accessibility and distinctive team-first design philosophy.
Available exclusively through Battle.net.',
9),

-- G101
('Diablo III: Reaper of Souls', 'd3ros.jpg', '2012-05-15', 4.20,
'Diablo III: Reaper of Souls is the complete edition of Blizzard`s action RPG Diablo III, including the major expansion.
Set in the dark world of Sanctuary, players choose from seven classes and battle through four acts of the main story.
The Reaper of Souls expansion added a fifth act, the Crusader class, and completely overhauled the endgame with Adventure Mode.
Rifts and Greater Rifts provide infinitely scaling randomized dungeons for endgame progression through Paragon levels.
Seasonal characters reset progress regularly, giving long-term players new goals and exclusive cosmetic rewards.
The game is known for its satisfying loot system and the visceral feel of combat with screen-filling abilities and effects.
Available through Battle.net.',
9),

-- G102
('Warcraft III: Reforged', 'wc3.jpg', '2020-01-28', 3.00,
'Warcraft III: Reforged is a remaster of Warcraft III: Reign of Chaos and The Frozen Throne, published by Blizzard in January 2020.
The remaster updates the visuals with completely remade models and textures while retaining the original gameplay systems.
The original game is historically significant for spawning the MOBA genre through the custom map Defense of the Ancients.
Campaign missions follow the stories of Arthas Menethil, Thrall, and Tyrande Whisperwind across the Alliance, Horde, and Night Elf factions.
Reforged was controversially received due to missing promised features and changes to cinematic presentation from the original.
Despite its troubled launch, the underlying game of Warcraft III remains one of the finest RTS campaigns ever made.
Available through Battle.net.',
9),

-- G103
('Overwatch (Original)', 'ow1.jpg', '2016-05-24', 4.50,
'Overwatch was a team-based hero shooter developed and published by Blizzard Entertainment, released in May 2016.
Teams of six competed in objective-based matches across a colorful roster of over 30 heroes with diverse abilities.
The game pioneered the modern hero shooter genre and spawned numerous imitators across the industry.
A vibrant animated shorts series expanded the lore and character depth beyond the game itself, earning mainstream attention.
Overwatch won Game of the Year at The Game Awards 2016 and numerous other industry accolades.
The game was sunset in October 2022 when Overwatch 2 replaced it, but its legacy and influence are widely acknowledged.
Was exclusively distributed through Battle.net.',
9),

-- G104
('Call of Duty: Black Ops Cold War', 'bocw.jpg', '2020-11-13', 4.00,
'Call of Duty: Black Ops Cold War is a first-person shooter developed by Treyarch and Raven Software, published by Activision in 2020.
Set during the early 1980s Cold War, the campaign features a fictionalized hunt for a mysterious Soviet agent called Perseus.
The story incorporates real historical figures including President Reagan and features branching dialogue and multiple endings.
Multiplayer integrates with Warzone, the free-to-play battle royale, sharing progression and cosmetics across both games.
Zombies mode returns with a new round-based map and an open-world Outbreak mode across multiple large-scale environments.
The game was one of the top-selling titles of 2020 and received positive reception for its campaign and Zombies content.
Available through Battle.net.',
9),

-- ---- NINTENDO (Cat 10) — 10 new games (G105-G114) ----
-- G105
('The Legend of Zelda: Breath of the Wild', 'botw.jpg', '2017-03-03', 4.95,
'The Legend of Zelda: Breath of the Wild is an open-world action-adventure game developed and published by Nintendo, released in March 2017.
Set in the kingdom of Hyrule 100 years after a great calamity, players control Link as he explores the world and defeats Calamity Ganon.
The game revolutionized open-world design with its physics engine, chemistry system, and commitment to player freedom.
Nearly every element of the environment can be interacted with — trees fall, metal conducts lightning, and fire spreads in the wind.
120 Shrine puzzles scattered across the map offer compact self-contained challenges rewarding exploration.
The game can be completed after a short tutorial section, allowing players to go straight to the final boss if they choose.
Available exclusively for Nintendo Switch.',
10),

-- G106
('The Legend of Zelda: Tears of the Kingdom', 'totk.jpg', '2023-05-12', 4.95,
'The Legend of Zelda: Tears of the Kingdom is an open-world action-adventure game developed and published by Nintendo, released in May 2023.
The direct sequel to Breath of the Wild expands the playable space to include sky islands above Hyrule and underground depths below.
Ultrahand allows Link to attach and manipulate objects freely, enabling construction of vehicles, weapons, and Rube Goldberg machines.
Fuse merges items with weapons and shields, creating an infinite variety of weapon types from materials found in the environment.
Ascend lets Link travel vertically through solid ceilings, dramatically opening up traversal across the world.
The game received near-universal critical acclaim and is considered one of the finest games ever made on any platform.
Available exclusively for Nintendo Switch.',
10),

-- G107
('Super Mario Odyssey', 'smo.jpg', '2017-10-27', 4.92,
'Super Mario Odyssey is a 3D platformer developed and published by Nintendo, released in October 2017 for Nintendo Switch.
Mario travels across diverse kingdoms with his new companion Cappy, a sentient hat that can capture enemies and objects.
The Capture mechanic allows Mario to inhabit hundreds of different creatures and objects, each with unique controls and abilities.
Kingdoms range from photorealistic New Donk City to cartoon-stylized food and fashion themed worlds, offering stunning variety.
Power Moons replace Stars as the primary collectible, with over 800 scattered across all kingdoms for completionists.
Super Mario Odyssey won multiple Game of the Year awards and is considered one of the finest Mario games ever created.
Available exclusively for Nintendo Switch.',
10),

-- G108
('Animal Crossing: New Horizons', 'acnh.jpg', '2020-03-20', 4.75,
'Animal Crossing: New Horizons is a social simulation game developed and published by Nintendo, released in March 2020.
Players move to a deserted island and develop it over time into a thriving community through daily activities and crafting.
The game runs on a real-time clock — seasons, weather, and events change with the actual time of year in the player`s location.
A crafting system allows players to create furniture, tools, and decorations from materials gathered around the island.
Online multiplayer allows up to eight players to visit each other`s islands, trade items, and explore together.
New Horizons became a cultural phenomenon during the COVID-19 pandemic, providing community and comfort to millions.
Available exclusively for Nintendo Switch.',
10),

-- G109
('Pokemon Scarlet and Violet', 'poke_sv.jpg', '2022-11-18', 3.90,
'Pokemon Scarlet and Violet are open-world RPGs developed by Game Freak and published by Nintendo and The Pokemon Company.
Set in the Paldea region inspired by the Iberian Peninsula, players explore freely from the very beginning of the game.
Three storylines run simultaneously — the traditional gym challenge, a treasure hunt through Titan Pokemon, and a Team Star conflict.
New Pokemon types and regional forms expand the roster of creatures available to catch and battle in the Paldea region.
The Terastal phenomenon allows Pokemon to change type in battle, adding a strategic layer to competitive and in-game combat.
Four-player online co-op exploration was a first for the series, allowing friends to explore the open world together.
Available exclusively for Nintendo Switch.',
10),

-- G110
('Fire Emblem: Three Houses', 'fe3h.jpg', '2019-07-26', 4.70,
'Fire Emblem: Three Houses is a tactical RPG developed by Intelligent Systems and Koei Tecmo, published by Nintendo in July 2019.
Players take the role of Byleth, a professor at the Officer`s Academy of Garreg Mach Monastery in the land of Fodlan.
Three houses — Black Eagles, Blue Lions, and Golden Deer — each have their own students, lords, and storylines.
The choice of house at the beginning fundamentally changes the narrative, characters, and even the enemies of the game.
Between battles, players spend time teaching, fishing, cooking, and building relationships with students in the Academy.
The Crimson Flower route and subsequent Verdant Wind and Azure Moon paths offer dramatically different experiences.
Available exclusively for Nintendo Switch.',
10),

-- G111
('Splatoon 3', 'splatoon3.jpg', '2022-09-09', 4.45,
'Splatoon 3 is a third-person shooter developed and published by Nintendo, released in September 2022 for Nintendo Switch.
Players control Inklings and Octolings who battle by covering territory with colored ink rather than eliminating opponents.
The flagship Turf War mode pits two teams of four against each other to cover the most ground with their team`s ink.
Ranked modes include Splat Zones, Tower Control, Rainmaker, and Clam Blitz, each with distinct objective-based gameplay.
Salmon Run co-op returns as a wave-based cooperative mode where four players gather golden eggs from Salmonid bosses.
A story mode and the Return of the Mammalians narrative campaign provide dozens of hours of single-player content.
Available exclusively for Nintendo Switch.',
10),

-- G112
('Kirby and the Forgotten Land', 'kirby_fl.jpg', '2022-03-25', 4.70,
'Kirby and the Forgotten Land is a 3D action platformer developed by HAL Laboratory and published by Nintendo, released in March 2022.
It is Kirby`s first fully three-dimensional adventure, set in a mysterious post-apocalyptic world overrun by nature.
Kirby`s iconic Copy Ability returns, allowing him to absorb enemies and steal their powers — over 25 abilities are available.
Mouthful Mode is a new mechanic allowing Kirby to inhale large real-world objects like cars, vending machines, and traffic cones.
The game supports two-player local co-op, with the second player controlling Bandana Waddle Dee with a spear.
Kirby and the Forgotten Land was praised for its accessibility, creativity, and genuine emotional story.
Available exclusively for Nintendo Switch.',
10),

-- G113
('Pikmin 4', 'pikmin4.jpg', '2023-07-21', 4.55,
'Pikmin 4 is a real-time strategy adventure game developed and published by Nintendo, released in July 2023.
Players command colorful creatures called Pikmin to solve puzzles, defeat enemies, and collect items in a miniaturized world.
Ten types of Pikmin each have distinct abilities — Red Pikmin are stronger, Blue can swim, Ice Pikmin freeze enemies, and so on.
Oatchi, a rideable dog companion, adds new mobility and combat options and can be upgraded throughout the game.
The game introduces night expeditions, a new mode where players defend against waves of Glow Pikmin-stealing nocturnal creatures.
Pikmin 4 is the most accessible entry in the series while offering depth for longtime fans through post-game challenges.
Available exclusively for Nintendo Switch.',
10),

-- G114
('Mario Kart 8 Deluxe', 'mk8d.jpg', '2017-04-28', 4.80,
'Mario Kart 8 Deluxe is a kart racing game developed and published by Nintendo, released for Nintendo Switch in April 2017.
It is the enhanced port of Mario Kart 8 with all DLC included and features a revamped Battle Mode with five dedicated arenas.
The game features 42 race tracks in the base game, with the Booster Course Pass adding 48 more courses across six waves.
Up to four players can race locally on a single Switch or online against 12 racers from around the world.
The Booster Course Pass brings tracks from past Mario Kart games as well as Tour, covering nearly the entire franchise history.
Mario Kart 8 Deluxe is the best-selling Nintendo Switch game with over 67 million copies sold.
Available exclusively for Nintendo Switch.',
10);

INSERT INTO price_history (game_id, price, recorded_date) VALUES

-- ---- STEAM (G01-G29) ----
-- G01 Elden Ring
(1, 59.99, '2022-02-25 00:00:00'),
(1, 49.99, '2022-09-01 00:00:00'),
(1, 39.99, '2023-06-15 00:00:00'),
(1, 29.99, '2024-01-01 00:00:00'),

-- G02 Cyberpunk 2077
(2, 59.99, '2020-12-10 00:00:00'),
(2, 39.99, '2021-07-01 00:00:00'),
(2, 29.99, '2022-03-01 00:00:00'),
(2, 19.99, '2023-08-01 00:00:00'),
(2, 15.99, '2024-06-01 00:00:00'),

-- G03 Hollow Knight
(3, 14.99, '2017-02-24 00:00:00'),
(3, 11.99, '2019-01-01 00:00:00'),
(3,  9.99, '2021-06-01 00:00:00'),

-- G04 Hades
(4, 24.99, '2020-09-17 00:00:00'),
(4, 19.99, '2021-06-01 00:00:00'),
(4, 14.99, '2022-12-01 00:00:00'),

-- G05 Counter-Strike 2
(5,  0.00, '2023-09-27 00:00:00'),  -- free-to-play

-- G06 Stardew Valley
(6, 14.99, '2016-02-26 00:00:00'),
(6, 13.99, '2018-01-01 00:00:00'),
(6, 11.99, '2020-01-01 00:00:00'),

-- G07 The Witcher 3: Wild Hunt
(7, 39.99, '2015-05-19 00:00:00'),
(7, 29.99, '2016-06-01 00:00:00'),
(7, 19.99, '2018-01-01 00:00:00'),
(7,  9.99, '2021-01-01 00:00:00'),

-- G08 Minecraft
(8, 26.95, '2014-11-18 00:00:00'),
(8, 26.95, '2018-01-01 00:00:00'),
(8, 29.99, '2022-06-01 00:00:00'),

-- G09 Resident Evil 4 Remake
(9, 59.99, '2023-03-24 00:00:00'),
(9, 49.99, '2023-09-01 00:00:00'),
(9, 39.99, '2024-03-01 00:00:00'),

-- G10 Celeste
(10, 19.99, '2018-01-25 00:00:00'),
(10, 14.99, '2019-06-01 00:00:00'),
(10,  9.99, '2021-01-01 00:00:00'),

-- G11 Red Dead Redemption 2
(11, 59.99, '2018-10-26 00:00:00'),
(11, 39.99, '2019-11-01 00:00:00'),
(11, 29.99, '2021-06-01 00:00:00'),
(11, 19.99, '2023-01-01 00:00:00'),

-- G12 God of War Ragnarok
(12, 69.99, '2022-11-09 00:00:00'),
(12, 59.99, '2023-06-01 00:00:00'),
(12, 49.99, '2024-01-01 00:00:00'),

-- G13 Dark Souls III
(13, 59.99, '2016-03-24 00:00:00'),
(13, 39.99, '2017-06-01 00:00:00'),
(13, 19.99, '2020-01-01 00:00:00'),

-- G14 Sekiro: Shadows Die Twice
(14, 59.99, '2019-03-22 00:00:00'),
(14, 49.99, '2020-01-01 00:00:00'),
(14, 39.99, '2022-01-01 00:00:00'),

-- G15 Baldur's Gate 3
(15, 59.99, '2023-08-03 00:00:00'),
(15, 54.99, '2024-01-01 00:00:00'),

-- G16 Horizon Zero Dawn
(16, 59.99, '2017-02-28 00:00:00'),
(16, 39.99, '2018-01-01 00:00:00'),
(16, 19.99, '2020-06-01 00:00:00'),
(16,  9.99, '2022-01-01 00:00:00'),

-- G17 Death Stranding
(17, 59.99, '2019-11-08 00:00:00'),
(17, 39.99, '2020-07-01 00:00:00'),
(17, 24.99, '2021-06-01 00:00:00'),

-- G18 Persona 5 Royal
(18, 59.99, '2020-10-22 00:00:00'),
(18, 49.99, '2021-06-01 00:00:00'),
(18, 39.99, '2022-10-01 00:00:00'),

-- G19 Monster Hunter World
(19, 59.99, '2018-01-26 00:00:00'),
(19, 39.99, '2019-01-01 00:00:00'),
(19, 29.99, '2021-01-01 00:00:00'),

-- G20 Divinity: Original Sin 2
(20, 44.99, '2017-09-14 00:00:00'),
(20, 34.99, '2018-06-01 00:00:00'),
(20, 24.99, '2020-01-01 00:00:00'),

-- G21 Disco Elysium
(21, 39.99, '2019-10-15 00:00:00'),
(21, 29.99, '2020-06-01 00:00:00'),
(21, 19.99, '2022-01-01 00:00:00'),

-- G22 DOOM Eternal
(22, 59.99, '2020-03-20 00:00:00'),
(22, 39.99, '2020-12-01 00:00:00'),
(22, 29.99, '2022-01-01 00:00:00'),

-- G23 Terraria
(23,  9.99, '2011-05-16 00:00:00'),
(23,  9.99, '2016-01-01 00:00:00'),
(23,  9.99, '2024-01-01 00:00:00'),

-- G24 Path of Exile
(24,  0.00, '2013-10-23 00:00:00'),  -- free-to-play

-- G25 Factorio
(25, 30.00, '2020-08-14 00:00:00'),
(25, 35.00, '2022-01-01 00:00:00'),  -- price raised post-1.0

-- G26 Subnautica
(26, 29.99, '2018-01-23 00:00:00'),
(26, 24.99, '2019-06-01 00:00:00'),
(26, 19.99, '2021-01-01 00:00:00'),

-- G27 Outer Wilds
(27, 24.99, '2019-05-28 00:00:00'),
(27, 19.99, '2020-06-01 00:00:00'),
(27, 14.99, '2022-01-01 00:00:00'),

-- G28 Return of the Obra Dinn
(28, 19.99, '2018-10-18 00:00:00'),
(28, 14.99, '2020-01-01 00:00:00'),

-- G29 Disco Elysium: The Final Cut
(29, 39.99, '2021-03-30 00:00:00'),
(29, 29.99, '2022-01-01 00:00:00'),
(29, 19.99, '2023-06-01 00:00:00'),

-- ---- WINDOWS STORE (G30-G31) ----
-- G30 Ori and the Blind Forest
(30, 19.99, '2015-03-11 00:00:00'),
(30, 14.99, '2017-01-01 00:00:00'),
(30,  9.99, '2020-01-01 00:00:00'),

-- G31 Cuphead
(31, 19.99, '2017-09-29 00:00:00'),
(31, 19.99, '2022-01-01 00:00:00'),

-- ---- STEAM cont. (G32-G50) ----
-- G32 Shovel Knight
(32, 24.99, '2014-06-26 00:00:00'),
(32, 19.99, '2018-01-01 00:00:00'),

-- G33 Undertale
(33,  9.99, '2015-09-15 00:00:00'),
(33,  9.99, '2020-01-01 00:00:00'),

-- G34 Titanfall 2
(34, 59.99, '2016-10-28 00:00:00'),
(34, 29.99, '2017-06-01 00:00:00'),
(34,  9.99, '2020-01-01 00:00:00'),
(34,  4.99, '2022-01-01 00:00:00'),

-- G35 Doom (2016)
(35, 59.99, '2016-05-13 00:00:00'),
(35, 29.99, '2017-01-01 00:00:00'),
(35, 19.99, '2019-01-01 00:00:00'),

-- G36 Star Wars Jedi: Survivor
(36, 69.99, '2023-04-28 00:00:00'),
(36, 49.99, '2023-11-01 00:00:00'),
(36, 39.99, '2024-06-01 00:00:00'),

-- G37 Mass Effect Legendary Edition
(37, 59.99, '2021-05-14 00:00:00'),
(37, 39.99, '2022-01-01 00:00:00'),
(37, 29.99, '2023-06-01 00:00:00'),

-- G38 Spiritfarer
(38, 29.99, '2020-08-18 00:00:00'),
(38, 19.99, '2021-06-01 00:00:00'),

-- G39 Vampire Survivors
(39,  4.99, '2022-10-20 00:00:00'),
(39,  4.99, '2024-01-01 00:00:00'),

-- G40 It Takes Two
(40, 39.99, '2021-03-26 00:00:00'),
(40, 29.99, '2022-06-01 00:00:00'),
(40, 19.99, '2023-06-01 00:00:00'),

-- G41 Tunic
(41, 29.99, '2022-03-16 00:00:00'),
(41, 24.99, '2023-01-01 00:00:00'),

-- G42 Sifu
(42, 39.99, '2022-02-08 00:00:00'),
(42, 29.99, '2023-01-01 00:00:00'),

-- G43 Deathloop
(43, 59.99, '2021-09-14 00:00:00'),
(43, 29.99, '2022-06-01 00:00:00'),
(43, 19.99, '2023-06-01 00:00:00'),

-- G44 Ghostrunner
(44, 29.99, '2020-10-27 00:00:00'),
(44, 19.99, '2021-06-01 00:00:00'),

-- G45 Valheim
(45, 19.99, '2021-02-02 00:00:00'),
(45, 19.99, '2024-01-01 00:00:00'),

-- G46 Deep Rock Galactic
(46, 29.99, '2020-05-13 00:00:00'),
(46, 24.99, '2021-06-01 00:00:00'),

-- G47 Phasmophobia
(47, 13.99, '2020-09-18 00:00:00'),
(47, 13.99, '2024-01-01 00:00:00'),

-- ---- WINDOWS STORE (G48) ----
-- G48 Forza Horizon 5
(48, 59.99, '2021-11-09 00:00:00'),
(48, 49.99, '2022-11-01 00:00:00'),
(48, 39.99, '2024-01-01 00:00:00'),

-- ---- STEAM cont. (G49-G50) ----
-- G49 Slay the Spire
(49, 24.99, '2019-01-23 00:00:00'),
(49, 19.99, '2021-01-01 00:00:00'),

-- G50 Neon White
(50, 24.99, '2022-06-16 00:00:00'),
(50, 19.99, '2023-06-01 00:00:00'),

-- ---- XBOX LIVE (G51-G60) ----
-- G51 Halo Infinite
(51, 59.99, '2021-12-08 00:00:00'),
(51, 39.99, '2022-06-01 00:00:00'),
(51,  0.00, '2023-01-01 00:00:00'),  -- campaign went free-to-play

-- G52 Gears 5
(52, 59.99, '2019-09-10 00:00:00'),
(52, 29.99, '2020-09-01 00:00:00'),
(52, 19.99, '2022-01-01 00:00:00'),

-- G53 Forza Motorsport (2023)
(53, 69.99, '2023-10-10 00:00:00'),
(53, 59.99, '2024-03-01 00:00:00'),
(53, 49.99, '2024-09-01 00:00:00'),

-- G54 Sea of Thieves
(54, 39.99, '2018-03-20 00:00:00'),
(54, 39.99, '2020-01-01 00:00:00'),
(54, 39.99, '2024-01-01 00:00:00'),

-- G55 Grounded
(55, 29.99, '2020-07-28 00:00:00'),
(55, 39.99, '2022-09-27 00:00:00'),  -- price raised on full release
(55, 39.99, '2024-01-01 00:00:00'),

-- G56 Psychonauts 2
(56, 59.99, '2021-08-25 00:00:00'),
(56, 39.99, '2022-06-01 00:00:00'),
(56, 29.99, '2023-06-01 00:00:00'),

-- G57 Ori and the Will of the Wisps
(57, 29.99, '2020-03-11 00:00:00'),
(57, 19.99, '2021-06-01 00:00:00'),
(57,  9.99, '2023-01-01 00:00:00'),

-- G58 Fable Anniversary
(58, 24.99, '2014-09-12 00:00:00'),
(58, 14.99, '2017-01-01 00:00:00'),
(58,  9.99, '2020-01-01 00:00:00'),

-- G59 State of Decay 2
(59, 29.99, '2018-05-22 00:00:00'),
(59, 29.99, '2020-03-26 00:00:00'),  -- Juggernaut Edition
(59, 19.99, '2022-01-01 00:00:00'),

-- G60 Rare Replay
(60, 29.99, '2015-08-04 00:00:00'),
(60, 19.99, '2018-01-01 00:00:00'),
(60, 14.99, '2021-01-01 00:00:00'),

-- ---- ORIGIN GAMES (G61-G70) ----
-- G61 The Sims 4
(61, 39.99, '2014-09-02 00:00:00'),
(61, 19.99, '2018-01-01 00:00:00'),
(61,  0.00, '2022-10-18 00:00:00'),  -- went free-to-play

-- G62 Dragon Age: Origins
(62, 49.99, '2009-11-03 00:00:00'),
(62, 19.99, '2011-01-01 00:00:00'),
(62,  9.99, '2014-01-01 00:00:00'),
(62,  4.99, '2020-01-01 00:00:00'),

-- G63 Mass Effect 2
(63, 59.99, '2010-01-26 00:00:00'),
(63, 19.99, '2012-01-01 00:00:00'),
(63,  9.99, '2016-01-01 00:00:00'),
(63,  4.99, '2021-01-01 00:00:00'),

-- G64 Dragon Age: Inquisition
(64, 59.99, '2014-11-18 00:00:00'),
(64, 39.99, '2015-06-01 00:00:00'),
(64, 19.99, '2017-01-01 00:00:00'),
(64,  9.99, '2021-01-01 00:00:00'),

-- G65 Battlefield 1
(65, 59.99, '2016-10-21 00:00:00'),
(65, 39.99, '2017-06-01 00:00:00'),
(65, 19.99, '2019-01-01 00:00:00'),
(65,  4.99, '2022-01-01 00:00:00'),

-- G66 Battlefield V
(66, 59.99, '2018-11-20 00:00:00'),
(66, 39.99, '2019-06-01 00:00:00'),
(66, 19.99, '2021-01-01 00:00:00'),
(66,  4.99, '2023-01-01 00:00:00'),

-- G67 Need for Speed Heat
(67, 59.99, '2019-11-08 00:00:00'),
(67, 39.99, '2020-06-01 00:00:00'),
(67, 19.99, '2022-01-01 00:00:00'),

-- G68 Star Wars Jedi: Fallen Order
(68, 59.99, '2019-11-15 00:00:00'),
(68, 39.99, '2020-06-01 00:00:00'),
(68, 19.99, '2022-01-01 00:00:00'),
(68,  9.99, '2023-06-01 00:00:00'),

-- G69 Apex Legends
(69,  0.00, '2019-02-04 00:00:00'),  -- free-to-play at launch

-- G70 A Way Out
(70, 29.99, '2018-03-23 00:00:00'),
(70, 19.99, '2019-06-01 00:00:00'),
(70, 14.99, '2021-01-01 00:00:00'),

-- ---- UBISOFT CONNECT (G71-G80) ----
-- G71 Assassin's Creed Odyssey
(71, 59.99, '2018-10-05 00:00:00'),
(71, 39.99, '2019-06-01 00:00:00'),
(71, 19.99, '2021-01-01 00:00:00'),
(71,  9.99, '2023-01-01 00:00:00'),

-- G72 Assassin's Creed Valhalla
(72, 59.99, '2020-11-10 00:00:00'),
(72, 39.99, '2021-11-01 00:00:00'),
(72, 29.99, '2023-01-01 00:00:00'),

-- G73 Far Cry 5
(73, 59.99, '2018-03-27 00:00:00'),
(73, 39.99, '2019-01-01 00:00:00'),
(73, 19.99, '2021-01-01 00:00:00'),
(73,  9.99, '2023-01-01 00:00:00'),

-- G74 Far Cry 6
(74, 59.99, '2021-10-07 00:00:00'),
(74, 39.99, '2022-06-01 00:00:00'),
(74, 29.99, '2023-06-01 00:00:00'),

-- G75 Rainbow Six Siege
(75, 19.99, '2015-12-01 00:00:00'),
(75, 14.99, '2018-01-01 00:00:00'),
(75,  9.99, '2020-01-01 00:00:00'),  -- Standard Edition price drop

-- G76 Watch Dogs 2
(76, 59.99, '2016-11-15 00:00:00'),
(76, 29.99, '2017-06-01 00:00:00'),
(76, 14.99, '2020-01-01 00:00:00'),
(76,  9.99, '2022-01-01 00:00:00'),

-- G77 For Honor
(77, 59.99, '2017-02-14 00:00:00'),
(77, 29.99, '2018-01-01 00:00:00'),
(77, 14.99, '2020-01-01 00:00:00'),

-- G78 Immortals Fenyx Rising
(78, 59.99, '2020-12-03 00:00:00'),
(78, 39.99, '2021-06-01 00:00:00'),
(78, 19.99, '2023-01-01 00:00:00'),

-- G79 The Crew 2
(79, 49.99, '2018-06-29 00:00:00'),
(79, 29.99, '2019-06-01 00:00:00'),
(79, 14.99, '2022-01-01 00:00:00'),

-- G80 Ghost Recon Wildlands
(80, 59.99, '2017-03-07 00:00:00'),
(80, 39.99, '2018-01-01 00:00:00'),
(80, 19.99, '2020-01-01 00:00:00'),
(80,  9.99, '2022-01-01 00:00:00'),

-- ---- EA APP additional (G81-G84) ----
-- G81 FIFA 23
(81, 69.99, '2022-09-30 00:00:00'),
(81, 39.99, '2023-06-01 00:00:00'),
(81, 19.99, '2024-01-01 00:00:00'),

-- G82 NHL 24
(82, 69.99, '2023-10-06 00:00:00'),
(82, 49.99, '2024-03-01 00:00:00'),

-- G83 F1 23
(83, 69.99, '2023-06-16 00:00:00'),
(83, 39.99, '2024-01-01 00:00:00'),
(83, 29.99, '2024-06-01 00:00:00'),

-- G84 Madden NFL 24
(84, 69.99, '2023-08-18 00:00:00'),
(84, 39.99, '2024-02-01 00:00:00'),
(84, 19.99, '2024-08-01 00:00:00'),

-- ---- WINDOWS STORE additional (G85-G89) ----
-- G85 Age of Empires IV
(85, 59.99, '2021-10-28 00:00:00'),
(85, 39.99, '2022-10-01 00:00:00'),
(85, 29.99, '2024-01-01 00:00:00'),

-- G86 Microsoft Flight Simulator 2020
(86, 59.99, '2020-08-18 00:00:00'),
(86, 49.99, '2022-01-01 00:00:00'),
(86, 39.99, '2024-01-01 00:00:00'),

-- G87 Halo: The Master Chief Collection
(87, 39.99, '2019-12-03 00:00:00'),
(87, 29.99, '2021-01-01 00:00:00'),
(87, 19.99, '2023-01-01 00:00:00'),

-- G88 Gears of War 4
(88, 59.99, '2016-10-11 00:00:00'),
(88, 29.99, '2018-01-01 00:00:00'),
(88, 19.99, '2021-01-01 00:00:00'),

-- G89 Minecraft Dungeons
(89, 19.99, '2020-05-26 00:00:00'),
(89, 19.99, '2022-01-01 00:00:00'),

-- ---- ROCKSTAR GAMES additional (G90-G94) ----
-- G90 Grand Theft Auto V
(90, 59.99, '2013-09-17 00:00:00'),
(90, 29.99, '2015-04-14 00:00:00'),  -- PC release
(90, 19.99, '2018-01-01 00:00:00'),
(90,  9.99, '2021-01-01 00:00:00'),

-- G91 Max Payne 3
(91, 29.99, '2012-05-15 00:00:00'),
(91, 19.99, '2014-01-01 00:00:00'),
(91,  9.99, '2018-01-01 00:00:00'),

-- G92 L.A. Noire
(92, 29.99, '2011-05-17 00:00:00'),
(92, 19.99, '2014-01-01 00:00:00'),
(92,  9.99, '2017-01-01 00:00:00'),

-- G93 Bully: Scholarship Edition
(93, 19.99, '2008-10-21 00:00:00'),
(93,  9.99, '2012-01-01 00:00:00'),
(93,  6.99, '2018-01-01 00:00:00'),

-- G94 Midnight Club: Los Angeles
(94, 29.99, '2009-01-01 00:00:00'),  -- PC release
(94, 14.99, '2012-01-01 00:00:00'),
(94,  7.99, '2016-01-01 00:00:00'),

-- ---- BATTLE.NET (G95-G104) ----
-- G95 Overwatch 2
(95,  0.00, '2022-10-04 00:00:00'),  -- free-to-play

-- G96 World of Warcraft
(96, 14.99, '2004-11-23 00:00:00'),  -- original box price (monthly sub)
(96, 14.99, '2015-01-01 00:00:00'),  -- subscription model ongoing
(96,  0.00, '2021-01-01 00:00:00'),  -- base game free, sub still required

-- G97 Diablo IV
(97, 69.99, '2023-06-06 00:00:00'),
(97, 49.99, '2024-01-01 00:00:00'),
(97, 39.99, '2024-06-01 00:00:00'),

-- G98 StarCraft II
(98, 39.99, '2010-07-27 00:00:00'),
(98, 19.99, '2013-01-01 00:00:00'),
(98,  0.00, '2017-11-14 00:00:00'),  -- went free-to-play

-- G99 Hearthstone
(99,  0.00, '2014-03-11 00:00:00'),  -- free-to-play at launch

-- G100 Heroes of the Storm
(100,  0.00, '2015-06-02 00:00:00'),  -- free-to-play at launch

-- G101 Diablo III: Reaper of Souls
(101, 59.99, '2012-05-15 00:00:00'),
(101, 39.99, '2014-03-25 00:00:00'),  -- RoS expansion release
(101, 19.99, '2017-01-01 00:00:00'),
(101,  9.99, '2021-01-01 00:00:00'),

-- G102 Warcraft III: Reforged
(102, 29.99, '2020-01-28 00:00:00'),
(102, 29.99, '2022-01-01 00:00:00'),

-- G103 Overwatch (Original)
(103, 39.99, '2016-05-24 00:00:00'),
(103, 19.99, '2018-01-01 00:00:00'),
(103,  0.00, '2022-10-04 00:00:00'),  -- sunset, replaced by OW2

-- G104 Call of Duty: Black Ops Cold War
(104, 69.99, '2020-11-13 00:00:00'),
(104, 39.99, '2021-11-01 00:00:00'),
(104, 29.99, '2023-01-01 00:00:00'),

-- ---- NINTENDO (G105-G114) ----
-- G105 The Legend of Zelda: Breath of the Wild
(105, 59.99, '2017-03-03 00:00:00'),
(105, 59.99, '2020-01-01 00:00:00'),  -- Nintendo rarely discounts
(105, 59.99, '2024-01-01 00:00:00'),

-- G106 The Legend of Zelda: Tears of the Kingdom
(106, 69.99, '2023-05-12 00:00:00'),
(106, 69.99, '2024-01-01 00:00:00'),

-- G107 Super Mario Odyssey
(107, 59.99, '2017-10-27 00:00:00'),
(107, 59.99, '2020-01-01 00:00:00'),
(107, 41.99, '2023-01-01 00:00:00'),  -- Nintendo Selects pricing

-- G108 Animal Crossing: New Horizons
(108, 59.99, '2020-03-20 00:00:00'),
(108, 59.99, '2022-01-01 00:00:00'),
(108, 41.99, '2024-01-01 00:00:00'),

-- G109 Pokemon Scarlet and Violet
(109, 59.99, '2022-11-18 00:00:00'),
(109, 49.99, '2024-01-01 00:00:00'),

-- G110 Fire Emblem: Three Houses
(110, 59.99, '2019-07-26 00:00:00'),
(110, 59.99, '2021-01-01 00:00:00'),
(110, 41.99, '2023-06-01 00:00:00'),

-- G111 Splatoon 3
(111, 59.99, '2022-09-09 00:00:00'),
(111, 59.99, '2023-06-01 00:00:00'),
(111, 41.99, '2024-06-01 00:00:00'),

-- G112 Kirby and the Forgotten Land
(112, 59.99, '2022-03-25 00:00:00'),
(112, 59.99, '2023-01-01 00:00:00'),
(112, 41.99, '2024-01-01 00:00:00'),

-- G113 Pikmin 4
(113, 59.99, '2023-07-21 00:00:00'),
(113, 59.99, '2024-01-01 00:00:00'),

-- G114 Mario Kart 8 Deluxe
(114, 59.99, '2017-04-28 00:00:00'),
(114, 59.99, '2020-01-01 00:00:00'),
(114, 41.99, '2023-06-01 00:00:00');


INSERT INTO digital_keys (order_item_id, key_code, game_id, status, sold_date) VALUES
(NULL,'G001-K001',1,'available',NULL),(NULL,'G001-K002',1,'available',NULL),(NULL,'G001-K003',1,'available',NULL),(NULL,'G001-K004',1,'available',NULL),(NULL,'G001-K005',1,'available',NULL),
(NULL,'G002-K001',2,'available',NULL),(NULL,'G002-K002',2,'available',NULL),(NULL,'G002-K003',2,'available',NULL),(NULL,'G002-K004',2,'available',NULL),(NULL,'G002-K005',2,'available',NULL),
(NULL,'G003-K001',3,'available',NULL),(NULL,'G003-K002',3,'available',NULL),(NULL,'G003-K003',3,'available',NULL),(NULL,'G003-K004',3,'available',NULL),(NULL,'G003-K005',3,'available',NULL),
(NULL,'G004-K001',4,'available',NULL),(NULL,'G004-K002',4,'available',NULL),(NULL,'G004-K003',4,'available',NULL),(NULL,'G004-K004',4,'available',NULL),(NULL,'G004-K005',4,'available',NULL),
(NULL,'G005-K001',5,'available',NULL),(NULL,'G005-K002',5,'available',NULL),(NULL,'G005-K003',5,'available',NULL),(NULL,'G005-K004',5,'available',NULL),(NULL,'G005-K005',5,'available',NULL),
(NULL,'G006-K001',6,'available',NULL),(NULL,'G006-K002',6,'available',NULL),(NULL,'G006-K003',6,'available',NULL),(NULL,'G006-K004',6,'available',NULL),(NULL,'G006-K005',6,'available',NULL),
(NULL,'G007-K001',7,'available',NULL),(NULL,'G007-K002',7,'available',NULL),(NULL,'G007-K003',7,'available',NULL),(NULL,'G007-K004',7,'available',NULL),(NULL,'G007-K005',7,'available',NULL),
(NULL,'G008-K001',8,'available',NULL),(NULL,'G008-K002',8,'available',NULL),(NULL,'G008-K003',8,'available',NULL),(NULL,'G008-K004',8,'available',NULL),(NULL,'G008-K005',8,'available',NULL),
(NULL,'G009-K001',9,'available',NULL),(NULL,'G009-K002',9,'available',NULL),(NULL,'G009-K003',9,'available',NULL),(NULL,'G009-K004',9,'available',NULL),(NULL,'G009-K005',9,'available',NULL),
(NULL,'G010-K001',10,'available',NULL),(NULL,'G010-K002',10,'available',NULL),(NULL,'G010-K003',10,'available',NULL),(NULL,'G010-K004',10,'available',NULL),(NULL,'G010-K005',10,'available',NULL),
(NULL,'G011-K001',11,'available',NULL),(NULL,'G011-K002',11,'available',NULL),(NULL,'G011-K003',11,'available',NULL),(NULL,'G011-K004',11,'available',NULL),(NULL,'G011-K005',11,'available',NULL),
(NULL,'G012-K001',12,'available',NULL),(NULL,'G012-K002',12,'available',NULL),(NULL,'G012-K003',12,'available',NULL),(NULL,'G012-K004',12,'available',NULL),(NULL,'G012-K005',12,'available',NULL),
(NULL,'G013-K001',13,'available',NULL),(NULL,'G013-K002',13,'available',NULL),(NULL,'G013-K003',13,'available',NULL),(NULL,'G013-K004',13,'available',NULL),(NULL,'G013-K005',13,'available',NULL),
(NULL,'G014-K001',14,'available',NULL),(NULL,'G014-K002',14,'available',NULL),(NULL,'G014-K003',14,'available',NULL),(NULL,'G014-K004',14,'available',NULL),(NULL,'G014-K005',14,'available',NULL),
(NULL,'G015-K001',15,'available',NULL),(NULL,'G015-K002',15,'available',NULL),(NULL,'G015-K003',15,'available',NULL),(NULL,'G015-K004',15,'available',NULL),(NULL,'G015-K005',15,'available',NULL),
(NULL,'G016-K001',16,'available',NULL),(NULL,'G016-K002',16,'available',NULL),(NULL,'G016-K003',16,'available',NULL),(NULL,'G016-K004',16,'available',NULL),(NULL,'G016-K005',16,'available',NULL),
(NULL,'G017-K001',17,'available',NULL),(NULL,'G017-K002',17,'available',NULL),(NULL,'G017-K003',17,'available',NULL),(NULL,'G017-K004',17,'available',NULL),(NULL,'G017-K005',17,'available',NULL),
(NULL,'G018-K001',18,'available',NULL),(NULL,'G018-K002',18,'available',NULL),(NULL,'G018-K003',18,'available',NULL),(NULL,'G018-K004',18,'available',NULL),(NULL,'G018-K005',18,'available',NULL),
(NULL,'G019-K001',19,'available',NULL),(NULL,'G019-K002',19,'available',NULL),(NULL,'G019-K003',19,'available',NULL),(NULL,'G019-K004',19,'available',NULL),(NULL,'G019-K005',19,'available',NULL),
(NULL,'G020-K001',20,'available',NULL),(NULL,'G020-K002',20,'available',NULL),(NULL,'G020-K003',20,'available',NULL),(NULL,'G020-K004',20,'available',NULL),(NULL,'G020-K005',20,'available',NULL),
(NULL,'G021-K001',21,'available',NULL),(NULL,'G021-K002',21,'available',NULL),(NULL,'G021-K003',21,'available',NULL),(NULL,'G021-K004',21,'available',NULL),(NULL,'G021-K005',21,'available',NULL),
(NULL,'G022-K001',22,'available',NULL),(NULL,'G022-K002',22,'available',NULL),(NULL,'G022-K003',22,'available',NULL),(NULL,'G022-K004',22,'available',NULL),(NULL,'G022-K005',22,'available',NULL),
(NULL,'G023-K001',23,'available',NULL),(NULL,'G023-K002',23,'available',NULL),(NULL,'G023-K003',23,'available',NULL),(NULL,'G023-K004',23,'available',NULL),(NULL,'G023-K005',23,'available',NULL),
(NULL,'G024-K001',24,'available',NULL),(NULL,'G024-K002',24,'available',NULL),(NULL,'G024-K003',24,'available',NULL),(NULL,'G024-K004',24,'available',NULL),(NULL,'G024-K005',24,'available',NULL),
(NULL,'G025-K001',25,'available',NULL),(NULL,'G025-K002',25,'available',NULL),(NULL,'G025-K003',25,'available',NULL),(NULL,'G025-K004',25,'available',NULL),(NULL,'G025-K005',25,'available',NULL),
(NULL,'G026-K001',26,'available',NULL),(NULL,'G026-K002',26,'available',NULL),(NULL,'G026-K003',26,'available',NULL),(NULL,'G026-K004',26,'available',NULL),(NULL,'G026-K005',26,'available',NULL),
(NULL,'G027-K001',27,'available',NULL),(NULL,'G027-K002',27,'available',NULL),(NULL,'G027-K003',27,'available',NULL),(NULL,'G027-K004',27,'available',NULL),(NULL,'G027-K005',27,'available',NULL),
(NULL,'G028-K001',28,'available',NULL),(NULL,'G028-K002',28,'available',NULL),(NULL,'G028-K003',28,'available',NULL),(NULL,'G028-K004',28,'available',NULL),(NULL,'G028-K005',28,'available',NULL),
(NULL,'G029-K001',29,'available',NULL),(NULL,'G029-K002',29,'available',NULL),(NULL,'G029-K003',29,'available',NULL),(NULL,'G029-K004',29,'available',NULL),(NULL,'G029-K005',29,'available',NULL),
(NULL,'G030-K001',30,'available',NULL),(NULL,'G030-K002',30,'available',NULL),(NULL,'G030-K003',30,'available',NULL),(NULL,'G030-K004',30,'available',NULL),(NULL,'G030-K005',30,'available',NULL),
(NULL,'G031-K001',31,'available',NULL),(NULL,'G031-K002',31,'available',NULL),(NULL,'G031-K003',31,'available',NULL),(NULL,'G031-K004',31,'available',NULL),(NULL,'G031-K005',31,'available',NULL),
(NULL,'G032-K001',32,'available',NULL),(NULL,'G032-K002',32,'available',NULL),(NULL,'G032-K003',32,'available',NULL),(NULL,'G032-K004',32,'available',NULL),(NULL,'G032-K005',32,'available',NULL),
(NULL,'G033-K001',33,'available',NULL),(NULL,'G033-K002',33,'available',NULL),(NULL,'G033-K003',33,'available',NULL),(NULL,'G033-K004',33,'available',NULL),(NULL,'G033-K005',33,'available',NULL),
(NULL,'G034-K001',34,'available',NULL),(NULL,'G034-K002',34,'available',NULL),(NULL,'G034-K003',34,'available',NULL),(NULL,'G034-K004',34,'available',NULL),(NULL,'G034-K005',34,'available',NULL),
(NULL,'G035-K001',35,'available',NULL),(NULL,'G035-K002',35,'available',NULL),(NULL,'G035-K003',35,'available',NULL),(NULL,'G035-K004',35,'available',NULL),(NULL,'G035-K005',35,'available',NULL),
(NULL,'G036-K001',36,'available',NULL),(NULL,'G036-K002',36,'available',NULL),(NULL,'G036-K003',36,'available',NULL),(NULL,'G036-K004',36,'available',NULL),(NULL,'G036-K005',36,'available',NULL),
(NULL,'G037-K001',37,'available',NULL),(NULL,'G037-K002',37,'available',NULL),(NULL,'G037-K003',37,'available',NULL),(NULL,'G037-K004',37,'available',NULL),(NULL,'G037-K005',37,'available',NULL),
(NULL,'G038-K001',38,'available',NULL),(NULL,'G038-K002',38,'available',NULL),(NULL,'G038-K003',38,'available',NULL),(NULL,'G038-K004',38,'available',NULL),(NULL,'G038-K005',38,'available',NULL),
(NULL,'G039-K001',39,'available',NULL),(NULL,'G039-K002',39,'available',NULL),(NULL,'G039-K003',39,'available',NULL),(NULL,'G039-K004',39,'available',NULL),(NULL,'G039-K005',39,'available',NULL),
(NULL,'G040-K001',40,'available',NULL),(NULL,'G040-K002',40,'available',NULL),(NULL,'G040-K003',40,'available',NULL),(NULL,'G040-K004',40,'available',NULL),(NULL,'G040-K005',40,'available',NULL),
(NULL,'G041-K001',41,'available',NULL),(NULL,'G041-K002',41,'available',NULL),(NULL,'G041-K003',41,'available',NULL),(NULL,'G041-K004',41,'available',NULL),(NULL,'G041-K005',41,'available',NULL),
(NULL,'G042-K001',42,'available',NULL),(NULL,'G042-K002',42,'available',NULL),(NULL,'G042-K003',42,'available',NULL),(NULL,'G042-K004',42,'available',NULL),(NULL,'G042-K005',42,'available',NULL),
(NULL,'G043-K001',43,'available',NULL),(NULL,'G043-K002',43,'available',NULL),(NULL,'G043-K003',43,'available',NULL),(NULL,'G043-K004',43,'available',NULL),(NULL,'G043-K005',43,'available',NULL),
(NULL,'G044-K001',44,'available',NULL),(NULL,'G044-K002',44,'available',NULL),(NULL,'G044-K003',44,'available',NULL),(NULL,'G044-K004',44,'available',NULL),(NULL,'G044-K005',44,'available',NULL),
(NULL,'G045-K001',45,'available',NULL),(NULL,'G045-K002',45,'available',NULL),(NULL,'G045-K003',45,'available',NULL),(NULL,'G045-K004',45,'available',NULL),(NULL,'G045-K005',45,'available',NULL),
(NULL,'G046-K001',46,'available',NULL),(NULL,'G046-K002',46,'available',NULL),(NULL,'G046-K003',46,'available',NULL),(NULL,'G046-K004',46,'available',NULL),(NULL,'G046-K005',46,'available',NULL),
(NULL,'G047-K001',47,'available',NULL),(NULL,'G047-K002',47,'available',NULL),(NULL,'G047-K003',47,'available',NULL),(NULL,'G047-K004',47,'available',NULL),(NULL,'G047-K005',47,'available',NULL),
(NULL,'G048-K001',48,'available',NULL),(NULL,'G048-K002',48,'available',NULL),(NULL,'G048-K003',48,'available',NULL),(NULL,'G048-K004',48,'available',NULL),(NULL,'G048-K005',48,'available',NULL),
(NULL,'G049-K001',49,'available',NULL),(NULL,'G049-K002',49,'available',NULL),(NULL,'G049-K003',49,'available',NULL),(NULL,'G049-K004',49,'available',NULL),(NULL,'G049-K005',49,'available',NULL),
(NULL,'G050-K001',50,'available',NULL),(NULL,'G050-K002',50,'available',NULL),(NULL,'G050-K003',50,'available',NULL),(NULL,'G050-K004',50,'available',NULL),(NULL,'G050-K005',50,'available',NULL),
-- G51-G60 Xbox Live
(NULL,'G051-K001',51,'available',NULL),(NULL,'G051-K002',51,'available',NULL),(NULL,'G051-K003',51,'available',NULL),(NULL,'G051-K004',51,'available',NULL),(NULL,'G051-K005',51,'available',NULL),
(NULL,'G052-K001',52,'available',NULL),(NULL,'G052-K002',52,'available',NULL),(NULL,'G052-K003',52,'available',NULL),(NULL,'G052-K004',52,'available',NULL),(NULL,'G052-K005',52,'available',NULL),
(NULL,'G053-K001',53,'available',NULL),(NULL,'G053-K002',53,'available',NULL),(NULL,'G053-K003',53,'available',NULL),(NULL,'G053-K004',53,'available',NULL),(NULL,'G053-K005',53,'available',NULL),
(NULL,'G054-K001',54,'available',NULL),(NULL,'G054-K002',54,'available',NULL),(NULL,'G054-K003',54,'available',NULL),(NULL,'G054-K004',54,'available',NULL),(NULL,'G054-K005',54,'available',NULL),
(NULL,'G055-K001',55,'available',NULL),(NULL,'G055-K002',55,'available',NULL),(NULL,'G055-K003',55,'available',NULL),(NULL,'G055-K004',55,'available',NULL),(NULL,'G055-K005',55,'available',NULL),
(NULL,'G056-K001',56,'available',NULL),(NULL,'G056-K002',56,'available',NULL),(NULL,'G056-K003',56,'available',NULL),(NULL,'G056-K004',56,'available',NULL),(NULL,'G056-K005',56,'available',NULL),
(NULL,'G057-K001',57,'available',NULL),(NULL,'G057-K002',57,'available',NULL),(NULL,'G057-K003',57,'available',NULL),(NULL,'G057-K004',57,'available',NULL),(NULL,'G057-K005',57,'available',NULL),
(NULL,'G058-K001',58,'available',NULL),(NULL,'G058-K002',58,'available',NULL),(NULL,'G058-K003',58,'available',NULL),(NULL,'G058-K004',58,'available',NULL),(NULL,'G058-K005',58,'available',NULL),
(NULL,'G059-K001',59,'available',NULL),(NULL,'G059-K002',59,'available',NULL),(NULL,'G059-K003',59,'available',NULL),(NULL,'G059-K004',59,'available',NULL),(NULL,'G059-K005',59,'available',NULL),
(NULL,'G060-K001',60,'available',NULL),(NULL,'G060-K002',60,'available',NULL),(NULL,'G060-K003',60,'available',NULL),(NULL,'G060-K004',60,'available',NULL),(NULL,'G060-K005',60,'available',NULL),
-- G61-G70 Origin Games
(NULL,'G061-K001',61,'available',NULL),(NULL,'G061-K002',61,'available',NULL),(NULL,'G061-K003',61,'available',NULL),(NULL,'G061-K004',61,'available',NULL),(NULL,'G061-K005',61,'available',NULL),
(NULL,'G062-K001',62,'available',NULL),(NULL,'G062-K002',62,'available',NULL),(NULL,'G062-K003',62,'available',NULL),(NULL,'G062-K004',62,'available',NULL),(NULL,'G062-K005',62,'available',NULL),
(NULL,'G063-K001',63,'available',NULL),(NULL,'G063-K002',63,'available',NULL),(NULL,'G063-K003',63,'available',NULL),(NULL,'G063-K004',63,'available',NULL),(NULL,'G063-K005',63,'available',NULL),
(NULL,'G064-K001',64,'available',NULL),(NULL,'G064-K002',64,'available',NULL),(NULL,'G064-K003',64,'available',NULL),(NULL,'G064-K004',64,'available',NULL),(NULL,'G064-K005',64,'available',NULL),
(NULL,'G065-K001',65,'available',NULL),(NULL,'G065-K002',65,'available',NULL),(NULL,'G065-K003',65,'available',NULL),(NULL,'G065-K004',65,'available',NULL),(NULL,'G065-K005',65,'available',NULL),
(NULL,'G066-K001',66,'available',NULL),(NULL,'G066-K002',66,'available',NULL),(NULL,'G066-K003',66,'available',NULL),(NULL,'G066-K004',66,'available',NULL),(NULL,'G066-K005',66,'available',NULL),
(NULL,'G067-K001',67,'available',NULL),(NULL,'G067-K002',67,'available',NULL),(NULL,'G067-K003',67,'available',NULL),(NULL,'G067-K004',67,'available',NULL),(NULL,'G067-K005',67,'available',NULL),
(NULL,'G068-K001',68,'available',NULL),(NULL,'G068-K002',68,'available',NULL),(NULL,'G068-K003',68,'available',NULL),(NULL,'G068-K004',68,'available',NULL),(NULL,'G068-K005',68,'available',NULL),
(NULL,'G069-K001',69,'available',NULL),(NULL,'G069-K002',69,'available',NULL),(NULL,'G069-K003',69,'available',NULL),(NULL,'G069-K004',69,'available',NULL),(NULL,'G069-K005',69,'available',NULL),
(NULL,'G070-K001',70,'available',NULL),(NULL,'G070-K002',70,'available',NULL),(NULL,'G070-K003',70,'available',NULL),(NULL,'G070-K004',70,'available',NULL),(NULL,'G070-K005',70,'available',NULL),
-- G71-G80 Ubisoft Connect
(NULL,'G071-K001',71,'available',NULL),(NULL,'G071-K002',71,'available',NULL),(NULL,'G071-K003',71,'available',NULL),(NULL,'G071-K004',71,'available',NULL),(NULL,'G071-K005',71,'available',NULL),
(NULL,'G072-K001',72,'available',NULL),(NULL,'G072-K002',72,'available',NULL),(NULL,'G072-K003',72,'available',NULL),(NULL,'G072-K004',72,'available',NULL),(NULL,'G072-K005',72,'available',NULL),
(NULL,'G073-K001',73,'available',NULL),(NULL,'G073-K002',73,'available',NULL),(NULL,'G073-K003',73,'available',NULL),(NULL,'G073-K004',73,'available',NULL),(NULL,'G073-K005',73,'available',NULL),
(NULL,'G074-K001',74,'available',NULL),(NULL,'G074-K002',74,'available',NULL),(NULL,'G074-K003',74,'available',NULL),(NULL,'G074-K004',74,'available',NULL),(NULL,'G074-K005',74,'available',NULL),
(NULL,'G075-K001',75,'available',NULL),(NULL,'G075-K002',75,'available',NULL),(NULL,'G075-K003',75,'available',NULL),(NULL,'G075-K004',75,'available',NULL),(NULL,'G075-K005',75,'available',NULL),
(NULL,'G076-K001',76,'available',NULL),(NULL,'G076-K002',76,'available',NULL),(NULL,'G076-K003',76,'available',NULL),(NULL,'G076-K004',76,'available',NULL),(NULL,'G076-K005',76,'available',NULL),
(NULL,'G077-K001',77,'available',NULL),(NULL,'G077-K002',77,'available',NULL),(NULL,'G077-K003',77,'available',NULL),(NULL,'G077-K004',77,'available',NULL),(NULL,'G077-K005',77,'available',NULL),
(NULL,'G078-K001',78,'available',NULL),(NULL,'G078-K002',78,'available',NULL),(NULL,'G078-K003',78,'available',NULL),(NULL,'G078-K004',78,'available',NULL),(NULL,'G078-K005',78,'available',NULL),
(NULL,'G079-K001',79,'available',NULL),(NULL,'G079-K002',79,'available',NULL),(NULL,'G079-K003',79,'available',NULL),(NULL,'G079-K004',79,'available',NULL),(NULL,'G079-K005',79,'available',NULL),
(NULL,'G080-K001',80,'available',NULL),(NULL,'G080-K002',80,'available',NULL),(NULL,'G080-K003',80,'available',NULL),(NULL,'G080-K004',80,'available',NULL),(NULL,'G080-K005',80,'available',NULL),
-- G81-G90 EA App additional
(NULL,'G081-K001',81,'available',NULL),(NULL,'G081-K002',81,'available',NULL),(NULL,'G081-K003',81,'available',NULL),(NULL,'G081-K004',81,'available',NULL),(NULL,'G081-K005',81,'available',NULL),
(NULL,'G082-K001',82,'available',NULL),(NULL,'G082-K002',82,'available',NULL),(NULL,'G082-K003',82,'available',NULL),(NULL,'G082-K004',82,'available',NULL),(NULL,'G082-K005',82,'available',NULL),
(NULL,'G083-K001',83,'available',NULL),(NULL,'G083-K002',83,'available',NULL),(NULL,'G083-K003',83,'available',NULL),(NULL,'G083-K004',83,'available',NULL),(NULL,'G083-K005',83,'available',NULL),
(NULL,'G084-K001',84,'available',NULL),(NULL,'G084-K002',84,'available',NULL),(NULL,'G084-K003',84,'available',NULL),(NULL,'G084-K004',84,'available',NULL),(NULL,'G084-K005',84,'available',NULL),
-- G85-G89 Windows Store additional
(NULL,'G085-K001',85,'available',NULL),(NULL,'G085-K002',85,'available',NULL),(NULL,'G085-K003',85,'available',NULL),(NULL,'G085-K004',85,'available',NULL),(NULL,'G085-K005',85,'available',NULL),
(NULL,'G086-K001',86,'available',NULL),(NULL,'G086-K002',86,'available',NULL),(NULL,'G086-K003',86,'available',NULL),(NULL,'G086-K004',86,'available',NULL),(NULL,'G086-K005',86,'available',NULL),
(NULL,'G087-K001',87,'available',NULL),(NULL,'G087-K002',87,'available',NULL),(NULL,'G087-K003',87,'available',NULL),(NULL,'G087-K004',87,'available',NULL),(NULL,'G087-K005',87,'available',NULL),
(NULL,'G088-K001',88,'available',NULL),(NULL,'G088-K002',88,'available',NULL),(NULL,'G088-K003',88,'available',NULL),(NULL,'G088-K004',88,'available',NULL),(NULL,'G088-K005',88,'available',NULL),
(NULL,'G089-K001',89,'available',NULL),(NULL,'G089-K002',89,'available',NULL),(NULL,'G089-K003',89,'available',NULL),(NULL,'G089-K004',89,'available',NULL),(NULL,'G089-K005',89,'available',NULL),
-- G90-G94 Rockstar additional
(NULL,'G090-K001',90,'available',NULL),(NULL,'G090-K002',90,'available',NULL),(NULL,'G090-K003',90,'available',NULL),(NULL,'G090-K004',90,'available',NULL),(NULL,'G090-K005',90,'available',NULL),
(NULL,'G091-K001',91,'available',NULL),(NULL,'G091-K002',91,'available',NULL),(NULL,'G091-K003',91,'available',NULL),(NULL,'G091-K004',91,'available',NULL),(NULL,'G091-K005',91,'available',NULL),
(NULL,'G092-K001',92,'available',NULL),(NULL,'G092-K002',92,'available',NULL),(NULL,'G092-K003',92,'available',NULL),(NULL,'G092-K004',92,'available',NULL),(NULL,'G092-K005',92,'available',NULL),
(NULL,'G093-K001',93,'available',NULL),(NULL,'G093-K002',93,'available',NULL),(NULL,'G093-K003',93,'available',NULL),(NULL,'G093-K004',93,'available',NULL),(NULL,'G093-K005',93,'available',NULL),
(NULL,'G094-K001',94,'available',NULL),(NULL,'G094-K002',94,'available',NULL),(NULL,'G094-K003',94,'available',NULL),(NULL,'G094-K004',94,'available',NULL),(NULL,'G094-K005',94,'available',NULL),
-- G95-G104 Battle.net
(NULL,'G095-K001',95,'available',NULL),(NULL,'G095-K002',95,'available',NULL),(NULL,'G095-K003',95,'available',NULL),(NULL,'G095-K004',95,'available',NULL),(NULL,'G095-K005',95,'available',NULL),
(NULL,'G096-K001',96,'available',NULL),(NULL,'G096-K002',96,'available',NULL),(NULL,'G096-K003',96,'available',NULL),(NULL,'G096-K004',96,'available',NULL),(NULL,'G096-K005',96,'available',NULL),
(NULL,'G097-K001',97,'available',NULL),(NULL,'G097-K002',97,'available',NULL),(NULL,'G097-K003',97,'available',NULL),(NULL,'G097-K004',97,'available',NULL),(NULL,'G097-K005',97,'available',NULL),
(NULL,'G098-K001',98,'available',NULL),(NULL,'G098-K002',98,'available',NULL),(NULL,'G098-K003',98,'available',NULL),(NULL,'G098-K004',98,'available',NULL),(NULL,'G098-K005',98,'available',NULL),
(NULL,'G099-K001',99,'available',NULL),(NULL,'G099-K002',99,'available',NULL),(NULL,'G099-K003',99,'available',NULL),(NULL,'G099-K004',99,'available',NULL),(NULL,'G099-K005',99,'available',NULL),
(NULL,'G100-K001',100,'available',NULL),(NULL,'G100-K002',100,'available',NULL),(NULL,'G100-K003',100,'available',NULL),(NULL,'G100-K004',100,'available',NULL),(NULL,'G100-K005',100,'available',NULL),
(NULL,'G101-K001',101,'available',NULL),(NULL,'G101-K002',101,'available',NULL),(NULL,'G101-K003',101,'available',NULL),(NULL,'G101-K004',101,'available',NULL),(NULL,'G101-K005',101,'available',NULL),
(NULL,'G102-K001',102,'available',NULL),(NULL,'G102-K002',102,'available',NULL),(NULL,'G102-K003',102,'available',NULL),(NULL,'G102-K004',102,'available',NULL),(NULL,'G102-K005',102,'available',NULL),
(NULL,'G103-K001',103,'available',NULL),(NULL,'G103-K002',103,'available',NULL),(NULL,'G103-K003',103,'available',NULL),(NULL,'G103-K004',103,'available',NULL),(NULL,'G103-K005',103,'available',NULL),
(NULL,'G104-K001',104,'available',NULL),(NULL,'G104-K002',104,'available',NULL),(NULL,'G104-K003',104,'available',NULL),(NULL,'G104-K004',104,'available',NULL),(NULL,'G104-K005',104,'available',NULL),
-- G105-G114 Nintendo
(NULL,'G105-K001',105,'available',NULL),(NULL,'G105-K002',105,'available',NULL),(NULL,'G105-K003',105,'available',NULL),(NULL,'G105-K004',105,'available',NULL),(NULL,'G105-K005',105,'available',NULL),
(NULL,'G106-K001',106,'available',NULL),(NULL,'G106-K002',106,'available',NULL),(NULL,'G106-K003',106,'available',NULL),(NULL,'G106-K004',106,'available',NULL),(NULL,'G106-K005',106,'available',NULL),
(NULL,'G107-K001',107,'available',NULL),(NULL,'G107-K002',107,'available',NULL),(NULL,'G107-K003',107,'available',NULL),(NULL,'G107-K004',107,'available',NULL),(NULL,'G107-K005',107,'available',NULL),
(NULL,'G108-K001',108,'available',NULL),(NULL,'G108-K002',108,'available',NULL),(NULL,'G108-K003',108,'available',NULL),(NULL,'G108-K004',108,'available',NULL),(NULL,'G108-K005',108,'available',NULL),
(NULL,'G109-K001',109,'available',NULL),(NULL,'G109-K002',109,'available',NULL),(NULL,'G109-K003',109,'available',NULL),(NULL,'G109-K004',109,'available',NULL),(NULL,'G109-K005',109,'available',NULL),
(NULL,'G110-K001',110,'available',NULL),(NULL,'G110-K002',110,'available',NULL),(NULL,'G110-K003',110,'available',NULL),(NULL,'G110-K004',110,'available',NULL),(NULL,'G110-K005',110,'available',NULL),
(NULL,'G111-K001',111,'available',NULL),(NULL,'G111-K002',111,'available',NULL),(NULL,'G111-K003',111,'available',NULL),(NULL,'G111-K004',111,'available',NULL),(NULL,'G111-K005',111,'available',NULL),
(NULL,'G112-K001',112,'available',NULL),(NULL,'G112-K002',112,'available',NULL),(NULL,'G112-K003',112,'available',NULL),(NULL,'G112-K004',112,'available',NULL),(NULL,'G112-K005',112,'available',NULL),
(NULL,'G113-K001',113,'available',NULL),(NULL,'G113-K002',113,'available',NULL),(NULL,'G113-K003',113,'available',NULL),(NULL,'G113-K004',113,'available',NULL),(NULL,'G113-K005',113,'available',NULL),
(NULL,'G114-K001',114,'available',NULL),(NULL,'G114-K002',114,'available',NULL),(NULL,'G114-K003',114,'available',NULL),(NULL,'G114-K004',114,'available',NULL),(NULL,'G114-K005',114,'available',NULL);
-- Total: 570 digital keys

INSERT INTO orders (user_id, total_amount, payment_method, payment_status, order_date) VALUES
(1, 89.98, 'QR',        'paid',     '2024-07-01 10:00:00'),
(1, 49.98, 'TRUEMONEY', 'paid',     '2024-07-15 14:30:00'),
(1, 59.99, 'QR',        'refunded', '2024-08-01 09:00:00'),
(2, 29.99, 'TRUEMONEY', 'paid',     '2024-07-05 11:00:00'),
(2, 44.98, 'QR',        'paid',     '2024-07-20 16:45:00');

INSERT INTO order_items (digital_key_id, order_id, purchase_price) VALUES
(1,   1, 39.99),
(16,  1, 49.99),
(31,  2, 19.99),
(46,  2, 29.99),
(51,  3, 59.99),
(11,  4, 14.99),
(26,  4, 14.99),
(71,  5, 29.99),
(106, 5, 14.99);

UPDATE digital_keys SET status='sold', order_item_id=1, sold_date='2024-07-01 10:00:00' WHERE digital_key_id=1;
UPDATE digital_keys SET status='sold', order_item_id=2, sold_date='2024-07-01 10:00:00' WHERE digital_key_id=16;
UPDATE digital_keys SET status='sold', order_item_id=3, sold_date='2024-07-15 14:30:00' WHERE digital_key_id=31;
UPDATE digital_keys SET status='sold', order_item_id=4, sold_date='2024-07-15 14:30:00' WHERE digital_key_id=46;
UPDATE digital_keys SET status='sold', order_item_id=5, sold_date='2024-08-01 09:00:00' WHERE digital_key_id=51;
UPDATE digital_keys SET status='sold', order_item_id=6, sold_date='2024-07-05 11:00:00' WHERE digital_key_id=11;
UPDATE digital_keys SET status='sold', order_item_id=7, sold_date='2024-07-05 11:00:00' WHERE digital_key_id=26;
UPDATE digital_keys SET status='sold', order_item_id=8, sold_date='2024-07-20 16:45:00' WHERE digital_key_id=71;
UPDATE digital_keys SET status='sold', order_item_id=9, sold_date='2024-07-20 16:45:00' WHERE digital_key_id=106;

-- ============================================================
-- TRANSACTION LOG (unchanged)
-- ============================================================
INSERT INTO transaction_log (order_id, user_id, type, amount) VALUES
(NULL, 1, 'deposit',  200.00),
(NULL, 1, 'deposit',  150.00),
(NULL, 2, 'deposit',  100.00),
(1,    1, 'purchase',  89.98),
(2,    1, 'purchase',  49.98),
(3,    1, 'purchase',  59.99),
(4,    2, 'purchase',  29.98),
(5,    2, 'purchase',  44.98),
(3,    1, 'refund',    59.99);

INSERT INTO game_reviews (user_id, game_id, rating, comment, review_date) VALUES
(1,  1, 5, 'Elden Ring is the most rewarding game I have ever played. Every boss fight feels like a true accomplishment.',        '2024-07-02 12:00:00'),
(1,  4, 5, 'Hades is absolutely brilliant. The way the story and gameplay loop are intertwined is genius.',                      '2024-07-02 13:00:00'),
(1,  7, 5, 'The Witcher 3 has the best side quests in gaming. Every quest feels like a self-contained short story.',             '2024-07-16 09:00:00'),
(1, 10, 4, 'Celeste is a beautiful and challenging platformer. The story about mental health is surprisingly moving.',           '2024-07-16 10:00:00'),
(1, 11, 5, 'Red Dead Redemption 2 is a stunning achievement. Arthur Morgan is one of the greatest characters in game history.', '2024-08-02 11:00:00'),
(2,  3, 5, 'Hollow Knight is a masterpiece of atmosphere and design. The underground world of Hallownest is unforgettable.',     '2024-07-06 14:00:00'),
(2,  6, 5, 'Stardew Valley is the most relaxing and genuinely wholesome game I have ever played. Perfect for unwinding.',       '2024-07-06 15:00:00'),
(2, 15, 5, 'Baldur`s Gate 3 is a landmark RPG. The depth of choices and the quality of writing are simply unmatched.',          '2024-07-21 18:00:00'),
(2, 22, 4, 'DOOM Eternal is relentlessly intense and brilliantly designed. The combat loop is unlike anything else.',            '2024-07-21 19:00:00');

-- ============================================================
-- excalibur_db — Fix price_history: Replace 0.00 prices
-- ============================================================



-- game 5: Counter-Strike 2 (Steam) — Prime Status $14.99
UPDATE price_history
SET price = 14.99
WHERE game_id = 5 AND price = 0.00;

-- game 24: Path of Exile (Steam) — Starter Supporter Pack $30.00
UPDATE price_history
SET price = 30.00
WHERE game_id = 24 AND price = 0.00;

-- game 51: Halo Infinite (Xbox) — campaign now $19.99 (was free briefly)
UPDATE price_history
SET price = 19.99
WHERE game_id = 51 AND price = 0.00;

-- game 61: The Sims 4 (Origin) — base game free but Deluxe Party Edition $49.99
UPDATE price_history
SET price = 49.99
WHERE game_id = 61 AND price = 0.00;

-- game 69: Apex Legends (Origin) — Champion Edition $39.99
UPDATE price_history
SET price = 39.99
WHERE game_id = 69 AND price = 0.00;

-- game 95: Overwatch 2 (Battle.net) — Watchpoint Pack $39.99
UPDATE price_history
SET price = 39.99
WHERE game_id = 95 AND price = 0.00;

-- game 96: World of Warcraft (Battle.net) — Monthly subscription $14.99
UPDATE price_history
SET price = 14.99
WHERE game_id = 96 AND price = 0.00;

-- game 98: StarCraft II (Battle.net) — Campaign Bundle $14.99
UPDATE price_history
SET price = 14.99
WHERE game_id = 98 AND price = 0.00;

-- game 99: Hearthstone (Battle.net) — Year of the Wolf Bundle $49.99
UPDATE price_history
SET price = 49.99
WHERE game_id = 99 AND price = 0.00;

-- game 100: Heroes of the Storm (Battle.net) — Heroic Bundle $9.99
UPDATE price_history
SET price = 9.99
WHERE game_id = 100 AND price = 0.00;

-- game 103: Overwatch Original (Battle.net) — remove 0.00 sunset record, keep $19.99
DELETE FROM price_history
WHERE game_id = 103 AND price = 0.00;
INSERT INTO price_history (game_id, price, recorded_date) VALUES
(103, 19.99, '2022-10-04 00:00:00');  -- final price before sunset

-- ============================================================
-- ============================================================
-- Verify: check no more 0.00 in price_history

-- keep identity sequences in step with explicit ids
SELECT setval(pg_get_serial_sequence('users','user_id'),               (SELECT MAX(user_id) FROM users));
SELECT setval(pg_get_serial_sequence('categories','category_id'),      (SELECT MAX(category_id) FROM categories));
SELECT setval(pg_get_serial_sequence('games','game_id'),               (SELECT MAX(game_id) FROM games));
SELECT setval(pg_get_serial_sequence('price_history','price_history_id'), (SELECT MAX(price_history_id) FROM price_history));
SELECT setval(pg_get_serial_sequence('digital_keys','digital_key_id'), (SELECT MAX(digital_key_id) FROM digital_keys));
SELECT setval(pg_get_serial_sequence('orders','order_id'),             (SELECT MAX(order_id) FROM orders));
SELECT setval(pg_get_serial_sequence('order_items','order_item_id'),   (SELECT MAX(order_item_id) FROM order_items));
SELECT setval(pg_get_serial_sequence('transaction_log','transaction_id'), (SELECT MAX(transaction_id) FROM transaction_log));
SELECT setval(pg_get_serial_sequence('game_reviews','game_review_id'), (SELECT MAX(game_review_id) FROM game_reviews));
COMMIT;
