# Cortex Back End Developer Challenge
In this test we would like you to create an API that will manage a player character’s Hit Points(HP). Clients will need to be able to do the following:
- Deal damage of different types (bludgeoning, fire, etc) while considering character resistences and immunities
- Heal
- Add temporary hit points

The API should be built with Express on Node.js and run in docker. The service you create should calculate the HP based on the character information and persist for the life of the application. You can store the data however you'd like. You'll find the json that represents a stripped down character in  [briv.json](briv.json).

HP are an abstract representation of a character's life total. In D&D a character's HP are calculated in one of two ways. Either a random roll of a Hit Die whose number of sides is determined by a character's class for each class level they have, or the player may choose to the rounded up average result of the hit die value for each character level. You may choose either method you do not need to do both. Also included in the calculation of the character's HP is the character's constitution stat modifer. To calculate a stat modifier take the ((statValue - 10)/2) round to the lowest integer. In negative numbers this means rounding to the integer further from zero.

Temporary Hit Points are a special case of hitpoints that are added to the current HP total and are always subtracted from first, and they cannot be healed. Temporary hit points are never additive they only take the higher value, either what exists or what is being "added".

When a character has resistance to a damage type they receive half damage from that type.

When a character has immunity to a damage type they receive no damage from that type.

Feel free to fill in any gaps you may encounter as you see fit. However, if you have questions please reach out to your Fandom contact and we will get back to you.

# Steps I took to create this
- I timeboxed myself to 8 hours to do this work
- With very little exposure to Typescript, Node Express, and Mongo - I followed this tutorial on how to build out the scaffolding of a simple API project and used it as my base since it seemed to follow similar patterns I use when building my .NET Web APIs: [https://levelup.gitconnected.com/setup-restful-api-with-node-js-express-mongodb-using-typescript-261959ef0998](Setup RESTful API with Node.js, Express, MongoDB using Typescript)
- started with creating a schema for the character with the briv.json and quickly realized hitpoints isn't listed on the character. I figure 2 ways to do this is to calculate the average based on their hit dice, which I will do when I create an API for creating new users to test with. But I feel like this datapoint really needs stored somewhere, so I added the hitpoints to schema for the character.
- I would probably change how I am doing hitpoints and temp_hitpoints if I had more requirements around them, but in order to make sure I hit within alloted amount of time I am choosing to go the easiest path and just store them in the root of the object instead of trying to make something more complicated.
