// Copy & paste this to console at https://iris.to or other page that has gun, sea and iris-lib
// Due to an unsolved bug, someoneElse's messages only start showing up after a reload

var gun1 = new Gun('https://gun-us.herokuapp.com/gun');
var gun2 = new Gun('https://gun-us.herokuapp.com/gun');
var myKey = await iris.Key.getDefault();
var someoneElse = localStorage.getItem('someoneElsesKey');
if (someoneElse) {
 someoneElse = JSON.parse(someoneElse);
} else {
 someoneElse = await iris.Key.generate();
 localStorage.setItem('someoneElsesKey', JSON.stringify(someoneElse));
}

iris.Channel.initUser(gun1, myKey); // saves myKey.epub to gun.user().get('epub')
iris.Channel.initUser(gun2, someoneElse);

var ourChannel = new iris.Channel({key: myKey, gun: gun1, participants: someoneElse.pub});
var theirChannel = new iris.Channel({key: someoneElse, gun: gun2, participants: myKey.pub});

var myChannels = {}; // you can list them in a user interface
function printMessage(msg, info) {
 console.log(`[${new Date(msg.time).toLocaleString()}] ${info.from.slice(0,8)}: ${msg.text}`)
}
iris.Channel.getChannels(gun1, myKey, channel => {
 var pub = channel.getParticipants(console.log);
 gun1.user(pub).get('profile').get('name').on(name => channel.name = name);
 myChannels[pub] = channel;
 channel.getMessages(printMessage);
 channel.on('mood', (mood, from) => console.log(from.slice(0,8) + ' is feeling ' + mood));
});

// you can play with these in the console:
ourChannel.send('message from myKey');
theirChannel.send('message from someoneElse');

ourChannel.put('mood', 'blessed');
theirChannel.put('mood', 'happy');