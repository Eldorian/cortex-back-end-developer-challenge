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
- Going to add a quick and simple very very basic API to add/update/remove characters so I can test with some postman scripts
- Ended up just hard coding the Character API to just create the briv.json character for now. Spent too much time playing with it and need to actually do the real work I need to do. Learned a lot though!
- I understand what I am doing is very likely NOT EVEN CLOSE to being best practices - that just comes down to still needing to learn more about this tech stack.
- Nothing like spending 2 hours on why your math won't work because apparently Number is a different type than number
- I'm not a fan of having all the business logic sitting in the controllers, but I am out of time to go back and refactor this
- I would have liked to use the class-validator package to do some validation on the model, but ran out of time to figure out how it works - I think what I have kind of works in a weird way anyway, but would have preferred to explicitly code in the validation so everyone knows what is accepted and what is not.
- Wanted to add some swagger implementation to these APIs, but instead I will include my postman collection I used to test with
- Designed this with the idea of having separate end points for adding temp hit points, healing, and damage - that way I could just use the same ICharacter model I created.
- Unfortunately I don't have any experience running a node.js application in docker and having a heck of a time getting it to run. Can build the image just fine, but when I run it nodemon tells me that the internal watch failed. Have a feeling it's something messed up with how I am using ports but everything I have tried so far has been fruitless. Going to sync this up to github and submit it with an explanation and that I'm going to try and fix it Monday after sleeping on it.

# Running this thing
- If you want to run locally, install Mongo on your PC (also recommend mongoDBCompass). In the root folder of the project on a command line do 'npm install - y' then also run 'npm install -g typescript'. Finally run 'npm run dev' (or whatever environment based on the envvironment file) and you can hit the end points from there using postman.
- If you run from docker you should be able to run 'docker build -t imageName .' to build the image (which does work) and then 'docker run -p 3000:3000 imageName' - but as of right now nodemon will throw an internal watch failed error about circular symlink detected I need to figure out
- Check the postman collection. You should be able to run the post character endpoint and that will create one based off the briv.json. Or you can go into the characterController and change some things around if you want to create something different.
- From there you can also add temp hit points, heal, and do damage to the character after grabbing the character id from the post character response