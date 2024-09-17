# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import connection

"""
To manage NewsApi
@author: Kalaivani.P
@version: 1.0
@project: ServiceDesk
"""        
#NewsApi Functionality Here
def newsapi_funct():
    """
        Function to insert the newsapi details
        @param request:post request
        @return: json data for status of NewsApi result
        @rtype: json
        @raise e:Unable to insert the NewsApi 
    """
    json_result = {}
    cr = connection.cursor()
    if cr:
        cr.execute("""select newsapi_articles,newsapi_title,url from news_api order by id desc limit 10""")
        result = cr.fetchall()
        keys = ['description','title','url']
        json_result = list(dict(zip(keys,j)) for j in result)
    else:
        json_result = "config.unable_to_create_connection_message"
    return json_result 