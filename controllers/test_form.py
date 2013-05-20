# coding: utf8
# prova qualcosa come
db.define_table('testtable',
    Field('dfield', 'integer', requires=IS_INT_IN_RANGE(0,30)),
    Field('bfield'),
    Field('cfield', requires=IS_IN_SET(('foo', 'bar')))
)
if db(db.testtable.id > 0).isempty():
    from gluon.contrib.populate import populate
    populate(db.testtable,100)
    db.commit()



def index():
    links = [A('beforesend', _href=URL('example_1')),
             A('success and error', _href=URL('example_2'))]
    return dict(content=links)

import time
def loaded():
    db.testtable.bfield.default = str(request.now)
    form = SQLFORM(db.testtable)
    if form.process().accepted:
        time.sleep(3)
        response.flash = 'accepted'
    elif form.errors:
        response.flash = 'errors in form'
    else:
        response.flash = 'please fill the form'
    return dict(form=form)

def example_1():
    message = 'you are advised to run all with the console opened (firebug, chrome dev, IE dev tools)'
    content = """simple form with ajax:beforeSend
    The form needs 3 seconds to be processed
    ajax:beforeSend returning false will prevent the submission
    Also, we customize how to show the flash message overwriting the default representation
    """
    content = content.split('\n')
    content = CAT([CAT(SPAN(a), BR()) for a in content])
    response.files.insert(3,URL('static','js/web2py_non_inlined.js'))
    loaded_fragment = LOAD('test_form', 'loaded.load', ajax=True, target='test_div')
    return dict(loaded=loaded_fragment, message=message, content=content)

def example_2():
    message = 'you are advised to run all with the console opened (firebug, chrome dev, IE dev tools)'
    content = """simple form with ajax:success
    The form needs 3 seconds to be processed
    ajax:success happens only when the ajax is correct.
    Also, we customize how to show the flash message overwriting the default representation
    """
    content = content.split('\n')
    content = CAT([CAT(SPAN(a), BR()) for a in content])
    response.files.insert(3,URL('static','js/web2py_non_inlined.js'))
    loaded_fragment = LOAD('test_form', 'loaded.load', ajax=True, target='test_div')
    return dict(loaded=loaded_fragment, message=message, content=content)
