So admin can manage account and user it self, nothing more
he can manage their money, and editing user tho

and then there is user, who can interact with event, account and user it self

# User level 0
## having access to
>> Seeing progress          [GET]       [User]
>> Seeing event             [GET]       [Event]
>> Seeing achievement       [GET]       [User]
>> Adding payment           [PUT]       [User, Account]
>> Reading payment          [GET]       [User]
>> Updating photo           [PUT]       [User]

# User level 1
## having access to
>> Seeing all user level 0  [GET]       [User]
>> Updating user & achv     [POST]      [User]
>> Adding event             [POST]      [Event]
>> Updating event           [PUT]       [Event]
>> Removing event           [DELETE]    [Event]

# Admin
## having access to
>> Registering User
>> Registering User level 1
>> Managing transaction