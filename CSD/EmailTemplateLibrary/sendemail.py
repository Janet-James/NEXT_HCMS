# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.mail import EmailMultiAlternatives
from django.core.mail import get_connection
from django.template.loader import get_template

def sendemail(subject,text_content,from_email,to,html_content,bcc,cc,context):
	'''
	Send emails with some template
	@param subject: Subject of the send mail
	@type subject : String
	@param text_content: Body of the send mail
	@type text_content : String
	@param from_email: From email address
	@type from_email : String
	@param to: To email address
	@type to : List
	@param html_content: Html template
	@type html_content : Name of the template as string
	@param bcc: BCC email address
	@type bcc : List
	@param cc: CC email address
	@type cc : List
	@param context: Contain dynamic data
	@type context : Object
	@return:   Boolean Data
	@rtype:  Boolean 
	@exception  : Unable to act this functionality
	'''
	try:
		if html_content: 
			html = get_template(html_content) # if yoy got 
			html_render = html.render(context)
		else:
			html_render=""
		print "---------------------",html_render
		connection = get_connection() # uses SMTP server specified in settings.py
		print "======================",connection
		connection.open()# If you don't open the connection manually, Django will automatically open, then tear down the connection in msg.send()
		print "---------Email->",to,from_email
		msg = EmailMultiAlternatives(subject,text_content,from_email,to=to,bcc=bcc,cc=cc,connection=connection)
		if html_render:
			msg.attach_alternative(html_render, "text/html")
			msg.send()
			connection.close() # Cleanup
		return True
	except Exception as e:
		print "--------e----------",e
		return e    
