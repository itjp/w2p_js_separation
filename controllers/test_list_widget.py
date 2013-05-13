# coding: utf8
# prova qualcosa come



def index():
    return dict(message="hello from test_list_widget.py")

def new():
    message = 'you are advised to run all with the console opened (firebug, chrome dev, IE dev tools)'
    response.files.insert(3,URL('static','js/web2py_non_inlined.js'))
    #response.view = 'testgrid/base_grid.html'
    #grid = SQLFORM.grid(db.testtable, user_signature=False)
    single = UL(LI(INPUT()), _class="w2p_list", _style="list-style:none")
    single2 = UL(LI(INPUT()), _class="w2p_list", _style="list-style:none")
    return dict(message=message, single=single, single2=single2)

 
