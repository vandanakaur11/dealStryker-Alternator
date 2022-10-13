# Alternator
Websockets for Chats

List Threads (Channel), Chats, UnreadChatData (in User Models), Handle Files



Routing needed:

Add Chat (Checks if thread is active by Bid)
Members from Offers and parentBidId from Offers, then the parent id is used to see if chat is alive. 

Get Chat History (grab the data and then listen for updates)


List Threads (Show threads in order of last messages )


When a user connects, they "GET" the history of the data. When a message is sent it is "POST"ed to the backend where then websockets emit the message. This way if someone joins a chat, they fetched the chat data using a http server and then they listen for updates. This minimizes the use of websockets to only current messages.


Instead of posting to make a channel, it would be better if when a user pulls to see channels they are subscribed to, it checks offers and then see if there is a corresponding channel, if not then it will make the channel.


test update

test again!!!
