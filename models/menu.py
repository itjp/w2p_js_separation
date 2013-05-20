# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## Customize your APP title, subtitle and menus here
#########################################################################

response.logo = A(B('web',SPAN(2),'py'),XML('&trade;&nbsp;'),
                  _class="brand",_href="http://www.web2py.com/")
response.title = ' '.join(
    word.capitalize() for word in request.application.split('_'))
response.subtitle = T('no more inline javascript!')

## read more at http://dev.w3.org/html5/markup/meta.name.html
response.meta.author = 'Niphlod <niphlod@gmail.com>'
response.meta.description = 'trying to get rid of inline javascript'
response.meta.keywords = 'web2py, python, framework'
response.meta.generator = 'Web2py Web Framework'

## your http://google.com/analytics id
response.google_analytics_id = None

#########################################################################
## this is the main application menu add/remove items as required
#########################################################################

response.menu = [
    ('Home', False, URL('default', 'index'), []),
    ('A Helper', False, URL('test_a', 'old'), []),
    ('New A Helper', False, URL('test_a', 'new'), []),
    ('List Widget', False, URL('test_list_widget', 'new'), []),
    ('Password Widget', False, URL('test_password_widget', 'new'), []),
    ('Forms', False, URL('test_password_widget', 'new'), [])
]
