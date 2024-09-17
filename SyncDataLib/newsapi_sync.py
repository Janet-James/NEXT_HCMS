# -*- coding: utf-8 -*-
from newsapi.articles import Articles
from newsapi.sources import Sources
import psycopg2
import datetime

"""
To manage NewsApi
@author: Kalaivani.P
@version: 1.0
@project: ServiceDesk
"""        
#NewsApi Functionality Here
class NewsApi():
    
    def newsapi(self):
        """
            Function to insert the newsapi details
            @param request:post request
            @return: json data for status of NewsApi result
            @rtype: json
            @raise e:Unable to insert the NewsApi 
        """
        status = 0
        conn = psycopg2.connect("dbname='prod_hcms' user='next' host='localhost' password='next'")
        try:
            cr = conn.cursor()
            if cr:
                api_key = '59e40fdb4d4046c39e6dbd1156acfe00'
                newsapi_source = 'ars-technica'
                a = Articles(API_KEY=api_key)
                news_data = a.get(source=newsapi_source)
                if news_data.status=='ok':
                    business_news = news_data.articles
                date = format(datetime.datetime.now()) #set current date time in created date field
                if cr: 
                    if api_key and news_data and business_news:
                        for i in business_news:
                            cr.execute("insert into news_api(api_key,newsapi_source,newsapi_articles,newsapi_title,created_date,modified_date,url) values (%s,%s,%s,%s,%s,%s,%s) returning id",
                            (api_key,newsapi_source,i['description'],i['title'],str(date),str(date),i['url'],))  
                            result=cr.fetchall()
                            conn.commit()
                            if result[0][0]:
                                status = 0
                            else:
                                status = 1
                    else:
                        status = 1
                else:
                    status = 1
                conn.close()
                cr.close() 
        except Exception as e:
            status = 1
            print e
        return status 
            
if __name__ == '__main__':
    a = NewsApi()
    a.newsapi();