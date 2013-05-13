w2p_js_separation
=================

a proposed way to avoid inline javascript in web2py code

Web2py provides jQuery by default to "spice up" ajax interactions with your page.
Now that html5 data-* attributes provide us with a nice way to interact "between languages" it's easier to deal with
**fragments** behaviour (elements, small snippets, .load views, etc).
Until now web2py provided some inline js snippets that became more and more convoluted as soon as features were added.
A lot of my apps currently struggle between the "easy" syntax web2py provides for doing "something" and the lack of
those "somethings" being a little bit more flexible...
With inline javascript is **almost** impossible to hook up your own events and/or seeking some ajax interaction over the
basic level.
So if you, like me, often find yourself basically rewriting small portions of web2py.js to accomodate your requirements,
or you avoid web2py's facilities to mimic a close functionality, this is the first step towards leveraging the best of both
worlds.
A lot of things are to be dealt with, but in the meantime we can discuss naming, jquery compatibility issues,
backward compatibility ones, and a lot more features to be added.
Make no mistake: I'm not a seasoned javascript programmer (and I stand on the shoulders of giants): 
most of the work posted here is just rewriting web2py.js to be a closure and take inspirations from 
[rails-ujs](https://github.com/rails/jquery-ujs)

In this app you'll find just the little bits I put together in a week or two of free time, and what is available
right now, comparing old behaviour to the new one.
There are several examples (please provide your own so we can test those) of the A() helper in every way I used it
so far. 

A little bit of wording (download the app and try yourself fiddling with the code) on the general ideas:
- web2py_non_inlined.js is "the new web2py.js"
  - hopefully it will be "switchable" with the current web2py.js
  - hopefully someone could take that and do a dojo or a prototype version of it
- wherever python code needs feature, it puts them in data-* attributes (right now they are all data-w2p_* to prevent name collisions)
- all events are hooked to the document with the sweet .on() function
- web2py won't provide any platform specific js code inside python source, it will "defer" those features to hooks defined in web2py.js
- web2py.js will be an integral part of web2py. All users will need to upgrade web2py.js in every app if they want to run a newer version of web2py

