import csv
import re
#import spacy
import sys
reload(sys)
import pandas as pd
sys.setdefaultencoding('utf8')
from cStringIO import StringIO
# from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
# from pdfminer.converter import TextConverter
# from pdfminer.layout import LAParams
# from pdfminer.pdfpage import PDFPage
import os
import sys, getopt
import numpy as np
# from bs4 import BeautifulSoup
import urllib2
from urllib2 import urlopen

#pdf export functionality here
def pdf_content_reader(get_file):
	#Function converting pdf to string
	def convert(fname, pages=None):
	    if not pages:
		pagenums = set()
	    else:
		pagenums = set(pages)

	    output = StringIO()
	    manager = PDFResourceManager()
	    converter = TextConverter(manager, output, laparams=LAParams())
	    interpreter = PDFPageInterpreter(manager, converter)

	    infile = file(fname, 'rb')
	    for page in PDFPage.get_pages(infile, pagenums):
		interpreter.process_page(page)
	    infile.close()
	    converter.close()
	    text = output.getvalue()
	    output.close
	    return text
	#Function to extract names from the string using spacy
	get_name = []
	def extract_name(string):
	    r1 = unicode(string)
	    nlp = spacy.load('xx')
	    doc = nlp(r1)
	    for ent in doc.ents:
		if(ent.label_ == 'PER'):
		    get_name.append(ent.text)
		    break
	#Function to extract Phone Numbers from string using regular expressions
	def extract_phone_numbers(string):
	    r = re.compile(r'(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})')
	    phone_numbers = r.findall(string)
	    return [re.sub(r'\D', '', number) for number in phone_numbers]
	#Function to extract Email address from a string using regular expressions
	def extract_email_addresses(string):
	    r = re.compile(r'[\w\.-]+@[\w\.-]+')
	    return r.findall(string)
	#Converting pdf to string
	resume_string = convert(get_file)
	resume_string1 = resume_string
	#Removing commas in the resume for an effecient check
	resume_string = resume_string.replace(',',' ')
	#Converting all the charachters in lower case
	resume_string = resume_string.lower()
	#Information Extraction Function
	def extract_information(string):
	    string.replace (" ", "+")
	    query = string
	    soup = BeautifulSoup(urlopen("https://en.wikipedia.org/wiki/" + query), "html.parser")
	    #creates soup and opens URL for Google. Begins search with site:wikipedia.com so only wikipedia
	    #links show up. Uses html parser.
	    for item in soup.find_all('div', attrs={'id' : "mw-content-text"}):
		print(item.find('p').get_text())
		print('\n')
	with open('/home/next/git/NEXT-HCMS/CommonLib/resume_parser/techatt.csv', 'rb') as f:
	    reader = csv.reader(f)
	    your_listatt = list(reader)
	with open('/home/next/git/NEXT-HCMS/CommonLib/resume_parser/techskill.csv', 'rb') as f:
	    reader = csv.reader(f)
	    your_list = list(reader)
	with open('/home/next/git/NEXT-HCMS/CommonLib/resume_parser/nontechnicalskills.csv', 'rb') as f:
	    reader = csv.reader(f)
	    your_list1 = list(reader)
	#Sets are used as it has a a constant time for lookup hence the overall the time for the total code will not exceed O(n)
	s = set(your_list[0])
	s1 = your_list
	s2 = your_listatt
	skillindex = []
	skills = []
	skillsatt = []
	print('-----------Resume Parser--------------')
	#Name
	extract_name(resume_string1)
	print "Name is : ",get_name
	#Phone Numbers
	y = extract_phone_numbers(resume_string)
	y1 = []
	for i in range(len(y)):
	    if(len(y[i])>9):
		y1.append(y[i])
	print 'Phone Number is : ',y1
	#Email
	get_email = extract_email_addresses(resume_string)
	print 'Email id is : ',extract_email_addresses(resume_string)
	#Technical Skill
	for word in resume_string.split(" "):
	    if word in s:
		skills.append(word)
	skills1 = list(set(skills))
	get_skills = []
	np_a1 = np.array(your_list)
	for i in range(len(skills1)):
	    item_index = np.where(np_a1==skills1[i])
	    skillindex.append(item_index[1][0])

	nlen = len(skillindex)
	for i in range(nlen):
	    skills = []
	    skills.append(skills1[i])
	    skills.append(s2[0][skillindex[i]])
	    get_skills.append(skills)
	print "Skill details : ",get_skills
	#Non Technical
	#Sets are used as it has a a constant time for lookup hence the overall the time for the total code will not exceed O(n)
	s1 = set(your_list1[0])
	nontechskills = []
	for word in resume_string.split(" "):
	    if word in s1:
		nontechskills.append(word)
	nontechskills = set(nontechskills)
	list5 = list(nontechskills)
	for i in range(len(list5)):
	    print(list5[i])
	print 'Non Technical Skill : ',list5
	#Address
	nlp = spacy.load('en_core_web_sm')
	doc = nlp(unicode(resume_string1, "utf-8"))
	count = 0
	get_address = []
	for ent in doc.ents:
		if count == 3 :
		    break
		if ent.label_ in ['LOC']:
			get_address.append(ent.text)
		elif ent.label_ in ['GPE']:
			get_address.append(ent.text)
			count += 1
	print "Address details : ",get_address
	return {'get_name':get_name, 'get_phone':y1, 'get_email':get_email, 'get_technical':get_skills, 'get_non_technical':list5, 'get_address':get_address}

if __name__ == '__main__':
	get_pdf_content = pdf_content_reader("/home/next/git/NEXT-HCMS/CommonLib/resume_parser/resume.pdf");
	print "------get_pdf_content------",get_pdf_content
