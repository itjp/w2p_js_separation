# coding: utf8

import time

def test():
    time.sleep(5)
    response.flash = 'flash message'
    response.status = 404
    return request.now


class NA(DIV):

    tag = 'a'

    def xml(self):
        if not self.components and self['_href']:
            self.append(self['_href'])
        if not self['_disable_with']:
            self['_data-w2p_disable_with'] = 'default'
        if self['delete']:
            self['_data-w2p_remove'] = self['delete']
        if self['target']:
            self['_data-w2p_target'] = self['target']
        if self['component']:
            self['_data-w2p_method'] = 'GET'
            self['_href'] = self['component']
        elif self['callback']:
            self['_data-w2p_method'] = 'POST'
            self['_href'] = self['callback']
            if self['delete'] and not self['noconfirm']:
                if not self['confirm']:
                    self['_data-w2p_confirm'] = 'default'
                else:
                    self['_data-w2p_confirm'] = self['confirm']
        elif self['cid']:
            self['_data-w2p_method'] = 'GET'
            self['_data-w2p_target'] = self['cid']
            if self['pre_call']:
                self['_data-w2p_pre_call'] = self['pre_call']
        return DIV.xml(self)

def old():
    message = 'you are advised to run all with the console opened (firebug, chrome dev, IE dev tools)'
    response.files.insert(3,URL('static','js/web2py_non_inlined.js'))
    response.view = 'test_a/base_a.html'
    a1 = """A('a simple href', _href=URL('test'))"""
    a2 = """A('a simple component (failing without a target)', component=URL('test'), _id="a2")"""
    a3 = """A('a component with a target', component=URL('test'), target='default_target')"""
    a4 = """DIV(
        A('a component with a delete (failing without a target)', component=URL('test'), delete='div', _id="a4")
    )"""
    a5 = """DIV(
        A('a component, a target and a delete', component=URL('test'), target='default_target', delete='div')
    )"""
    a6 = """A('a simple callback', callback=URL('test'))"""
    a7 = """DIV(
        A('a callback with a delete', callback=URL('test'), delete='div')
    )"""
    a8 = """DIV(
        A('a callback with a delete without confirmation', callback=URL('test'), delete='div', noconfirm=True)
    )"""
    a9 = """A('an href and a cid', _href=URL('test'), cid='default_target')"""
    a10 = """A('an href and a cid with pre_call', _href=URL('test'), cid='default_target', pre_call='alert("hey!");')"""
    a11 = """DIV(
        A('an href, a cid and a delete', _href=URL('test'), cid='default_target', delete='div')
    )"""

    mya = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11]
    return dict(mya=mya, message=message)


def new():
    message = 'you are advised to run all with the console opened (firebug, chrome dev, IE dev tools)'
    response.files.insert(3,URL('static','js/web2py_non_inlined.js'))
    response.view = 'test_a/base_a.html'
    a1 = """NA('a simple href', _href=URL('test'))"""
    a2 = """NA('a simple component', component=URL('test'), _id="a2")"""
    a3 = """NA('a component with a target', component=URL('test'), target='default_target')"""
    a4 = """DIV(
        NA('a component with a delete', component=URL('test'), delete='div', _id="a4")
    )"""
    a5 = """DIV(
        NA('a component, a target and a delete', component=URL('test'), target='default_target', delete='div')
    )"""
    a6 = """NA('a simple callback', callback=URL('test'))"""
    a7 = """DIV(
        NA('a callback with a delete', callback=URL('test'), delete='div')
    )"""
    a8 = """DIV(
        NA('a callback with a delete without confirmation', callback=URL('test'), delete='div', noconfirm=True)
    )"""
    a9 = """NA('an href and a cid', _href=URL('test'), cid='default_target')"""
    a10 = """NA('an href and a cid with pre_call', _href=URL('test'), cid='default_target', pre_call='alert("hey!");')"""
    a11 = """DIV(
        NA('an href, a cid and a delete', _href=URL('test'), cid='default_target', delete='div')
    )"""

    mya = [a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11]
    return dict(mya=mya, NA=NA, message=message)
